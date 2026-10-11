import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Trophy,
  Volume2,
  VolumeX,
  PhoneCall,
  Copy,
  Check,
  Gamepad2,
  Moon,
  Sun
} from 'lucide-react';

interface NavbarProps {
  onOpenScoreboard: () => void;
  onOpenGameSelector: () => void;
  onOpenVoiceCallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenScoreboard,
  onOpenGameSelector,
  onOpenVoiceCallModal
}) => {
  const { room, soundEnabled, toggleSound } = useSocket();
  const [copied, setCopied] = useState(false);

  // STRICT DEFAULT: Light Theme (false). Use dedicated key to ignore previous dark preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('duoplay_theme_mode');
      return saved === 'dark'; // Defaults to false (Light Theme)
    }
    return false;
  });

  const isPinkTheme = room?.roomId === 'ACAA' || room?.isSpecialTheme;

  // Apply theme classes:
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isPinkTheme) {
      // Room ACAA has its own special cute pink theme; dark mode is strictly disallowed here
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('theme-pink');
      return;
    }

    document.body.classList.remove('theme-pink');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('duoplay_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('duoplay_theme_mode', 'light');
    }
  }, [isDarkMode, isPinkTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleCopyCode = () => {
    if (room?.roomId) {
      navigator.clipboard.writeText(room.roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const playerIds = room ? Object.keys(room.players) : [];
  const p1 = playerIds[0] ? room?.players[playerIds[0]] : null;
  const p2 = playerIds[1] ? room?.players[playerIds[1]] : null;

  return (
    <header
      className={`sticky top-0 z-30 w-full border-b-2 shadow-sm transition-colors duration-300 ${
        isPinkTheme
          ? 'bg-pink-100/95 border-pink-400 backdrop-blur-xs text-pink-950'
          : 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700'
      }`}
    >
      <div className="max-w-4xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Room Code */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-black text-sm tracking-tight text-zinc-900 dark:text-white">
            <span
              className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center text-sm font-black ${
                isPinkTheme
                  ? 'bg-pink-300 border-pink-600 shadow-[2px_2px_0px_#db2777]'
                  : 'bg-amber-200 dark:bg-amber-500 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
              }`}
            >
              {isPinkTheme ? '💖' : '🎮'}
            </span>
            <span
              className={`font-extrabold text-base tracking-tight hidden xs:inline ${
                isPinkTheme ? 'text-pink-950 font-black' : ''
              }`}
            >
              {isPinkTheme ? 'DuoPlay • Acaa' : 'DuoPlay'}
            </span>
          </div>

          {room && (
            <button
              onClick={handleCopyCode}
              title="Salin Kode Room"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border-2 text-xs font-mono font-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                isPinkTheme
                  ? 'bg-pink-200 hover:bg-pink-300 text-pink-950 border-pink-600 shadow-[2px_2px_0px_#db2777]'
                  : 'bg-purple-100 dark:bg-purple-950 hover:bg-purple-200 text-purple-950 dark:text-purple-200 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
              }`}
            >
              <span>{room.roomId}</span>
              {isPinkTheme && <span className="text-[10px]">🌸</span>}
              {copied ? (
                <Check className={`w-3.5 h-3.5 ${isPinkTheme ? 'text-pink-700' : 'text-emerald-700 dark:text-emerald-400'}`} />
              ) : (
                <Copy className={`w-3.5 h-3.5 ${isPinkTheme ? 'text-pink-800' : 'text-zinc-700 dark:text-zinc-300'}`} />
              )}
            </button>
          )}
        </div>

        {/* Live Scores Banner */}
        {room && (
          <div
            className={`flex items-center gap-2 border-2 px-3 py-1 rounded-xl ${
              isPinkTheme
                ? 'bg-white/95 border-pink-400 shadow-[2px_2px_0px_#f472b6]'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            <div className="flex items-center gap-1 text-xs">
              <span className="text-sm">{p1?.avatar || '🦁'}</span>
              <span className={`font-black font-mono ${isPinkTheme ? 'text-pink-700' : 'text-purple-700 dark:text-purple-400'}`}>
                {p1?.score ?? 0}
              </span>
            </div>
            <span className="text-zinc-400 text-xs font-bold">:</span>
            <div className="flex items-center gap-1 text-xs">
              <span className={`font-black font-mono ${isPinkTheme ? 'text-rose-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {p2?.score ?? 0}
              </span>
              <span className="text-sm">{p2?.avatar || '🦊'}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Dark Mode Toggle (Disabled / Replaced in Room ACAA) */}
          {!isPinkTheme ? (
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              )}
            </button>
          ) : (
            <div
              title="Tema Spesial Pink Imut Acaa Aktif"
              className="px-2.5 py-1 rounded-xl bg-pink-200 border-2 border-pink-500 shadow-[2px_2px_0px_#f472b6] text-pink-950 text-xs font-black flex items-center gap-1 cursor-default select-none animate-pulse"
            >
              <span>🌸</span>
              <span className="text-[11px] font-extrabold hidden sm:inline">Pink Imut</span>
            </div>
          )}

          {/* WhatsApp Call Guide Button */}
          <button
            onClick={onOpenVoiceCallModal}
            title="Panduan Panggilan Suara WhatsApp"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isPinkTheme
                ? 'bg-rose-200 hover:bg-rose-300 text-rose-950 border-rose-500 shadow-[2px_2px_0px_#fb7185]'
                : 'bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-950 dark:text-emerald-200 border-zinc-900 dark:border-emerald-700 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Voice Call WA</span>
          </button>

          {/* Switch Game Button */}
          {room && (
            <button
              onClick={onOpenGameSelector}
              title="Pilih Permainan Lain"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 text-xs font-bold active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                isPinkTheme
                  ? 'bg-pink-300 hover:bg-pink-400 text-pink-950 border-pink-600 shadow-[2px_2px_0px_#db2777]'
                  : 'bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 text-sky-950 dark:text-sky-200 border-zinc-900 dark:border-sky-700 shadow-[2px_2px_0px_#18181b]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pilih Game</span>
            </button>
          )}

          {/* Scoreboard Drawer */}
          {room && (
            <button
              onClick={onOpenScoreboard}
              title="Papan Skor Bersama"
              className={`p-1.5 rounded-xl border-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                isPinkTheme
                  ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 border-amber-500 shadow-[2px_2px_0px_#f59e0b]'
                  : 'bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border-zinc-900 dark:border-amber-700 shadow-[2px_2px_0px_#18181b]'
              }`}
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className={`p-1.5 rounded-xl border-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isPinkTheme
                ? 'bg-white hover:bg-pink-50 text-pink-950 border-pink-400 shadow-[2px_2px_0px_#f472b6]'
                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-900 dark:text-zinc-100 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181b]'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
