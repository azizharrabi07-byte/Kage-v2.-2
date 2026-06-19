import { useState } from 'react';
import Battles from './Battles.tsx';
import BountiesPage from './BountiesPage.tsx';
import Leaderboard from './Leaderboard.tsx';

type DojoTab = 'battles' | 'bounties' | 'rankings';

export default function DojoPage() {
  const [tab, setTab] = useState<DojoTab>('battles');

  const tabs: { key: DojoTab; label: string }[] = [
    { key: 'battles', label: 'BATTLES' },
    { key: 'bounties', label: 'BOUNTIES' },
    { key: 'rankings', label: 'RANKINGS' },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto pb-20 space-y-4">
      <h1 className="text-white text-lg font-bold font-mono">DOJO</h1>

      <div className="flex gap-1 p-0.5 rounded-lg bg-void border border-white/5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
              tab === t.key ? 'bg-kachi text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'battles' && <Battles />}
      {tab === 'bounties' && <BountiesPage />}
      {tab === 'rankings' && <Leaderboard />}
    </div>
  );
}
