import { expect, test, describe, beforeEach, vi } from 'vitest';
import { generatePrograms, setTrainingExercises } from '../utils/programGenerator';
import { createAchievements, checkAllAchievements, calculateStats, getProgressForAchievement } from '../utils/achievements';
import { suggestProgressiveOverload, estimate1RM } from '../utils/progressiveOverload';
import { getShadowData, getShadowComparison } from '../utils/shadowMode';
import { generateWeeklyBounties, updateBountyProgress, getAvailableBounties } from '../utils/dojoBounties';
import { getRoninState, enableRoninMode, disableRoninMode, roninRestrictions, roninDaysRemaining } from '../utils/roninMode';
import type { Exercise, LoggedSet, WorkoutSession, ExerciseLog } from '../types';

const mockExercises: Exercise[] = [
  { id: '1', name: 'Bench Press', category: 'Chest', equipment: 'Barbell', imagePlaceholder: 'bp.svg' },
  { id: '2', name: 'Squat', category: 'Legs', equipment: 'Barbell', imagePlaceholder: 'sq.svg' },
  { id: '3', name: 'Push Up', category: 'Chest', equipment: 'Bodyweight', imagePlaceholder: 'pu.svg' },
  { id: '4', name: 'Pull Up', category: 'Back', equipment: 'Bodyweight', imagePlaceholder: 'pl.svg' },
  { id: '5', name: 'Deadlift', category: 'Back', equipment: 'Barbell', imagePlaceholder: 'dl.svg' },
  { id: '6', name: 'Dumbbell Row', category: 'Back', equipment: 'Dumbbell', imagePlaceholder: 'dr.svg' },
  { id: '7', name: 'Overhead Press', category: 'Shoulders', equipment: 'Barbell', imagePlaceholder: 'op.svg' },
  { id: '8', name: 'Bicep Curl', category: 'Arms', equipment: 'Dumbbell', imagePlaceholder: 'bc.svg' },
  { id: '9', name: 'Tricep Pushdown', category: 'Arms', equipment: 'Cable', imagePlaceholder: 'tp.svg' },
  { id: '10', name: 'Leg Press', category: 'Legs', equipment: 'Machine', imagePlaceholder: 'lp.svg' },
  { id: '11', name: 'Lat Pulldown', category: 'Back', equipment: 'Cable', imagePlaceholder: 'lpd.svg' },
  { id: '12', name: 'Dumbbell Shoulder Press', category: 'Shoulders', equipment: 'Dumbbell', imagePlaceholder: 'dsp.svg' },
  { id: '13', name: 'Plank', category: 'Core', equipment: 'Bodyweight', imagePlaceholder: 'plank.svg' },
  { id: '14', name: 'Crunch', category: 'Core', equipment: 'Bodyweight', imagePlaceholder: 'cr.svg' },
  { id: '15', name: 'Russian Twist', category: 'Core', equipment: 'Bodyweight', imagePlaceholder: 'rt.svg' },
  { id: '16', name: 'Dumbbell Fly', category: 'Chest', equipment: 'Dumbbell', imagePlaceholder: 'df.svg' },
  { id: '17', name: 'Goblet Squat', category: 'Legs', equipment: 'Dumbbell', imagePlaceholder: 'gs.svg' },
  { id: '18', name: 'Romanian Deadlift', category: 'Legs', equipment: 'Barbell', imagePlaceholder: 'rdl.svg' },
  { id: '19', name: 'Face Pull', category: 'Shoulders', equipment: 'Cable', imagePlaceholder: 'fp.svg' },
  { id: '20', name: 'Lateral Raise', category: 'Shoulders', equipment: 'Dumbbell', imagePlaceholder: 'lr.svg' },
  { id: '21', name: 'Walking Lunge', category: 'Legs', equipment: 'Bodyweight', imagePlaceholder: 'wl.svg' },
  { id: '22', name: 'Dumbbell Bench Press', category: 'Chest', equipment: 'Dumbbell', imagePlaceholder: 'dbp.svg' },
];

