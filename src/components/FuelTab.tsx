import React, { useState, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { CupSoda, Droplet, Utensils, Plus, X, Apple } from 'lucide-react';
import type { Meal, NutritionLog } from './types';
import DietPlanView from './DietPlanView';

export interface FuelTabProps {
  isLight: boolean;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
  mealPlanType: 'shred' | 'bulk' | 'maintain';
  setMealPlanType: (t: 'shred' | 'bulk' | 'maintain') => void;
  waterCups: boolean[];
  fillWaterCup: (index: number) => void;
  MOCK_MEAL_PLANS: Record<'shred' | 'bulk' | 'maintain', Meal[]>;
}

function FuelTab({
  isLight,
  soundSafe,
  mealPlanType,
  setMealPlanType,
  waterCups,
  fillWaterCup,
  MOCK_MEAL_PLANS,
}: FuelTabProps) {
  const [fuelView, setFuelView] = useState<'meals' | 'diets'>('meals');
  const [todayLogs, setTodayLogs] = useState<NutritionLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  const todayTotals = todayLogs.reduce(
    (acc, m) => ({ cal: acc.cal + m.calories, pro: acc.pro + m.protein, carb: acc.carb + m.carbs, fat: acc.fat + m.fat }),
    { cal: 0, pro: 0, carb: 0, fat: 0 },
  );

  const dailyTargets = {
    cal: mealPlanType === 'bulk' ? 3200 : mealPlanType === 'shred' ? 1800 : 2400,
    pro: mealPlanType === 'bulk' ? 180 : mealPlanType === 'shred' ? 150 : 130,
    carb: mealPlanType === 'bulk' ? 320 : mealPlanType === 'shred' ? 90 : 200,
    fat: mealPlanType === 'bulk' ? 80 : mealPlanType === 'shred' ? 55 : 65,
  };

  const addMeal = () => {
    if (!mealName.trim() || calories <= 0) return;
    setTodayLogs(prev => [...prev, {
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: 'snack',
      name: mealName,
      calories,
      protein,
      carbs,
      fat,
    }]);
    setMealName('');
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
    setShowForm(false);
  };

  return (
    <motion.div key="tab-evolve" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2" style={{ willChange: 'transform, opacity' }}>
      
      <div className={`text-center py-2 flex justify-between items-center pb-4 ${isLight ? 'border-b border-stone-200' : 'border-b border-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="font-kanji font-black text-amber-500 text-3xl">异</span>
          <h2 className={`text-xl font-bold tracking-widest ${isLight ? 'text-stone-800' : 'text-white'}`}>WARRIOR'S FUEL</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-400 font-mono">NUTRITION</span>
      </div>

      <div className={`flex p-0.5 rounded-lg ${isLight ? 'bg-stone-200' : 'bg-void border border-white/5'}`}>
        <motion.button
          onClick={() => { soundSafe('tap'); setFuelView('meals'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${fuelView === 'meals' ? (isLight ? 'bg-white text-amber-600 shadow-sm' : 'bg-kachi text-amber-400') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
        >
          MEAL PLANS
        </motion.button>
        <motion.button
          onClick={() => { soundSafe('tap'); setFuelView('diets'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${fuelView === 'diets' ? (isLight ? 'bg-white text-rose-600 shadow-sm' : 'bg-kachi text-rose-400') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
        >
          DIET PROGRAMS
        </motion.button>
      </div>

      {fuelView === 'meals' && (
      <div className={`pt-4 border-t space-y-4 ${isLight ? 'border-stone-200' : 'border-white/5'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Utensils className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-[#F2C94C]'}`} />
            <h3 className={`text-xs font-mono uppercase tracking-widest ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>WARRIOR'S FUEL</h3>
          </div>
          <select value={mealPlanType} onChange={e => { soundSafe('tap'); setMealPlanType(e.target.value as 'shred' | 'bulk' | 'maintain'); }}
            className={`text-xs font-mono rounded px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isLight ? 'bg-white border border-stone-300 text-stone-700' : 'bg-void border border-white/10 text-zinc-300'}`}>
            <option value="shred">SHRED (Low Cal)</option>
            <option value="bulk">BULK (High Pro)</option>
            <option value="maintain">MAINTAIN</option>
          </select>
        </div>

        {/* Macro Rings */}
        <div className={`grid grid-cols-3 gap-3 rounded-xl p-4 ${isLight ? 'backdrop-blur-xl bg-white/60 border border-stone-200' : 'backdrop-blur-xl bg-black/20 border border-white/10'}`}>
          {[
            { key: 'protein', color: 'stroke-rose-500', label: 'PROTEIN', textColor: 'text-rose-400', fill: mealPlanType === 'bulk' ? 0.9 : mealPlanType === 'shred' ? 0.8 : 0.65, val: mealPlanType === 'bulk' ? '180g' : '150g' },
            { key: 'carbs', color: 'stroke-[#F2C94C]', label: 'CARBS', textColor: 'text-yellow-400', fill: mealPlanType === 'bulk' ? 0.95 : mealPlanType === 'shred' ? 0.25 : 0.5, val: mealPlanType === 'bulk' ? '320g' : '90g' },
            { key: 'fat', color: 'stroke-[#2D9C6E]', label: 'LIPID', textColor: 'text-emerald-400', fill: mealPlanType === 'bulk' ? 0.7 : mealPlanType === 'shred' ? 0.45 : 0.6, val: mealPlanType === 'bulk' ? '80g' : '55g' },
          ].map(m => (
            <div key={m.key} className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" className={`fill-none ${isLight ? 'stroke-stone-200' : 'stroke-void'}`} strokeWidth="4" />
                  <circle cx="32" cy="32" r="26" className={`${m.color} fill-none transition-all duration-1000`} strokeWidth="4" strokeDasharray={163.3} strokeDashoffset={163.3 * (1 - m.fill)} />
                </svg>
                <div className="text-center">
                  <span className={`text-xs font-bold font-mono ${isLight ? 'text-stone-800' : 'text-white'}`}>{m.val}</span>
                  <p className={`text-[8px] font-mono ${m.textColor}`}>{m.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WATER TRACKER */}
        <div className={`border rounded-xl p-4 space-y-3 ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className={`text-xs font-mono ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>HYDRO-LEDGER</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{waterCups.filter(c => c).length} / 8 GLASSES</span>
          </div>

          <p className={`text-[10px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>HYDRATION PREVENTS CORE MUSCLE FAILURES.</p>
          
          <div className="grid grid-cols-8 gap-2">
            {waterCups.map((filled, idx) => (
              <motion.button key={idx} onClick={() => fillWaterCup(idx)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`aspect-square rounded border transition-colors flex items-center justify-center relative overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${filled ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]' : isLight ? 'bg-stone-100 border-stone-300 hover:border-cyan-400/30' : 'bg-void border-zinc-700 hover:border-cyan-500/30'}`}>
                {filled && <div className="absolute inset-0 bg-cyan-400 opacity-20 animate-pulse" />}
                <CupSoda className={`w-4 h-4 ${filled ? 'text-cyan-400 animate-bounce' : isLight ? 'text-stone-400' : 'text-zinc-600'}`} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Meal Card List */}
        <div className="space-y-2">
          <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>SUGGESTED COMBAT RECIPES FOR TODAY:</span>
          {MOCK_MEAL_PLANS[mealPlanType].map(meal => (
            <div key={meal.id} className={`rounded-xl p-3 flex items-center justify-between border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meal.image}</span>
                <div>
                  <p className={`text-xs font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>{meal.name}</p>
                  <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-amber-500">{meal.calories} kcal</span>
            </div>
          ))}
        </div>

      </div>
      )}

      {/* Nutrition Logging */}
      {fuelView === 'meals' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl p-4 border mt-4 ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`} style={{ willChange: 'transform, opacity' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Apple className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              <h3 className={`text-xs font-mono font-bold ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>YOUR NUTRITION LOG</h3>
            </div>
            <motion.button onClick={() => { soundSafe('tap'); setShowForm(!showForm); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'}`}>
              {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showForm ? 'CLOSE' : 'LOG MEAL'}
            </motion.button>
          </div>

          {/* Daily Macro Progress */}
          <div className="space-y-2 mb-3">
            {[
              { label: 'CALORIES', key: 'cal', current: todayTotals.cal, target: dailyTargets.cal, unit: 'kcal', color: 'bg-amber-500' },
              { label: 'PROTEIN', key: 'pro', current: todayTotals.pro, target: dailyTargets.pro, unit: 'g', color: 'bg-rose-500' },
              { label: 'CARBS', key: 'carb', current: todayTotals.carb, target: dailyTargets.carb, unit: 'g', color: 'bg-yellow-500' },
              { label: 'FAT', key: 'fat', current: todayTotals.fat, target: dailyTargets.fat, unit: 'g', color: 'bg-emerald-500' },
            ].map(m => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.key} className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono w-14 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>{m.label}</span>
                  <div className={`flex-1 h-2 rounded-full ${isLight ? 'bg-stone-200' : 'bg-void'}`}>
                    <div className={`h-full rounded-full transition-all ${m.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-[9px] font-mono w-20 text-right ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                    {m.current}{m.unit} / {m.target}{m.unit}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Log Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`rounded-lg p-3 mb-3 space-y-2 border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-800/50 border-white/5'}`} style={{ willChange: 'transform, opacity' }}>
              <input value={mealName} onChange={e => setMealName(e.target.value)} placeholder="Meal name (e.g. Chicken & Rice)"
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono outline-none border focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isLight ? 'bg-white border-stone-300 text-stone-700 placeholder:text-stone-400' : 'bg-void border-zinc-700 text-zinc-300 placeholder:text-zinc-600'}`} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'CAL', value: calories, set: setCalories },
                  { label: 'PRO(g)', value: protein, set: setProtein },
                  { label: 'CARB(g)', value: carbs, set: setCarbs },
                  { label: 'FAT(g)', value: fat, set: setFat },
                ].map(f => (
                  <div key={f.label}>
                    <span className={`text-[8px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{f.label}</span>
                    <input type="number" value={f.value || ''} onChange={e => f.set(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-full px-2 py-1 rounded text-xs font-mono outline-none border focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isLight ? 'bg-white border-stone-300 text-stone-700' : 'bg-void border-zinc-700 text-zinc-300'}`} />
                  </div>
                ))}
              </div>
              <motion.button onClick={addMeal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`w-full py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'}`}>
                ADD MEAL
              </motion.button>
            </motion.div>
          )}

          {/* Logged Meals Today */}
          {todayLogs.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {todayLogs.map((m, i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-mono ${isLight ? 'bg-stone-100' : 'bg-zinc-800/50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">{m.name}</span>
                    <span className={isLight ? 'text-stone-400' : 'text-zinc-500'}>{m.time}</span>
                  </div>
                  <span className={isLight ? 'text-stone-500' : 'text-zinc-400'}>
                    {m.calories}cal • P{m.protein} • C{m.carbs} • F{m.fat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {fuelView === 'diets' && <DietPlanView isLight={isLight} />}

    </motion.div>
  );
}

export default memo(FuelTab);
