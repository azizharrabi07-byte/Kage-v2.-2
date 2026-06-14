import type { Exercise } from '../types/exercise';

export interface CustomProgramDay {
  day: number;
  exercises: { exerciseId: string; name: string; muscleGroup: string; sets: number; reps: string; restSeconds: number }[];
}

export interface CustomProgram {
  id: string;
  name: string;
  goal: string;
  daysPerWeek: number;
  sessionDuration: number;
  experienceLevel: string;
  equipment: string[];
  weeks: number;
  createdAt: number;
  days: CustomProgramDay[];
}

/**
 * Filter exercises by available equipment.
 * If equipment list is empty, returns all exercises.
 */
export function filterExercisesByEquipment(
  exercises: Exercise[],
  equipment: string[]
): Exercise[] {
  if (!equipment || equipment.length === 0) return exercises;
  const equipLower = equipment.map(e => e.toLowerCase());
  return exercises.filter(ex => {
    const exEquip = ex.equipment.toLowerCase();
    return equipLower.some(eq => exEquip.includes(eq));
  });
}

/**
 * Filter exercises by training goal.
 * - strength: lower rep range exercises (defaultReps tends toward lower numbers)
 * - hypertrophy: moderate rep range
 * - endurance: higher rep range
 * - power: similar to strength
 * - general fitness: all
 * - weight loss: cardio/high burn
 */
export function filterExercisesByGoal(
  exercises: Exercise[],
  goal: string
): Exercise[] {
  switch (goal) {
    case 'strength':
    case 'power':
      return exercises.filter(ex => {
        const reps = parseRepRange(ex.defaultReps);
        return reps <= 8 || ex.category === 'strength';
      });
    case 'hypertrophy':
      return exercises.filter(ex => {
        const reps = parseRepRange(ex.defaultReps);
        return (reps >= 6 && reps <= 15) || ex.category === 'strength' || ex.category === 'bodyweight';
      });
    case 'endurance':
      return exercises.filter(ex => {
        const reps = parseRepRange(ex.defaultReps);
        return reps >= 12 || ex.category === 'cardio' || ex.category === 'calisthenics';
      });
    case 'weight loss':
      return exercises.filter(ex =>
        ex.category === 'cardio' || ex.category === 'calisthenics' || ex.category === 'bodyweight'
      );
    case 'general fitness':
    default:
      return exercises;
  }
}

/**
 * Parse defaultReps string to extract a numeric rep value.
 * Handles formats like "6-12", "8-12", "20-30 seconds each side", "10", etc.
 */
function parseRepRange(reps: string): number {
  const match = reps.match(/(\d+)/);
  if (!match) return 10;
  return parseInt(match[1], 10);
}

/**
 * Calculate total volume (sets × reps) across all days in a plan.
 */
export function calculateTotalVolume(plan: CustomProgram): number {
  let total = 0;
  for (const day of plan.days) {
    for (const ex of day.exercises) {
      const repNum = parseRepRange(ex.reps);
      total += ex.sets * repNum;
    }
  }
  return total;
}

/**
 * Estimate total weekly duration based on session length and days.
 */
export function estimateDuration(plan: CustomProgram, sessionLength: number): string {
  const totalMinutes = sessionLength * plan.daysPerWeek * plan.weeks;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

/**
 * Generate a unique program ID.
 */
export function generateProgramId(): string {
  return `cp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
