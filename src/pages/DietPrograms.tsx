import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

interface DietProgram {
  id: string;
  name: string;
  category: string;
  goal: string;
  difficulty: string;
  description: string;
  typical_macros: Record<string, string>;
  pros: string[];
  cons: string[];
  best_for: string;
}

export default function DietPrograms() {
  const [programs, setPrograms] = useState<DietProgram[]>([]);
  const [selected, setSelected] = useState<DietProgram | null>(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const url = category ? `/api/diet-programs?category=${category}` : '/api/diet-programs';
      const r = await apiClient.get(url);
      setPrograms(r.data ?? []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchPrograms(); }, [category]);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-lg font-bold font-mono">DIET PLANS</h1>
        {selected && (
          <button onClick={() => setSelected(null)} className="text-zinc-500 text-[10px] font-mono hover:text-zinc-300 cursor-pointer">BACK</button>
        )}
      </div>

      {!selected && (
        <>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {['', 'fat-loss', 'muscle-gain', 'keto', 'plant-based', 'mediterranean'].map((c) => (
              <button key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  category === c ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}>
                {c || 'ALL'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {programs.map((p) => (
              <div key={p.id} onClick={() => setSelected(p)}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-rose-500/30 transition-colors cursor-pointer">
                <h3 className="text-white text-sm font-bold font-mono">{p.name}</h3>
                <p className="text-zinc-400 text-[10px] font-mono mt-1">{p.goal}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 text-[8px] font-mono">{p.difficulty}</span>
              </div>
            ))}
            {programs.length === 0 && !loading && (
              <p className="text-zinc-600 text-xs font-mono text-center py-8">Run migration 010 + seed_diets.ts</p>
            )}
          </div>
        </>
      )}

      {selected && (
        <div className="space-y-4">
          <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
            <h2 className="text-white text-lg font-bold font-mono">{selected.name}</h2>
            <p className="text-zinc-500 text-[10px] font-mono mt-1">{selected.category} · {selected.difficulty}</p>
            <p className="text-zinc-300 text-xs font-mono mt-3 leading-relaxed">{selected.description}</p>
            {selected.goal && <p className="text-amber-400 text-[10px] font-mono mt-2 font-bold">🎯 {selected.goal}</p>}
          </div>

          {selected.typical_macros && Object.keys(selected.typical_macros).length > 0 && (
            <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
              <h3 className="text-zinc-400 text-[10px] font-mono font-bold mb-2">TYPICAL MACROS</h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                {Object.entries(selected.typical_macros).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-zinc-600">{k}: </span>
                    <span className="text-white">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected.pros?.length > 0 && (
            <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
              <h3 className="text-emerald-400 text-[10px] font-mono font-bold mb-2">PROS</h3>
              <ul className="space-y-1">
                {selected.pros.map((pro, i) => (
                  <li key={i} className="text-zinc-300 text-[10px] font-mono flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">+</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected.cons?.length > 0 && (
            <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
              <h3 className="text-rose-400 text-[10px] font-mono font-bold mb-2">CONS</h3>
              <ul className="space-y-1">
                {selected.cons.map((con, i) => (
                  <li key={i} className="text-zinc-300 text-[10px] font-mono flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">−</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected.best_for && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <p className="text-amber-400 text-[10px] font-mono">BEST FOR: {selected.best_for}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
