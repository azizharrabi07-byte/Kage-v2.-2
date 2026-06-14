import type { LoggedSet, WorkoutSession } from '../types';

export interface OverloadSuggestion {
  exerciseName: string;
  lastWeight: number;
  lastReps: number;
  suggestedWeight: number;
  suggestedReps: number;
  reasoning: string;
}

const UPPER_BODY_INCREMENT = 2.5;
const LOWER_BODY_INCREMENT = 5;

const UPPER_EXERCISES = [
  'bench press', 'dumbbell press', 'shoulder press', 'overhead press',
  'bicep curl', 'tricep', 'row', 'pull', 'fly', 'lateral raise',
  'front raise', 'face pull', 'pushdown',
  'push up', 'push-up', 'dip',
];

export function suggestProgressiveOverload(
  exerciseName: string,
  currentLogs: LoggedSet[],
  history: WorkoutSession[],
): OverloadSuggestion | null {
  const recentSets = currentLogs.filter(s => s.weight > 0 && s.reps > 0);
  if (recentSets.length === 0) return null;

  const lastSet = recentSets[recentSets.length - 1];
  const isUpper = UPPER_EXERCISES.some(e => exerciseName.toLowerCase().includes(e));
  const increment = isUpper ? UPPER_BODY_INCREMENT : LOWER_BODY_INCREMENT;

  const previousSessions = history
    .filter(s => s.exercises.some(e => e.name === exerciseName))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (previousSessions.length === 0) return null;

  const prevSession = previousSessions[0];
  const prevExercise = prevSession.exercises.find(e => e.name === exerciseName);
  if (!prevExercise || prevExercise.sets.length === 0) return null;

  const prevBestSet = prevExercise.sets.reduce(
    (best, s) => (s.weight > best.weight ? s : best),
    prevExercise.sets[0],
  );

  const metOrExceededReps = lastSet.reps >= prevBestSet.reps;
  const metOrExceededWeight = lastSet.weight >= prevBestSet.weight;
  if (!metOrExceededReps || !metOrExceededWeight) {
    return null;
  }

  return {
    exerciseName,
    lastWeight: lastSet.weight,
    lastReps: lastSet.reps,
    suggestedWeight: lastSet.weight + increment,
    suggestedReps: Math.max(lastSet.reps - 2, 5),
    reasoning: `${isUpper ? 'Upper' : 'Lower'} body — increase by ${increment}kg`,
  };
}

export function estimate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}
