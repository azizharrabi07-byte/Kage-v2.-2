import type { WorkoutProgram, Exercise } from '../types';

type Goal = 'strength' | 'hypertrophy' | 'endurance';
type Difficulty = 1 | 2 | 3 | 4 | 5;
type Equipment = 'none' | 'minimal' | 'full';

interface GenParams {
  goal: Goal;
  difficulty: Difficulty;
  duration: number;
  frequency: number;
  equipment: Equipment;
}

const GOAL_CONFIGS: Record<Goal, { repRanges: [number, number][]; restSeconds: number; setCount: [number, number] }> = {
  strength: { repRanges: [[3, 6]], restSeconds: 180, setCount: [4, 6] },
  hypertrophy: { repRanges: [[8, 12]], restSeconds: 90, setCount: [3, 5] },
  endurance: { repRanges: [[15, 25]], restSeconds: 45, setCount: [2, 4] },
};

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  1: 0.6, 2: 0.75, 3: 1.0, 4: 1.2, 5: 1.4,
};

const PROGRAM_NAMES: Record<Goal, { ja: string; en: string }[]> = {
  strength: [
    { ja: '鉄の拳', en: 'IRON FIST' }, { ja: '剛力', en: 'MIGHT' },
    { ja: '破壊者', en: 'DESTROYER' }, { ja: '不動', en: 'IMMOVABLE' },
    { ja: '要塞', en: 'FORTRESS' },
  ],
  hypertrophy: [
    { ja: '彫刻', en: 'SCULPTOR' }, { ja: '鋼体', en: 'STEEL BODY' },
    { ja: '刃', en: 'BLADE' }, { ja: '巨人', en: 'TITAN' },
    { ja: '鏡', en: 'MIRROR' },
  ],
  endurance: [
    { ja: '無限', en: 'LIMITLESS' }, { ja: '風', en: 'WIND' },
    { ja: '永続', en: 'ETERNAL' }, { ja: '炎', en: 'BLAZE' },
    { ja: '大河', en: 'RIVER' },
  ],
};

const ALL_TRAINING_EXERCISES: Exercise[] = [];

export function setTrainingExercises(exercises: Exercise[]) {
  ALL_TRAINING_EXERCISES.length = 0;
  ALL_TRAINING_EXERCISES.push(...exercises);
}

export function generatePrograms(params: GenParams): WorkoutProgram[] {
  const { goal, difficulty, duration, frequency, equipment } = params;
  const config = GOAL_CONFIGS[goal];
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty];
  const names = PROGRAM_NAMES[goal];

  const filtered = ALL_TRAINING_EXERCISES.filter(ex => {
    if (equipment === 'none' && ex.equipment !== 'Bodyweight' && ex.equipment !== 'bodyweight' && ex.equipment !== 'None') return false;
    if (equipment === 'minimal' && (ex.equipment === 'None' || ex.equipment === 'bodyweight')) return false;
    return true;
  });

  const pool = filtered.length > 20 ? filtered : ALL_TRAINING_EXERCISES;
  if (pool.length === 0) return [];

  const programs: WorkoutProgram[] = [];
  const numPrograms = Math.min(names.length, Math.max(3, duration));

  for (let p = 0; p < numPrograms; p++) {
    const name = names[p % names.length];
    const weeklySessions = Math.min(frequency, 6);
    const totalDays = duration * weeklySessions;
    const exercisesPerSession = Math.min(Math.floor(pool.length / 3), 8);

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, exercisesPerSession);

    const moves = selected.map(ex => {
      const repRange = config.repRanges[Math.floor(Math.random() * config.repRanges.length)];
      const baseSets = config.setCount[0] + Math.floor(Math.random() * (config.setCount[1] - config.setCount[0]));
      const sets = Math.round(baseSets * multiplier);
      const reps = repRange[0] + Math.floor(Math.random() * (repRange[1] - repRange[0]));

      return {
        name: ex.name,
        image: ex.imagePlaceholder || '',
        sets: Math.max(2, sets),
        reps,
      };
    });

    const estDuration = moves.length * config.setCount[1] * (config.restSeconds / 60) * multiplier;
    const durationMinutes = Math.round(estDuration);
    const workoutCount = totalDays;

    programs.push({
      id: `gen_${goal}_${difficulty}_${p}_${Date.now()}`,
      nameKanji: name.ja,
      nameEnglish: name.en,
      difficulty,
      duration: `${durationMinutes} min`,
      workoutCount,
      equipmentNeeded: equipment !== 'none',
      description: `${goal.charAt(0).toUpperCase() + goal.slice(1)} program — ${duration} weeks, ${frequency}x/week. ${equipment === 'none' ? 'Bodyweight only.' : equipment === 'minimal' ? 'Minimal equipment.' : 'Full gym.'}`,
      moves,
    });
  }

  return programs;
}
