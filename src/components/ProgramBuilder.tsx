import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronLeft, ChevronRight, Check, Dumbbell, ArrowUp, ArrowDown, Plus, Save, Play, Hammer } from 'lucide-react';
import { exercises } from '../data/exercises';
import type { Exercise } from '../types/exercise';
import { filterExercisesByEquipment, filterExercisesByGoal, calculateTotalVolume, estimateDuration, generateProgramId } from '../utils/programBuilderUtils';
import type { CustomProgram, CustomProgramDay } from '../utils/programBuilderUtils';

interface ProgramBuilderProps {
  isLight: boolean;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
  onStartTraining: (program: any) => void;
}

const GOALS = [
  { value: 'strength', label: 'Strength', kanji: '力' },
  { value: 'hypertrophy', label: 'Hypertrophy', kanji: '大' },
  { value: 'endurance', label: 'Endurance', kanji: '耐' },
  { value: 'power', label: 'Power', kanji: '爆' },
  { value: 'general fitness', label: 'General Fitness', kanji: '全' },
  { value: 'weight loss', label: 'Weight Loss', kanji: '減' },
];

const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbells', 'Kettlebells', 'Cables', 'Machines', 'Bodyweight', 'Bands',
];

const DURATIONS = [30, 45, 60, 90];
const WEEK_OPTIONS = [4, 8, 12];
const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

