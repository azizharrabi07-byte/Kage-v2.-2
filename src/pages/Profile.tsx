import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuthStore } from '../stores/authStore';

interface ProgressData {
  xp: number;
  level: number;
  rankIndex: number;
  streak: number;
  workoutsCompleted: number;
  achievements: { id: string; name: string; description: string }[];
  recentSessions: { id: string; created_at: string }[];
  totalSessions: number;
}

export default function Profile() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ rank: number; total: number } | null>(null);
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    apiClient.get('/api/progress/stats').then((r) => setData(r.data)).catch(() => {});
    apiClient.get('/api/leaderboard/rank').then((r) => setLeaderboard(r.data)).catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-bold font-mono">{user?.email?.split('@')[0] || 'Warrior'}</h1>
          <p className="text-zinc-500 text-xs font-mono">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 font-mono text-[10px] hover:bg-zinc-700 cursor-pointer"
        >
          SIGN OUT
        </button>
      </div>

      {leaderboard && (
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 text-center">
          <p className="text-zinc-500 text-[9px] font-mono">RANK</p>
          <p className="text-white text-2xl font-bold font-mono">
            #{leaderboard.rank} <span className="text-xs text-zinc-500">/ {leaderboard.total}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="LEVEL" value={String(data?.level ?? '—')} />
        <StatCard label="XP" value={String(data?.xp ?? '—')} />
        <StatCard label="STREAK" value={`${data?.streak ?? 0} days`} />
        <StatCard label="WORKOUTS" value={String(data?.workoutsCompleted ?? '—')} />
      </div>

      {data?.achievements && data.achievements.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-zinc-400 text-xs font-mono font-bold tracking-wider">ACHIEVEMENTS</h2>
          {data.achievements.map((ach) => (
            <div key={ach.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <p className="text-white text-sm font-mono">{ach.name}</p>
              <p className="text-zinc-500 text-[10px] font-mono">{ach.description}</p>
            </div>
          ))}
        </div>
      )}

      {data?.recentSessions && data.recentSessions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-zinc-400 text-xs font-mono font-bold tracking-wider">RECENT SESSIONS</h2>
          {data.recentSessions.map((s) => (
            <div key={s.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <p className="text-zinc-400 text-[10px] font-mono">
                {new Date(s.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
      <p className="text-zinc-500 text-[9px] font-mono tracking-wider">{label}</p>
      <p className="text-white text-xl font-bold font-mono mt-1">{value}</p>
    </div>
  );
}
