import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { GameType } from '../types/game';
import { X, Sparkles, PhoneCall, Zap, Flag, BookOpen, HeartHandshake, Play, Check } from 'lucide-react';

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
      type: 'flag',
      title: 'Tebak Bendera Dunia',
      badge: '120+ Bendera',
      icon: <Flag className="w-5 h-5 text-amber-900" />,
      description: 'Tebak nama negara dari benderanya dengan 4 pilihan cepat. Siapa tercepat mendapat poin bonus!',
      recommendedFor: 'Asah pengetahuan geografi & kecepatan',
      pastelBg: 'bg-amber-100'
    },
    {
      type: 'word',
      title: 'Tebak Kata Indonesia',
      badge: '110+ Teka-Teki',
      icon: <BookOpen className="w-5 h-5 text-indigo-900" />,
      description: 'Pecahkan teka-teki logika kata bahasa Indonesia dari petunjuk benda, kuliner, hewan, profesi.',
      recommendedFor: 'Pecinta teka-teki kata nusantara',
      pastelBg: 'bg-purple-100'
    },
    {
      type: 'emoji_voice',
      title: 'Tebak Emoji Panggilan Suara',
      badge: '100+ Emoji WA Call 📞',
      icon: <PhoneCall className="w-5 h-5 text-emerald-900" />,
      description: 'Satu pemain melihat emoji & kata terlarang, jelaskan lewat suara telepon! Pasangan menebak dari layarnya.',
      recommendedFor: 'Main sambil teleponan / LDR / Teman akrab',
      pastelBg: 'bg-emerald-100'
    },
    {
      type: 'dilemma',
      title: 'Uji Kecocokan (Dilema Telepati)',
      badge: '100+ Dilema Seru 💖',
      icon: <HeartHandshake className="w-5 h-5 text-pink-900" />,
      description: 'Pilih dilema harian (bubur diaduk vs tidak, kopi vs teh). Reveal bersamaan untuk melihat kecocokan kalian!',
      recommendedFor: 'Pasangan & Bestie yang ingin tahu seberapa sefrekuensi',
      pastelBg: 'bg-pink-100'
    },
    {
      type: 'reflex',
      title: 'Refleks Kilat (Buzzer Duel)',
      badge: 'Refleks Milidetik ⚡',
      icon: <Zap className="w-5 h-5 text-yellow-950" />,
      description: 'Tahan jarimu... Begitu tombol berubah HIJAU, tekan secepat mungkin! Yang duluan menang babak.',
      recommendedFor: 'Adu adrenalin & kecepatan reaksi',
      pastelBg: 'bg-yellow-100'
    }
  ];

  const handleSelectAndStart = (type: GameType) => {
    selectGameType(type, 5, true);
    onClose();
  };

  const handleSelectOnly = (type: GameType) => {
    selectGameType(type, 5, false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border-2 border-zinc-900 rounded-3xl shadow-[6px_6px_0px_#18181b] overflow-hidden flex flex-col max-h-[85vh] cursor-default"
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-zinc-900 bg-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b]">
              <Sparkles className="w-5 h-5 text-sky-900" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900">Pilih Mode Permainan</h3>
              <p className="text-xs text-zinc-600 font-medium">Koleksi 100+ soal & emoji terlengkap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] text-zinc-800 hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Game list */}
        <div className="p-5 overflow-y-auto space-y-3 bg-[#FAF8F5]">
          {games.map((game) => {
            const isCurrent = currentGameType === game.type;

            return (
              <div
                key={game.type}
                className={`p-4 rounded-2xl border-2 border-zinc-900 transition-all ${
                  isCurrent
                    ? `${game.pastelBg} shadow-[4px_4px_0px_#18181b] ring-2 ring-zinc-900`
                    : 'bg-white shadow-[2px_2px_0px_#18181b]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border-2 border-zinc-900 ${game.pastelBg} shrink-0 shadow-[2px_2px_0px_#18181b]`}>
                    {game.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-zinc-900 text-sm">
                        {game.title}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-zinc-900 text-zinc-800">
                        {game.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-200 border border-zinc-900 text-emerald-950">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
                      {game.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {bothConnected && (
                        <button
                          type="button"
                          onClick={() => handleSelectAndStart(game.type)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-zinc-900 font-black text-xs border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] flex items-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-zinc-900" />
                          Mainkan Sekarang
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSelectOnly(game.type)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Pilih Saja
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t-2 border-zinc-900 bg-white flex items-center justify-between text-xs text-zinc-600">
          <span className="font-bold">{isHost ? '👑 Host Room' : 'Semua pemain dapat memilih game'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs shadow-[2px_2px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
