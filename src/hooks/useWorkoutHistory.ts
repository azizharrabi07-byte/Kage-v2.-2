import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { WorkoutSession, LoggedSet, ExercisePR } from '../types';

export function useWorkoutHistory() {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutSession[]>('kage_workouts', []);

  const addWorkout = useCallback((session: WorkoutSession) => {
    setWorkouts(prev => [session, ...prev]);
  }, [setWorkouts]);

  const getTotalWorkouts = useCallback(() => workouts.length, [workouts]);
  const getVerifiedWorkouts = useCallback(() => workouts.filter(w => w.verified).length, [workouts]);

  const getTotalVolume = useCallback(() => {
    return workouts.filter(w => w.verified).reduce((sum, w) => {
      return sum + w.exercises.reduce((exSum, ex) => {
        return exSum + ex.sets.reduce((setSum, s) => setSum + (s.weight * s.reps), 0);
      }, 0);
    }, 0);
  }, [workouts]);

  const getCurrentStreak = useCallback(() => {
    const verified = workouts.filter(w => w.verified);
    if (verified.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      if (verified.some(w => w.date.startsWith(ds))) {
        streak++;
      } else if (i > 0) break;
    }
    return streak;
  }, [workouts]);

  const getBestStreak = useCallback(() => {
    const verified = workouts.filter(w => w.verified).map(w => w.date.split('T')[0]);
    if (verified.length === 0) return 0;
    const uniqueDays = [...new Set(verified)].sort();
    let best = 1, cur = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const d1 = new Date(uniqueDays[i - 1]);
      const d2 = new Date(uniqueDays[i]);
      const diff = (d2.getTime() - d1.getTime()) / 86400000;
      if (diff === 1) { cur++; best = Math.max(best, cur); }
      else cur = 1;
    }
    return best;
  }, [workouts]);

  const getWeeklyVolume = useCallback(() => {
    const days: { day: string; volume: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const vol = workouts.filter(w => w.verified && w.date.startsWith(ds))
        .reduce((sum, w) => sum + w.exercises.reduce((exSum, ex) => exSum + ex.sets.reduce((setSum, s) => setSum + s.weight * s.reps, 0), 0), 0);
      days.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), volume: vol });
    }
    return days;
  }, [workouts]);

  const getMaxVolumeSession = useCallback(() => {
    return Math.max(...workouts.map(w => w.exercises.reduce((exSum, ex) => exSum + ex.sets.reduce((setSum, s) => setSum + s.weight * s.reps, 0), 0)), 0);
  }, [workouts]);

  const compute1RM = (weight: number, reps: number) => Math.round(weight * (1 + reps / 30));

  return { workouts, setWorkouts, addWorkout, getTotalWorkouts, getVerifiedWorkouts, getTotalVolume, getCurrentStreak, getBestStreak, getWeeklyVolume, getMaxVolumeSession, compute1RM };
}

export function useExercisePRs() {
  const [prs, setPrs] = useLocalStorage<Record<string, ExercisePR>>('kage_prs', {});

  const updatePRs = useCallback((exerciseName: string, weight: number, reps: number) => {
    const e1rm = Math.round(weight * (1 + reps / 30));
    setPrs(prev => {
      const existing = prev[exerciseName];
      if (!existing || e1rm > existing.max1RM) {
        return {
          ...prev,
          [exerciseName]: {
            max1RM: existing ? Math.max(e1rm, existing.max1RM) : e1rm,
            maxWeight: existing ? Math.max(weight, existing.maxWeight) : weight,
            maxReps: existing ? Math.max(reps, existing.maxReps) : reps,
            bestSet: existing && e1rm <= existing.max1RM ? existing.bestSet : { weight, reps, timestamp: Date.now() },
            history: [...(existing?.history || []), { date: new Date().toISOString(), weight, reps, estimated1RM: e1rm }]
          }
        };
      }
      return prev;
    });
    return e1rm;
  }, [setPrs]);

  const checkNewPR = useCallback((exerciseName: string, weight: number, reps: number): number | null => {
    const e1rm = Math.round(weight * (1 + reps / 30));
    const existing = prs[exerciseName];
    if (!existing || e1rm > existing.max1RM) return e1rm;
    return null;
  }, [prs]);

  return { prs, updatePRs, checkNewPR };
}
