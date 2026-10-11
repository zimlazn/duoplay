import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  GameType,
  RoomState,
  Player,
  RoundResult
} from './src/types/game.ts';
import {
  generateFlagQuestion,
  generateWordQuestion,
  generateEmojiVoiceQuestion,
  generateDilemmaQuestion
} from './src/data/gameData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket']
});

const PORT = Number(process.env.PORT) || 3000;

// Rooms storage in-memory
const rooms: Record<string, RoomState> = {};
// Timers for rooms
const roomTimers: Record<string, NodeJS.Timeout> = {};

function initSpecialRoomAcaa() {
  rooms['ACAA'] = {
    roomId: 'ACAA',
    players: {},
    hostId: '',
    gameState: {
      gameType: 'flag',
      status: 'waiting',
      currentRound: 1,
      totalRounds: 5,
      timeLeft: 0,
      countdown: 3,
      playerAnswers: {}
    },
    roundHistory: [],
    usedQuestionIds: { flag: [], word: [], emoji_voice: [], dilemma: [] },
    isSpecialTheme: true,
    isPermanent: true
  };
}

// Pre-initialize special permanent room ACAA immediately on startup
initSpecialRoomAcaa();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  // Ensure we never randomly generate 'ACAA'
  while (true) {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (code.toUpperCase() !== 'ACAA') {
      break;
    }
  }
  return code;
}

function clearRoomTimer(roomId: string) {
  if (roomTimers[roomId]) {
    clearInterval(roomTimers[roomId]);
    clearTimeout(roomTimers[roomId]);
    delete roomTimers[roomId];
  }
}

function getPlayerIds(room: RoomState): string[] {
  return Object.keys(room.players);
}

function startRoundTimer(roomId: string, seconds: number, onTick?: (left: number) => void, onComplete?: () => void) {
  clearRoomTimer(roomId);
  const room = rooms[roomId];
  if (!room) return;

  room.gameState.timeLeft = seconds;
  io.to(roomId).emit('room:updated', room);

  let remaining = seconds;
  roomTimers[roomId] = setInterval(() => {
    const currentRoom = rooms[roomId];
    if (!currentRoom) {
      clearRoomTimer(roomId);
      return;
    }

    remaining -= 1;
    currentRoom.gameState.timeLeft = remaining;

    if (onTick) {
      onTick(remaining);
    }

    io.to(roomId).emit('game:time_update', { timeLeft: remaining });

    if (remaining <= 0) {
      clearRoomTimer(roomId);
      if (onComplete) {
        onComplete();
      }
    }
  }, 1000);
}

function startCountdownAndRound(roomId: string) {
  clearRoomTimer(roomId);
  const room = rooms[roomId];
  if (!room) return;

  room.gameState.status = 'countdown';
  room.gameState.countdown = 3;
  room.gameState.playerAnswers = {};
  delete room.gameState.roundWinnerId;
  delete room.gameState.roundFeedback;

  io.to(roomId).emit('room:updated', room);

  let countdownValue = 3;
  roomTimers[roomId] = setInterval(() => {
    countdownValue -= 1;
    const currentRoom = rooms[roomId];
    if (!currentRoom) {
      clearRoomTimer(roomId);
      return;
    }

    currentRoom.gameState.countdown = countdownValue;
    io.to(roomId).emit('game:countdown_tick', { countdown: countdownValue });

    if (countdownValue <= 0) {
      clearRoomTimer(roomId);
      launchRound(roomId);
    }
  }, 1000);
}

