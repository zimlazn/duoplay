import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { GameType } from '../types/game';
import {
  X,
  Sparkles,
  PhoneCall,
  Zap,
  Flag,
  BookOpen,
  HeartHandshake,
  Grid3X3,
  Layers,
  Trophy,
  Play,
  Check
} from 'lucide-react';

interface GameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameOption {
  type: GameType;
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  recommendedFor: string;
  pastelBg: string;
}

export const GameSelectorModal: React.FC<GameSelectorModalProps> = ({ isOpen, onClose }) => {
  const { room, selectGameType, playerId } = useSocket();
  const [selectedRounds, setSelectedRounds] = React.useState<number>(room?.gameState.totalRounds || 5);

  useEffect(() => {
    if (room?.gameState.totalRounds) {
      setSelectedRounds(room.gameState.totalRounds);
    }
  }, [room?.gameState.totalRounds]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !room) return null;

  const currentGameType = room.gameState.gameType;
  const isHost = room.hostId === playerId;
  const playerIds = Object.keys(room.players);
  const bothConnected = playerIds.length >= 2;

  const games: GameOption[] = [
    {
      type: 'uno',
      title: 'Permainan Kartu UNO',
      badge: 'Aturan Resmi 🃏🔥',
      icon: <Layers className="w-5 h-5 text-red-900 dark:text-red-300" />,
      description: 'Game kartu UNO lengkap! Kartu 0-9, Skip, Reverse, Draw 2 (+2), Wild, Wild Draw 4 (+4), dan tombol teriak UNO!',
      recommendedFor: 'Game besar strategi kartu kompetitif',
      pastelBg: 'bg-rose-100 dark:bg-rose-950/60'
    },
    {
      type: 'ludo',
      title: 'LUDO 2 Player',
      badge: 'Papan Resmi 🎲🏆',
      icon: <Trophy className="w-5 h-5 text-amber-900 dark:text-amber-300" />,
      description: 'Papan Ludo 4 pion resmi! Lempar dadu, masuki arena saat dapat 6, makan pion lawan, dan capai Home segitiga.',
      recommendedFor: 'Balapan taktik & keberuntungan',
      pastelBg: 'bg-amber-100 dark:bg-amber-950/60'
    },
    {
      type: 'tictactoe',
      title: 'Tic Tac Toe',
      badge: 'Duel Klasik ⭕❌',
      icon: <Grid3X3 className="w-5 h-5 text-sky-900 dark:text-sky-300" />,
      description: 'Duel 3x3 klasik! Bergantian menempatkan simbol X dan O untuk membentuk 3 garis lurus sebelum lawan.',
      recommendedFor: 'Taktik cepat & santai',
      pastelBg: 'bg-sky-100 dark:bg-sky-950/60'
    },
    {
      type: 'flag',
      title: 'Tebak Bendera Dunia',
      badge: '120+ Bendera 🌍',
      icon: <Flag className="w-5 h-5 text-amber-900 dark:text-amber-300" />,
      description: 'Tebak nama negara dari benderanya dengan 4 pilihan cepat. Siapa tercepat mendapat poin bonus!',
      recommendedFor: 'Asah pengetahuan geografi & kecepatan',
      pastelBg: 'bg-amber-100 dark:bg-amber-950/60'
    },
    {
      type: 'word',
      title: 'Tebak Kata Indonesia',
      badge: '110+ Teka-Teki 📚',
      icon: <BookOpen className="w-5 h-5 text-indigo-900 dark:text-indigo-300" />,
      description: 'Pecahkan teka-teki logika kata bahasa Indonesia dari petunjuk benda, kuliner, hewan, profesi.',
      recommendedFor: 'Pecinta teka-teki kata nusantara',
      pastelBg: 'bg-purple-100 dark:bg-purple-950/60'
    },
    {
      type: 'emoji_voice',
      title: 'Tebak Emoji Panggilan Suara',
      badge: '100+ Emoji WA Call 📞',
      icon: <PhoneCall className="w-5 h-5 text-emerald-900 dark:text-emerald-300" />,
      description: 'Satu pemain melihat emoji & kata terlarang, jelaskan lewat suara telepon! Pasangan menebak dari layarnya.',
      recommendedFor: 'Main sambil teleponan / LDR / Teman akrab',
      pastelBg: 'bg-emerald-100 dark:bg-emerald-950/60'
    },
    {
      type: 'dilemma',
      title: 'Uji Kecocokan (Dilema Telepati)',
      badge: '100+ Dilema Seru 💖',
      icon: <HeartHandshake className="w-5 h-5 text-pink-900 dark:text-pink-300" />,
      description: 'Pilih dilema harian (bubur diaduk vs tidak, kopi vs teh). Reveal bersamaan untuk melihat kecocokan kalian!',
      recommendedFor: 'Pasangan & Bestie sefrekuensi',
      pastelBg: 'bg-pink-100 dark:bg-pink-950/60'
    },
    {
      type: 'reflex',
      title: 'Refleks Kilat (Buzzer Duel)',
      badge: 'Refleks Milidetik ⚡',
      icon: <Zap className="w-5 h-5 text-yellow-950 dark:text-yellow-300" />,
      description: 'Tahan jarimu... Begitu tombol berubah HIJAU, tekan secepat mungkin! Yang duluan menang babak.',
      recommendedFor: 'Adu adrenalin & kecepatan reaksi',
      pastelBg: 'bg-yellow-100 dark:bg-yellow-950/60'
    }
  ];

  const handleSelectAndStart = (type: GameType) => {
    selectGameType(type, selectedRounds, true);
    onClose();
  };

  const handleSelectOnly = (type: GameType) => {
    selectGameType(type, selectedRounds, false);
    onClose();
  };

  const isPinkTheme = room.roomId === 'ACAA' || room.isSpecialTheme;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg border-2 rounded-3xl overflow-hidden flex flex-col max-h-[88vh] cursor-default transition-all ${
          isPinkTheme
            ? 'bg-pink-50 border-pink-500 shadow-[6px_6px_0px_#f472b6] text-pink-950'
            : 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-700 shadow-[6px_6px_0px_#18181b]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b-2 flex items-center justify-between ${
            isPinkTheme
              ? 'bg-pink-200 border-pink-400 text-pink-950'
              : 'bg-sky-100 dark:bg-sky-950/80 border-zinc-900 dark:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border-2 ${
                isPinkTheme ? 'bg-white border-pink-500 shadow-[2px_2px_0px_#f472b6]' : 'bg-white dark:bg-zinc-800 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isPinkTheme ? 'text-pink-600' : 'text-sky-900 dark:text-sky-300'}`} />
            </div>
            <div>
              <h3 className="text-base font-black">Pilih Mode Permainan</h3>
              <p className={`text-xs font-medium ${isPinkTheme ? 'text-pink-800' : 'text-zinc-600 dark:text-zinc-400'}`}>
                Koleksi game 2-player terlengkap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
              isPinkTheme
                ? 'bg-white hover:bg-pink-100 border-pink-500 text-pink-900 shadow-[2px_2px_0px_#f472b6]'
                : 'bg-white dark:bg-zinc-800 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pilihan Jumlah Ronde */}
        <div
          className={`px-5 py-3 border-b-2 ${
            isPinkTheme
              ? 'bg-pink-100/70 border-pink-400 text-pink-950'
              : 'bg-[#F4F1EB] dark:bg-zinc-850 border-zinc-900 dark:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-zinc-700 dark:text-zinc-300 tracking-wider">
              🎯 Jumlah Ronde / Babak:
            </span>
            <span className="text-xs font-black text-purple-950 dark:text-purple-200 bg-purple-200 dark:bg-purple-900 px-2.5 py-0.5 rounded-lg border border-zinc-900">
              {selectedRounds} Ronde
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 5, 10].map((rounds) => {
              const isSelected = selectedRounds === rounds;
              return (
                <button
                  key={rounds}
                  type="button"
                  onClick={() => setSelectedRounds(rounds)}
                  className={`py-1.5 rounded-xl border-2 border-zinc-900 font-black text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-[2px_2px_0px_#18181b] scale-[1.02]'
                      : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {rounds} Ronde
                </button>
              );
            })}
          </div>
        </div>

        {/* Game List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {games.map((g) => {
            const isCurrent = currentGameType === g.type;

            return (
              <div
                key={g.type}
                className={`p-4 rounded-2xl border-2 border-zinc-900 transition-all ${
                  isCurrent
                    ? `${g.pastelBg} ring-2 ring-purple-500 shadow-[4px_4px_0px_#18181b]`
                    : 'bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-[2px_2px_0px_#18181b]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b]">
                      {g.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                          {g.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 text-[10px] font-black border border-zinc-900 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        )}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-white/70 dark:bg-zinc-900 text-[10px] font-black text-zinc-700 dark:text-zinc-300 border border-zinc-400">
                        {g.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-2 font-medium leading-relaxed">
                  {g.description}
                </p>

                <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1">
                  <span>💡 Cocok:</span>
                  <span className="italic text-zinc-700 dark:text-zinc-300">{g.recommendedFor}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-300 dark:border-zinc-700">
                  {bothConnected ? (
                    <button
                      onClick={() => handleSelectAndStart(g.type)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-300 dark:bg-amber-500 hover:bg-amber-400 text-zinc-950 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-xs font-black flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Pilih & Mulai Langsung</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectOnly(g.type)}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-200 dark:bg-purple-900 hover:bg-purple-300 text-purple-950 dark:text-purple-200 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-xs font-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                    >
                      Pilih Mode Ini
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
