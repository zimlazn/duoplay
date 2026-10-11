import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  GameType,
  RoomState,
  Player,
  RoundResult,
  UnoColor,
  UnoCard
} from './src/types/game.ts';
import {
  generateFlagQuestion,
  generateWordQuestion,
  generateEmojiVoiceQuestion,
  generateDilemmaQuestion
} from './src/data/gameData.ts';
import {
  initUnoGame,
  createUnoDeck,
  isValidUnoMove
} from './src/utils/unoLogic.ts';
import {
  initLudoGame,
  getValidLudoMoves,
  getGlobalTrackIndex,
  SAFE_INDICES
} from './src/utils/ludoLogic.ts';

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
// Uno draw decks per room
const roomUnoDecks: Record<string, UnoCard[]> = {};

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

    // If game is paused, freeze the timer!
    if (currentRoom.gameState.isPaused) {
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
  room.gameState.isPaused = false;
  room.gameState.exitVotes = [];
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

function checkTicTacToeWin(board: Array<string | null>): { winner: 'X' | 'O' | 'draw' | null; line: number[] | null } {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as 'X' | 'O', line };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  return { winner: null, line: null };
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
  room.gameState.isPaused = false;
  room.gameState.exitVotes = [];

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
      io.to(roomId).emit('room:updated', currentRoom);

      // If no one taps within 4 seconds, end round
      roomTimers[roomId] = setTimeout(() => {
        finishRound(roomId);
      }, 4000);
    }, delay);
  } else if (room.gameState.gameType === 'tictactoe') {
    const startingPlayerId = roundNum % 2 === 1 ? p1 : p2;
    room.gameState.timeLeft = 0;
    room.gameState.tictactoeState = {
      board: Array(9).fill(null),
      currentTurnPlayerId: startingPlayerId,
      playerSymbols: {
        [p1]: 'X',
        [p2]: 'O'
      },
      winningLine: null,
      status: 'playing'
    };
    clearRoomTimer(roomId);
    io.to(roomId).emit('room:updated', room);
  } else if (room.gameState.gameType === 'uno') {
    const { unoState, remainingDeck } = initUnoGame(p1, p2);
    room.gameState.timeLeft = 0;
    room.gameState.unoState = unoState;
    roomUnoDecks[roomId] = remainingDeck;
    clearRoomTimer(roomId);
    io.to(roomId).emit('room:updated', room);
  } else if (room.gameState.gameType === 'ludo') {
    room.gameState.timeLeft = 0;
    room.gameState.ludoState = initLudoGame(p1, p2);
    clearRoomTimer(roomId);
    io.to(roomId).emit('room:updated', room);
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
  if (!p1Obj || !p2Obj) return;

  const p1Answer = room.gameState.playerAnswers[p1];
  const p2Answer = room.gameState.playerAnswers[p2];

  let winnerId: string | 'draw' | null = null;
  let feedback = '';

  if (room.gameState.gameType === 'flag') {
    const correctCountry = room.gameState.flagData?.countryName;
    const p1Correct = p1Answer && p1Answer.answer === correctCountry;
    const p2Correct = p2Answer && p2Answer.answer === correctCountry;

    if (p1Correct && p2Correct) {
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
  } else if (room.gameState.gameType === 'tictactoe') {
    const ttt = room.gameState.tictactoeState;
    if (ttt && ttt.status === 'win' && ttt.winnerPlayerId && ttt.winnerPlayerId !== 'draw') {
      winnerId = ttt.winnerPlayerId;
      const winObj = room.players[winnerId];
      if (winObj) winObj.score += 15;
      feedback = `🎉 ${winObj?.nickname || 'Pemain'} berhasil membentuk garis 3 beruntun! (+15 poin)`;
    } else {
      winnerId = 'draw';
      p1Obj.score += 5;
      p2Obj.score += 5;
      feedback = `Seri! Papan Tic Tac Toe terisi penuh tanpa pemenang (+5 poin).`;
    }
  } else if (room.gameState.gameType === 'uno') {
    const uno = room.gameState.unoState;
    if (uno && uno.winnerPlayerId) {
      winnerId = uno.winnerPlayerId;
      const winObj = room.players[winnerId];
      if (winObj) winObj.score += 30;
      feedback = `🎉 ${winObj?.nickname || 'Pemain'} berhasil menghabiskan kartu UNO! (+30 poin)`;
    } else {
      winnerId = 'draw';
      feedback = `Waktu babak UNO habis!`;
    }
  } else if (room.gameState.gameType === 'ludo') {
    const ludo = room.gameState.ludoState;
    if (ludo && ludo.winnerPlayerId) {
      winnerId = ludo.winnerPlayerId;
      const winObj = room.players[winnerId];
      if (winObj) winObj.score += 40;
      feedback = `🏆 ${winObj?.nickname || 'Pemain'} memenangkan balapan LUDO! (+40 poin)`;
    } else {
      winnerId = 'draw';
      feedback = `Waktu babak LUDO selesai!`;
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
      nickname: nickname || 'Pemain 1',
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

    if (isSpecialAcaa) {
      room.isSpecialTheme = true;
      room.isPermanent = true;
    }

    const currentPlayers = Object.keys(room.players);

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
        nickname: nickname || (isFirstPlayer ? 'Pemain 1' : 'Pemain 2'),
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
    const validRounds = [1, 3, 5, 10, 15].includes(totalRounds) ? totalRounds : (totalRounds > 0 ? totalRounds : 5);
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

  // Pause / Resume Toggle
  socket.on('game:pause_toggle', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round') return;

    room.gameState.isPaused = !room.gameState.isPaused;
    if (room.gameState.isPaused) {
      room.gameState.pausedByPlayerId = socket.id;
    } else {
      delete room.gameState.pausedByPlayerId;
    }
    io.to(roomId).emit('room:updated', room);
  });

  // Exit from game (Requires mutual consent)
  socket.on('game:exit_request', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (!room.gameState.exitVotes) room.gameState.exitVotes = [];
    if (!room.gameState.exitVotes.includes(socket.id)) {
      room.gameState.exitVotes.push(socket.id);
    }

    const playerIds = getPlayerIds(room);
    if (room.gameState.exitVotes.length >= playerIds.length) {
      // Both agreed! Reset to Lobby
      clearRoomTimer(roomId);
      room.gameState.status = 'waiting';
      room.gameState.isPaused = false;
      room.gameState.exitVotes = [];
      room.gameState.currentRound = 1;
      room.gameState.playerAnswers = {};
      delete room.gameState.tictactoeState;
      delete room.gameState.unoState;
      delete room.gameState.ludoState;
    }
    io.to(roomId).emit('room:updated', room);
  });

  socket.on('game:exit_cancel', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    room.gameState.exitVotes = [];
    io.to(roomId).emit('room:updated', room);
  });

  socket.on('game:answer', (data: { answer?: any; choice?: string; timeTaken?: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.isPaused) return;

    room.gameState.playerAnswers[socket.id] = data;
    io.to(roomId).emit('room:updated', room);

    const playerIds = getPlayerIds(room);

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

  // Reflex tap
  socket.on('game:reflex_tap', ({ tapTimestamp }: { tapTimestamp: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'reflex' || room.gameState.isPaused) return;

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

  // --- TIC TAC TOE HANDLER ---
  socket.on('tictactoe:move', ({ index }: { index: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'tictactoe' || room.gameState.isPaused) return;

    const ttt = room.gameState.tictactoeState;
    if (!ttt || ttt.status !== 'playing') return;
    if (ttt.currentTurnPlayerId !== socket.id) return;
    if (index < 0 || index > 8 || ttt.board[index] !== null) return;

    const playerSymbol = ttt.playerSymbols[socket.id];
    ttt.board[index] = playerSymbol;

    const { winner, line } = checkTicTacToeWin(ttt.board);
    if (winner && winner !== 'draw') {
      ttt.status = 'win';
      ttt.winningLine = line;
      ttt.winnerPlayerId = socket.id;
      io.to(roomId).emit('room:updated', room);
      clearRoomTimer(roomId);
      setTimeout(() => finishRound(roomId), 1500);
    } else if (winner === 'draw') {
      ttt.status = 'draw';
      ttt.winnerPlayerId = 'draw';
      io.to(roomId).emit('room:updated', room);
      clearRoomTimer(roomId);
      setTimeout(() => finishRound(roomId), 1500);
    } else {
      const playerIds = getPlayerIds(room);
      const nextPlayerId = playerIds.find(id => id !== socket.id) || socket.id;
      ttt.currentTurnPlayerId = nextPlayerId;
      io.to(roomId).emit('room:updated', room);
    }
  });

  // --- UNO HANDLERS ---
  socket.on('uno:play_card', ({ cardId, chosenColor }: { cardId: string; chosenColor?: UnoColor }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'uno' || room.gameState.isPaused) return;

    const uno = room.gameState.unoState;
    if (!uno || uno.currentTurnPlayerId !== socket.id) return;

    const playerHand = uno.playerHands[socket.id];
    if (!playerHand) return;

    const cardIndex = playerHand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = playerHand[cardIndex];
    if (!isValidUnoMove(card, uno.topCard, uno.activeColor)) return;

    playerHand.splice(cardIndex, 1);
    uno.topCard = card;
    uno.hasDrawnCardThisTurn = false;
    delete uno.drawnCardId;

    if (card.color === 'wild') {
      uno.activeColor = chosenColor || 'red';
    } else {
      uno.activeColor = card.color;
    }

    const playerIds = getPlayerIds(room);
    const opponentId = playerIds.find(id => id !== socket.id) || socket.id;
    const playerName = room.players[socket.id]?.nickname || 'Pemain';

    if (playerHand.length === 0) {
      uno.winnerPlayerId = socket.id;
      uno.lastActionMessage = `🎉 ${playerName} memenangkan permainan UNO!`;
      io.to(roomId).emit('room:updated', room);
      clearRoomTimer(roomId);
      setTimeout(() => finishRound(roomId), 1500);
      return;
    }

    let nextTurn = opponentId;
    let message = `${playerName} memainkan ${card.color !== 'wild' ? card.color.toUpperCase() : ''} ${card.value.toUpperCase()}`;

    if (card.value === 'skip') {
      nextTurn = socket.id;
      message = `${playerName} memainkan Skip! Giliranmu lagi.`;
    } else if (card.value === 'reverse') {
      nextTurn = socket.id;
      message = `${playerName} memainkan Reverse! Giliranmu lagi.`;
    } else if (card.value === 'draw2') {
      const deck = roomUnoDecks[roomId] || [];
      if (deck.length < 2) {
        deck.push(...createUnoDeck());
      }
      const drawn = deck.splice(0, 2);
      if (!uno.playerHands[opponentId]) uno.playerHands[opponentId] = [];
      uno.playerHands[opponentId].push(...drawn);
      uno.drawPileCount = deck.length;
      nextTurn = socket.id;
      message = `${playerName} memainkan Draw +2! Lawan mengambil 2 kartu & giliranmu lagi.`;
    } else if (card.value === 'wild4') {
      const deck = roomUnoDecks[roomId] || [];
      if (deck.length < 4) {
        deck.push(...createUnoDeck());
      }
      const drawn = deck.splice(0, 4);
      if (!uno.playerHands[opponentId]) uno.playerHands[opponentId] = [];
      uno.playerHands[opponentId].push(...drawn);
      uno.drawPileCount = deck.length;
      nextTurn = socket.id;
      message = `${playerName} memainkan Wild +4 (${uno.activeColor.toUpperCase()})! Lawan mengambil 4 kartu & giliranmu lagi.`;
    } else if (card.value === 'wild') {
      nextTurn = opponentId;
      message = `${playerName} memainkan Wild dan memilih warna ${uno.activeColor.toUpperCase()}!`;
    }

    uno.currentTurnPlayerId = nextTurn;
    uno.lastActionMessage = message;

    if (playerHand.length > 1) {
      uno.unoCalled[socket.id] = false;
    }

    io.to(roomId).emit('room:updated', room);
  });

  socket.on('uno:draw_card', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'uno' || room.gameState.isPaused) return;

    const uno = room.gameState.unoState;
    if (!uno || uno.currentTurnPlayerId !== socket.id) return;
    if (uno.hasDrawnCardThisTurn) return;

    const deck = roomUnoDecks[roomId] || [];
    if (deck.length === 0) {
      deck.push(...createUnoDeck());
      roomUnoDecks[roomId] = deck;
    }

    const drawnCard = deck.shift();
    if (!drawnCard) return;

    if (!uno.playerHands[socket.id]) uno.playerHands[socket.id] = [];
    uno.playerHands[socket.id].push(drawnCard);
    uno.drawPileCount = deck.length;
    uno.hasDrawnCardThisTurn = true;
    uno.drawnCardId = drawnCard.id;

    const playerName = room.players[socket.id]?.nickname || 'Pemain';
    uno.lastActionMessage = `${playerName} mengambil 1 kartu dari tumpukan.`;

    io.to(roomId).emit('room:updated', room);
  });

  socket.on('uno:pass_turn', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'uno' || room.gameState.isPaused) return;

    const uno = room.gameState.unoState;
    if (!uno || uno.currentTurnPlayerId !== socket.id) return;
    if (!uno.hasDrawnCardThisTurn) return;

    uno.hasDrawnCardThisTurn = false;
    delete uno.drawnCardId;

    const playerIds = getPlayerIds(room);
    const opponentId = playerIds.find(id => id !== socket.id) || socket.id;
    uno.currentTurnPlayerId = opponentId;

    const playerName = room.players[socket.id]?.nickname || 'Pemain';
    uno.lastActionMessage = `${playerName} mengakhiri giliran.`;

    io.to(roomId).emit('room:updated', room);
  });

  socket.on('uno:call_uno', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    const uno = room.gameState.unoState;
    if (!uno) return;

    const playerHand = uno.playerHands[socket.id] || [];
    if (playerHand.length === 1) {
      uno.unoCalled[socket.id] = true;
      const playerName = room.players[socket.id]?.nickname || 'Pemain';
      uno.lastActionMessage = `🔥 ${playerName} BERKATA: UNO! (Tersisa 1 kartu!)`;
      io.to(roomId).emit('room:updated', room);
    }
  });

  // --- LUDO HANDLERS ---
  socket.on('ludo:roll_dice', () => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'ludo' || room.gameState.isPaused) return;

    const ludo = room.gameState.ludoState;
    if (!ludo || ludo.currentTurnPlayerId !== socket.id) return;
    if (!ludo.canRoll) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    ludo.diceValue = dice;
    ludo.diceRolled = true;
    ludo.canRoll = false;

    const playerColor = ludo.playerColors[socket.id];
    const playerTokens = ludo.tokens[playerColor] || [];
    const valid = getValidLudoMoves(playerTokens, dice);
    ludo.validMoves = valid;

    const playerName = room.players[socket.id]?.nickname || 'Pemain';

    if (valid.length === 0) {
      ludo.lastMessage = `${playerName} dapat angka ${dice}. Tidak ada pion yang bisa melangkah!`;
      io.to(roomId).emit('room:updated', room);

      setTimeout(() => {
        const curRoom = rooms[roomId];
        if (!curRoom || !curRoom.gameState.ludoState) return;
        const curLudo = curRoom.gameState.ludoState;

        if (dice === 6) {
          curLudo.canRoll = true;
          curLudo.diceRolled = false;
          curLudo.validMoves = [];
          curLudo.lastMessage = `${playerName} dapat angka 6 tapi terhalang. Lempar lagi!`;
        } else {
          const pIds = getPlayerIds(curRoom);
          const nextP = pIds.find(id => id !== socket.id) || socket.id;
          curLudo.currentTurnPlayerId = nextP;
          curLudo.canRoll = true;
          curLudo.diceRolled = false;
          curLudo.diceValue = null;
          curLudo.validMoves = [];
          curLudo.lastMessage = `Giliran berganti ke ${curRoom.players[nextP]?.nickname || 'Lawan'}.`;
        }
        io.to(roomId).emit('room:updated', curRoom);
      }, 1200);
      return;
    }

    ludo.lastMessage = `${playerName} dapat angka ${dice}! Pilih pion untuk melangkah.`;
    io.to(roomId).emit('room:updated', room);
  });

  socket.on('ludo:move_token', ({ tokenId }: { tokenId: number }) => {
    const current = getSocketRoom();
    if (!current) return;
    const { roomId, room } = current;
    if (room.gameState.status !== 'in_round' || room.gameState.gameType !== 'ludo' || room.gameState.isPaused) return;

    const ludo = room.gameState.ludoState;
    if (!ludo || ludo.currentTurnPlayerId !== socket.id) return;
    if (!ludo.diceRolled || ludo.diceValue === null) return;
    if (!ludo.validMoves.includes(tokenId)) return;

    const playerColor = ludo.playerColors[socket.id];
    const playerTokens = ludo.tokens[playerColor] || [];
    const token = playerTokens.find(t => t.id === tokenId);
    if (!token) return;

    const dice = ludo.diceValue;
    if (token.step === -1) {
      token.step = 0;
    } else {
      token.step += dice;
    }

    let captured = false;
    let capturedName = '';
    const playerIds = getPlayerIds(room);
    const opponentId = playerIds.find(id => id !== socket.id) || socket.id;
    const opponentColor = ludo.playerColors[opponentId];
    const opponentTokens = ludo.tokens[opponentColor] || [];

    if (token.step >= 0 && token.step <= 50) {
      const myGlobal = getGlobalTrackIndex(token.color, token.step);
      if (myGlobal !== null && !SAFE_INDICES.includes(myGlobal)) {
        for (const oppToken of opponentTokens) {
          if (oppToken.step >= 0 && oppToken.step <= 50) {
            const oppGlobal = getGlobalTrackIndex(oppToken.color, oppToken.step);
            if (oppGlobal === myGlobal) {
              oppToken.step = -1;
              captured = true;
              capturedName = room.players[opponentId]?.nickname || 'Lawan';
              break;
            }
          }
        }
      }
    }

    const playerName = room.players[socket.id]?.nickname || 'Pemain';

    const allHome = playerTokens.every(t => t.step === 56);
    if (allHome) {
      ludo.winnerPlayerId = socket.id;
      ludo.lastMessage = `🏆 SELAMAT! ${playerName} berhasil memasukkan semua 4 pion ke Home!`;
      io.to(roomId).emit('room:updated', room);
      clearRoomTimer(roomId);
      setTimeout(() => finishRound(roomId), 1500);
      return;
    }

    const extraTurn = dice === 6 || captured;
    if (extraTurn) {
      ludo.canRoll = true;
      ludo.diceRolled = false;
      ludo.diceValue = null;
      ludo.validMoves = [];
      ludo.lastMessage = captured
        ? `⚔️ ${playerName} memakan pion ${capturedName}! Bonus lemparan dadu!`
        : `🎲 ${playerName} dapat angka 6! Bonus lemparan dadu!`;
    } else {
      ludo.currentTurnPlayerId = opponentId;
      ludo.canRoll = true;
      ludo.diceRolled = false;
      ludo.diceValue = null;
      ludo.validMoves = [];
      ludo.lastMessage = `Giliran berganti ke ${room.players[opponentId]?.nickname || 'Lawan'}.`;
    }

    io.to(roomId).emit('room:updated', room);
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

        const allDisconnected = Object.values(room.players).every(p => !p.isConnected);
        if (allDisconnected) {
          clearRoomTimer(userRoomId);
          delete roomUnoDecks[userRoomId];
          if (room.isPermanent) {
            room.gameState.status = 'waiting';
            room.gameState.currentRound = 1;
            room.gameState.playerAnswers = {};
            room.players = {};
          } else {
            setTimeout(() => {
              if (rooms[userRoomId!] && !rooms[userRoomId!].isPermanent && Object.values(rooms[userRoomId!].players).every(p => !p.isConnected)) {
                delete rooms[userRoomId!];
                delete roomUnoDecks[userRoomId!];
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
