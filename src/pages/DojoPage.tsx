import { useState, useEffect } from 'react';
import { get, post } from '../services/api';
import toast from 'react-hot-toast';

type Tab = 'battles' | 'bounties' | 'leaderboard';

export default function DojoPage() {
  const [tab, setTab] = useState<Tab>('battles');
  const [ghosts, setGhosts] = useState<any[]>([]);
  const [myGhosts, setMyGhosts] = useState<any[]>([]);
  const [fightLoading, setFightLoading] = useState<string | null>(null);

  useEffect(() => {
    get('/api/ghosts').then(setGhosts).catch(() => {});
    get('/api/ghosts/my').then(setMyGhosts).catch(() => {});
  }, []);

  const handleFight = async (gid: string) => {
    setFightLoading(gid);
    try {
      const r = await post(`/api/ghosts/${gid}/fight`, { xp_earned: Math.floor(Math.random() * 300) + 50 });
      if (r.status === 'victory') {
        toast.success(`Victory! +${r.xp_won} XP`);
      } else {
        toast.error(`Defeated! -${r.xp_lost} XP`);
      }
      get('/api/ghosts').then(setGhosts).catch(() => {});
      get('/api/ghosts/my').then(setMyGhosts).catch(() => {});
    } catch { toast.error('Failed'); }
    finally { setFightLoading(null); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">DOJO</h1>

      <div className="flex gap-1 p-0.5 rounded-lg bg-[#1a1a2e] border border-zinc-800">
        {(['battles', 'bounties', 'leaderboard'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold cursor-pointer ${
              tab === t ? 'bg-[#e94560] text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}>{t.toUpperCase()}</button>
        ))}
      </div>

      {tab === 'battles' && (
        <div className="space-y-2">
          {ghosts.map((g) => (
            <div key={g.id} className="p-4 rounded-xl bg-[#1a1a2e] border border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-bold font-mono">{g.exercise_data?.exercise || 'Unknown'} Ghost</p>
                  <p className="text-zinc-500 text-[10px] font-mono mt-1">
                    {g.exercise_data?.weight}kg × {g.exercise_data?.reps} × {g.exercise_data?.sets} sets
                  </p>
                  <p className="text-[#ffd700] text-[10px] font-mono mt-1">{g.xp_earned} XP reward</p>
                </div>
                <button onClick={() => handleFight(g.id)} disabled={fightLoading === g.id}
                  className="px-4 py-2 rounded-lg bg-[#e94560] text-white font-mono text-[9px] font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer">
                  {fightLoading === g.id ? '⚔...' : 'FIGHT'}
                </button>
              </div>
            </div>
          ))}
          {ghosts.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-8">No ghosts to fight</p>}
        </div>
      )}

      {tab === 'bounties' && (
        <div className="space-y-2">
          {myGhosts.map((g) => (
            <div key={g.id} className="p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800">
              <p className="text-white text-xs font-mono">{g.exercise_data?.exercise || 'Ghost'}</p>
              <p className="text-zinc-600 text-[9px] font-mono mt-1">Wins: {g.wins || 0} · Losses: {g.losses || 0}</p>
            </div>
          ))}
          {myGhosts.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-8">Your ghosts will appear here after workouts</p>}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="space-y-1">
          {ghosts.sort((a, b) => (b.wins || 0) - (a.wins || 0)).slice(0, 10).map((g, i) => (
            <div key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800">
              <span className="text-zinc-500 text-xs font-mono w-6">#{i + 1}</span>
              <span className="text-white text-xs font-mono flex-1">{g.exercise_data?.exercise || 'Ghost'}</span>
              <span className="text-[#ffd700] text-[10px] font-mono">{g.wins || 0}W · {g.losses || 0}L</span>
            </div>
          ))}
          {ghosts.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-8">No leaderboard data</p>}
        </div>
      )}
    </div>
  );
}