const EXP_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function ProgramBuilder({ isLight, soundSafe, onStartTraining }: ProgramBuilderProps) {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [programName, setProgramName] = useState('');
  const [goal, setGoal] = useState('strength');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [sessionDuration, setSessionDuration] = useState(45);
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [equipment, setEquipment] = useState<string[]>(['Barbell', 'Dumbbells', 'Bodyweight']);
  const [weeks, setWeeks] = useState(8);

  // Step 2 state
  const [days, setDays] = useState<CustomProgramDay[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayForAdd, setSelectedDayForAdd] = useState(0);

  // Step 3 / saved state
  const [savedProgramId, setSavedProgramId] = useState<string | null>(null);

  // Initialize days when daysPerWeek changes
  useEffect(() => {
    setDays(prev => {
      const newDays: CustomProgramDay[] = [];
      for (let i = 0; i < daysPerWeek; i++) {
        const existing = prev.find(d => d.day === i + 1);
        newDays.push(existing || { day: i + 1, exercises: [] });
      }
      return newDays;
    });
    if (activeDay >= daysPerWeek) setActiveDay(0);
  }, [daysPerWeek]);

  // Filtered exercises based on goal + equipment
  const filteredExercises = useMemo(() => {
    let result = exercises;
    result = filterExercisesByGoal(result, goal);
    result = filterExercisesByEquipment(result, equipment);
    return result;
  }, [goal, equipment]);

  const searchedExercises = useMemo(() => {
    if (!searchQuery.trim()) return filteredExercises;
    const q = searchQuery.toLowerCase();
    return filteredExercises.filter(ex =>
      ex.name.toLowerCase().includes(q) ||
      ex.muscleGroup.toLowerCase().includes(q) ||
      ex.kanji.includes(q) ||
      ex.equipment.toLowerCase().includes(q)
    );
  }, [filteredExercises, searchQuery]);

  const toggleEquipment = useCallback((eq: string) => {
    setEquipment(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  }, []);

  const addExerciseToDay = useCallback((exercise: Exercise) => {
    soundSafe('tap');
    setDays(prev => prev.map(d => {
      if (d.day === selectedDayForAdd) {
        // Check if exercise already exists in this day
        if (d.exercises.some(e => e.exerciseId === exercise.id)) return d;
        return {
          ...d,
          exercises: [
            ...d.exercises,
            {
              exerciseId: exercise.id,
              name: exercise.name,
              muscleGroup: exercise.muscleGroup,
              sets: exercise.defaultSets,
              reps: exercise.defaultReps,
              restSeconds: exercise.restSeconds,
            },
          ],
        };
      }
      return d;
    }));
  }, [selectedDayForAdd, soundSafe]);

  const removeExerciseFromDay = useCallback((dayNum: number, exIndex: number) => {
    soundSafe('tap');
    setDays(prev => prev.map(d => {
      if (d.day === dayNum) {
        return {
          ...d,
          exercises: d.exercises.filter((_, i) => i !== exIndex),
        };
      }
      return d;
    }));
  }, [soundSafe]);

  const moveExercise = useCallback((dayNum: number, fromIndex: number, direction: 'up' | 'down') => {
    setDays(prev => prev.map(d => {
      if (d.day !== dayNum) return d;
      const exercises = [...d.exercises];
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= exercises.length) return d;
      [exercises[fromIndex], exercises[toIndex]] = [exercises[toIndex], exercises[fromIndex]];
      return { ...d, exercises };
    }));
  }, []);

  const updateExerciseSets = useCallback((dayNum: number, exIndex: number, sets: number) => {
    setDays(prev => prev.map(d => {
      if (d.day !== dayNum) return d;
      const exercises = d.exercises.map((ex, i) =>
        i === exIndex ? { ...ex, sets } : ex
      );
      return { ...d, exercises };
    }));
  }, []);

  const updateExerciseReps = useCallback((dayNum: number, exIndex: number, reps: string) => {
    setDays(prev => prev.map(d => {
      if (d.day !== dayNum) return d;
      const exercises = d.exercises.map((ex, i) =>
        i === exIndex ? { ...ex, reps } : ex
      );
      return { ...d, exercises };
    }));
  }, []);

  const handleSaveProgram = () => {
    const program: CustomProgram = {
      id: generateProgramId(),
      name: programName.trim().toUpperCase(),
      goal,
      daysPerWeek,
      sessionDuration,
      experienceLevel,
      equipment,
      weeks,
      createdAt: Date.now(),
      days,
    };

    // Save to localStorage under kage_custom_programs
    try {
      const existing = JSON.parse(localStorage.getItem('kage_custom_programs') || '[]');
      existing.push(program);
      localStorage.setItem('kage_custom_programs', JSON.stringify(existing));
    } catch {
      localStorage.setItem('kage_custom_programs', JSON.stringify([program]));
    }

    // Also save to kage_user_programs for TrainTab compatibility
    const userProgram = {
      id: program.id,
      name: program.name,
      description: `${goal} • ${daysPerWeek} days/wk • ${weeks} weeks`,
      difficulty: experienceLevel === 'beginner' ? 2 : experienceLevel === 'intermediate' ? 3 : 5,
      goal,
      exercises: days.flatMap(d => d.exercises.map(e => ({
        name: e.name,
        sets: e.sets,
        reps: typeof e.reps === 'string' ? parseInt(e.reps) || 10 : e.reps,
      }))),
      equipmentNeeded: equipment.length > 0 && !equipment.includes('Bodyweight'),
      createdAt: Date.now(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('kage_user_programs') || '[]');
      existing.push(userProgram);
      localStorage.setItem('kage_user_programs', JSON.stringify(existing));
    } catch {
      localStorage.setItem('kage_user_programs', JSON.stringify([userProgram]));
    }

    setSavedProgramId(program.id);
    soundSafe('clash');
  };

  const handleStartTraining = () => {
    const totalExercises = days.flatMap(d => d.exercises);
    const moves = totalExercises.map(e => ({
      name: e.name,
      image: '',
      sets: e.sets,
      reps: parseInt(e.reps) || 10,
    }));

    onStartTraining({
      id: savedProgramId || `cp_${Date.now()}`,
      nameKanji: '造',
      nameEnglish: programName.trim().toUpperCase(),
      difficulty: experienceLevel === 'beginner' ? 2 : experienceLevel === 'intermediate' ? 3 : 5,
      duration: `${sessionDuration} min`,
      workoutCount: totalExercises.length,
      equipmentNeeded: equipment.length > 0 && !equipment.includes('Bodyweight'),
      description: `${goal.charAt(0).toUpperCase() + goal.slice(1)} • ${daysPerWeek} days/wk • ${weeks} weeks`,
      moves,
    });
  };

  const totalExercisesCount = days.reduce((sum, d) => sum + d.exercises.length, 0);
  const totalVolume = useMemo(() => {
    let vols = 0;
    for (const day of days) {
      for (const ex of day.exercises) {
        const repNum = parseInt(ex.reps.match(/(\d+)/)?.[1] || '10');
        vols += ex.sets * repNum;
      }
    }
    return vols;
  }, [days]);

  const canProceedToStep2 = programName.trim().length > 0;
  const canProceedToStep3 = totalExercisesCount > 0;

  // Shared style helpers
  const inputClass = `w-full rounded-lg px-3 py-2.5 text-xs font-mono outline-none border transition-all ${isLight ? 'bg-stone-100 border-stone-300 text-stone-800 placeholder-stone-400 focus:border-rose-400' : 'bg-void border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-rose-500'}`;
  const cardClass = `rounded-xl border p-4 transition-colors ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`;
  const labelClass = `text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`;
  const btnPrimary = `px-4 py-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-mono font-bold tracking-wider transition-all active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`;

  return (
    <motion.div
      key="program-builder"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <div className={`text-center py-3 ${isLight ? 'border-b border-stone-200' : 'border-b border-white/5'}`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Hammer className={`w-4 h-4 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />
          <h1 className={`text-sm font-mono font-bold tracking-widest ${isLight ? 'text-stone-800' : 'text-white'}`}>PROGRAM BUILDER</h1>
          <Hammer className={`w-4 h-4 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />
        </div>
        <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>造 — Forge Your Custom Training Path</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => { if (s < step || (s === 2 && canProceedToStep2) || (s === 3 && canProceedToStep3)) { soundSafe('tap'); setStep(s); } }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                step === s
                  ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(227,30,36,0.4)]'
                  : step > s
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isLight ? 'bg-stone-200 text-stone-400' : 'bg-zinc-800 text-zinc-600'
              }`}
            >
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </button>
            {s < 3 && <div className={`w-8 h-[2px] rounded ${step > s ? 'bg-emerald-500/50' : isLight ? 'bg-stone-200' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      {/* Step Title */}
      <div className="text-center">
        <p className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          STEP {step} — {step === 1 ? 'PROGRAM INFO' : step === 2 ? 'EXERCISE SELECTION' : 'REVIEW & SAVE'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ==================== STEP 1: PROGRAM INFO ==================== */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className={cardClass}>
              <div className="space-y-4">
                {/* Program Name */}
                <div>
                  <label className={labelClass}>Program Name</label>
                  <input
                    type="text"
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                    placeholder="e.g. SAMURAI SHRED"
                    className={inputClass}
                  />
                </div>

                {/* Goal */}
                <div>
                  <label className={labelClass}>Training Goal</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {GOALS.map(g => (
                      <button
                        key={g.value}
                        onClick={() => { soundSafe('tap'); setGoal(g.value); }}
                        className={`px-2 py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all border cursor-pointer active:scale-95 ${
                          goal === g.value
                            ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_8px_rgba(227,30,36,0.3)]'
                            : isLight
                              ? 'bg-stone-100 text-stone-600 border-stone-200 hover:border-rose-300'
                              : 'bg-void text-zinc-400 border-zinc-700 hover:border-rose-500/50'
                        }`}
                      >
                        <span className="block text-sm mb-0.5">{g.kanji}</span>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className={labelClass}>Experience Level</label>
                  <div className="flex gap-2">
                    {EXP_LEVELS.map(el => (
                      <button
                        key={el.value}
                        onClick={() => { soundSafe('tap'); setExperienceLevel(el.value); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all border cursor-pointer active:scale-95 ${
                          experienceLevel === el.value
                            ? 'bg-rose-600 text-white border-rose-500'
                            : isLight
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-void text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {el.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Days Per Week */}
                <div>
                  <label className={labelClass}>Days Per Week</label>
                  <div className="flex gap-1.5">
                    {DAY_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => { soundSafe('tap'); setDaysPerWeek(n); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                          daysPerWeek === n
                            ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(227,30,36,0.3)]'
                            : isLight
                              ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                              : 'bg-void text-zinc-500 hover:bg-zinc-800'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Duration */}
                <div>
                  <label className={labelClass}>Session Duration</label>
                  <div className="flex gap-2">
                    {DURATIONS.map(d => (
                      <button
                        key={d}
                        onClick={() => { soundSafe('tap'); setSessionDuration(d); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all border cursor-pointer active:scale-95 ${
                          sessionDuration === d
                            ? 'bg-rose-600 text-white border-rose-500'
                            : isLight
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-void text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <label className={labelClass}>Available Equipment</label>
                  <div className="flex flex-wrap gap-1.5">
                    {EQUIPMENT_OPTIONS.map(eq => (
                      <button
                        key={eq}
                        onClick={() => toggleEquipment(eq)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all border cursor-pointer active:scale-95 ${
                          equipment.includes(eq)
                            ? 'bg-rose-600 text-white border-rose-500'
                            : isLight
                              ? 'bg-stone-100 text-stone-500 border-stone-200 hover:border-rose-300'
                              : 'bg-void text-zinc-400 border-zinc-700 hover:border-rose-500/30'
                        }`}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weeks */}
                <div>
                  <label className={labelClass}>Program Length</label>
                  <div className="flex gap-2">
                    {WEEK_OPTIONS.map(w => (
                      <button
                        key={w}
                        onClick={() => { soundSafe('tap'); setWeeks(w); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all border cursor-pointer active:scale-95 ${
                          weeks === w
                            ? 'bg-rose-600 text-white border-rose-500'
                            : isLight
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-void text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {w} Weeks
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { soundSafe('tap'); setStep(2); }}
              disabled={!canProceedToStep2}
              className={`w-full py-3 rounded-xl text-xs font-mono font-bold tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                isLight
                  ? 'bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-md'
                  : 'bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(227,30,36,0.3)]'
              }`}
            >
              NEXT: SELECT EXERCISES
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* ==================== STEP 2: EXERCISE SELECTION ==================== */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Day tabs */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {days.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => { soundSafe('tap'); setActiveDay(i); }}
                  className={`px-3 py-2 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all border whitespace-nowrap cursor-pointer active:scale-95 ${
                    activeDay === i
                      ? 'bg-rose-600 text-white border-rose-500'
                      : isLight
                        ? 'bg-stone-100 text-stone-500 border-stone-200'
                        : 'bg-void text-zinc-400 border-zinc-700'
                  }`}
                >
                  DAY {d.day}
                  {d.exercises.length > 0 && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[8px] ${activeDay === i ? 'bg-white/20' : isLight ? 'bg-stone-200' : 'bg-zinc-800'}`}>
                      {d.exercises.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Active Day Exercises */}
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-mono font-bold tracking-wider ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                  DAY {days[activeDay]?.day || 1} — EXERCISES
                </h3>
                <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  {days[activeDay]?.exercises.length || 0} exercises
                </span>
              </div>

              {(!days[activeDay] || days[activeDay].exercises.length === 0) ? (
                <div className={`py-8 text-center ${isLight ? 'text-stone-400' : 'text-zinc-600'}`}>
                  <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-mono">No exercises yet</p>
                  <p className="text-[10px] font-mono mt-1">Tap "Add Exercise" below</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
                  {days[activeDay].exercises.map((ex, idx) => (
                    <div
                      key={ex.exerciseId + idx}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                        isLight ? 'bg-stone-100 hover:bg-stone-200' : 'bg-void/50 hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveExercise(days[activeDay].day, idx, 'up')}
                          disabled={idx === 0}
                          className={`p-0.5 rounded cursor-pointer disabled:opacity-20 ${isLight ? 'hover:bg-stone-200 text-stone-400' : 'hover:bg-zinc-700 text-zinc-500'}`}
                        >
                          <ArrowUp className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => moveExercise(days[activeDay].day, idx, 'down')}
                          disabled={idx === days[activeDay].exercises.length - 1}
                          className={`p-0.5 rounded cursor-pointer disabled:opacity-20 ${isLight ? 'hover:bg-stone-200 text-stone-400' : 'hover:bg-zinc-700 text-zinc-500'}`}
                        >
                          <ArrowDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>{ex.name}</p>
                        <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{ex.muscleGroup}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          value={ex.sets}
                          min={1}
                          max={20}
                          onChange={e => updateExerciseSets(days[activeDay].day, idx, parseInt(e.target.value) || 3)}
                          className={`w-10 text-center px-1 py-1 rounded text-[10px] font-mono outline-none border ${isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                        />
                        <span className={`text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>×</span>
                        <input
                          type="text"
                          value={ex.reps}
                          onChange={e => updateExerciseReps(days[activeDay].day, idx, e.target.value)}
                          className={`w-12 text-center px-1 py-1 rounded text-[10px] font-mono outline-none border ${isLight ? 'bg-white border-stone-200 text-stone-700' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                        />
                        <button
                          onClick={() => removeExerciseFromDay(days[activeDay].day, idx)}
                          className={`p-1 rounded cursor-pointer ${isLight ? 'text-stone-400 hover:text-rose-500 hover:bg-stone-200' : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-700'}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  soundSafe('tap');
                  setSelectedDayForAdd(days[activeDay]?.day || 1);
                  setShowExercisePicker(true);
                  setSearchQuery('');
                }}
                className={`w-full mt-3 py-2.5 rounded-lg border border-dashed text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                  isLight
                    ? 'border-stone-300 text-stone-500 hover:border-rose-400 hover:text-rose-600 bg-stone-50'
                    : 'border-zinc-700 text-zinc-500 hover:border-rose-500/50 hover:text-rose-400 bg-void'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                ADD EXERCISE
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { soundSafe('tap'); setStep(1); }}
                className={`flex-1 py-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border ${
                  isLight
                    ? 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                    : 'bg-void text-zinc-400 border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                BACK
              </button>
              <button
                onClick={() => { soundSafe('tap'); setStep(3); }}
                disabled={!canProceedToStep3}
                className={`flex-[2] py-3 rounded-xl text-xs font-mono font-bold tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                  isLight
                    ? 'bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-md'
                    : 'bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(227,30,36,0.3)]'
                }`}
              >
                NEXT: REVIEW
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================== STEP 3: REVIEW & SAVE ==================== */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Summary Card */}
            <div className={cardClass}>
              <h2 className={`text-sm font-bold font-mono tracking-wider mb-3 ${isLight ? 'text-stone-800' : 'text-white'}`}>
                {programName.toUpperCase()}
              </h2>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`px-3 py-2 rounded-lg ${isLight ? 'bg-stone-100' : 'bg-void'}`}>
                  <span className={`text-[8px] font-mono uppercase tracking-wider block ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Goal</span>
                  <span className={`text-xs font-bold font-mono ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{goal.charAt(0).toUpperCase() + goal.slice(1)}</span>
                </div>
                <div className={`px-3 py-2 rounded-lg ${isLight ? 'bg-stone-100' : 'bg-void'}`}>
                  <span className={`text-[8px] font-mono uppercase tracking-wider block ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Level</span>
                  <span className={`text-xs font-bold font-mono ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}</span>
                </div>
                <div className={`px-3 py-2 rounded-lg ${isLight ? 'bg-stone-100' : 'bg-void'}`}>
                  <span className={`text-[8px] font-mono uppercase tracking-wider block ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Schedule</span>
                  <span className={`text-xs font-bold font-mono ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{daysPerWeek} days/wk × {weeks} weeks</span>
                </div>
                <div className={`px-3 py-2 rounded-lg ${isLight ? 'bg-stone-100' : 'bg-void'}`}>
                  <span className={`text-[8px] font-mono uppercase tracking-wider block ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Duration</span>
                  <span className={`text-xs font-bold font-mono ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>{sessionDuration} min/session</span>
                </div>
              </div>

              {/* Day-by-day breakdown */}
              <div className="space-y-2 mb-4">
                <p className={`text-[9px] font-mono uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>Weekly Plan</p>
                {days.map(d => (
                  <div
                    key={d.day}
                    className={`px-3 py-2 rounded-lg border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-void/50 border-zinc-800'}`}
                  >
                    <p className={`text-[10px] font-mono font-bold mb-1 ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>
                      DAY {d.day} — {d.exercises.length} exercises
                    </p>
                    {d.exercises.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {d.exercises.map((ex, i) => (
                          <span
                            key={i}
                            className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono ${
                              isLight ? 'bg-stone-200 text-stone-600' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {ex.sets}×{ex.reps} {ex.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className={`text-[9px] font-mono italic ${isLight ? 'text-stone-400' : 'text-zinc-600'}`}>Rest day</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Volume Stats */}
              <div className={`rounded-xl p-4 border ${isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-500/5 border-rose-500/20'}`}>
                <p className={`text-[9px] font-mono uppercase tracking-wider mb-2 ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>Volume Summary</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className={`text-lg font-black font-mono ${isLight ? 'text-rose-700' : 'text-rose-300'}`}>{totalExercisesCount}</p>
                    <p className={`text-[8px] font-mono uppercase ${isLight ? 'text-rose-500' : 'text-rose-500/70'}`}>Exercises</p>
                  </div>
                  <div>
                    <p className={`text-lg font-black font-mono ${isLight ? 'text-rose-700' : 'text-rose-300'}`}>{totalVolume.toLocaleString()}</p>
                    <p className={`text-[8px] font-mono uppercase ${isLight ? 'text-rose-500' : 'text-rose-500/70'}`}>Total Reps</p>
                  </div>
                  <div>
                    <p className={`text-lg font-black font-mono ${isLight ? 'text-rose-700' : 'text-rose-300'}`}>
                      {Math.round(totalVolume / daysPerWeek).toLocaleString()}
                    </p>
                    <p className={`text-[8px] font-mono uppercase ${isLight ? 'text-rose-500' : 'text-rose-500/70'}`}>Avg/Day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!savedProgramId ? (
                <button
                  onClick={handleSaveProgram}
                  className={`w-full py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                    isLight
                      ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-md'
                      : 'bg-rose-600 text-white hover:bg-rose-500 shadow-[0_4px_20px_rgba(227,30,36,0.3)]'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  SAVE PROGRAM
                </button>
              ) : (
                <div className={`rounded-xl p-4 border text-center ${isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                  <Check className={`w-6 h-6 mx-auto mb-1 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <p className={`text-sm font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>PROGRAM SAVED!</p>
                  <p className={`text-[10px] font-mono mt-1 ${isLight ? 'text-emerald-600' : 'text-emerald-400/70'}`}>
                    {totalExercisesCount} exercises • {totalVolume.toLocaleString()} total reps • {weeks} weeks
                  </p>
                </div>
              )}

              {savedProgramId && (
                <button
                  onClick={handleStartTraining}
                  className={`w-full py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                    isLight
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_4px_20px_rgba(227,30,36,0.3)]'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  START TRAINING
                </button>
              )}

              <button
                onClick={() => { soundSafe('tap'); if (savedProgramId) { setSavedProgramId(null); setStep(1); setProgramName(''); setDays([]); } else { setStep(2); } }}
                className={`w-full py-2.5 rounded-xl text-[10px] font-mono tracking-wider transition-all cursor-pointer active:scale-[0.98] ${
                  isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {savedProgramId ? 'CREATE ANOTHER PROGRAM' : '← BACK TO EXERCISE SELECTION'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== EXERCISE PICKER OVERLAY ==================== */}
      {showExercisePicker && (
        <div className={`fixed inset-0 z-50 flex flex-col ${isLight ? 'bg-stone-100/98' : 'bg-[#0A0A0F]/98'} backdrop-blur-sm`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className={`text-xs font-mono font-bold tracking-wider ${isLight ? 'text-stone-800' : 'text-white'}`}>
              ADD EXERCISE — DAY {selectedDayForAdd}
            </h3>
            <button
              onClick={() => setShowExercisePicker(false)}
              className={`p-1.5 rounded-lg cursor-pointer ${isLight ? 'hover:bg-stone-200 text-stone-500' : 'hover:bg-zinc-800 text-zinc-400'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search exercises by name, muscle group..."
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-xs font-mono outline-none border transition-all ${isLight ? 'bg-white border-stone-300 text-stone-800 placeholder-stone-400' : 'bg-void border-zinc-700 text-zinc-200 placeholder-zinc-600'}`}
                autoFocus
              />
            </div>
            <p className={`text-[9px] font-mono mt-1.5 ${isLight ? 'text-stone-400' : 'text-zinc-600'}`}>
              {searchedExercises.length} exercises available
            </p>
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-20">
            <div className="space-y-1.5">
              {searchedExercises.map((ex) => {
                const alreadyAdded = days.find(d => d.day === selectedDayForAdd)?.exercises.some(e => e.exerciseId === ex.id);
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      if (!alreadyAdded) addExerciseToDay(ex);
                    }}
                    disabled={!!alreadyAdded}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center gap-3 cursor-pointer active:scale-[0.99] ${
                      alreadyAdded
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-200 opacity-50'
                          : 'bg-emerald-500/5 border-emerald-500/20 opacity-50'
                        : isLight
                          ? 'bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50/30'
                          : 'bg-void border-zinc-800 hover:border-rose-500/30 hover:bg-rose-500/5'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono ${
                      ex.difficulty === 'beginner'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ex.difficulty === 'intermediate'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {ex.difficulty === 'beginner' ? 'B' : ex.difficulty === 'intermediate' ? 'I' : 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>{ex.name}</p>
                      <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                        {ex.muscleGroup} · {ex.equipment} · {ex.defaultSets}×{ex.defaultReps}
                      </p>
                    </div>
                    {alreadyAdded ? (
                      <Check className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    ) : (
                      <Plus className={`w-4 h-4 ${isLight ? 'text-rose-500' : 'text-rose-400'}`} />
                    )}
                  </button>
                );
              })}
              {searchedExercises.length === 0 && (
                <div className={`py-12 text-center ${isLight ? 'text-stone-400' : 'text-zinc-600'}`}>
                  <p className="text-xs font-mono">No exercises match your criteria</p>
                  <p className="text-[10px] font-mono mt-1">Try adjusting goal/equipment or search terms</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className={`fixed bottom-0 left-0 right-0 px-5 py-3 border-t ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-[#0A0A0F] border-zinc-800'}`}>
            <button
              onClick={() => setShowExercisePicker(false)}
              className="w-full py-3 rounded-xl bg-rose-600 text-white text-xs font-mono font-bold tracking-widest transition-all hover:bg-rose-500 cursor-pointer active:scale-[0.98]"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
