import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../lib/theme';
import WorkoutChart from '../components/WorkoutChart';

interface Progress { xp: number; level: number; streak: number; workoutsCompleted: number; }
interface Achievement { id: string; name: string; description: string; }
interface Record { id: string; exercise_name: string; best_weight: number; best_reps: number; achieved_at: string; }

export default function SoulPage() {
  const [userEmail, setUserEmail] = useState('');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const { isLight, toggle } = useTheme();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || ''));
    apiClient.get('/api/progress/stats').then((r) => {
      setProgress(r.data);
      setAchievements(r.data?.achievements ?? []);
    }).catch(() => {});
    apiClient.get('/api/personal-records').then((r) => setRecords(r.data ?? [])).catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      {/* Profile Header */}
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500/50 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-black text-rose-400 font-mono">
            {(userEmail?.split('@')[0]?.[0] || 'W').toUpperCase()}
          </span>
        </div>
        <h1 className="text-white text-lg font-bold font-mono">{userEmail?.split('@')[0] || 'Warrior'}</h1>
        <p className="text-zinc-500 text-[10px] font-mono">{userEmail}</p>
        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
          LV.{progress?.level ?? 1} · {progress?.xp ?? 0} XP
        </span>
      </div>

      {/* Weekly Chart */}
      <WorkoutChart />

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-zinc-400 text-xs font-mono font-bold">ACHIEVEMENTS</h2>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-white text-xs font-mono font-bold">{a.name}</p>
                <p className="text-zinc-600 text-[8px] font-mono mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Records */}
      {records.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-zinc-400 text-xs font-mono font-bold">PERSONAL RECORDS</h2>
          {records.map((r) => (
            <div key={r.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="text-white text-xs font-mono font-bold">{r.exercise_name}</p>
                <p className="text-zinc-600 text-[8px] font-mono">{r.best_weight}kg × {r.best_reps} reps</p>
              </div>
              <span className="text-amber-400 text-[9px] font-mono">{r.achieved_at?.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3">
        <h2 className="text-zinc-400 text-xs font-mono font-bold">SETTINGS</h2>
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-mono">Theme</span>
          <button onClick={toggle} className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[10px] cursor-pointer hover:bg-zinc-700">
            {isLight ? '☀ LIGHT' : '🌙 DARK'}
          </button>
        </div>
        <button onClick={() => supabase.auth.signOut()}
          className="w-full py-2 rounded-lg bg-rose-600/20 border border-rose-600/30 text-rose-400 font-mono text-[10px] font-bold hover:bg-rose-600/30 cursor-pointer">
          SIGN OUT
        </button>
      </div>
    </div>
  );
}
