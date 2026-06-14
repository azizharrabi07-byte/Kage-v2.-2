import type { Achievement, AchievementStats } from '../types';

export function createAchievements(): Achievement[] {
  return [
    {
      id: 'first_blood',
      title: 'First Blood',
      description: 'Complete your first verified workout',
      icon: '⚔️',
      unlocked: false,
      rarity: 'common',
      rewardXP: 100,
      condition: (s: AchievementStats) => s.verifiedWorkouts >= 1,
      progress: (s: AchievementStats) => Math.min(100, (s.verifiedWorkouts / 1) * 100),
    },
    {
      id: 'iron_resolve',
      title: 'Iron Resolve',
      description: 'Complete 10 verified workouts',
      icon: '🛡️',
      unlocked: false,
      rarity: 'common',
      rewardXP: 500,
      rewardTitle: 'Initiate',
      condition: (s: AchievementStats) => s.verifiedWorkouts >= 10,
      progress: (s: AchievementStats) => Math.min(100, (s.verifiedWorkouts / 10) * 100),
    },
    {
      id: 'volume_hunter',
      title: 'Volume Hunter',
      description: 'Accumulate 10,000kg total volume',
      icon: '🏋️',
      unlocked: false,
      rarity: 'rare',
      rewardXP: 1000,
      condition: (s: AchievementStats) => s.totalVolume >= 10000,
      progress: (s: AchievementStats) => Math.min(100, (s.totalVolume / 10000) * 100),
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false,
      rarity: 'rare',
      rewardXP: 1500,
      rewardSkin: 'Shadow',
      condition: (s: AchievementStats) => s.currentStreak >= 7,
      progress: (s: AchievementStats) => Math.min(100, (s.currentStreak / 7) * 100),
    },
    {
      id: 'no_days_off',
      title: 'No Days Off',
      description: 'Maintain a 30-day streak',
      icon: '💀',
      unlocked: false,
      rarity: 'epic',
      rewardXP: 5000,
      condition: (s: AchievementStats) => s.currentStreak >= 30,
      progress: (s: AchievementStats) => Math.min(100, (s.currentStreak / 30) * 100),
    },
    {
      id: 'hydration_ninja',
      title: 'Hydration Ninja',
      description: 'Log 8 cups of water in a day',
      icon: '💧',
      unlocked: false,
      rarity: 'common',
      rewardXP: 200,
      condition: (_s: AchievementStats) => false,
      progress: () => 0,
    },
    {
      id: 'centurion',
      title: 'Centurion',
      description: 'Complete 100 verified workouts',
      icon: '🎖️',
      unlocked: false,
      rarity: 'epic',
      rewardXP: 3000,
      rewardTitle: 'Centurion',
      condition: (s: AchievementStats) => s.verifiedWorkouts >= 100,
      progress: (s: AchievementStats) => Math.min(100, (s.verifiedWorkouts / 100) * 100),
    },
    {
      id: 'heavy_lifter',
      title: 'Heavy Lifter',
      description: 'Log a set with 100kg+',
      icon: '💪',
      unlocked: false,
      rarity: 'rare',
      rewardXP: 800,
      condition: (s: AchievementStats) => s.totalVolume >= 100,
      progress: (s: AchievementStats) => Math.min(100, (s.totalVolume / 100) * 100),
    },
    {
      id: 'ronin_soul',
      title: 'Ronin Soul',
      description: 'Complete 7 days of Ronin Hardcore Mode',
      icon: '🗡️',
      unlocked: false,
      rarity: 'legendary',
      rewardXP: 10000,
      rewardTitle: 'Ronin',
      rewardSkin: 'Shadow Ronin',
      condition: () => false,
      progress: () => 0,
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Work out 5 days in a row',
      icon: '🎯',
      unlocked: false,
      rarity: 'common',
      rewardXP: 300,
      condition: (s: AchievementStats) => s.currentStreak >= 5,
      progress: (s: AchievementStats) => Math.min(100, (s.currentStreak / 5) * 100),
    },
  ];
}

export function checkAllAchievements(achievements: Achievement[], stats: AchievementStats): Achievement[] {
  return achievements.map(a => {
    if (!a.unlocked && a.condition(stats)) {
      return { ...a, unlocked: true };
    }
    return a;
  });
}

export function getProgressForAchievement(a: Achievement, stats: AchievementStats): number {
  return a.progress ? a.progress(stats) : a.unlocked ? 100 : 0;
}

export function calculateStats(workouts: { verified: boolean }[], waterCups: boolean[], totalVolume: number, currentStreak: number): AchievementStats {
  const verifiedWorkouts = workouts.filter(w => w.verified).length;
  return {
    totalWorkouts: workouts.length,
    verifiedWorkouts,
    totalVolume,
    currentStreak,
    bestStreak: currentStreak,
    totalXP: 0,
    hydrationDays: waterCups.filter(c => c).length > 0 ? 1 : 0,
    pactWorkouts: 0,
    bestFormScore: 0,
  };
}
