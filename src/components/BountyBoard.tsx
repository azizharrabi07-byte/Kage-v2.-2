import { useState, memo } from 'react';
import { Award, Gift, CheckCircle2, Clock } from 'lucide-react';
import { generateWeeklyBounties, getAvailableBounties, type Bounty } from '../utils/dojoBounties';

interface Props {
  isLight: boolean;
}

const BountyBoard = memo(function BountyBoard({ isLight }: Props) {
  const [bounties, setBounties] = useState<Bounty[]>(() => {
    const stored = localStorage.getItem('kage_bounties');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const expiresAt = parsed[0]?.expiresAt;
        if (expiresAt && new Date(expiresAt) > new Date()) return parsed;
      } catch {}
    }
    const fresh = generateWeeklyBounties();
    localStorage.setItem('kage_bounties', JSON.stringify(fresh));
    return fresh;
  });

  const { active, completed, claimed } = getAvailableBounties(bounties);

  const handleClaim = (id: string) => {
    const updated = bounties.map(b => (b.id === id ? { ...b, claimed: true } : b));
    setBounties(updated);
    localStorage.setItem('kage_bounties', JSON.stringify(updated));
  };

  const bg = isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-zinc-800';
  const text = isLight ? 'text-stone-800' : 'text-zinc-200';
  const muted = isLight ? 'text-stone-500' : 'text-zinc-500';
  const cardBg = isLight ? 'bg-stone-100' : 'bg-[#0A0A0F]';

  const renderBounty = (b: Bounty, state: 'active' | 'completed' | 'claimed') => (
    <div key={b.id} className={`${cardBg} border ${isLight ? 'border-stone-200' : 'border-zinc-800'} rounded-lg p-3 space-y-2`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {state === 'claimed' ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : state === 'completed' ? (
            <Gift className="w-4 h-4 text-amber-400" />
          ) : (
            <Award className="w-4 h-4 text-rose-400" />
          )}
          <span className={`text-xs font-mono font-bold ${text}`}>{b.title}</span>
        </div>
        <span className="text-[10px] font-mono text-rose-400">+{b.rewardXP} XP</span>
      </div>
      <p className={`text-[10px] ${muted}`}>{b.description}</p>
      <div className="flex items-center gap-2">
        <div className={`flex-1 h-1.5 rounded-full ${isLight ? 'bg-stone-200' : 'bg-zinc-800'} overflow-hidden`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all"
            style={{ width: `${Math.min(100, (b.progress / b.target) * 100)}%` }}
          />
        </div>
        <span className={`text-[10px] font-mono ${muted}`}>{b.progress}/{b.target}</span>
      </div>
      {state === 'completed' && (
        <button
          onClick={() => handleClaim(b.id)}
          className="w-full px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono rounded-lg transition-colors cursor-pointer active:scale-95"
        >
          CLAIM REWARD
        </button>
      )}
      {state === 'active' && b.expiresAt && (
        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
          <Clock className="w-3 h-3" />
          Expires {new Date(b.expiresAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  return (
    <div className={`${bg} border rounded-xl p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className={`font-mono font-bold text-sm ${text}`}>DOJO BOUNTIES</h3>
        </div>
        <span className={`text-[10px] font-mono ${muted}`}>Weekly Challenges</span>
      </div>

      {claimed.length > 0 && (
        <div className="space-y-2">
          <p className={`text-[10px] font-mono uppercase tracking-wider ${muted}`}>Claimed</p>
          {claimed.map(b => renderBounty(b, 'claimed'))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2">
          <p className={`text-[10px] font-mono uppercase tracking-wider text-green-400`}>Ready to Claim</p>
          {completed.map(b => renderBounty(b, 'completed'))}
        </div>
      )}

      <div className="space-y-2">
        <p className={`text-[10px] font-mono uppercase tracking-wider ${muted}`}>Active</p>
        {active.map(b => renderBounty(b, 'active'))}
        {active.length === 0 && completed.length === 0 && (
          <p className={`text-xs ${muted} text-center py-4`}>All bounties claimed. New ones arrive next week.</p>
        )}
      </div>
    </div>
  );
});

export default BountyBoard;
