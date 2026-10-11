import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Share2,
  Copy,
  Check,
  Play,
  Gamepad2,
  PhoneCall,
  Crown,
  Sparkles,
  Heart
} from 'lucide-react';

const AVATARS = ['🦁', '🦊', '🐼', '🐱', '🐯', '🐰', '🐸', '🦄', '⚡', '🚀', '👑', '🎯'];
const NICKNAME_PRESETS = ['Garuda', 'Kancil', 'Bintang', 'Panda', 'Kapten', 'Juara'];

interface LobbyProps {
  onOpenGameSelector: () => void;
  onOpenVoiceCallModal: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onOpenGameSelector, onOpenVoiceCallModal }) => {
  const {
    room,
    playerId,
    createRoom,
    joinRoom,
    startGame,
    error,
    clearError
  } = useSocket();

  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom) {
        setInputRoomCode(urlRoom.toUpperCase());
      }
    }
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom(nickname.trim(), selectedAvatar);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoomCode.trim()) return;
    joinRoom(inputRoomCode.trim().toUpperCase(), nickname.trim(), selectedAvatar);
  };

  const handleCopyCode = () => {
    if (room?.roomId) {
      navigator.clipboard.writeText(room.roomId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (room?.roomId && typeof window !== 'undefined') {
      const url = `${window.location.origin}?room=${room.roomId}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!room?.roomId) return;
    const url = typeof window !== 'undefined' ? `${window.location.origin}?room=${room.roomId}` : '';
    const text = encodeURIComponent(
      `Hai! Ayo main game 2-player DuoPlay bareng aku! 🎮\nKode Room: ${room.roomId}\nLangsung klik link: ${url}\n\nKita bisa sambil teleponan di WhatsApp yaa! 📞`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Pre-join Lobby
  if (!room) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-5 px-2 py-4">
        {/* Hero Branding */}
        <div className="text-center space-y-1.5">
          <div className="inline-block px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 border-2 border-zinc-900 dark:border-purple-600 shadow-[2px_2px_0px_#18181b] text-purple-950 dark:text-purple-200 text-xs font-black">
            Game 2 Player Real-Time
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            DuoPlay
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto font-medium">
            Uno, Ludo, Tic Tac Toe, Tebak Bendera, Kata & Refleks
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="w-full p-3 rounded-2xl bg-pink-100 dark:bg-pink-950/80 border-2 border-zinc-900 dark:border-pink-600 shadow-[3px_3px_0px_#18181b] text-pink-950 dark:text-pink-200 text-xs font-bold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="text-zinc-600 hover:text-black dark:text-zinc-300 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="w-full p-5 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl shadow-[4px_4px_0px_#18181b] space-y-4">
          <div>
            <label className="block text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-2">
              Pilih Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`aspect-square text-2xl rounded-2xl border-2 border-zinc-900 flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'bg-amber-200 dark:bg-amber-500 shadow-[2px_2px_0px_#18181b] scale-105'
                      : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-2">
              Nama Pemain
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Masukkan nama kamu..."
              maxLength={15}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 text-sm font-bold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-750 focus:shadow-[2px_2px_0px_#18181b] transition"
            />
            {/* Quick Presets */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
              {NICKNAME_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNickname(p)}
                  className="px-2.5 py-1 text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-900 shrink-0 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Tabs: Buat Room / Masuk Room */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Create Room Button */}
          <button
            onClick={handleCreate}
            className="w-full p-4 rounded-3xl bg-amber-200 dark:bg-amber-500 hover:bg-amber-300 dark:hover:bg-amber-400 text-zinc-900 border-2 border-zinc-900 shadow-[4px_4px_0px_#18181b] flex flex-col items-center justify-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer font-black"
          >
            <span className="text-2xl">✨</span>
            <span className="text-sm">Buat Room Baru</span>
            <span className="text-[10px] text-zinc-700 dark:text-zinc-900 font-bold">Dapatkan kode 4-karakter</span>
          </button>

          {/* Join Room Form */}
          <form
            onSubmit={handleJoin}
            className="w-full p-4 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-zinc-900 dark:border-emerald-700 shadow-[4px_4px_0px_#18181b] flex flex-col items-center justify-between gap-2.5"
          >
            <div className="w-full text-center">
              <span className="text-[11px] font-black uppercase text-emerald-950 dark:text-emerald-200 tracking-wider">
                Gabung Room Teman
              </span>
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="KODE"
                maxLength={4}
                className="w-full mt-1.5 px-3 py-1.5 text-center font-mono font-black text-lg uppercase tracking-widest bg-white dark:bg-zinc-900 border-2 border-zinc-900 rounded-xl placeholder-zinc-300 dark:placeholder-zinc-600 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!inputRoomCode.trim()}
              className="w-full py-2 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 border-2 border-zinc-900 font-black text-xs shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
            >
              Masuk Room ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Room Lobby (Waiting for match or start)
  const isPinkTheme = room.roomId === 'ACAA' || room.isSpecialTheme;
  const isHost = room.hostId === playerId;
  const playerIds = Object.keys(room.players);
  const p1 = playerIds[0] ? room.players[playerIds[0]] : null;
  const p2 = playerIds[1] ? room.players[playerIds[1]] : null;
  const bothConnected = playerIds.length >= 2;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 px-2 py-2">
      {/* Special Acaa cute badge */}
      {isPinkTheme && (
        <div className="w-full py-2 px-3 rounded-2xl bg-white/95 border-2 border-pink-400 shadow-[3px_3px_0px_#f472b6] flex items-center justify-center gap-2 text-pink-900 text-xs font-black animate-fade-in">
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
          <span>Room Spesial Acaa • Mode Pink Imut Aktif 💖</span>
          <Sparkles className="w-4 h-4 text-pink-500" />
        </div>
      )}

      {/* Room Code Showcase */}
      <div
        className={`w-full p-4 rounded-3xl border-2 flex flex-col items-center text-center space-y-3 transition-all ${
          isPinkTheme
            ? 'bg-white/95 border-pink-500 shadow-[4px_4px_0px_#f472b6]'
            : 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_#18181b]'
        }`}
      >
        <span
          className={`text-[11px] font-black uppercase tracking-wider ${
            isPinkTheme ? 'text-pink-800' : 'text-zinc-500 dark:text-zinc-400'
          }`}
        >
          Kode Room Kamu
        </span>

        <div className="flex items-center gap-2">
          <div
            className={`px-5 py-2 rounded-2xl border-2 font-mono text-3xl font-black tracking-widest ${
              isPinkTheme
                ? 'bg-pink-100 border-pink-500 text-pink-900 shadow-[3px_3px_0px_#f472b6]'
                : 'bg-amber-100 dark:bg-amber-950/80 border-zinc-900 dark:border-amber-500 text-zinc-900 dark:text-amber-200 shadow-[3px_3px_0px_#18181b]'
            }`}
          >
            {room.roomId}
          </div>
          <button
            onClick={handleCopyCode}
            title="Salin Kode"
            className={`p-3 rounded-2xl border-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isPinkTheme
                ? 'bg-pink-50 hover:bg-pink-100 border-pink-500 text-pink-900 shadow-[2px_2px_0px_#f472b6]'
                : 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-zinc-800 dark:text-zinc-200'
            }`}
          >
            {copiedCode ? (
              <Check className={`w-5 h-5 ${isPinkTheme ? 'text-pink-600' : 'text-emerald-600'}`} />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopyLink}
            className={`py-2 px-3 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isPinkTheme
                ? 'bg-pink-100 hover:bg-pink-200 text-pink-950 border-pink-500 shadow-[2px_2px_0px_#f472b6]'
                : 'bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-950 dark:text-purple-200 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            {copiedLink ? (
              <Check className={`w-3.5 h-3.5 ${isPinkTheme ? 'text-pink-700' : 'text-emerald-700'}`} />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className={`py-2 px-3 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isPinkTheme
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-400 shadow-[2px_2px_0px_#fb7185]'
                : 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-950 dark:text-emerald-200 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Kirim WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Players In Room */}
      <div className="w-full grid grid-cols-2 gap-3">
        {/* Slot 1 */}
        <div
          className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center relative ${
            isPinkTheme
              ? 'bg-white/95 border-pink-400 shadow-[3px_3px_0px_#f472b6]'
              : 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_#18181b]'
          }`}
        >
          {p1?.isHost && (
            <span className="absolute top-2.5 right-2.5 text-amber-500" title="Room Host">
              <Crown className="w-4 h-4 fill-amber-400" />
            </span>
          )}
          <div
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl mb-2 ${
              isPinkTheme
                ? 'bg-pink-100 border-pink-400 shadow-[2px_2px_0px_#f472b6]'
                : 'bg-amber-100 dark:bg-amber-950/80 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            {p1 ? p1.avatar : '👤'}
          </div>
          <span
            className={`text-xs font-black truncate max-w-full ${
              isPinkTheme ? 'text-pink-950' : 'text-zinc-900 dark:text-white'
            }`}
          >
            {p1 ? p1.nickname : 'Menunggu...'}
          </span>
          <span
            className={`text-[10px] font-bold mt-0.5 ${
              isPinkTheme ? 'text-pink-600' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {p1?.id === playerId ? 'Kamu (Host)' : 'Pemain 1'}
          </span>
        </div>

        {/* Slot 2 */}
        <div
          className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center relative ${
            isPinkTheme
              ? 'bg-white/95 border-pink-400 shadow-[3px_3px_0px_#f472b6]'
              : 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_#18181b]'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl mb-2 ${
              isPinkTheme
                ? 'bg-rose-100 border-rose-400 shadow-[2px_2px_0px_#fb7185]'
                : 'bg-emerald-100 dark:bg-emerald-950/80 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            {p2 ? p2.avatar : '⏳'}
          </div>
          <span
            className={`text-xs font-black truncate max-w-full ${
              isPinkTheme ? 'text-pink-950' : 'text-zinc-900 dark:text-white'
            }`}
          >
            {p2 ? p2.nickname : 'Menunggu Lawan...'}
          </span>
          <span
            className={`text-[10px] font-bold mt-0.5 ${
              isPinkTheme ? 'text-pink-600' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {p2 ? (p2.id === playerId ? 'Kamu' : 'Pemain 2') : 'Slot Kosong'}
          </span>
        </div>
      </div>

      {/* Selected Game Details Bar */}
      <div
        className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between ${
          isPinkTheme
            ? 'bg-pink-50/95 border-pink-400 shadow-[3px_3px_0px_#f472b6]'
            : 'bg-sky-50 dark:bg-zinc-850 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_#18181b]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isPinkTheme
                ? 'bg-pink-200 border-pink-500 text-pink-950'
                : 'bg-sky-200 dark:bg-sky-900 border-zinc-900 text-sky-950 dark:text-sky-200'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <div
              className={`text-xs font-black ${
                isPinkTheme ? 'text-pink-950' : 'text-zinc-900 dark:text-white'
              }`}
            >
              {room.gameState.gameType === 'flag' && 'Tebak Bendera Dunia'}
              {room.gameState.gameType === 'word' && 'Tebak Kata Indonesia'}
              {room.gameState.gameType === 'emoji_voice' && 'Tebak Emoji Panggilan Suara'}
              {room.gameState.gameType === 'dilemma' && 'Uji Kecocokan (Dilema)'}
              {room.gameState.gameType === 'reflex' && 'Refleks Kilat (Buzzer Duel)'}
              {room.gameState.gameType === 'tictactoe' && 'Tic Tac Toe'}
              {room.gameState.gameType === 'uno' && 'Permainan Kartu UNO'}
              {room.gameState.gameType === 'ludo' && 'LUDO 2 Player'}
            </div>
            <div
              className={`text-[10px] font-bold ${
                isPinkTheme ? 'text-pink-700' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {room.gameState.totalRounds} Babak Permainan
            </div>
          </div>
        </div>

        <button
          onClick={onOpenGameSelector}
          className={`px-3 py-1.5 rounded-xl border text-xs font-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
            isPinkTheme
              ? 'bg-white hover:bg-pink-100 text-pink-950 border-pink-500 shadow-[1px_1px_0px_#f472b6]'
              : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 border-zinc-900 shadow-[1px_1px_0px_#18181b]'
          }`}
        >
          Ganti Game ⚙️
        </button>
      </div>

      {/* Start Game Action */}
      {bothConnected ? (
        <button
          onClick={startGame}
          className={`w-full py-4 rounded-3xl border-3 font-black text-base flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer animate-pulse ${
            isPinkTheme
              ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white border-pink-700 shadow-[5px_5px_0px_#be185d]'
              : 'bg-amber-300 dark:bg-amber-500 hover:bg-amber-400 text-zinc-900 border-zinc-900 shadow-[5px_5px_0px_#18181b]'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>MULAI MAIN SEKARANG!</span>
        </button>
      ) : (
        <div
          className={`w-full py-3.5 px-4 rounded-2xl border-2 border-dashed text-center text-xs font-bold flex items-center justify-center gap-2 ${
            isPinkTheme
              ? 'bg-pink-50/90 border-pink-300 text-pink-800'
              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-400 text-zinc-600 dark:text-zinc-300'
          }`}
        >
          <span>Menunggu teman bergabung dengan kode</span>
          <strong
            className={`font-mono px-2 py-0.5 rounded border ${
              isPinkTheme
                ? 'bg-white border-pink-400 text-pink-900'
                : 'bg-white dark:bg-zinc-900 border-zinc-400 text-zinc-900 dark:text-white'
            }`}
          >
            {room.roomId}
          </strong>
        </div>
      )}
    </div>
  );
};