describe('ProgramGenerator', () => {
  beforeEach(() => {
    setTrainingExercises(mockExercises);
  });

  test('generates programs for strength goal', () => {
    const programs = generatePrograms({
      goal: 'strength', difficulty: 3, duration: 4, frequency: 4, equipment: 'full',
    });
    expect(programs.length).toBeGreaterThan(0);
    for (const p of programs) {
      expect(p.nameKanji).toBeTruthy();
      expect(p.nameEnglish).toBeTruthy();
      expect(p.moves.length).toBeGreaterThan(0);
      expect(p.difficulty).toBe(3);
      for (const m of p.moves) {
        expect(m.sets).toBeGreaterThanOrEqual(2);
        expect(m.reps).toBeGreaterThan(0);
      }
    }
  });

  test('generates programs for hypertrophy goal', () => {
    const programs = generatePrograms({
      goal: 'hypertrophy', difficulty: 2, duration: 6, frequency: 5, equipment: 'full',
    });
    expect(programs.length).toBeGreaterThan(0);
    for (const p of programs) {
      expect(p.moves.every(m => m.reps >= 8 && m.reps <= 12)).toBe(true);
    }
  });

  test('generates programs for endurance goal', () => {
    const programs = generatePrograms({
      goal: 'endurance', difficulty: 1, duration: 3, frequency: 3, equipment: 'full',
    });
    expect(programs.length).toBeGreaterThan(0);
    for (const p of programs) {
      expect(p.moves.every(m => m.reps >= 15)).toBe(true);
    }
  });

  test('filters by bodyweight when equipment=none', () => {
    const programs = generatePrograms({
      goal: 'strength', difficulty: 1, duration: 4, frequency: 3, equipment: 'none',
    });
    expect(programs.length).toBeGreaterThan(0);
  });

  test('returns empty array when pool is empty', () => {
    setTrainingExercises([]);
    const programs = generatePrograms({
      goal: 'strength', difficulty: 1, duration: 4, frequency: 3, equipment: 'none',
    });
    expect(programs).toEqual([]);
  });

  test('id contains goal and difficulty', () => {
    const programs = generatePrograms({
      goal: 'strength', difficulty: 5, duration: 4, frequency: 4, equipment: 'full',
    });
    for (const p of programs) {
      expect(p.id).toContain('strength');
      expect(p.id).toContain('5');
    }
  });

  test('equipment description', () => {
    const full = generatePrograms({ goal: 'strength', difficulty: 1, duration: 4, frequency: 3, equipment: 'full' });
    expect(full[0].description).toContain('Full gym');

    const none = generatePrograms({ goal: 'strength', difficulty: 1, duration: 4, frequency: 3, equipment: 'none' });
    expect(none[0].description).toContain('Bodyweight');
  });

  test('difficulty multiplier affects sets', () => {
    const easy = generatePrograms({ goal: 'hypertrophy', difficulty: 1, duration: 4, frequency: 3, equipment: 'full' });
    const hard = generatePrograms({ goal: 'hypertrophy', difficulty: 5, duration: 4, frequency: 3, equipment: 'full' });
    for (let i = 0; i < Math.min(easy.length, hard.length); i++) {
      for (let j = 0; j < Math.min(easy[i].moves.length, hard[i].moves.length); j++) {
        expect(hard[i].moves[j].sets).toBeGreaterThanOrEqual(easy[i].moves[j].sets);
      }
    }
  });
});

