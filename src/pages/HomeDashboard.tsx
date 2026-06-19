import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { supabase } from '../lib/supabaseClient';
import WorkoutChart from '../components/WorkoutChart';

interface Progress {
  xp: number; level: number; streak: number; workoutsCompleted: number;
}

interface Bounty { id: string; title: string; xp_reward: number; }

interface Session { id: string; created_at: string; xp_earned?: number; }

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || ''));
    apiClient.get('/api/progress/stats').then((r) => setProgress(r.data)).catch(() => {});
    apiClient.get('/api/bounties').then((r) => {
      const b = r.data?.find((b: Bounty) => b);
      if (b) setBounty(b);
    }).catch(() => {});
    apiClient.get('/api/workout-sessions').then((r) => {
      const items = r.data?.items ?? r.data ?? [];
      setSessions(items.slice(0, 3));
    }).catch(() => {});
  }, []);

  const xpPct = progress ? ((progress.xp % 500) / 500) * 100 : 0;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* Greeting */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-xl font-black font-mono">KAGE</h1>
          <p className="text-zinc-500 text-xs font-mono">
            {userEmail ? `Welcome, ${userEmail.split('@')[0]}` : 'Loading...'}
          </p>
        </div>
        <span className="text-zinc-600 text-[10px] font-mono">🔥 {progress?.streak ?? 0} DAY STREAK</span>
      </div>

      {/* Level + XP Bar */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-amber-400 text-2xl font-bold font-mono">LV.{progress?.level ?? 1}</span>
          <span className="text-zinc-500 text-xs font-mono">{progress?.xp ?? 0} / {(progress?.level ?? 1) * 500} XP</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all duration-500" style={{ width: `${Math.min(xpPct, 100)}%` }} />
        </div>
        <p className="text-zinc-600 text-[10px] font-mono mt-2">{progress?.workoutsCompleted ?? 0} total workouts</p>
      </div>

      {/* Active Bounty */}
      {bounty && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-[10px] font-mono font-bold">ACTIVE BOUNTY</p>
            <p className="text-white text-xs font-mono mt-0.5">{bounty.title}</p>
          </div>
          <span className="text-amber-400 text-xs font-mono font-bold">+{bounty.xp_reward} XP</span>
        </div>
      )}

      {/* Macro Ring */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
        <h3 className="text-zinc-500 text-[10px] font-mono mb-2">TODAY'S NUTRITION</h3>
        <ProgressRing pct={0} label="Calories" />
      </div>

      {/* Start Workout */}
      <button onClick={() => navigate('/workout')}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-mono text-sm font-bold tracking-widest hover:opacity-90 transition-all cursor-pointer">
        START WORKOUT
      </button>

      {/* Workout Chart */}
      <WorkoutChart />

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="space-y-1">
          <p className="text-zinc-500 text-[10px] font-mono font-bold">RECENT SESSIONS</p>
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-300 text-[10px] font-mono">{new Date(s.created_at).toLocaleDateString()}</span>
              {s.xp_earned != null && <span className="text-amber-400 text-[10px] font-mono">+{s.xp_earned} XP</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center">
        <span className="text-white text-xs font-mono font-bold">{Math.round(pct)}%</span>
      </div>
      <span className="text-zinc-400 text-[10px] font-mono">{label}</span>
    </div>
  );
}
