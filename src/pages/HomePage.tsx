import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../services/api';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function HomePage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({ level: 1, xp: 0, streak: 0, workoutsCompleted: 0 });
  const [contract, setContract] = useState<any>(null);
  const [quest, setQuest] = useState<any>(null);
  const [ghostCount, setGhostCount] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || 'Warrior'));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await get('/api/progress/stats');
      setStats(s);
    } catch {}
    try {
      const c = await get('/api/contracts/today');
      if (c?.id) setContract(c);
    } catch {}
    try {
      const q = await get('/api/quests');
      setQuest(q);
    } catch {}
    try {
      const g = await get('/api/ghosts');
      setGhostCount(g?.length || 0);
    } catch {}
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const c = await post('/api/contracts/generate');
      setContract(c);
      toast.success('Contract received!');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || 'Error');
    } finally { setGenerating(false); }
  };

  const handleQuestToggle = async () => {
    try {
      const r = await post('/api/quests/toggle');
      setQuest((prev: any) => prev ? { ...prev, completed: r.completed } : prev);
    } catch {}
  };

  const xpPct = stats.level > 0 ? ((stats.xp % 500) / 500) * 100 : 0;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <div className="text-center py-4">
        <h1 className="text-2xl font-black text-white font-mono tracking-widest">KAGE</h1>
        <p className="text-zinc-500 text-xs font-mono mt-1">
          {userEmail ? `Welcome, ${userEmail.split('@')[0]}` : 'Forge your spirit'}
        </p>
      </div>

      {/* Stats Card */}
      <div className="rounded-xl bg-[#1a1a2e] border-l-4 border-[#e94560] p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#ffd700] text-2xl font-bold font-mono">LV.{stats.level}</span>
          <span className="text-zinc-500 text-xs font-mono">{stats.xp} / {(stats.level) * 500} XP</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#e94560] to-[#ff6b35]" style={{ width: `${Math.min(xpPct, 100)}%` }} />
        </div>
        <p className="text-zinc-600 text-[10px] font-mono mt-2">🔥 {stats.streak} day streak · {stats.workoutsCompleted} total workouts</p>
      </div>

      {/* Contract */}
      {contract ? (
        <div className="rounded-xl bg-[#1a1a2e] border-l-4 border-[#ffd700] p-4 flex items-center justify-between">
          <div>
            <p className="text-[#ffd700] text-[9px] font-mono font-bold tracking-widest">⚔ TODAY'S CONTRACT</p>
            <p className="text-white text-sm font-bold font-mono mt-1">{contract.exercise_name}</p>
            <p className="text-[#e94560] text-[10px] font-mono mt-0.5">{contract.sets}×{contract.reps} @ {contract.weight_kg}kg · +{contract.xp_potential} XP</p>
          </div>
          <button onClick={() => navigate('/train/session')}
            className="px-4 py-2 rounded-lg bg-[#e94560] text-white font-mono text-[9px] font-bold hover:opacity-90 cursor-pointer">START</button>
        </div>
      ) : (
        <div className="rounded-xl bg-[#1a1a2e] border border-zinc-800 p-4 text-center">
          <p className="text-zinc-500 text-xs font-mono mb-3">No contract for today</p>
          <button onClick={handleGenerate} disabled={generating}
            className="px-6 py-3 rounded-lg bg-[#e94560] text-white font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer">
            {generating ? 'SUMMONING...' : '⚔ GENERATE CONTRACT'}
          </button>
        </div>
      )}

      {/* Nutrition Quest */}
      {quest && (
        <div onClick={handleQuestToggle}
          className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer ${
            quest.completed ? 'bg-[#1a1a2e] border-[#4caf50]' : 'bg-[#1a1a2e] border-zinc-800'
          }`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">🥗</span>
            <div>
              <p className={`text-xs font-mono font-bold ${quest.completed ? 'text-[#4caf50] line-through' : 'text-white'}`}>Nutrition Quest</p>
              <p className={`text-[9px] font-mono mt-0.5 ${quest.completed ? 'text-[#4caf50]' : 'text-zinc-500'}`}>{quest.task}</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold ${quest.completed ? 'text-[#4caf50]' : 'text-zinc-600'}`}>{quest.completed ? '✓ DONE' : 'TAP'}</span>
        </div>
      )}

      {/* Ghost Status */}
      {ghostCount > 0 && (
        <div className="rounded-xl bg-[#1a1a2e] border border-zinc-800 p-3 flex items-center justify-between">
          <span className="text-zinc-300 text-xs font-mono">👻 {ghostCount} ghosts available</span>
          <button onClick={() => navigate('/dojo')}
            className="px-3 py-1.5 rounded-lg bg-[#333] text-white font-mono text-[9px] hover:bg-zinc-600 cursor-pointer">FIGHT</button>
        </div>
      )}

      {/* Start Workout */}
      <button onClick={() => navigate('/train/session')}
        className="w-full py-5 rounded-xl bg-gradient-to-r from-[#e94560] to-[#ff6b35] text-white font-mono text-lg font-black tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#e94560]/20">
        ⚔ START WORKOUT
      </button>
    </div>
  );
}
