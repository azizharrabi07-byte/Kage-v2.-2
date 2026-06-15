import React, { useState, useMemo, memo, useCallback } from 'react';
import { motion } from 'motion/react';
import type { WorkoutProgram, WorkoutSession, ExerciseLog } from './types';
import BuildView from './BuildView';
import ProgramBrowser from './ProgramBrowser';
import ExerciseLibrary from './ExerciseLibrary';
import { getShadowData, getShadowComparison } from '../utils/shadowMode';

export interface UserProgram {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  goal: string;
  exercises: { name: string; sets: number; reps: number }[];
  equipmentNeeded: boolean;
  createdAt: number;
}

export interface TrainTabProps {
  isLight: boolean;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
  MOCK_PROGRAMS: WorkoutProgram[];
  MOCK_TRAINING_PLANS: { id: string; name: string; description: string; duration: string; difficulty: number; equipmentNeeded: boolean }[];
  GENERATED_ZERO_EQUIP_PROGRAMS: WorkoutProgram[];
  userPrograms: UserProgram[];
  trainingSubTab: 'eq' | 'zero';
  setTrainingSubTab: (t: 'eq' | 'zero') => void;
  trainingInnerTab: 'plans' | 'track' | 'build';
  setTrainingInnerTab: (t: 'plans' | 'track' | 'build') => void;
  setSelectedProgram: (p: WorkoutProgram | null) => void;
  setActiveRunningProgram: (p: WorkoutProgram | null) => void;
  setExerciseLogs: (logs: import('./App').ExerciseLog[]) => void;
  setCurrentExerciseIndex: (i: number) => void;
  setRunningTimer: (t: number) => void;
  setIsRunning: (b: boolean) => void;
  setRestTimerDuration: (d: number) => void;
  setRestTimerKey: React.Dispatch<React.SetStateAction<number>>;
  saveUserProgram: (prog: UserProgram) => void;
  getTotalWorkouts: () => number;
  getVerifiedWorkouts: () => number;
  getTotalVolume: () => number;
  getCurrentStreak: () => number;
  getBestStreak: () => number;
  getWeeklyVolume: () => { day: string; volume: number }[];
  getMaxVolumeSession: () => number;
  workouts: WorkoutSession[];
}

