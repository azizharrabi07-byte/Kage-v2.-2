import { X, Flame, Trophy, Zap, CheckCircle2, Camera } from 'lucide-react';

interface WorkoutCompleteProps {
  isLight: boolean;
  programName: string;
  duration: number;
  totalSets: number;
  totalVolume: number;
  newPRs: { name: string }[];
  xpEarned: number;
  achievementsUnlocked: string[];
  onClose: () => void;
  onPhotoUpload?: () => void;
}

export default function WorkoutComplete({
  isLight, programName, duration, totalSets, totalVolume,
  newPRs, xpEarned, achievementsUnlocked, onClose, onPhotoUpload,
}: WorkoutCompleteProps) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-2xl p-6 border ${isLight ? 'bg-white border-stone-200' : 'bg-[#0A0A0F] border-white/10'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>PROTOCOL COMPLETE</h3>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-full cursor-pointer ${isLight ? 'hover:bg-stone-100' : 'hover:bg-zinc-800'}`}>
            <X className={`w-4 h-4 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`} />
          </button>
        </div>

        <p className={`text-xs font-mono text-center mb-4 ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>
          ✧ "{programName}" — COMPLETE ✧
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`rounded-xl p-3 text-center border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-stone-800' : 'text-white'}`}>{minutes}:{seconds.toString().padStart(2, '0')}</span>
            <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>DURATION</p>
          </div>
          <div className={`rounded-xl p-3 text-center border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{totalSets}</span>
            <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>SETS</p>
          </div>
          <div className={`rounded-xl p-3 text-center border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{totalVolume.toLocaleString()}</span>
            <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>VOLUME (KG)</p>
          </div>
          <div className={`rounded-xl p-3 text-center border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
            <span className={`text-2xl font-bold font-mono ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>+{xpEarned}</span>
            <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>XP EARNED</p>
          </div>
        </div>

        {newPRs.length > 0 && (
          <div className={`rounded-xl p-3 border mb-3 ${isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>NEW PERSONAL RECORDS</span>
            </div>
            {newPRs.map((pr, i) => (
              <p key={i} className={`text-[10px] font-mono ${isLight ? 'text-amber-600' : 'text-amber-300'}`}>🔥 {pr.name}</p>
            ))}
          </div>
        )}

        {achievementsUnlocked.length > 0 && (
          <div className={`rounded-xl p-3 border mb-3 ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="w-3 h-3 text-emerald-400" />
              <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>ACHIEVEMENTS UNLOCKED</span>
            </div>
            {achievementsUnlocked.map((a, i) => (
              <p key={i} className={`text-[10px] font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-300'}`}>🎉 {a}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {onPhotoUpload && (
            <button onClick={onPhotoUpload}
              className={`flex-1 py-3 rounded-xl text-[10px] font-mono font-bold cursor-pointer active:scale-95 transition-all border ${isLight ? 'bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}>
              <Camera className="w-3 h-3 inline mr-1" /> PHOTO
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-mono font-bold cursor-pointer active:scale-95 transition-all hover:bg-rose-600">
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