function launchRound(roomId: string) {
  const room = rooms[roomId];
  if (!room) return;

  const playerIds = getPlayerIds(room);
  if (playerIds.length < 2) {
    room.gameState.status = 'waiting';
    io.to(roomId).emit('room:updated', room);
    return;
  }

  const p1 = playerIds[0];
  const p2 = playerIds[1];
  const roundNum = room.gameState.currentRound;

  room.gameState.status = 'in_round';
  room.gameState.playerAnswers = {};

  if (!room.usedQuestionIds) {
    room.usedQuestionIds = { flag: [], word: [], emoji_voice: [], dilemma: [] };
  }

  if (room.gameState.gameType === 'flag') {
    const { question, chosenId } = generateFlagQuestion(room.usedQuestionIds.flag || []);
    room.gameState.flagData = question;
    if (!room.usedQuestionIds.flag) room.usedQuestionIds.flag = [];
    room.usedQuestionIds.flag.push(chosenId);
    io.to(roomId).emit('room:updated', room);
    startRoundTimer(roomId, 12, undefined, () => finishRound(roomId));
  } else if (room.gameState.gameType === 'word') {
    const { question, chosenId } = generateWordQuestion(room.usedQuestionIds.word || []);
    room.gameState.wordData = question;
    if (!room.usedQuestionIds.word) room.usedQuestionIds.word = [];
    room.usedQuestionIds.word.push(chosenId);
    io.to(roomId).emit('room:updated', room);
    startRoundTimer(roomId, 15, undefined, () => finishRound(roomId));
  } else if (room.gameState.gameType === 'emoji_voice') {
    const { question, chosenId } = generateEmojiVoiceQuestion(p1, p2, roundNum, room.usedQuestionIds.emoji_voice || []);
    room.gameState.emojiVoiceData = question;
    if (!room.usedQuestionIds.emoji_voice) room.usedQuestionIds.emoji_voice = [];
    room.usedQuestionIds.emoji_voice.push(chosenId);
    io.to(roomId).emit('room:updated', room);
    startRoundTimer(roomId, 25, undefined, () => finishRound(roomId));
  } else if (room.gameState.gameType === 'dilemma') {
    const { question, chosenId } = generateDilemmaQuestion(room.usedQuestionIds.dilemma || []);
    room.gameState.dilemmaData = question;
    if (!room.usedQuestionIds.dilemma) room.usedQuestionIds.dilemma = [];
    room.usedQuestionIds.dilemma.push(chosenId);
    io.to(roomId).emit('room:updated', room);
    startRoundTimer(roomId, 14, undefined, () => finishRound(roomId));
  } else if (room.gameState.gameType === 'reflex') {
    room.gameState.reflexState = {
      phase: 'ready',
      playerTaps: {}
    };
    io.to(roomId).emit('room:updated', room);

    // Random delay between 2000ms and 5000ms for reflex buzzer
    const delay = 2000 + Math.floor(Math.random() * 3000);
    clearRoomTimer(roomId);
    roomTimers[roomId] = setTimeout(() => {
      const currentRoom = rooms[roomId];
      if (!currentRoom || currentRoom.gameState.status !== 'in_round') return;

      const now = Date.now();
      if (currentRoom.gameState.reflexState) {
        currentRoom.gameState.reflexState.phase = 'signal';
        currentRoom.gameState.reflexState.signalTimestamp = now;
      }
      io.to(roomId).emit('game:reflex_signal', { timestamp: now });

      // If no one taps within 4 seconds, end round
      roomTimers[roomId] = setTimeout(() => {
        finishRound(roomId);
      }, 4000);
    }, delay);
  }
}

