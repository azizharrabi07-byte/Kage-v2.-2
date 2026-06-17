import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

interface Profile {
  id: string;
  username: string;
  level: number;
  xp: number;
  total_workouts: number;
  avatar_url: string | null;
}

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    apiClient.get('/api/leaderboard?limit=100').then((r) => setProfiles(r.data ?? [])).catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-white text-lg font-bold font-mono">LEADERBOARD</h1>
      <div className="space-y-1">
        {profiles.map((p, i) => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold font-mono w-6 text-center ${
                i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-amber-700' : 'text-zinc-600'
              }`}>#{i + 1}</span>
              <div>
                <p className="text-white text-xs font-mono font-bold">{p.username || 'Unknown'}</p>
                <p className="text-zinc-600 text-[9px] font-mono">Lv.{p.level} · {p.total_workouts ?? 0} workouts</p>
              </div>
            </div>
            <span className="text-amber-400 text-xs font-mono font-bold">{p.xp} XP</span>
          </div>
        ))}
        {profiles.length === 0 && (
          <p className="text-zinc-600 text-xs font-mono text-center py-8">
            No warriors on the leaderboard yet. Start training!
          </p>
        )}
      </div>
    </div>
  );
}
