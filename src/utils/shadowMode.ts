import type { WorkoutSession, ExerciseLog, LoggedSet } from '../types';

export interface ShadowData {
  exerciseName: string;
  bestSet: LoggedSet | null;
  totalVolume: number;
  completedSets: number;
}

export function getShadowData(workoutHistory: WorkoutSession[], currentExercises: ExerciseLog[]): ShadowData[] {
  return currentExercises.map(ex => {
    const previousSessions = workoutHistory
      .filter(s => s.exercises.some(e => e.name === ex.name))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (previousSessions.length === 0) {
      return { exerciseName: ex.name, bestSet: null, totalVolume: 0, completedSets: 0 };
    }

    const prevEx = previousSessions[0].exercises.find(e => e.name === ex.name);
    if (!prevEx || prevEx.sets.length === 0) {
      return { exerciseName: ex.name, bestSet: null, totalVolume: 0, completedSets: 0 };
    }

    const bestSet = prevEx.sets.reduce(
      (best, s) => (s.weight > best.weight ? s : best),
      prevEx.sets[0],
    );

    const totalVolume = prevEx.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);

    return {
      exerciseName: ex.name,
      bestSet,
      totalVolume,
      completedSets: prevEx.sets.length,
    };
  });
}

export function getShadowComparison(current: LoggedSet, shadow: LoggedSet | null): 'ahead' | 'behind' | 'equal' | 'none' {
  if (!shadow) return 'none';
  const currentVolume = current.reps * current.weight;
  const shadowVolume = shadow.reps * shadow.weight;
  if (currentVolume > shadowVolume) return 'ahead';
  if (currentVolume < shadowVolume) return 'behind';
  return 'equal';
}