function finishRound(roomId: string) {
  clearRoomTimer(roomId);
  const room = rooms[roomId];
  if (!room) return;

  const playerIds = getPlayerIds(room);
  if (playerIds.length < 2) return;

  const [p1, p2] = playerIds;
  const p1Obj = room.players[p1];
  const p2Obj = room.players[p2];
  const p1Answer = room.gameState.playerAnswers[p1];
  const p2Answer = room.gameState.playerAnswers[p2];

  let winnerId: string | 'draw' | null = null;
  let feedback = '';

  if (room.gameState.gameType === 'flag') {
    const correctCountry = room.gameState.flagData?.countryName;
    const p1Correct = p1Answer && p1Answer.answer === correctCountry;
    const p2Correct = p2Answer && p2Answer.answer === correctCountry;

    if (p1Correct && p2Correct) {
      // Compare response time
      const p1Time = p1Answer.timeTaken || 12;
      const p2Time = p2Answer.timeTaken || 12;
      if (p1Time < p2Time) {
        p1Obj.score += 15;
        p2Obj.score += 10;
        winnerId = p1;
        feedback = `${p1Obj.nickname} menjawab benar lebih cepat (+15 poin)! ${p2Obj.nickname} juga benar (+10 poin).`;
      } else if (p2Time < p1Time) {
        p2Obj.score += 15;
        p1Obj.score += 10;
        winnerId = p2;
        feedback = `${p2Obj.nickname} menjawab benar lebih cepat (+15 poin)! ${p1Obj.nickname} juga benar (+10 poin).`;
      } else {
        p1Obj.score += 12;
        p2Obj.score += 12;
        winnerId = 'draw';
        feedback = `Keduanya menjawab benar di waktu yang sama! (+12 poin)`;
      }
    } else if (p1Correct) {
      p1Obj.score += 15;
      winnerId = p1;
      feedback = `${p1Obj.nickname} berhasil menebak dengan tepat! (+15 poin)`;
    } else if (p2Correct) {
      p2Obj.score += 15;
      winnerId = p2;
      feedback = `${p2Obj.nickname} berhasil menebak dengan tepat! (+15 poin)`;
    } else {
      winnerId = 'draw';
      feedback = `Keduanya belum tepat. Jawabannya adalah ${correctCountry}!`;
    }
  } else if (room.gameState.gameType === 'word') {
    const correctWord = room.gameState.wordData?.word;
    const p1Correct = p1Answer && p1Answer.answer === correctWord;
    const p2Correct = p2Answer && p2Answer.answer === correctWord;

    if (p1Correct && p2Correct) {
      const p1Time = p1Answer.timeTaken || 15;
      const p2Time = p2Answer.timeTaken || 15;
      if (p1Time < p2Time) {
        p1Obj.score += 15;
        p2Obj.score += 10;
        winnerId = p1;
        feedback = `${p1Obj.nickname} memecahkan teka-teki lebih cepat (+15)!`;
      } else {
        p2Obj.score += 15;
        p1Obj.score += 10;
        winnerId = p2;
        feedback = `${p2Obj.nickname} memecahkan teka-teki lebih cepat (+15)!`;
      }
    } else if (p1Correct) {
      p1Obj.score += 15;
      winnerId = p1;
      feedback = `${p1Obj.nickname} tepat menebak: ${correctWord}! (+15 poin)`;
    } else if (p2Correct) {
      p2Obj.score += 15;
      winnerId = p2;
      feedback = `${p2Obj.nickname} tepat menebak: ${correctWord}! (+15 poin)`;
    } else {
      winnerId = 'draw';
      feedback = `Waktu habis! Jawabannya adalah: ${correctWord}`;
    }
  } else if (room.gameState.gameType === 'emoji_voice') {
    const data = room.gameState.emojiVoiceData;
    const guesserId = data?.guesserPlayerId;
    const describerId = data?.describerPlayerId;
    const guess = room.gameState.playerAnswers[guesserId || ''];

    const targetEmoji = data?.targetEmoji;
    const targetName = data?.name;

    const guesserName = (guesserId && room.players[guesserId]?.nickname) || 'Penebak';
    const describerName = (describerId && room.players[describerId]?.nickname) || 'Pemberi Petunjuk';

    if (guess && guess.answer === targetEmoji && guesserId && room.players[guesserId]) {
      // HANYA PEMAIN YANG MENEBAK BENAR YANG MENDAPATKAN SKOR (+15 POIN)
      // Pemain yang memberitahu petunjuk (describer) TIDAK MENDAPATKAN SKOR (0 poin)
      room.players[guesserId].score += 15;
      winnerId = guesserId;
      feedback = `🎯 Tebakan tepat! ${guesserName} (Penebak) berhasil menebak: ${targetEmoji} ${targetName}! (+15 poin untuk ${guesserName}, ${describerName} 0 poin)`;
    } else {
      winnerId = 'draw';
      const guessedEmoji = guess?.answer;
      if (guessedEmoji) {
        feedback = `❌ Tebakan meleset! ${guesserName} memilih ${guessedEmoji}. Emoji rahasianya adalah ${targetEmoji} (${targetName}). (Keduanya 0 poin)`;
      } else {
        feedback = `⏰ Waktu habis! ${guesserName} belum sempat memilih. Emoji rahasianya adalah ${targetEmoji} (${targetName}). (Keduanya 0 poin)`;
      }
    }
  } else if (room.gameState.gameType === 'dilemma') {
    const a1 = p1Answer?.choice;
    const a2 = p2Answer?.choice;

    if (a1 && a2 && a1 === a2) {
      p1Obj.score += 15;
      p2Obj.score += 15;
      winnerId = 'draw';
      const chosenText = a1 === 'A' ? room.gameState.dilemmaData?.optionA.text : room.gameState.dilemmaData?.optionB.text;
      feedback = `SEFREKUENSI! Kalian berdua sama-sama memilih: "${chosenText}" (+15 poin kecocokan!)`;
    } else if (a1 && a2) {
      winnerId = 'draw';
      const p1Text = a1 === 'A' ? room.gameState.dilemmaData?.optionA.text : room.gameState.dilemmaData?.optionB.text;
      const p2Text = a2 === 'A' ? room.gameState.dilemmaData?.optionA.text : room.gameState.dilemmaData?.optionB.text;
      feedback = `Beda selera nih! ${p1Obj.nickname}: "${p1Text}" vs ${p2Obj.nickname}: "${p2Text}". Perbedaan itu melengkapi!`;
    } else {
      winnerId = 'draw';
      feedback = `Salah satu atau keduanya belum memilih pilihan dilema!`;
    }
  } else if (room.gameState.gameType === 'reflex') {
    const taps = room.gameState.reflexState?.playerTaps || {};
    const t1 = taps[p1];
    const t2 = taps[p2];

    if (t1?.early && t2?.early) {
      winnerId = 'draw';
      feedback = `Keduanya curang/terlalu cepat menekan sebelum sinyal! (False start)`;
    } else if (t1?.early) {
      p2Obj.score += 15;
      winnerId = p2;
      feedback = `${p1Obj.nickname} menekan sebelum sinyal! Kemenangan untuk ${p2Obj.nickname} (+15 poin).`;
    } else if (t2?.early) {
      p1Obj.score += 15;
      winnerId = p1;
      feedback = `${p2Obj.nickname} menekan sebelum sinyal! Kemenangan untuk ${p1Obj.nickname} (+15 poin).`;
    } else if (t1 && t2) {
      if (t1.timeMs < t2.timeMs) {
        p1Obj.score += 15;
        winnerId = p1;
        feedback = `Refleks dewa! ${p1Obj.nickname} menang (${t1.timeMs}ms vs ${t2.timeMs}ms) (+15 poin)!`;
      } else {
        p2Obj.score += 15;
        winnerId = p2;
        feedback = `Refleks dewa! ${p2Obj.nickname} menang (${t2.timeMs}ms vs ${t1.timeMs}ms) (+15 poin)!`;
      }
    } else if (t1) {
      p1Obj.score += 15;
      winnerId = p1;
      feedback = `${p1Obj.nickname} menekan dalam ${t1.timeMs}ms! (+15 poin)`;
    } else if (t2) {
      p2Obj.score += 15;
      winnerId = p2;
      feedback = `${p2Obj.nickname} menekan dalam ${t2.timeMs}ms! (+15 poin)`;
    } else {
      winnerId = 'draw';
      feedback = `Tidak ada yang menekan sinyal!`;
    }
  }

  // Record round result
  const winnerName = winnerId === 'draw' ? 'Seri' : winnerId ? room.players[winnerId]?.nickname : '-';
  const roundRes: RoundResult = {
    roundNumber: room.gameState.currentRound,
    winnerPlayerId: winnerId,
    winnerName,
    player1Score: p1Obj.score,
    player2Score: p2Obj.score,
    details: feedback
  };

  room.roundHistory.push(roundRes);
  room.gameState.status = 'round_result';
  room.gameState.roundWinnerId = winnerId;
  room.gameState.roundFeedback = feedback;

  io.to(roomId).emit('room:updated', room);

  // After 4.5 seconds showing round result, check if game is over or go to next round
  roomTimers[roomId] = setTimeout(() => {
    const currentRoom = rooms[roomId];
    if (!currentRoom) return;

    if (currentRoom.gameState.currentRound >= currentRoom.gameState.totalRounds) {
      // GAME OVER
      currentRoom.gameState.status = 'game_over';
      // Determine overall winner and increase totalWins
      const curP1 = currentRoom.players[p1];
      const curP2 = currentRoom.players[p2];
      if (curP1 && curP2) {
        if (curP1.score > curP2.score) {
          curP1.totalWins += 1;
        } else if (curP2.score > curP1.score) {
          curP2.totalWins += 1;
        }
      }
      io.to(roomId).emit('room:updated', currentRoom);
    } else {
      // NEXT ROUND
      currentRoom.gameState.currentRound += 1;
      startCountdownAndRound(roomId);
    }
  }, 4500);
}

