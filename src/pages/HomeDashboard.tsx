import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { supabase } from '../lib/supabaseClient';

interface Progress { xp: number; level: number; streak: number; workoutsCompleted: number; }
interface Contract { id: string; exercise_name: string; status: string; xp_potential: number; }
interface Quest { id: string; task: string; completed: boolean; }
interface GhostStats { wins: number; losses: number; }

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [ghostWins, setGhostWins] = useState(0);
  const [ghostLosses, setGhostLosses] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || ''));
    apiClient.get('/api/progress/stats').then((r) => setProgress(r.data)).catch(() => {});
    apiClient.get('/api/contracts/today').then((r) => {
      if (r.data?.id) setContract(r.data);
    }).catch(() => {});
    apiClient.get('/api/quests').then((r) => setQuest(r.data)).catch(() => {});
    apiClient.get('/api/ghosts/my').then((r) => {
      const ghosts = r.data ?? [];
      setGhostWins(ghosts.reduce((s: number, g: any) => s + (g.wins || 0), 0));
      setGhostLosses(ghosts.reduce((s: number, g: any) => s + (g.losses || 0), 0));
    }).catch(() => {});
  }, []);

  const toggleQuest = async () => {
    try {
      const r = await apiClient.post('/api/quests/toggle');
      setQuest((prev) => prev ? { ...prev, completed: r.data.completed } : prev);
    } catch {}
  };

  const xpPct = progress ? ((progress.xp % 500) / 500) * 100 : 0;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-black text-white font-mono">KAGE</h1>
        <p className="text-zinc-500 text-xs font-mono mt-1">
          {userEmail ? `Welcome, ${userEmail.split('@')[0]}` : 'Forge your spirit'}
        </p>
      </div>

      {/* Level + XP */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-amber-400 text-2xl font-bold font-mono">LV.{progress?.level ?? 1}</span>
          <span className="text-zinc-500 text-xs font-mono">{progress?.xp ?? 0} / {(progress?.level ?? 1) * 500} XP</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-400 transition-all" style={{ width: `${Math.min(xpPct, 100)}%` }} />
        </div>
        <p className="text-zinc-600 text-[10px] font-mono mt-2">🔥 {progress?.streak ?? 0} day streak · {progress?.workoutsCompleted ?? 0} total workouts</p>
      </div>

      {/* Active Contract Card */}
      {contract && contract.status !== 'success' && contract.status !== 'fail' && (
        <div className="rounded-xl bg-gradient-to-r from-rose-900/20 to-amber-900/20 border border-rose-500/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-rose-400 text-[9px] font-mono font-bold tracking-widest">⚔ ACTIVE CONTRACT</p>
            <p className="text-white text-sm font-bold font-mono mt-1">{contract.exercise_name}</p>
            <p className="text-amber-400 text-[10px] font-mono mt-0.5">+{contract.xp_potential} XP potential</p>
          </div>
          <button onClick={() => navigate('/train')}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white font-mono text-[9px] font-bold hover:bg-rose-500 cursor-pointer">TRAIN</button>
        </div>
      )}

      {/* Nutrition Quest */}
      {quest && (
        <div className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer ${quest.completed ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-zinc-900/80 border-zinc-800'}`}
          onClick={toggleQuest}>
          <div className="flex items-center gap-3">
            <span className={`text-lg ${quest.completed ? '' : 'opacity-30'}`}>🥗</span>
            <div>
              <p className={`text-xs font-mono font-bold ${quest.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>Nutrition Quest</p>
              <p className={`text-[9px] font-mono mt-0.5 ${quest.completed ? 'text-emerald-600' : 'text-zinc-600'}`}>{quest.task?.slice(0, 50)}</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold ${quest.completed ? 'text-emerald-400' : 'text-zinc-600'}`}>{quest.completed ? '✓ DONE' : 'TAP'}</span>
        </div>
      )}

      {/* Ghost Status */}
      {(ghostWins > 0 || ghostLosses > 0) && (
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 flex items-center justify-around">
          <div className="text-center"><p className="text-emerald-400 text-lg font-bold font-mono">{ghostWins}</p><p className="text-zinc-600 text-[8px] font-mono">GHOST WINS</p></div>
          <div className="text-center"><p className="text-rose-400 text-lg font-bold font-mono">{ghostLosses}</p><p className="text-zinc-600 text-[8px] font-mono">GHOST LOSSES</p></div>
        </div>
      )}

      {/* Start Workout */}
      <button onClick={() => navigate('/train')}
        className="w-full py-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-mono text-lg font-black tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-rose-600/20">
        ⚔ START WORKOUT
      </button>
    </div>
  );
}
