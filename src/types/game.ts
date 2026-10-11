export type GameType =
  | 'flag'
  | 'word'
  | 'emoji_voice'
  | 'dilemma'
  | 'reflex'
  | 'tictactoe'
  | 'uno'
  | 'ludo';

export interface Player {
  id: string; // socket.id
  nickname: string;
  avatar: string;
  isHost: boolean;
  score: number;
  totalWins: number;
  isReady: boolean;
  isConnected: boolean;
}

export interface FlagQuestion {
  id: string;
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  options: string[];
  fact?: string;
}

export interface WordQuestion {
  id: string;
  word: string;
  clue: string;
  category: string;
  options: string[];
  hint: string;
}

export interface EmojiVoiceQuestion {
  id: string;
  targetEmoji: string;
  name: string;
  category: string;
  forbiddenWords: string[];
  options: { emoji: string; name: string }[];
  describerPlayerId: string;
  guesserPlayerId: string;
}

export interface DilemmaQuestion {
  id: string;
  title: string;
  category: string;
  optionA: { id: 'A'; text: string; emoji: string };
  optionB: { id: 'B'; text: string; emoji: string };
}

export interface RoundResult {
  roundNumber: number;
  winnerPlayerId: string | 'draw' | null;
  winnerName: string;
  player1Score: number;
  player2Score: number;
  details?: string;
}

// --- TIC TAC TOE TYPES ---
export interface TicTacToeState {
  board: Array<string | null>; // 9 cells
  currentTurnPlayerId: string;
  playerSymbols: Record<string, 'X' | 'O'>;
  winningLine: number[] | null;
  status: 'playing' | 'win' | 'draw';
  winnerPlayerId?: string | 'draw';
}

// --- UNO TYPES ---
export type UnoColor = 'red' | 'blue' | 'green' | 'yellow';
export type UnoValue =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface UnoCard {
  id: string;
  color: UnoColor | 'wild';
  value: UnoValue;
}

export interface UnoState {
  currentTurnPlayerId: string;
  topCard: UnoCard;
  activeColor: UnoColor;
  playerHands: Record<string, UnoCard[]>;
  drawPileCount: number;
  unoCalled: Record<string, boolean>;
  hasDrawnCardThisTurn?: boolean;
  drawnCardId?: string;
  lastActionMessage?: string;
  winnerPlayerId?: string;
}

// --- LUDO TYPES ---
export type LudoColor = 'red' | 'yellow' | 'green' | 'blue';

export interface LudoToken {
  id: number; // 0, 1, 2, 3
  color: LudoColor;
  step: number; // -1 = base/yard; 0..50 = track; 51..55 = home column; 56 = home!
}

export interface LudoState {
  currentTurnPlayerId: string;
  playerColors: Record<string, LudoColor>; // p1 -> red, p2 -> yellow
  diceValue: number | null;
  diceRolled: boolean;
  canRoll: boolean;
  tokens: Record<LudoColor, LudoToken[]>;
  validMoves: number[]; // token IDs of current player that can move
  isRolling: boolean;
  consecutiveSixes: number;
  winnerPlayerId?: string;
  lastMessage?: string;
}

export interface GameState {
  gameType: GameType;
  status: 'waiting' | 'countdown' | 'in_round' | 'round_result' | 'game_over';
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  countdown: number;
  // Game specific state
  flagData?: FlagQuestion;
  wordData?: WordQuestion;
  emojiVoiceData?: EmojiVoiceQuestion;
  dilemmaData?: DilemmaQuestion;
  reflexState?: {
    phase: 'waiting' | 'ready' | 'signal' | 'result';
    signalTimestamp?: number;
    playerTaps: Record<string, { timeMs: number; early?: boolean }>;
  };
  tictactoeState?: TicTacToeState;
  unoState?: UnoState;
  ludoState?: LudoState;

  playerAnswers: Record<string, any>;
  roundWinnerId?: string | 'draw' | null;
  roundFeedback?: string;

  // Mutual pause and exit
  isPaused?: boolean;
  pausedByPlayerId?: string;
  exitVotes?: string[]; // IDs of players who agreed to exit
}

export interface RoomState {
  roomId: string;
  players: Record<string, Player>;
  hostId: string;
  gameState: GameState;
  roundHistory: RoundResult[];
  usedQuestionIds?: Record<string, string[]>;
  isSpecialTheme?: boolean;
  isPermanent?: boolean;
  lastReaction?: {
    id: string;
    senderId: string;
    senderName: string;
    emoji: string;
    timestamp: number;
  };
}
