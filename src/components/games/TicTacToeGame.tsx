import React from 'react';
import { useSocket } from '../../context/SocketContext';
import { Grid3X3, Clock, Sparkles } from 'lucide-react';

export const TicTacToeGame: React.FC = () => {
  const { room, playerId, submitTicTacToeMove } = useSocket();

  const ttt = room?.gameState.tictactoeState;
  const currentRound = room?.gameState.currentRound ?? 1;
  const totalRounds = room?.gameState.totalRounds ?? 5;
  const timeLeft = room?.gameState.timeLeft ?? 0;

  if (!ttt) return null;

  const playerIds = room ? Object.keys(room.players) : [];
  const p1Id = playerIds[0];
  const p2Id = playerIds[1];
  const p1 = p1Id ? room?.players[p1Id] : null;
  const p2 = p2Id ? room?.players[p2Id] : null;

  const isMyTurn = ttt.currentTurnPlayerId === playerId;
  const mySymbol = playerId ? ttt.playerSymbols[playerId] : null;
  const currentTurnPlayer = ttt.currentTurnPlayerId ? room?.players[ttt.currentTurnPlayerId] : null;

  const handleCellClick = (index: number) => {
    if (!isMyTurn || ttt.board[index] !== null || ttt.status !== 'playing') return;
    submitTicTacToeMove(index);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3 select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-1 text-xs">
        <span className="font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          <Grid3X3 className="w-4 h-4 text-zinc-900 dark:text-amber-400" />
          Babak {currentRound} / {totalRounds}
        </span>
        <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 border-2 border-zinc-900 dark:border-amber-500 shadow-[2px_2px_0px_#18181b] font-mono font-black text-zinc-900 dark:text-amber-200">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Players Indicator Bar */}
      <div className="w-full grid grid-cols-2 gap-2">
        {p1 && (
          <div
            className={`p-2.5 rounded-2xl border-2 border-zinc-900 flex items-center gap-2 transition-all shadow-[2px_2px_0px_#18181b] ${
              ttt.currentTurnPlayerId === p1.id
                ? 'bg-rose-100 dark:bg-rose-950/70 border-rose-600 scale-[1.02] ring-2 ring-rose-400'
                : 'bg-white dark:bg-zinc-800 opacity-70'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white font-black text-base flex items-center justify-center border border-zinc-900">
              X
            </div>
            <div className="truncate">
              <div className="text-xs font-black text-zinc-900 dark:text-white truncate">
                {p1.nickname} {p1.id === playerId ? '(Kamu)' : ''}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                {ttt.currentTurnPlayerId === p1.id ? 'Sedang Giliran ⚡' : 'Menunggu'}
              </div>
            </div>
          </div>
        )}

        {p2 && (
          <div
            className={`p-2.5 rounded-2xl border-2 border-zinc-900 flex items-center gap-2 transition-all shadow-[2px_2px_0px_#18181b] ${
              ttt.currentTurnPlayerId === p2.id
                ? 'bg-sky-100 dark:bg-sky-950/70 border-sky-600 scale-[1.02] ring-2 ring-sky-400'
                : 'bg-white dark:bg-zinc-800 opacity-70'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black text-base flex items-center justify-center border border-zinc-900">
              O
            </div>
            <div className="truncate">
              <div className="text-xs font-black text-zinc-900 dark:text-white truncate">
                {p2.nickname} {p2.id === playerId ? '(Kamu)' : ''}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                {ttt.currentTurnPlayerId === p2.id ? 'Sedang Giliran ⚡' : 'Menunggu'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Turn Banner */}
      <div
        className={`w-full py-2 px-3 rounded-2xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-center text-xs font-black flex items-center justify-center gap-1.5 transition-colors ${
          isMyTurn
            ? 'bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 animate-pulse'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          {isMyTurn
            ? `Giliranmu! Ketuk kotak kosong untuk pasang ${mySymbol}`
            : `Menunggu langkah ${currentTurnPlayer?.nickname || 'Lawan'}...`}
        </span>
      </div>

      {/* 3x3 Grid Board */}
      <div className="w-full max-w-[340px] aspect-square p-3 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-700 rounded-3xl shadow-[6px_6px_0px_#18181b] grid grid-cols-3 gap-2.5">
        {ttt.board.map((cell, idx) => {
          const isWinningCell = ttt.winningLine?.includes(idx);
          const isEmpty = cell === null;
          return (
            <button
              key={idx}
              type="button"
              disabled={!isMyTurn || !isEmpty || ttt.status !== 'playing'}
              onClick={() => handleCellClick(idx)}
              className={`rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 font-black text-4xl flex items-center justify-center transition-all ${
                isWinningCell
                  ? 'bg-emerald-300 dark:bg-emerald-600 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.8)] border-emerald-950 animate-bounce'
                  : cell === 'X'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-[2px_2px_0px_#18181b]'
                  : cell === 'O'
                  ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-[2px_2px_0px_#18181b]'
                  : isMyTurn
                  ? 'bg-amber-50/60 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-750 cursor-pointer active:scale-95 shadow-[2px_2px_0px_#18181b]'
                  : 'bg-zinc-50 dark:bg-zinc-850 cursor-not-allowed opacity-80'
              }`}
            >
              {cell === 'X' && (
                <span className="drop-shadow-[1px_1px_0px_#18181b]">✕</span>
              )}
              {cell === 'O' && (
                <span className="drop-shadow-[1px_1px_0px_#18181b]">◯</span>
              )}
              {isEmpty && isMyTurn && (
                <span className="text-zinc-300 dark:text-zinc-600 text-lg opacity-40 font-mono">
                  +
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