function TrainTab({
  isLight,
  soundSafe,
  MOCK_PROGRAMS: _MOCK_PROGRAMS,
  MOCK_TRAINING_PLANS: _MOCK_TRAINING_PLANS,
  GENERATED_ZERO_EQUIP_PROGRAMS,
  userPrograms,
  trainingSubTab,
  setTrainingSubTab,
  trainingInnerTab,
  setTrainingInnerTab,
  setSelectedProgram: _setSelectedProgram,
  setActiveRunningProgram,
  setExerciseLogs,
  setCurrentExerciseIndex,
  setRunningTimer,
  setIsRunning,
  setRestTimerDuration,
  setRestTimerKey,
  saveUserProgram,
  getTotalWorkouts,
  getVerifiedWorkouts,
  getTotalVolume,
  getCurrentStreak,
  getBestStreak,
  getWeeklyVolume,
  getMaxVolumeSession,
  workouts,
}: TrainTabProps) {
  const [buildMode, setBuildMode] = useState<'builder' | 'library'>('builder');

  // Convert generated WorkoutProgram to TrainingProgram format for ProgramBrowser
  const convertedZeroEquipPrograms = useMemo(() => 
    GENERATED_ZERO_EQUIP_PROGRAMS.map(p => ({
      id: p.id,
      name: p.nameEnglish || p.nameKanji,
      category: 'strength' as const,
      goal: p.description,
      difficulty: p.difficulty === 1 ? 'beginner' as const : p.difficulty <= 3 ? 'intermediate' as const : 'advanced' as const,
      duration: p.duration,
      frequency: `${p.workoutCount} days`,
      equipment: 'Bodyweight Only',
      description: p.description,
      scientificBasis: 'Procedurally generated based on strength training principles',
      evidenceLevel: 'B' as const,
      whatYouWillGain: 'Strength and muscle through progressive bodyweight training',
      sampleExercises: p.moves.map(m => m.name),
      targetMuscles: ['Full Body'],
      provenBy: 'KAGE Program Generator',
      popularity: 'modern' as const,
    }))
  , [GENERATED_ZERO_EQUIP_PROGRAMS]);

  const handleSelectProgram = useCallback((program: { id: string; name: string; difficulty: string; duration: string; sampleExercises: string[]; equipment: string; description: string }) => {
    soundSafe('clash');
    const workoutProgram: WorkoutProgram = {
      id: program.id,
      nameKanji: '',
      nameEnglish: program.name,
      difficulty: program.difficulty === 'beginner' ? 1 : program.difficulty === 'intermediate' ? 3 : 5,
      duration: program.duration,
      workoutCount: program.sampleExercises.length,
      equipmentNeeded: program.equipment !== 'Bodyweight Only',
      description: program.description,
      moves: program.sampleExercises.map((name: string) => ({ name, image: '' })),
    };
    setActiveRunningProgram(workoutProgram);
    setExerciseLogs(program.sampleExercises.map((name: string) => ({
      name,
      sets: [],
      targetSets: 3,
      targetReps: 10,
    })));
    setCurrentExerciseIndex(0);
    setRunningTimer(0);
    setIsRunning(true);
    setRestTimerDuration(90);
    setRestTimerKey(prev => prev + 1);
  }, [soundSafe, setActiveRunningProgram, setExerciseLogs, setCurrentExerciseIndex, setRunningTimer, setIsRunning, setRestTimerDuration, setRestTimerKey]);

  return (
    <motion.div key="tab-train" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2" style={{ willChange: 'transform, opacity' }}>
      
      <div className={`text-center py-2 flex justify-between items-center pb-4 ${isLight ? 'border-b border-stone-200' : 'border-b border-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="font-kanji font-black text-rose-500 text-3xl">武</span>
          <h2 className={`text-xl font-bold tracking-widest ${isLight ? 'text-stone-800' : 'text-white'}`}>DOJO FLOOR</h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-[10px] text-rose-400 font-mono">BETA</span>
      </div>

      {/* Sub-Tabs Selector */}
      <div className={`flex p-1 rounded-lg border ${isLight ? 'bg-stone-200 border-stone-300' : 'bg-void border-white/5'}`}>
        <motion.button
          onClick={() => { soundSafe('tap'); setTrainingSubTab('eq'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-2 rounded-md font-mono text-xs font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${trainingSubTab === 'eq' ? (isLight ? 'bg-white text-rose-600 font-bold border border-rose-300' : 'bg-kachi text-rose-500 font-bold border border-rose-500/10') : (isLight ? 'text-stone-500' : 'text-zinc-400')}`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          EQUIPMENT
        </motion.button>
        <motion.button
          onClick={() => { soundSafe('tap'); setTrainingSubTab('zero'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-2 rounded-md font-mono text-xs font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${trainingSubTab === 'zero' ? (isLight ? 'bg-white text-teal-600 font-bold border border-teal-300' : 'bg-kachi text-hisui font-bold border border-hisui/10') : (isLight ? 'text-stone-500' : 'text-zinc-400')}`}
        >
          <span className="w-2 h-2 rounded-full bg-hisui animate-pulse" />
          ZERO-EQUIPMENT
        </motion.button>
      </div>

      {/* Inner Sub-Sub-Tabs: Programs+Plans | Track | Build */}
      <div className={`flex p-0.5 rounded-lg ${isLight ? 'bg-stone-200' : 'bg-void border border-white/5'}`}>
        <motion.button
          onClick={() => { soundSafe('tap'); setTrainingInnerTab('plans'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${trainingInnerTab === 'plans' ? (isLight ? 'bg-white text-rose-600 shadow-sm' : 'bg-kachi text-rose-400') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
        >
          PROGRAMS+PLANS
        </motion.button>
        <motion.button
          onClick={() => { soundSafe('tap'); setTrainingInnerTab('track'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${trainingInnerTab === 'track' ? (isLight ? 'bg-white text-cyan-600 shadow-sm' : 'bg-kachi text-cyan-400') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
        >
          TRACK
        </motion.button>
        <motion.button
          onClick={() => { soundSafe('tap'); setTrainingInnerTab('build'); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${trainingInnerTab === 'build' ? (isLight ? 'bg-white text-amber-600 shadow-sm' : 'bg-kachi text-amber-400') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
        >
          BUILD
        </motion.button>
      </div>

      {/* PROGRAMS + PLANS (Mixed) */}
      {trainingInnerTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>AVAILABLE COMBAT MODULES & PLANS</p>
            <span className={`text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>MIXED ROSTER</span>
          </div>

          <div className="space-y-3">
            {/* My Creations */}
            {userPrograms.length > 0 && (
              <div className="space-y-2">
                <p className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>✦ MY CREATIONS</p>
                {userPrograms
                  .filter(p => trainingSubTab === 'eq' ? p.equipmentNeeded : !p.equipmentNeeded)
                  .map(up => (
                    <motion.div key={up.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={`rounded-xl p-4 border ${isLight ? 'bg-amber-50/80 border-amber-200 hover:border-amber-400 shadow-sm' : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⚔️</span>
                            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>{up.name}</h3>
                          </div>
                          <p className={`text-[10px] font-mono mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>{up.description}</p>
                          <p className={`text-[8px] font-mono mt-0.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{up.exercises.length} exercises • {up.goal} • {up.exercises.map(e => `${e.name} (${e.sets}×${e.reps})`).join(', ')}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex gap-0.5">
                            {Array.from({ length: up.difficulty }).map((_, i) => (
                              <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => {
                          soundSafe('clash');
                          const fakeProgram: WorkoutProgram = {
                            id: up.id,
                            nameKanji: '',
                            nameEnglish: up.name,
                            difficulty: up.difficulty,
                            duration: `${up.exercises.length * 5} min`,
                            workoutCount: up.exercises.length,
                            equipmentNeeded: up.equipmentNeeded,
                            description: up.description,
                            moves: up.exercises.map(e => ({ name: e.name, image: '', sets: e.sets, reps: e.reps }))
                          };
                          setActiveRunningProgram(fakeProgram);
                          setExerciseLogs(up.exercises.map(e => ({
                            name: e.name,
                            sets: [],
                            targetSets: e.sets,
                            targetReps: e.reps
                          })));
                          setCurrentExerciseIndex(0);
                          setRunningTimer(0);
                          setIsRunning(true);
                          setRestTimerDuration(90);
                          setRestTimerKey(prev => prev + 1);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors ${isLight ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'}`}>
                        START
                      </motion.button>
                    </motion.div>
                  ))}
              </div>
            )}

            <ProgramBrowser
              isLight={isLight}
              onSelectProgram={handleSelectProgram}
              programs={trainingSubTab === 'zero' ? convertedZeroEquipPrograms : undefined}
            />
          </div>
        </div>
      )}

      {/* TRACK - History & Progress */}
      {trainingInnerTab === 'track' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>WORKOUT HISTORY & RECORDS</p>
            <span className={`text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{getTotalWorkouts()} TOTAL</span>
          </div>

          {/* Weekly Progress Bars */}
          <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
            <h3 className={`text-xs font-bold font-mono mb-3 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>THIS WEEK'S VOLUME</h3>
            <div className="space-y-2">
              {getWeeklyVolume().map(d => {
                const weeklyVols = getWeeklyVolume();
                const maxVol = Math.max(...weeklyVols.map(x => x.volume), 1);
                const pct = d.volume > 0 ? Math.round((d.volume / maxVol) * 100) : 0;
                return (
                  <div key={d.day} className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono w-8 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>{d.day}</span>
                    <div className={`flex-1 h-2 rounded-full ${isLight ? 'bg-stone-200' : 'bg-void'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-[9px] font-mono w-16 text-right ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{d.volume > 0 ? `${Math.round(d.volume)}kg` : '-'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Max / Min Records */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
              <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>BEST STREAK</span>
              <p className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-stone-800' : 'text-white'}`}>{getBestStreak()} <span className={`text-xs ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>days</span></p>
              <p className={`text-[9px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>🔥 Personal Best</p>
            </div>
            <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
              <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>CURRENT STREAK</span>
              <p className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-stone-800' : 'text-white'}`}>{getCurrentStreak()} <span className={`text-xs ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>days</span></p>
              <p className={`text-[9px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>⚡ Keep Going</p>
            </div>
            <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
              <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>MAX VOLUME</span>
              <p className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-stone-800' : 'text-white'}`}>{getMaxVolumeSession().toLocaleString()} <span className={`text-xs ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>kg</span></p>
              <p className={`text-[9px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>🏋️ Single Session</p>
            </div>
            <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
              <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>VERIFIED</span>
              <p className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-stone-800' : 'text-white'}`}>{getVerifiedWorkouts()} <span className={`text-xs ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>workouts</span></p>
              <p className={`text-[9px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>✅ Trust Verified</p>
            </div>
          </div>

          {/* Shadow Mode — Previous Session Comparison */}
          {workouts.length >= 2 && (() => {
            const latest = workouts[workouts.length - 1];
            const older = workouts.slice(0, -1);
            const shadowData = getShadowData(older, latest.exercises);
            const comparisons = shadowData.filter(d => d.bestSet);
            if (comparisons.length === 0) return null;
            return (
              <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">👻</span>
                  <h3 className={`text-xs font-bold font-mono ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>SHADOW MODE</h3>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full ${isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>ACTIVE</span>
                </div>
                <p className={`text-[9px] font-mono mb-2 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Your ghost from the previous session:</p>
                {comparisons.slice(0, 4).map(d => {
                  const latestSet = latest.exercises.find(e => e.name === d.exerciseName)?.sets.slice(-1)[0];
                  const status = latestSet ? getShadowComparison(latestSet, d.bestSet) : 'none';
                  const statusStyles = {
                    ahead: { icon: '🚀', text: 'ahead', color: 'text-emerald-400' },
                    behind: { icon: '⚠️', text: 'behind', color: 'text-amber-400' },
                    equal: { icon: '⚖️', text: 'matched', color: 'text-blue-400' },
                    none: { icon: '👤', text: 'new', color: 'text-zinc-400' },
                  };
                  const s = statusStyles[status];
                  return (
                    <div key={d.exerciseName} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-mono mb-1 ${isLight ? 'bg-stone-100' : 'bg-zinc-800/50'}`}>
                      <div className="flex items-center gap-2">
                        <span>{s.icon}</span>
                        <span className={isLight ? 'text-stone-700' : 'text-zinc-300'}>{d.exerciseName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={isLight ? 'text-stone-400' : 'text-zinc-500'}>
                          ghost: {d.bestSet!.weight}kg × {d.bestSet!.reps}
                        </span>
                        {latestSet && (
                          <span className={isLight ? 'text-stone-400' : 'text-zinc-500'}>
                            now: {latestSet.weight}kg × {latestSet.reps}
                          </span>
                        )}
                        <span className={`font-bold ${s.color}`}>{s.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Recent Workouts */}
          {workouts.length > 0 && (
            <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
              <h3 className={`text-xs font-bold font-mono mb-3 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>RECENT WORKOUTS</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {workouts.slice(0, 10).map(w => (
                  <div key={w.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-mono ${isLight ? 'bg-stone-100' : 'bg-zinc-800/50'}`}>
                    <div className="flex items-center gap-2">
                      {w.verified ? <span className="text-emerald-400">✓</span> : <span className="text-amber-400">○</span>}
                      <span className={isLight ? 'text-stone-700' : 'text-zinc-300'}>{w.programName}</span>
                    </div>
                    <span className={isLight ? 'text-stone-400' : 'text-zinc-500'}>
                      {new Date(w.date).toLocaleDateString()} • {w.exercises.reduce((s, e) => s + e.sets.length, 0)} sets
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BUILD - Custom Program Creator */}
      {trainingInnerTab === 'build' && (
        <div className="space-y-4">
          {/* Build Sub-Mode Toggle */}
          <div className={`flex p-0.5 rounded-lg border ${isLight ? 'bg-stone-200 border-stone-300' : 'bg-void border-white/5'}`}>
            <motion.button
              onClick={() => { soundSafe('tap'); setBuildMode('builder'); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${buildMode === 'builder' ? (isLight ? 'bg-white text-amber-600 shadow-sm border border-amber-200' : 'bg-kachi text-amber-400 border border-amber-500/20') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
            >
              CUSTOM BUILDER
            </motion.button>
            <motion.button
              onClick={() => { soundSafe('tap'); setBuildMode('library'); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`flex-1 text-center py-1.5 rounded-md font-mono text-[10px] font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${buildMode === 'library' ? (isLight ? 'bg-white text-rose-600 shadow-sm border border-rose-200' : 'bg-kachi text-rose-400 border border-rose-500/20') : (isLight ? 'text-stone-500 hover:text-stone-700' : 'text-zinc-500 hover:text-zinc-300')}`}
            >
              EXERCISE LIBRARY
            </motion.button>
          </div>

          {buildMode === 'builder' ? (
            <BuildView
              isLight={isLight}
              soundSafe={soundSafe}
              saveUserProgram={saveUserProgram}
            />
          ) : (
            <ExerciseLibrary isLight={isLight} />
          )}
        </div>
      )}

    </motion.div>
  );
}

export default memo(TrainTab);
