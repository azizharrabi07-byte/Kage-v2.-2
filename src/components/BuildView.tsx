import { useState } from 'react';
import { Plus, Trash2, Play } from 'lucide-react';
import type { UserProgram } from '../types';

interface BuildViewProps {
  isLight: boolean;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
  saveUserProgram: (prog: UserProgram) => void;
}

const COMMON_EXERCISES = [
  'Push-Ups', 'Squats', 'Pull-Ups', 'Dips', 'Plank', 'Lunges',
  'Bench Press', 'Deadlifts', 'Overhead Press', 'Barbell Row',
  'Bicep Curls', 'Tricep Extensions', 'Lateral Raises', 'Face Pulls',
  'Leg Press', 'Hamstring Curls', 'Calf Raises', 'Crunches',
];

export default function BuildView({ isLight, soundSafe, saveUserProgram }: BuildViewProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [goal, setGoal] = useState('strength');
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: number }[]>([]);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState(3);
  const [exReps, setExReps] = useState(10);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addExercise = () => {
    const trimmed = exName.trim();
    if (!trimmed) return;
    setExercises(prev => [...prev, { name: trimmed, sets: exSets, reps: exReps }]);
    setExName('');
    setShowSuggestions(false);
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleForge = () => {
    if (!name.trim() || exercises.length === 0) return;
    const prog: UserProgram = {
      id: `up_${Date.now()}`,
      name: name.trim().toUpperCase(),
      description: description.trim() || `Custom ${goal} program`,
      difficulty,
      goal,
      exercises: [...exercises],
      equipmentNeeded: exercises.some(e =>
        ['Bench Press', 'Deadlifts', 'Overhead Press', 'Barbell Row', 'Bicep Curls', 'Tricep Extensions', 'Lateral Raises', 'Face Pulls', 'Leg Press', 'Hamstring Curls', 'Calf Raises'].includes(e.name)
      ),
      createdAt: Date.now(),
    };
    saveUserProgram(prog);
    soundSafe('clash');
    setName('');
    setDescription('');
    setExercises([]);
  };

  const filteredSuggestions = COMMON_EXERCISES.filter(
    e => e.toLowerCase().includes(exName.toLowerCase()) && !exercises.some(ex => ex.name === e)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>CUSTOM PROGRAM BUILDER</p>
        <span className={`text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>FORGE YOUR PATH</span>
      </div>

      <div className={`rounded-xl p-5 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
        <div className="space-y-4">
          <div>
            <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>PROGRAM NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="e.g. MY LEGENDARY ROUTINE" className={`w-full rounded-lg px-3 py-2 text-xs font-mono outline-none border transition-all ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800 placeholder-stone-400 focus:border-rose-400' : 'bg-void border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-rose-500'}`} />
          </div>
          <div>
            <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>DESCRIPTION</label>
            <input value={description} onChange={e => setDescription(e.target.value)} type="text" placeholder="e.g. My custom push/pull split" className={`w-full rounded-lg px-3 py-2 text-xs font-mono outline-none border transition-all ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800 placeholder-stone-400 focus:border-rose-400' : 'bg-void border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-rose-500'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>GOAL</label>
              <select value={goal} onChange={e => setGoal(e.target.value)} className={`w-full rounded-lg px-3 py-2 text-xs font-mono outline-none border transition-all ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-void border-zinc-700 text-zinc-200'}`}>
                <option value="strength">STRENGTH</option>
                <option value="hypertrophy">HYPERTROPHY</option>
                <option value="endurance">ENDURANCE</option>
                <option value="fatloss">FAT LOSS</option>
              </select>
            </div>
            <div>
              <label className={`text-[10px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>DIFFICULTY</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setDifficulty(n)}
                    className={`flex-1 py-2 rounded text-xs font-mono transition-all ${difficulty >= n ? 'bg-rose-500 text-white' : isLight ? 'bg-stone-100 text-stone-400' : 'bg-void text-zinc-600'}`}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          <div className={`border-t pt-4 ${isLight ? 'border-stone-200' : 'border-white/5'}`}>
            <label className={`text-[10px] font-mono uppercase block mb-2 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>EXERCISES</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input value={exName} onChange={e => { setExName(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={e => { if (e.key === 'Enter') addExercise(); }}
                  type="text" placeholder="Add exercise..." className={`w-full rounded-lg px-3 py-2 text-xs font-mono outline-none border transition-all ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800 placeholder-stone-400 focus:border-rose-400' : 'bg-void border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-rose-500'}`} />
                {showSuggestions && exName && filteredSuggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl z-10 max-h-32 overflow-y-auto ${isLight ? 'bg-white border-stone-200' : 'bg-void border-zinc-700'}`}>
                    {filteredSuggestions.slice(0, 6).map(s => (
                      <button key={s} onClick={() => { setExName(s); setShowSuggestions(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-rose-500/10 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
              <select value={exSets} onChange={e => setExSets(Number(e.target.value))} className={`w-16 rounded-lg px-2 py-2 text-xs font-mono outline-none border ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-void border-zinc-700 text-zinc-200'}`}>
                {[1,2,3,4,5,6,8].map(n => <option key={n}>{n}</option>)}
              </select>
              <select value={exReps} onChange={e => setExReps(Number(e.target.value))} className={`w-16 rounded-lg px-2 py-2 text-xs font-mono outline-none border ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800' : 'bg-void border-zinc-700 text-zinc-200'}`}>
                {[5,6,8,10,12,15,20,25,30].map(n => <option key={n}>{n}</option>)}
              </select>
              <button onClick={addExercise} className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {exercises.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {exercises.map((ex, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono ${isLight ? 'bg-stone-100' : 'bg-void/50'}`}>
                    <span className={isLight ? 'text-stone-700' : 'text-zinc-300'}>{i + 1}. {ex.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={isLight ? 'text-stone-400' : 'text-zinc-500'}>{ex.sets} × {ex.reps}</span>
                      <button onClick={() => removeExercise(i)} className="text-rose-500 hover:text-rose-400 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleForge} disabled={!name.trim() || exercises.length === 0}
            className={`w-full py-3 rounded-xl font-bold font-mono text-xs tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isLight ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-md disabled:opacity-30' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_4px_20px_rgba(227,30,36,0.3)] disabled:opacity-30'}`}>
            <Plus className="w-3.5 h-3.5" />
            FORGE PROGRAM ({exercises.length} EXERCISES)
          </button>
        </div>
      </div>
    </div>
  );
}
