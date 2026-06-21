import { useState, useEffect, type FormEvent } from 'react';
import { get, post } from '../services/api';

export default function NutritionPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [food, setFood] = useState('');
  const [cal, setCal] = useState('');
  const [pro, setPro] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    try {
      const l = await get(`/api/nutrition-logs?log_date=${date}`);
      setLogs(l ?? []);
      const s = await get(`/api/nutrition-logs/summary?date=${date}`);
      setSummary(s);
    } catch {}
  };

  useEffect(() => { load(); }, [date]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!food) return;
    try {
      await post('/api/nutrition-logs', { food_name: food, calories: parseInt(cal) || 0, protein_g: parseFloat(pro) || 0, carbs_g: parseFloat(carbs) || 0, fats_g: parseFloat(fat) || 0 });
      setFood(''); setCal(''); setPro(''); setCarbs(''); setFat('');
      load();
    } catch {}
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">NUTRITION</h1>

      <input value={date} onChange={(e) => setDate(e.target.value)} type="date"
        className="w-full px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-800 text-white text-xs font-mono" />

      {summary && (
        <div className="rounded-xl bg-[#1a1a2e] border border-zinc-800 p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-white text-lg font-bold font-mono">{summary.total_calories}</p><p className="text-zinc-600 text-[8px] font-mono">CAL</p></div>
            <div><p className="text-emerald-400 text-lg font-bold font-mono">{summary.total_protein?.toFixed(1)}g</p><p className="text-zinc-600 text-[8px] font-mono">PROTEIN</p></div>
            <div><p className="text-amber-400 text-lg font-bold font-mono">{summary.total_carbs?.toFixed(1)}g</p><p className="text-zinc-600 text-[8px] font-mono">CARBS</p></div>
            <div><p className="text-rose-400 text-lg font-bold font-mono">{summary.total_fat?.toFixed(1)}g</p><p className="text-zinc-600 text-[8px] font-mono">FAT</p></div>
          </div>
        </div>
      )}

      <form onSubmit={handleAdd} className="rounded-xl bg-[#1a1a2e] border border-zinc-800 p-4 space-y-2">
        <input value={food} onChange={(e) => setFood(e.target.value)} placeholder="Food name"
          className="w-full px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-700 text-white text-xs font-mono" />
        <div className="grid grid-cols-2 gap-2">
          <input value={cal} onChange={(e) => setCal(e.target.value)} placeholder="Calories" type="number" className="px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-700 text-white text-xs font-mono" />
          <input value={pro} onChange={(e) => setPro(e.target.value)} placeholder="Protein (g)" type="number" className="px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-700 text-white text-xs font-mono" />
          <input value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs (g)" type="number" className="px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-700 text-white text-xs font-mono" />
          <input value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat (g)" type="number" className="px-3 py-2 rounded-lg bg-[#1a1a2e] border border-zinc-700 text-white text-xs font-mono" />
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-[#e94560] text-white font-mono text-xs font-bold hover:opacity-90 cursor-pointer">LOG MEAL</button>
      </form>

      <div className="space-y-1">
        {logs.map((m: any) => (
          <div key={m.id} className="flex justify-between p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800">
            <div><p className="text-white text-xs font-mono">{m.food_name}</p><p className="text-zinc-600 text-[9px] font-mono">P:{m.protein_g} C:{m.carbs_g} F:{m.fats_g}</p></div>
            <span className="text-[#ffd700] text-xs font-mono font-bold">{m.calories}</span>
          </div>
        ))}
        {logs.length === 0 && <p className="text-zinc-600 text-xs font-mono text-center py-4">No meals logged</p>}
      </div>
    </div>
  );
}
