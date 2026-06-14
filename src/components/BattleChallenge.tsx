import { useState } from 'react';
import { Swords, Trophy, Zap, X } from 'lucide-react';

interface BattleChallengeProps {
  isLight: boolean;
  onClose: () => void;
  partnerName: string;
  partnerAvatar: string;
  sharedStreak: number;
}

const CHALLENGES = [
  { id: 'volume-war', name: 'VOLUME WAR', desc: 'Who logs the most total volume (kg) in 7 days?', duration: '7 DAYS', reward: '500 XP + GOLD CREST' },
  { id: 'iron-streak', name: 'IRON STREAK', desc: 'Longest daily streak over 14 days.', duration: '14 DAYS', reward: '1000 XP + LEGENDARY BADGE' },
  { id: 'rep-king', name: 'REP KING', desc: 'Most total reps across all exercises in 3 days.', duration: '3 DAYS', reward: '300 XP + SILVER CREST' },
  { id: 'pushup-war', name: 'PUSH-UP WAR', desc: 'Most push-ups logged in 24 hours.', duration: '24 HOURS', reward: '400 XP + IRON FIST' },
];

export default function BattleChallenge({ isLight, onClose, partnerName, partnerAvatar, sharedStreak }: BattleChallengeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, 'won' | 'lost' | 'active' | null>>({});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl p-5 max-h-[85vh] overflow-y-auto border ${isLight ? 'bg-white border-stone-200' : 'bg-[#0A0A0F] border-white/10'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Swords className={`w-5 h-5 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>BATTLE CHALLENGES</h3>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full cursor-pointer ${isLight ? 'hover:bg-stone-100' : 'hover:bg-zinc-800'}`}>
            <X className={`w-4 h-4 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`} />
          </button>
        </div>

        <div className={`flex items-center gap-3 rounded-xl p-3 mb-4 border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
          <span className="text-2xl">{partnerAvatar}</span>
          <div>
            <p className={`text-xs font-bold ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>Partner: {partnerName}</p>
            <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>🔥 Shared Streak: {sharedStreak}d</p>
          </div>
        </div>

        <div className="space-y-2">
          {CHALLENGES.map(c => {
            const res = results[c.id];
            const isActive = activeId === c.id;
            return (
              <div key={c.id}
                className={`rounded-xl p-3 border cursor-pointer transition-all ${
                  isLight
                    ? (isActive ? 'bg-rose-50 border-rose-300' : 'bg-white border-stone-200 hover:border-rose-200')
                    : (isActive ? 'bg-rose-500/10 border-rose-500/30' : 'bg-zinc-900/50 border-zinc-800/50 hover:border-rose-500/20')
                }`}
                onClick={() => setActiveId(isActive ? null : c.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-xs font-bold ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>{c.name}</p>
                    <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{c.duration}</p>
                  </div>
                  {res === 'won' ? <Trophy className="w-4 h-4 text-yellow-400" /> :
                   res === 'lost' ? <X className="w-4 h-4 text-rose-400" /> :
                   isActive ? <Zap className="w-4 h-4 text-rose-400 animate-pulse" /> : null}
                </div>
                {isActive && (
                  <div className="mt-3 space-y-2">
                    <p className={`text-[10px] font-mono ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>{c.desc}</p>
                    <p className={`text-[10px] font-mono ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>🏆 {c.reward}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResults(p => ({ ...p, [c.id]: 'active' })); setActiveId(null); }}
                      className={`w-full py-2 rounded-lg text-[10px] font-mono font-bold cursor-pointer active:scale-95 transition-all ${isLight ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'}`}>
                      ACCEPT CHALLENGE
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onClose}
          className={`w-full mt-4 py-3 rounded-xl text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all ${isLight ? 'bg-stone-200 text-stone-600 hover:bg-stone-300' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
          CLOSE
        </button>
      </div>
    </div>
  );
}
