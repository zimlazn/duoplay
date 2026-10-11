import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { LudoToken, LudoColor } from '../../types/game';
import {
  TRACK_COORDINATES,
  HOME_COLUMNS,
  BASE_COORDINATES,
  SAFE_INDICES,
  getGlobalTrackIndex,
  getTokenCoordinates
} from '../../utils/ludoLogic';
import { Dices, Clock, Trophy, Sparkles, Star } from 'lucide-react';

export const LudoGame: React.FC = () => {
  const {
    room,
    playerId,
    rollLudoDice,
    moveLudoToken
  } = useSocket();

  const [isDiceAnimating, setIsDiceAnimating] = useState(false);

  const ludo = room?.gameState.ludoState;
  const currentRound = room?.gameState.currentRound ?? 1;
  const totalRounds = room?.gameState.totalRounds ?? 5;
  const timeLeft = room?.gameState.timeLeft ?? 0;

  if (!ludo) return null;

  const playerIds = room ? Object.keys(room.players) : [];
  const p1Id = playerIds[0];
  const p2Id = playerIds[1];
  const p1 = p1Id ? room?.players[p1Id] : null;
  const p2 = p2Id ? room?.players[p2Id] : null;

  const myColor: LudoColor = playerId && ludo.playerColors[playerId] ? ludo.playerColors[playerId] : 'red';
  const oppColor: LudoColor = myColor === 'red' ? 'yellow' : 'red';

  const isMyTurn = ludo.currentTurnPlayerId === playerId;
  const myTokens = ludo.tokens[myColor] || [];
  const oppTokens = ludo.tokens[oppColor] || [];

  const handleRollClick = () => {
    if (!isMyTurn || !ludo.canRoll || ludo.diceRolled) return;
    setIsDiceAnimating(true);
    setTimeout(() => {
      setIsDiceAnimating(false);
    }, 600);
    rollLudoDice();
  };

  const handleTokenClick = (tokenId: number) => {
    if (!isMyTurn || !ludo.diceRolled || !ludo.validMoves.includes(tokenId)) return;
    moveLudoToken(tokenId);
  };

  // Count tokens in home
  const myHomeCount = myTokens.filter((t) => t.step === 56).length;
  const oppHomeCount = oppTokens.filter((t) => t.step === 56).length;

  const renderDiceFace = (val: number | null) => {
    if (!val) return <Dices className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />;
    const dotPatterns: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const activeDots = dotPatterns[val] || [];
    return (
      <div className="w-12 h-12 grid grid-cols-3 grid-rows-3 p-1.5 gap-0.5 bg-white rounded-xl border-2 border-zinc-900 shadow-inner">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {activeDots.includes(i) && (
              <span className={`w-2.5 h-2.5 rounded-full ${val === 6 || val === 1 ? 'bg-red-600' : 'bg-zinc-900'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-2.5 select-none relative">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-1 text-xs">
        <span className="font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-zinc-900 dark:text-amber-400" />
          LUDO • Babak {currentRound} / {totalRounds}
        </span>
        <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 border-2 border-zinc-900 dark:border-amber-500 shadow-[2px_2px_0px_#18181b] font-mono font-black text-zinc-900 dark:text-amber-200">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Players Progress Bar */}
      <div className="w-full grid grid-cols-2 gap-2">
        {p1 && (
          <div
            className={`p-2 rounded-2xl border-2 border-zinc-900 flex items-center justify-between shadow-[2px_2px_0px_#18181b] transition-all ${
              ludo.currentTurnPlayerId === p1.id
                ? 'bg-red-100 dark:bg-red-950/70 border-red-600 scale-[1.02] ring-2 ring-red-400'
                : 'bg-white dark:bg-zinc-800 opacity-80'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-zinc-900"></span>
              <span className="text-xs font-black text-zinc-900 dark:text-white truncate">
                {p1.nickname}
              </span>
            </div>
            <span className="text-[10px] font-black font-mono bg-red-200 dark:bg-red-900 text-red-950 dark:text-red-200 px-2 py-0.5 rounded-lg border border-zinc-900">
              {p1.id === playerId ? myHomeCount : oppHomeCount}/4 🏠
            </span>
          </div>
        )}

        {p2 && (
          <div
            className={`p-2 rounded-2xl border-2 border-zinc-900 flex items-center justify-between shadow-[2px_2px_0px_#18181b] transition-all ${
              ludo.currentTurnPlayerId === p2.id
                ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-500 scale-[1.02] ring-2 ring-amber-400'
                : 'bg-white dark:bg-zinc-800 opacity-80'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-zinc-900"></span>
              <span className="text-xs font-black text-zinc-900 dark:text-white truncate">
                {p2.nickname}
              </span>
            </div>
            <span className="text-[10px] font-black font-mono bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200 px-2 py-0.5 rounded-lg border border-zinc-900">
              {p2.id === playerId ? myHomeCount : oppHomeCount}/4 🏠
            </span>
          </div>
        )}
      </div>

      {/* LUDO BOARD SVG */}
      <div className="w-full max-w-[360px] aspect-square bg-[#FFFBEB] dark:bg-zinc-950 border-4 border-zinc-900 dark:border-zinc-700 rounded-3xl p-1 shadow-[6px_6px_0px_#18181b] relative overflow-hidden">
        <svg
          viewBox="0 0 15 15"
          className="w-full h-full rounded-2xl border-2 border-zinc-900 select-none"
        >
          {/* 4 Quadrants Background */}
          {/* Top-Left: Green Yard */}
          <rect x="0" y="0" width="6" height="6" fill="#10B981" stroke="#18181B" strokeWidth="0.1" />
          <rect x="1" y="1" width="4" height="4" fill="#FFFFFF" rx="0.5" stroke="#18181B" strokeWidth="0.1" />

          {/* Top-Right: Yellow Yard */}
          <rect x="9" y="0" width="6" height="6" fill="#FBBF24" stroke="#18181B" strokeWidth="0.1" />
          <rect x="10" y="1" width="4" height="4" fill="#FFFFFF" rx="0.5" stroke="#18181B" strokeWidth="0.1" />

          {/* Bottom-Left: Red Yard */}
          <rect x="0" y="9" width="6" height="6" fill="#EF4444" stroke="#18181B" strokeWidth="0.1" />
          <rect x="1" y="10" width="4" height="4" fill="#FFFFFF" rx="0.5" stroke="#18181B" strokeWidth="0.1" />

          {/* Bottom-Right: Blue Yard */}
          <rect x="9" y="9" width="6" height="6" fill="#3B82F6" stroke="#18181B" strokeWidth="0.1" />
          <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" rx="0.5" stroke="#18181B" strokeWidth="0.1" />

          {/* Center Triangles */}
          <polygon points="6,6 9,6 7.5,7.5" fill="#FBBF24" stroke="#18181B" strokeWidth="0.08" />
          <polygon points="9,6 9,9 7.5,7.5" fill="#3B82F6" stroke="#18181B" strokeWidth="0.08" />
          <polygon points="6,9 9,9 7.5,7.5" fill="#EF4444" stroke="#18181B" strokeWidth="0.08" />
          <polygon points="6,6 6,9 7.5,7.5" fill="#10B981" stroke="#18181B" strokeWidth="0.08" />

          {/* Home Columns Colors */}
          {/* Red home column: r 9..13, c 7 */}
          {[9, 10, 11, 12, 13].map((r) => (
            <rect key={`red_h_${r}`} x="7" y={r} width="1" height="1" fill="#FCA5A5" stroke="#18181B" strokeWidth="0.06" />
          ))}
          {/* Yellow home column: r 1..5, c 7 */}
          {[1, 2, 3, 4, 5].map((r) => (
            <rect key={`yel_h_${r}`} x="7" y={r} width="1" height="1" fill="#FDE68A" stroke="#18181B" strokeWidth="0.06" />
          ))}

          {/* Track Grid Squares */}
          {TRACK_COORDINATES.map((coord, idx) => {
            const isRedStart = idx === 0;
            const isYellowStart = idx === 26;
            const isStar = SAFE_INDICES.includes(idx) && !isRedStart && !isYellowStart;

            return (
              <g key={`sq_${idx}`}>
                <rect
                  x={coord.c}
                  y={coord.r}
                  width="1"
                  height="1"
                  fill={isRedStart ? '#EF4444' : isYellowStart ? '#FBBF24' : '#FFFFFF'}
                  stroke="#18181B"
                  strokeWidth="0.06"
                />
                {isStar && (
                  <text
                    x={coord.c + 0.5}
                    y={coord.r + 0.68}
                    fontSize="0.5"
                    textAnchor="middle"
                    fill="#F59E0B"
                  >
                    ★
                  </text>
                )}
                {isRedStart && (
                  <text
                    x={coord.c + 0.5}
                    y={coord.r + 0.65}
                    fontSize="0.4"
                    textAnchor="middle"
                    fontWeight="bold"
                    fill="#FFFFFF"
                  >
                    ▲
                  </text>
                )}
                {isYellowStart && (
                  <text
                    x={coord.c + 0.5}
                    y={coord.r + 0.65}
                    fontSize="0.4"
                    textAnchor="middle"
                    fontWeight="bold"
                    fill="#FFFFFF"
                  >
                    ▼
                  </text>
                )}
              </g>
            );
          })}

          {/* Tokens Rendering */}
          {/* Red tokens */}
          {(ludo.tokens.red || []).map((token) => {
            const pos = getTokenCoordinates(token);
            const isValidMove = isMyTurn && myColor === 'red' && ludo.validMoves.includes(token.id);

            return (
              <g
                key={`tok_red_${token.id}`}
                onClick={() => myColor === 'red' && handleTokenClick(token.id)}
                className={isValidMove ? 'cursor-pointer' : ''}
              >
                <circle
                  cx={pos.c + 0.5}
                  cy={pos.r + 0.5}
                  r="0.4"
                  fill="#DC2626"
                  stroke="#18181B"
                  strokeWidth="0.08"
                  className={isValidMove ? 'animate-pulse' : ''}
                />
                <circle cx={pos.c + 0.5} cy={pos.r + 0.5} r="0.22" fill="#FEE2E2" />
                <text
                  x={pos.c + 0.5}
                  y={pos.r + 0.62}
                  fontSize="0.32"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#7F1D1D"
                >
                  {token.id + 1}
                </text>
              </g>
            );
          })}

          {/* Yellow tokens */}
          {(ludo.tokens.yellow || []).map((token) => {
            const pos = getTokenCoordinates(token);
            const isValidMove = isMyTurn && myColor === 'yellow' && ludo.validMoves.includes(token.id);

            return (
              <g
                key={`tok_yel_${token.id}`}
                onClick={() => myColor === 'yellow' && handleTokenClick(token.id)}
                className={isValidMove ? 'cursor-pointer' : ''}
              >
                <circle
                  cx={pos.c + 0.5}
                  cy={pos.r + 0.5}
                  r="0.4"
                  fill="#D97706"
                  stroke="#18181B"
                  strokeWidth="0.08"
                  className={isValidMove ? 'animate-pulse' : ''}
                />
                <circle cx={pos.c + 0.5} cy={pos.r + 0.5} r="0.22" fill="#FEF3C7" />
                <text
                  x={pos.c + 0.5}
                  y={pos.r + 0.62}
                  fontSize="0.32"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#78350F"
                >
                  {token.id + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Action Notification Message */}
      {ludo.lastMessage && (
        <div className="w-full py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-zinc-850 border border-zinc-900 dark:border-zinc-700 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-[1px_1px_0px_#18181b] truncate">
          {ludo.lastMessage}
        </div>
      )}

      {/* Dice & Interaction Section */}
      <div className="w-full p-3 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl shadow-[4px_4px_0px_#18181b] flex items-center justify-between gap-3">
        {/* Dice Visual and Roll Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!isMyTurn || !ludo.canRoll || ludo.diceRolled}
            onClick={handleRollClick}
            className={`w-16 h-16 rounded-2xl border-2 border-zinc-900 shadow-[3px_3px_0px_#18181b] flex items-center justify-center p-1 transition-all ${
              isMyTurn && ludo.canRoll && !ludo.diceRolled
                ? 'bg-amber-300 dark:bg-amber-500 hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ring-2 ring-zinc-900 animate-bounce'
                : 'bg-zinc-100 dark:bg-zinc-800 opacity-90'
            } ${isDiceAnimating ? 'rotate-180 scale-90' : ''}`}
          >
            {renderDiceFace(ludo.diceValue)}
          </button>

          <div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100">
              {isMyTurn && ludo.canRoll && !ludo.diceRolled
                ? 'LEMPAR DADU! 🎲'
                : ludo.diceRolled
                ? `Angka Dadu: ${ludo.diceValue}`
                : 'Menunggu Lawan'}
            </div>
            <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              {isMyTurn && ludo.diceRolled && ludo.validMoves.length > 0
                ? 'Pilih pion di papan yang berkedip'
                : isMyTurn && ludo.canRoll
                ? 'Ketuk kotak dadu di samping'
                : 'Menunggu giliran'}
            </div>
          </div>
        </div>

        {/* Quick Token Selector Buttons (if multiple valid moves) */}
        {isMyTurn && ludo.diceRolled && ludo.validMoves.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">
              Pion:
            </span>
            {ludo.validMoves.map((tId) => (
              <button
                key={tId}
                type="button"
                onClick={() => handleTokenClick(tId)}
                className="w-8 h-8 rounded-xl bg-amber-200 dark:bg-amber-600 border-2 border-zinc-900 font-black text-xs text-zinc-900 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                #{tId + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
