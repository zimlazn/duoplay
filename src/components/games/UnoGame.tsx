import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { UnoCard, UnoColor } from '../../types/game';
import { isValidUnoMove } from '../../utils/unoLogic';
import { Flame, Clock, Layers, Sparkles, ChevronRight, Ban, RotateCcw } from 'lucide-react';

const COLOR_MAP: Record<UnoColor | 'wild', { bg: string; text: string; border: string; name: string }> = {
  red: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', name: 'Merah' },
  blue: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', name: 'Biru' },
  green: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600', name: 'Hijau' },
  yellow: { bg: 'bg-amber-400', text: 'text-zinc-900', border: 'border-amber-500', name: 'Kuning' },
  wild: { bg: 'bg-gradient-to-br from-red-500 via-amber-400 to-blue-500', text: 'text-white', border: 'border-purple-600', name: 'Wild' }
};

export const UnoGame: React.FC = () => {
  const {
    room,
    playerId,
    playUnoCard,
    drawUnoCard,
    callUno,
    passUnoTurn
  } = useSocket();

  const [pendingWildCardId, setPendingWildCardId] = useState<string | null>(null);

  const uno = room?.gameState.unoState;
  const currentRound = room?.gameState.currentRound ?? 1;
  const totalRounds = room?.gameState.totalRounds ?? 5;
  const timeLeft = room?.gameState.timeLeft ?? 0;

  if (!uno) return null;

  const playerIds = room ? Object.keys(room.players) : [];
  const p1Id = playerIds[0];
  const p2Id = playerIds[1];
  const opponentId = playerIds.find((id) => id !== playerId);

  const myHand = playerId && uno.playerHands[playerId] ? uno.playerHands[playerId] : [];
  const oppHand = opponentId && uno.playerHands[opponentId] ? uno.playerHands[opponentId] : [];

  const isMyTurn = uno.currentTurnPlayerId === playerId;
  const opponent = opponentId ? room?.players[opponentId] : null;

  const handleCardClick = (card: UnoCard) => {
    if (!isMyTurn) return;
    if (!isValidUnoMove(card, uno.topCard, uno.activeColor)) return;

    if (card.color === 'wild') {
      // Open color selector
      setPendingWildCardId(card.id);
    } else {
      playUnoCard(card.id);
    }
  };

  const handlePickColor = (color: UnoColor) => {
    if (!pendingWildCardId) return;
    playUnoCard(pendingWildCardId, color);
    setPendingWildCardId(null);
  };

  const renderCardContent = (card: UnoCard) => {
    if (card.value === 'skip') return <Ban className="w-6 h-6 stroke-[3]" />;
    if (card.value === 'reverse') return <RotateCcw className="w-6 h-6 stroke-[3]" />;
    if (card.value === 'draw2') return <span className="font-black text-xl">+2</span>;
    if (card.value === 'wild') return <span className="font-black text-xs uppercase tracking-tight">WILD</span>;
    if (card.value === 'wild4') return <span className="font-black text-lg">+4</span>;
    return <span className="font-black text-2xl font-mono">{card.value}</span>;
  };

  const renderCardCorner = (card: UnoCard) => {
    if (card.value === 'skip') return '🚫';
    if (card.value === 'reverse') return '🔁';
    if (card.value === 'draw2') return '+2';
    if (card.value === 'wild') return '★';
    if (card.value === 'wild4') return '+4';
    return card.value;
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-2.5 select-none relative">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between px-1 text-xs">
        <span className="font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-zinc-900 dark:text-amber-400" />
          UNO • Babak {currentRound} / {totalRounds}
        </span>
        <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 border-2 border-zinc-900 dark:border-amber-500 shadow-[2px_2px_0px_#18181b] font-mono font-black text-zinc-900 dark:text-amber-200">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Opponent Hand Tray */}
      <div className="w-full p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-200 border border-zinc-900 flex items-center justify-center text-sm">
            {opponent?.avatar || '🦊'}
          </div>
          <div>
            <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>{opponent?.nickname || 'Lawan'}</span>
              {uno.unoCalled[opponentId || ''] && (
                <span className="px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-black uppercase animate-bounce">
                  UNO!
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              {uno.currentTurnPlayerId === opponentId ? 'Sedang berpikir... 🤔' : 'Menunggu giliran'}
            </div>
          </div>
        </div>

        {/* Fanned Opponent Mini Cards */}
        <div className="flex items-center -space-x-4 overflow-hidden py-1">
          {oppHand.map((_, i) => (
            <div
              key={i}
              className="w-7 h-10 rounded-lg bg-zinc-900 border border-white shadow-[1px_1px_0px_rgba(0,0,0,0.4)] flex items-center justify-center transform -rotate-3 transition-transform"
            >
              <div className="w-4 h-6 rounded-full bg-red-600 border border-yellow-300 flex items-center justify-center text-[7px] font-black text-yellow-300 -rotate-12">
                U
              </div>
            </div>
          ))}
          <div className="ml-2 pl-2 text-xs font-black text-zinc-900 dark:text-white font-mono">
            {oppHand.length} kartu
          </div>
        </div>
      </div>

      {/* Action Notification Message */}
      {uno.lastActionMessage && (
        <div className="w-full py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-zinc-850 border border-zinc-900 dark:border-zinc-700 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-[1px_1px_0px_#18181b] truncate">
          {uno.lastActionMessage}
        </div>
      )}

      {/* Center Table Area (Draw Pile + Discard Pile) */}
      <div className="w-full p-4 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl shadow-[4px_4px_0px_#18181b] flex flex-col items-center gap-3">
        {/* Active Color Highlight Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Warna Aktif:
          </span>
          <div
            className={`px-3 py-1 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#18181b] ${
              COLOR_MAP[uno.activeColor].bg
            } ${COLOR_MAP[uno.activeColor].text}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-900"></span>
            <span>{COLOR_MAP[uno.activeColor].name}</span>
          </div>
        </div>

        {/* The Two Piles */}
        <div className="flex items-center justify-center gap-6 my-1">
          {/* Draw Pile (Tumpukan Ambil Kartu) */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              disabled={!isMyTurn || uno.hasDrawnCardThisTurn}
              onClick={drawUnoCard}
              className={`w-20 h-28 rounded-2xl bg-zinc-900 border-2 border-zinc-900 text-white flex flex-col items-center justify-center p-2 relative shadow-[4px_4px_0px_#18181b] transition-all ${
                isMyTurn && !uno.hasDrawnCardThisTurn
                  ? 'hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ring-2 ring-amber-400'
                  : 'opacity-80 cursor-not-allowed'
              }`}
            >
              <div className="w-14 h-20 rounded-xl bg-zinc-800 border-2 border-yellow-400 flex flex-col items-center justify-center transform rotate-3">
                <span className="text-xs font-black text-yellow-400 font-mono tracking-tighter">
                  UNO
                </span>
                <span className="text-[9px] text-zinc-400 font-mono mt-1">
                  {uno.drawPileCount}
                </span>
              </div>
            </button>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
              Ambil Kartu
            </span>
          </div>

          {/* Discard Pile (Top Card) */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-20 h-28 rounded-2xl border-2 border-zinc-900 p-1.5 shadow-[4px_4px_0px_#18181b] flex flex-col justify-between relative transition-all ${
                COLOR_MAP[uno.topCard.color].bg
              } ${COLOR_MAP[uno.topCard.color].text}`}
            >
              {/* Corner Mini */}
              <div className="text-[10px] font-black leading-none">
                {renderCardCorner(uno.topCard)}
              </div>

              {/* Center Oval with Symbol */}
              <div className="w-full flex-1 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center transform -rotate-6 shadow-inner">
                {renderCardContent(uno.topCard)}
              </div>

              {/* Inverted Corner Mini */}
              <div className="text-[10px] font-black leading-none self-end rotate-180">
                {renderCardCorner(uno.topCard)}
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
              Kartu Terbuka
            </span>
          </div>
        </div>

        {/* Turn Status Badge */}
        <div
          className={`w-full py-1.5 px-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-center text-xs font-black ${
            isMyTurn
              ? 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 animate-pulse'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
          }`}
        >
          {isMyTurn ? '⚡ Giliranmu! Pilih kartu yang cocok atau ambil kartu' : `Menunggu giliran lawan...`}
        </div>
      </div>

      {/* Control Buttons (Pass & Call UNO) */}
      <div className="w-full flex items-center justify-between gap-2 px-1">
        {/* Pass Button if card drawn */}
        {uno.hasDrawnCardThisTurn && isMyTurn ? (
          <button
            type="button"
            onClick={passUnoTurn}
            className="flex-1 py-2 px-3 rounded-xl bg-sky-200 hover:bg-sky-300 text-sky-950 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-xs font-black flex items-center justify-center gap-1 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <span>Lewati Giliran (Pass)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            Kartumu: <strong className="text-zinc-900 dark:text-zinc-100">{myHand.length}</strong>
          </div>
        )}

        {/* Shout UNO Button */}
        <button
          type="button"
          onClick={callUno}
          className={`py-2 px-4 rounded-xl border-2 border-zinc-900 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#18181b] transition-all cursor-pointer ${
            myHand.length <= 2
              ? 'bg-red-500 hover:bg-red-600 text-white animate-bounce'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span>KATAKAN UNO!</span>
        </button>
      </div>

      {/* Player's Hand of Cards (Horizontal scroll) */}
      <div className="w-full p-3 bg-zinc-100 dark:bg-zinc-850 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl shadow-[3px_3px_0px_#18181b]">
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar">
          {myHand.map((card) => {
            const isPlayable = isMyTurn && isValidUnoMove(card, uno.topCard, uno.activeColor);
            return (
              <button
                key={card.id}
                type="button"
                disabled={!isPlayable}
                onClick={() => handleCardClick(card)}
                className={`w-16 h-24 rounded-2xl border-2 border-zinc-900 p-1.5 flex flex-col justify-between shrink-0 transition-all select-none ${
                  COLOR_MAP[card.color].bg
                } ${COLOR_MAP[card.color].text} ${
                  isPlayable
                    ? 'shadow-[3px_3px_0px_#18181b] hover:-translate-y-2 cursor-pointer ring-2 ring-white scale-100'
                    : 'opacity-40 cursor-not-allowed scale-95'
                }`}
              >
                {/* Top Corner */}
                <div className="text-[10px] font-black leading-none">
                  {renderCardCorner(card)}
                </div>

                {/* Center Symbol */}
                <div className="w-full flex-1 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center transform -rotate-6">
                  {renderCardContent(card)}
                </div>

                {/* Bottom Corner */}
                <div className="text-[10px] font-black leading-none self-end rotate-180">
                  {renderCardCorner(card)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal / Sheet for Picking Color on Wild Card */}
      {pendingWildCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-zinc-900 border-4 border-zinc-900 rounded-3xl p-5 shadow-[6px_6px_0px_#18181b] text-center space-y-4">
            <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              PILIH WARNA BERIKUTNYA
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              Kartu Wild mengharuskanmu menentukan warna aktif:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {(['red', 'yellow', 'green', 'blue'] as UnoColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handlePickColor(c)}
                  className={`py-3 px-2 rounded-2xl border-2 border-zinc-900 font-black text-sm uppercase shadow-[3px_3px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer transition-all ${
                    COLOR_MAP[c].bg
                  } ${COLOR_MAP[c].text}`}
                >
                  {COLOR_MAP[c].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