describe('Achievements', () => {
  test('creates 10 achievements', () => {
    const achievements = createAchievements();
    expect(achievements.length).toBe(10);
  });

  test('each achievement has required fields', () => {
    const achievements = createAchievements();
    for (const a of achievements) {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.icon).toBeTruthy();
      expect(a.rarity).toMatch(/common|rare|epic|legendary/);
      expect(a.rewardXP).toBeGreaterThan(0);
    }
  });

  test('first_blood unlocks after 1 workout', () => {
    const achievements = createAchievements();
    const stats = calculateStats(
      [{ verified: true }], [], 0, 0,
    );
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'first_blood')!.unlocked).toBe(true);
  });

  test('irons_resolve unlocks after 10 workouts', () => {
    const achievements = createAchievements();
    const workouts = Array.from({ length: 10 }, () => ({ verified: true }));
    const stats = calculateStats(workouts, [], 0, 0);
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'iron_resolve')!.unlocked).toBe(true);
  });

  test('centurion does not unlock early', () => {
    const achievements = createAchievements();
    const workouts = Array.from({ length: 50 }, () => ({ verified: true }));
    const stats = calculateStats(workouts, [], 5000, 0);
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'centurion')!.unlocked).toBe(false);
  });

  test('streak_master unlocks at 7 day streak', () => {
    const achievements = createAchievements();
    const stats = calculateStats([], [], 0, 7);
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'streak_master')!.unlocked).toBe(true);
  });

  test('no_days_off unlocks at 30 day streak', () => {
    const achievements = createAchievements();
    const stats = calculateStats([], [], 0, 30);
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'no_days_off')!.unlocked).toBe(true);
  });

  test('dedicated unlocks at 5 day streak', () => {
    const achievements = createAchievements();
    const stats = calculateStats([], [], 0, 5);
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'dedicated')!.unlocked).toBe(true);
  });

  test('calculateStats counts verified workouts', () => {
    const workouts = [
      { verified: true }, { verified: false }, { verified: true }, { verified: true },
    ];
    const stats = calculateStats(workouts, [], 15000, 3);
    expect(stats.verifiedWorkouts).toBe(3);
    expect(stats.totalWorkouts).toBe(4);
    expect(stats.totalVolume).toBe(15000);
    expect(stats.currentStreak).toBe(3);
  });

  test('getProgressForAchievement returns progress percentage', () => {
    const achievements = createAchievements();
    const stats = calculateStats([{ verified: true }], [], 0, 0);
    const firstBlood = achievements.find(a => a.id === 'first_blood')!;
    expect(getProgressForAchievement(firstBlood, stats)).toBe(100);
  });

  test('checkAllAchievements does not un-lock', () => {
    const achievements = createAchievements().map(a => ({ ...a, unlocked: true }));
    const stats = calculateStats([], [], 0, 0);
    const updated = checkAllAchievements(achievements, stats);
    for (const a of updated) {
      expect(a.unlocked).toBe(true);
    }
  });

  test('heavy_lifter considers totalVolume', () => {
    const achievements = createAchievements();
    const stats = calculateStats([], [], 100, 0); // default cond uses volume >= 100
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'heavy_lifter')!.unlocked).toBe(true);
  });

  test('volume_hunter unlocks at 10000kg', () => {
    const achievements = createAchievements();
    const stats = calculateStats([], [], 10000, 0);
    const updated = checkAllAchievements(achievements, stats);
    expect(updated.find(a => a.id === 'volume_hunter')!.unlocked).toBe(true);
  });
});