// Socket Connection Handler
io.on('connection', (socket: Socket) => {
  let userRoomId: string | null = null;

  socket.on('room:create', ({ nickname, avatar }: { nickname: string; avatar: string }) => {
    const roomId = generateRoomCode();
    const player: Player = {
      id: socket.id,
      nickname: nickname || 'Player 1',
      avatar: avatar || '🦁',
      isHost: true,
      score: 0,
      totalWins: 0,
      isReady: true,
      isConnected: true
    };

    rooms[roomId] = {
      roomId,
      players: { [socket.id]: player },
      hostId: socket.id,
      gameState: {
        gameType: 'flag',
        status: 'waiting',
        currentRound: 1,
        totalRounds: 5,
        timeLeft: 0,
        countdown: 3,
        playerAnswers: {}
      },
      roundHistory: [],
      usedQuestionIds: { flag: [], word: [], emoji_voice: [], dilemma: [] }
    };

    userRoomId = roomId;
    socket.join(roomId);
    socket.emit('room:joined', { room: rooms[roomId], playerId: socket.id });
  });

  socket.on('room:join', ({ roomId, nickname, avatar }: { roomId: string; nickname: string; avatar: string }) => {
    const cleanRoomId = roomId.trim().toUpperCase();
    const isSpecialAcaa = cleanRoomId === 'ACAA';

    let room = rooms[cleanRoomId];

    // Special permanent room: if it doesn't exist yet, auto-provision it
    if (!room && isSpecialAcaa) {
      rooms[cleanRoomId] = {
        roomId: 'ACAA',
        players: {},
        hostId: socket.id,
        gameState: {
          gameType: 'flag',
          status: 'waiting',
          currentRound: 1,
          totalRounds: 5,
          timeLeft: 0,
          countdown: 3,
          playerAnswers: {}
        },
        roundHistory: [],
        usedQuestionIds: { flag: [], word: [], emoji_voice: [], dilemma: [] },
        isSpecialTheme: true,
        isPermanent: true
      };
      room = rooms[cleanRoomId];
    }

    if (!room) {
      socket.emit('room:error', { message: 'Kode Room tidak ditemukan. Silakan periksa kembali!' });
      return;
    }

    // Ensure special properties if it's ACAA
    if (isSpecialAcaa) {
      room.isSpecialTheme = true;
      room.isPermanent = true;
    }

    const currentPlayers = Object.keys(room.players);

    // If re-joining an existing player session
    let existingPlayerKey = currentPlayers.find(id => room.players[id].nickname === nickname && !room.players[id].isConnected);
    if (existingPlayerKey) {
      const oldPlayer = room.players[existingPlayerKey];
      delete room.players[existingPlayerKey];
      room.players[socket.id] = {
        ...oldPlayer,
        id: socket.id,
        isConnected: true
      };
      if (room.hostId === existingPlayerKey) {
        room.hostId = socket.id;
      }
    } else {
      if (currentPlayers.length >= 2) {
        socket.emit('room:error', { message: 'Room sudah penuh (maksimal 2 pemain)!' });
        return;
      }

      const isFirstPlayer = currentPlayers.length === 0;
      const player: Player = {
        id: socket.id,
        nickname: nickname || (isFirstPlayer ? 'Player 1' : 'Player 2'),
        avatar: avatar || (isFirstPlayer ? '🦁' : '🦊'),
        isHost: isFirstPlayer,
        score: 0,
        totalWins: 0,
        isReady: isFirstPlayer,
        isConnected: true
      };
      room.players[socket.id] = player;
      if (isFirstPlayer) {
        room.hostId = socket.id;
      }
    }

    userRoomId = cleanRoomId;
    socket.join(cleanRoomId);
    socket.emit('room:joined', { room, playerId: socket.id });
    io.to(cleanRoomId).emit('room:updated', room);
  });

  function getSocketRoom(): { roomId: string; room: RoomState } | null {
    if (userRoomId && rooms[userRoomId]) {
      return { roomId: userRoomId, room: rooms[userRoomId] };
    }
    for (const [rId, r] of Object.entries(rooms)) {
      if (r.players[socket.id]) {
        userRoomId = rId;
        return { roomId: rId, room: r };
      }
    }
    return null;
  }

  socket.on('player:ready', ({ isReady }: { isReady: boolean }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.players[socket.id]) {
      room.players[socket.id].isReady = isReady;
      io.to(roomId).emit('room:updated', room);
    }
  });

  socket.on('game:set_rounds', ({ totalRounds }: { totalRounds: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    const validRounds = [5, 10, 15].includes(totalRounds) ? totalRounds : (totalRounds > 0 ? totalRounds : 5);
    room.gameState.totalRounds = validRounds;
    io.to(roomId).emit('room:updated', room);
  });

  socket.on('game:select_type', ({ gameType, totalRounds, startImmediately }: { gameType: GameType; totalRounds?: number; startImmediately?: boolean }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    clearRoomTimer(roomId);

    room.gameState.gameType = gameType;
    if (totalRounds) {
      room.gameState.totalRounds = totalRounds;
    }
    room.gameState.currentRound = 1;
    // Reset round scores for new game
    Object.values(room.players).forEach(p => (p.score = 0));
    room.roundHistory = [];
    room.gameState.playerAnswers = {};

    const playerIds = getPlayerIds(room);
    if (startImmediately && playerIds.length >= 2) {
      startCountdownAndRound(roomId);
    } else {
      room.gameState.status = 'waiting';
      io.to(roomId).emit('room:updated', room);
    }
  });

  socket.on('game:start', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    const playerIds = getPlayerIds(room);
    if (playerIds.length < 2) {
      socket.emit('room:error', { message: 'Menunggu 1 pemain lagi untuk bergabung!' });
      return;
    }

    room.gameState.currentRound = 1;
    room.gameState.playerAnswers = {};
    Object.values(room.players).forEach(p => (p.score = 0));
    room.roundHistory = [];

    startCountdownAndRound(roomId);
  });

  socket.on('game:rematch', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    clearRoomTimer(roomId);

    room.gameState.status = 'waiting';
    room.gameState.currentRound = 1;
    room.gameState.playerAnswers = {};
    Object.values(room.players).forEach(p => (p.score = 0));
    room.roundHistory = [];

    io.to(roomId).emit('room:updated', room);
    startCountdownAndRound(roomId);
  });

  socket.on('game:answer', (data: { answer?: any; choice?: string; timeTaken?: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round') return;

    room.gameState.playerAnswers[socket.id] = data;
    io.to(roomId).emit('room:updated', room);

    const playerIds = getPlayerIds(room);

    // If both players have answered, finish round immediately!
    if (room.gameState.gameType === 'flag' || room.gameState.gameType === 'word' || room.gameState.gameType === 'dilemma') {
      const answeredCount = Object.keys(room.gameState.playerAnswers).length;
      if (answeredCount >= playerIds.length) {
        clearRoomTimer(roomId);
        finishRound(roomId);
      }
    } else if (room.gameState.gameType === 'emoji_voice') {
      const guesserId = room.gameState.emojiVoiceData?.guesserPlayerId;
      if (socket.id === guesserId) {
        clearRoomTimer(roomId);
        finishRound(roomId);
      }
    }
  });

  socket.on('game:reflex_tap', ({ tapTimestamp }: { tapTimestamp: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'reflex') return;

    const reflex = room.gameState.reflexState;
    if (!reflex) return;

    if (reflex.phase === 'ready') {
      reflex.playerTaps[socket.id] = { timeMs: -1, early: true };
      io.to(roomId).emit('room:updated', room);
      clearRoomTimer(roomId);
      finishRound(roomId);
    } else if (reflex.phase === 'signal' && reflex.signalTimestamp) {
      if (!reflex.playerTaps[socket.id]) {
        const reactionTime = Math.max(1, tapTimestamp - reflex.signalTimestamp);
        reflex.playerTaps[socket.id] = { timeMs: reactionTime, early: false };
        io.to(roomId).emit('room:updated', room);

        const playerIds = getPlayerIds(room);
        if (Object.keys(reflex.playerTaps).length >= playerIds.length) {
          clearRoomTimer(roomId);
          finishRound(roomId);
        }
      }
    }
  });

  socket.on('reaction:send', ({ emoji }: { emoji: string }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    const player = room.players[socket.id];
    if (!player) return;

    const reactionPayload = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: socket.id,
      senderName: player.nickname,
      emoji,
      timestamp: Date.now()
    };
    room.lastReaction = reactionPayload;
    io.to(roomId).emit('reaction:broadcast', reactionPayload);
  });

  socket.on('chat:send', ({ message }: { message: string }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    const player = room.players[socket.id];
    if (!player) return;

    io.to(roomId).emit('chat:broadcast', {
      senderId: socket.id,
      senderName: player.nickname,
      senderAvatar: player.avatar,
      message,
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    if (userRoomId && rooms[userRoomId]) {
      const room = rooms[userRoomId];
      if (room.players[socket.id]) {
        room.players[socket.id].isConnected = false;
        io.to(userRoomId).emit('room:updated', room);

        // If all disconnected, schedule room cleanup (unless room is permanent)
        const allDisconnected = Object.values(room.players).every(p => !p.isConnected);
        if (allDisconnected) {
          clearRoomTimer(userRoomId);
          if (room.isPermanent) {
            // Permanent room: reset game state to waiting and clear disconnected players when all leave so next visitors get a clean slate
            room.gameState.status = 'waiting';
            room.gameState.currentRound = 1;
            room.gameState.playerAnswers = {};
            room.players = {};
          } else {
            setTimeout(() => {
              if (rooms[userRoomId!] && !rooms[userRoomId!].isPermanent && Object.values(rooms[userRoomId!].players).every(p => !p.isConnected)) {
                delete rooms[userRoomId!];
              }
            }, 30000);
          }
        }
      }
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true as const,
        hmr: !isHmrDisabled,
        ws: isHmrDisabled ? false : { server },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`DuoPlay game server running on port ${PORT}`);
  });
}

startServer();
