import { useState, useEffect, type FormEvent } from 'react';
import apiClient from '../services/apiClient';

interface Meal {
  id: string;
  log_date: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}

interface Summary {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meals: Meal[];
}

export default function NutritionLog() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealType, setMealType] = useState('snack');
  const [loading, setLoading] = useState(false);

  const fetchToday = async () => {
    try {
      const [mealsRes, summaryRes] = await Promise.all([
        apiClient.get('/api/nutrition-logs'),
        apiClient.get('/api/nutrition-logs/summary'),
      ]);
      setMeals(mealsRes.data ?? []);
      setSummary(summaryRes.data);
    } catch {}
  };

  useEffect(() => { fetchToday(); }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!foodName) return;
    setLoading(true);
    try {
      await apiClient.post('/api/nutrition-logs', {
        food_name: foodName,
        calories: parseInt(calories) || 0,
        protein_g: parseFloat(protein) || 0,
        carbs_g: parseFloat(carbs) || 0,
        fats_g: parseFloat(fats) || 0,
        meal_type: mealType,
      });
      setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
      fetchToday();
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-white text-lg font-bold font-mono">NUTRITION</h1>

      {summary && (
        <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
          <p className="text-zinc-500 text-[10px] font-mono mb-2">DAILY SUMMARY — {summary.date}</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-white text-lg font-bold font-mono">{summary.total_calories}</p><p className="text-zinc-600 text-[8px] font-mono">CAL</p></div>
            <div><p className="text-emerald-400 text-lg font-bold font-mono">{summary.total_protein.toFixed(1)}g</p><p className="text-zinc-600 text-[8px] font-mono">PROTEIN</p></div>
            <div><p className="text-amber-400 text-lg font-bold font-mono">{summary.total_carbs.toFixed(1)}g</p><p className="text-zinc-600 text-[8px] font-mono">CARBS</p></div>
            <div><p className="text-rose-400 text-lg font-bold font-mono">{summary.total_fat.toFixed(1)}g</p><p className="text-zinc-600 text-[8px] font-mono">FAT</p></div>
          </div>
        </div>
      )}

      <form onSubmit={handleAdd} className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-2">
        <input value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food name" className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
        <div className="grid grid-cols-2 gap-2">
          <input value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" type="number" className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono">
            <option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option>
          </select>
          <input value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Protein (g)" type="number" className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
          <input value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs (g)" type="number" className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
          <input value={fats} onChange={(e) => setFats(e.target.value)} placeholder="Fat (g)" type="number" className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
        </div>
        <button type="submit" disabled={loading || !foodName} className="w-full py-2 rounded-lg bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-500 disabled:opacity-50 cursor-pointer">LOG MEAL</button>
      </form>

      <div className="space-y-1">
        {meals.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <div>
              <p className="text-white text-xs font-mono">{m.food_name}</p>
              <p className="text-zinc-600 text-[9px] font-mono">{m.meal_type} — P:{m.protein_g} C:{m.carbs_g} F:{m.fats_g}</p>
            </div>
            <span className="text-amber-400 text-xs font-mono font-bold">{m.calories}</span>
          </div>
        ))}
        {meals.length === 0 && <p className="text-zinc-600 text-[10px] font-mono text-center py-4">No meals logged today</p>}
      </div>
    </div>
  );
}