describe('ProgressiveOverload', () => {
  const makeSet = (weight: number, reps: number, timestamp?: number): LoggedSet => ({
    weight, reps, timestamp: timestamp || Date.now(),
  });

  const makeExerciseLog = (name: string, sets: LoggedSet[]): ExerciseLog => ({
    name, image: '', sets, restTimer: 90, completed: true,
  });

  test('estimate1RM returns weight for single rep', () => {
    expect(estimate1RM(100, 1)).toBe(100);
  });

  test('estimate1RM uses Epley formula', () => {
    const rm = estimate1RM(80, 10);
    expect(rm).toBe(Math.round(80 * (1 + 10 / 30)));
  });

  test('suggestProgressiveOverload returns null for no logs', () => {
    const result = suggestProgressiveOverload('Bench Press', [], []);
    expect(result).toBeNull();
  });

  test('suggestProgressiveOverload returns null for first session', () => {
    const logs = [makeSet(60, 10)];
    const result = suggestProgressiveOverload('Bench Press', logs, []);
    expect(result).toBeNull();
  });

  test('suggestProgressiveOverload suggests upper body increment', () => {
    const logs = [makeSet(60, 10)];
    const history: WorkoutSession[] = [{
      id: 'prev', date: new Date(Date.now() - 86400000).toISOString(),
      programName: 'Test', exercises: [makeExerciseLog('Bench Press', [makeSet(60, 8)])],
      duration: 1800, verified: true, timestamp: Date.now() - 86400000,
    }];
    const result = suggestProgressiveOverload('Bench Press', logs, history);
    expect(result).not.toBeNull();
    expect(result!.suggestedWeight).toBe(62.5);
    expect(result!.reasoning).toContain('Upper');
  });

  test('suggestProgressiveOverload suggests lower body increment', () => {
    const logs = [makeSet(100, 10)];
    const history: WorkoutSession[] = [{
      id: 'prev', date: new Date(Date.now() - 86400000).toISOString(),
      programName: 'Test', exercises: [makeExerciseLog('Squat', [makeSet(100, 8)])],
      duration: 1800, verified: true, timestamp: Date.now() - 86400000,
    }];
    const result = suggestProgressiveOverload('Squat', logs, history);
    expect(result).not.toBeNull();
    expect(result!.suggestedWeight).toBe(105);
    expect(result!.reasoning).toContain('Lower');
  });

  test('suggestProgressiveOverload returns null when reps not hit', () => {
    const targetReps = 10;
    const logs = [makeSet(60, targetReps - 3)];
    const history: WorkoutSession[] = [{
      id: 'prev', date: new Date(Date.now() - 86400000).toISOString(),
      programName: 'Test', exercises: [makeExerciseLog('Bench Press', [makeSet(50, 10)])],
      duration: 1800, verified: true, timestamp: Date.now() - 86400000,
    }];
    const result = suggestProgressiveOverload('Bench Press', logs, history);
    expect(result).toBeNull();
  });
});

describe('RoninMode', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const k of Object.keys(store)) delete store[k]; },
      get length() { return Object.keys(store).length; },
      key: (i: number) => Object.keys(store)[i] ?? null,
    });
  });

  test('enableRoninMode sets values', () => {
    enableRoninMode();
    const state = getRoninState();
    expect(state.enabled).toBe(true);
    expect(state.startDate).toBeGreaterThan(0);
  });

  test('disableRoninMode blocked before 7 days', () => {
    enableRoninMode();
    const result = disableRoninMode();
    expect(result).toBe(false);
    const state = getRoninState();
    expect(state.enabled).toBe(true);
  });

  test('roninRestrictions returns constraints when enabled', () => {
    enableRoninMode();
    const restrictions = roninRestrictions();
    expect(restrictions.skipRestTimer).toBe(false);
    expect(restrictions.requireGymPhoto).toBe(true);
    expect(restrictions.requireVerification).toBe(true);
  });

  test('roninRestrictions returns defaults when disabled', () => {
    const restrictions = roninRestrictions();
    expect(restrictions.skipRestTimer).toBe(true);
    expect(restrictions.requireGymPhoto).toBe(false);
    expect(restrictions.requireVerification).toBe(false);
  });
});

describe('ShadowMode', () => {
  const makeSet = (weight: number, reps: number): LoggedSet => ({
    weight, reps, timestamp: Date.now(),
  });

  const makeLog = (name: string, sets: LoggedSet[]): ExerciseLog => ({
    name, image: '', sets, restTimer: 90, completed: true,
  });

  const makeSession = (id: string, exercises: ExerciseLog[], daysAgo: number): WorkoutSession => ({
    id, date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    programName: 'test', exercises, duration: 1800, verified: true, timestamp: Date.now(),
  });

  test('getShadowData returns bestSet from history', () => {
    const current = [makeLog('Bench Press', [makeSet(70, 10)])];
    const history = [makeSession('s1', [makeLog('Bench Press', [makeSet(60, 8), makeSet(80, 6)])], 1)];
    const data = getShadowData(history, current);
    expect(data[0].exerciseName).toBe('Bench Press');
    expect(data[0].bestSet!.weight).toBe(80);
    expect(data[0].totalVolume).toBe(60 * 8 + 80 * 6);
    expect(data[0].completedSets).toBe(2);
  });

  test('getShadowData returns null bestSet for new exercises', () => {
    const current = [makeLog('Deadlift', [makeSet(100, 5)])];
    const data = getShadowData([], current);
    expect(data[0].bestSet).toBeNull();
    expect(data[0].totalVolume).toBe(0);
  });

  test('getShadowComparison ahead', () => {
    const current = makeSet(100, 10);
    const shadow = makeSet(80, 10);
    expect(getShadowComparison(current, shadow)).toBe('ahead');
  });

  test('getShadowComparison behind', () => {
    const current = makeSet(60, 10);
    const shadow = makeSet(80, 10);
    expect(getShadowComparison(current, shadow)).toBe('behind');
  });

  test('getShadowComparison equal', () => {
    const current = makeSet(80, 10);
    const shadow = makeSet(80, 10);
    expect(getShadowComparison(current, shadow)).toBe('equal');
  });

  test('getShadowComparison none when no shadow', () => {
    const current = makeSet(80, 10);
    expect(getShadowComparison(current, null)).toBe('none');
  });
});

