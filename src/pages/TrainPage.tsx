import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../services/api';

type Tab = 'exercises' | 'presets' | 'history';

export default function TrainPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('exercises');
  const [exercises, setExercises] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    get('/api/exercises').then(setExercises).catch(() => {});
    get('/api/programs').then(setPrograms).catch(() => {});
    get('/api/workout-sessions').then((r) => setSessions(r?.items ?? r ?? [])).catch(() => {});
  }, []);

  const filtered = exercises.filter((e) => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter && e.muscle_group !== filter) return false;
    return true;
  });

  const muscleGroups = [...new Set(exercises.map((e) => e.muscle_group).filter(Boolean))];

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">TRAIN</h1>

      <div className="flex gap-1 p-0.5 rounded-lg bg-[#1a1a2e] border border-zinc-800">
        {(['exercises', 'presets', 'history'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
              tab === t ? 'bg-[#e94560] text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}>{t.toUpperCase()}</button>
        ))}
      </div>

      {tab === 'exercises' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exercises..."
              className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-800 text-white text-xs font-mono placeholder-zinc-600" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-800 text-white text-xs font-mono">
              <option value="">All</option>
              {muscleGroups.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {filtered.map((ex) => (
              <div key={ex.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800">
                <div>
                  <p className="text-white text-xs font-mono font-bold">{ex.name}</p>
                  <p className="text-zinc-600 text-[9px] font-mono">{ex.muscle_group} · {ex.difficulty}</p>
                </div>
                <span className="text-[#e94560] text-xs font-mono cursor-pointer">+ ADD</span>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-8">No exercises found</p>}
          </div>
        </div>
      )}

      {tab === 'presets' && (
        <div className="space-y-2">
          {programs.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-[#1a1a2e] border border-zinc-800">
              <h3 className="text-white text-sm font-bold font-mono">{p.name}</h3>
              <p className="text-zinc-500 text-[10px] font-mono mt-1">{p.difficulty} · {p.sessions_per_week}x/week</p>
              <button onClick={() => navigate('/train/session')}
                className="mt-2 px-4 py-1.5 rounded-lg bg-[#e94560] text-white font-mono text-[9px] font-bold hover:opacity-90 cursor-pointer">START</button>
            </div>
          ))}
          {programs.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-8">No programs loaded</p>}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-1">
          {sessions.map((s: any) => (
            <div key={s.id} className="p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800">
              <p className="text-white text-xs font-mono">{s.name || 'Workout'}</p>
              <p className="text-zinc-600 text-[9px] font-mono mt-1">{new Date(s.created_at || s.date).toLocaleDateString()}</p>
            </div>
          ))}
          {sessions.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-8">No workout history</p>}
        </div>
      )}
    </div>
  );
}