describe('DojoBounties', () => {
  test('generates 6 weekly bounties', () => {
    const bounties = generateWeeklyBounties();
    expect(bounties.length).toBe(6);
  });

  test('each bounty has required fields', () => {
    const bounties = generateWeeklyBounties();
    for (const b of bounties) {
      expect(b.id).toBeTruthy();
      expect(b.title).toBeTruthy();
      expect(b.target).toBeGreaterThan(0);
      expect(b.rewardXP).toBeGreaterThan(0);
      expect(b.expiresAt).toBeTruthy();
      expect(b.progress).toBe(0);
      expect(b.claimed).toBe(false);
    }
  });

  test('updateBountyProgress increments matching objective', () => {
    const bounties = generateWeeklyBounties();
    const updated = updateBountyProgress(bounties, 'totalVolume', 2500);
    const volBounty = updated.find(b => b.objective === 'totalVolume')!;
    expect(volBounty.progress).toBe(2500);
  });

  test('updateBountyProgress does not overcap', () => {
    const bounties = generateWeeklyBounties();
    const volBounty = bounties.find(b => b.objective === 'totalVolume')!;
    const updated = updateBountyProgress(bounties, 'totalVolume', volBounty.target + 9999);
    const found = updated.find(b => b.id === volBounty.id)!;
    expect(found.progress).toBe(found.target);
  });

  test('updateBountyProgress ignores claimed bounties', () => {
    const bounties = generateWeeklyBounties().map((b, i) =>
      i === 0 ? { ...b, claimed: true } : b,
    );
    const updated = updateBountyProgress(bounties, 'totalVolume', 2500);
    const claimed = updated.find(b => b.claimed)!;
    expect(claimed.progress).toBe(0);
  });

  test('getAvailableBounties categorizes correctly', () => {
    let bounties = generateWeeklyBounties();
    bounties = bounties.map((b, i) => {
      if (i === 0) return { ...b, progress: b.target, claimed: true };
      if (i === 1) return { ...b, progress: b.target };
      return b;
    });
    const cat = getAvailableBounties(bounties);
    expect(cat.claimed.length).toBe(1);
    expect(cat.completed.length).toBe(1);
    expect(cat.active.length).toBe(4);
  });
});

describe('DataExport', () => {
  test('exportWorkoutsCSV produces correct headers', async () => {
    const { exportWorkoutsCSV } = await import('../utils/dataExport');
    const csv = exportWorkoutsCSV([]);
    expect(csv).toContain('Date,Program,Duration (s),Verified,Exercise,Set,Reps,Weight (kg),Timestamp');
  });

  test('exportPRsCSV produces correct headers', async () => {
    const { exportPRsCSV } = await import('../utils/dataExport');
    const csv = exportPRsCSV({});
    expect(csv).toContain('Exercise,Max 1RM (kg),Max Weight (kg),Max Reps,Date');
  });

  test('exportNutritionCSV produces correct headers', async () => {
    const { exportNutritionCSV } = await import('../utils/dataExport');
    const csv = exportNutritionCSV([]);
    expect(csv).toContain('Date,Time,Meal Type,Name,Calories,Protein (g),Carbs (g),Fat (g)');
  });
});
