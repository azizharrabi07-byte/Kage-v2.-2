import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Achievement, AchievementStats } from '../types';

export const WEB_DESIGNER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood', title: 'First Blood', description: 'Complete your first workout',
    icon: '⚔️', unlocked: false, rarity: 'common',
    rewardXP: 50, rewardTitle: 'Initiate',
    condition: s => s.totalWorkouts >= 1,
    progress: s => Math.min(s.totalWorkouts / 1, 1)
  },
  {
    id: 'iron_will', title: 'Iron Will', description: 'Complete 10 workouts',
    icon: '🛡️', unlocked: false, rarity: 'common',
    rewardXP: 100,
    condition: s => s.totalWorkouts >= 10,
    progress: s => Math.min(s.totalWorkouts / 10, 1)
  },
  {
    id: 'steel_discipline', title: 'Steel Discipline', description: 'Complete 50 workouts',
    icon: '⚡', unlocked: false, rarity: 'rare',
    rewardXP: 250, rewardTitle: 'Warrior',
    condition: s => s.totalWorkouts >= 50,
    progress: s => Math.min(s.totalWorkouts / 50, 1)
  },
  {
    id: 'immortal', title: 'Immortal', description: 'Complete 100 workouts',
    icon: '🔥', unlocked: false, rarity: 'epic',
    rewardXP: 500, rewardTitle: 'Immortal',
    condition: s => s.totalWorkouts >= 100,
    progress: s => Math.min(s.totalWorkouts / 100, 1)
  },
  {
    id: 'verified_warrior', title: 'Verified Warrior', description: 'Complete 10 verified workouts',
    icon: '✅', unlocked: false, rarity: 'common',
    rewardXP: 100,
    condition: s => s.verifiedWorkouts >= 10,
    progress: s => Math.min(s.verifiedWorkouts / 10, 1)
  },
  {
    id: 'unbreakable', title: 'Unbreakable', description: 'Maintain a 7-day streak',
    icon: '🔗', unlocked: false, rarity: 'rare',
    rewardXP: 200,
    condition: s => s.currentStreak >= 7,
    progress: s => Math.min(s.currentStreak / 7, 1)
  },
  {
    id: 'legendary_streak', title: 'Legendary Streak', description: 'Maintain a 30-day streak',
    icon: '👑', unlocked: false, rarity: 'legendary',
    rewardXP: 1000, rewardTitle: 'Legend',
    condition: s => s.currentStreak >= 30,
    progress: s => Math.min(s.currentStreak / 30, 1)
  },
  {
    id: 'volume_monster', title: 'Volume Monster', description: 'Accumulate 50,000 lbs total volume',
    icon: '💪', unlocked: false, rarity: 'epic',
    rewardXP: 400,
    condition: s => s.totalVolume >= 50000,
    progress: s => Math.min(s.totalVolume / 50000, 1)
  },
  {
    id: 'hydration_ninja', title: 'Hydration Ninja', description: 'Track water for 7 days',
    icon: '💧', unlocked: false, rarity: 'common',
    rewardXP: 75,
    condition: s => s.hydrationDays >= 7,
    progress: s => Math.min(s.hydrationDays / 7, 1)
  },
  {
    id: 'buddy_system', title: 'Buddy System', description: 'Complete 10 pact workouts',
    icon: '🤝', unlocked: false, rarity: 'rare',
    rewardXP: 200, rewardTitle: 'Ally',
    condition: s => s.pactWorkouts >= 10,
    progress: s => Math.min(s.pactWorkouts / 10, 1)
  },
  {
    id: 'form_master', title: 'Form Master', description: 'Achieve a form score of 95+',
    icon: '🎯', unlocked: false, rarity: 'epic',
    rewardXP: 300,
    condition: s => s.bestFormScore >= 95,
    progress: s => Math.min(s.bestFormScore / 95, 1)
  },
  {
    id: 'xp_hunter', title: 'XP Hunter', description: 'Earn 5,000 total XP',
    icon: '⭐', unlocked: false, rarity: 'rare',
    rewardXP: 300,
    condition: s => s.totalXP >= 5000,
    progress: s => Math.min(s.totalXP / 5000, 1)
  },
];

export function useAchievements(workoutCount: number, verifiedCount: number, totalVolume: number, currentStreak: number, hydrationDays: number, pactWorkouts: number, bestFormScore: number, totalXP: number) {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('kage_achievements', WEB_DESIGNER_ACHIEVEMENTS.map(a => ({ ...a })));
  const [xp, setXp] = useLocalStorage<number>('kage_xp', 0);
  const [bonusXP, setBonusXP] = useLocalStorage<number>('kage_bonus_xp', 0);
  const [recentUnlocks, setRecentUnlocks] = useLocalStorage<string[]>('kage_recent_unlocks', []);

  const stats: AchievementStats = useMemo(() => ({
    totalWorkouts: workoutCount,
    verifiedWorkouts: verifiedCount,
    totalVolume,
    currentStreak,
    bestStreak: 0,
    totalXP: xp + bonusXP,
    hydrationDays,
    pactWorkouts,
    bestFormScore,
  }), [workoutCount, verifiedCount, totalVolume, currentStreak, hydrationDays, pactWorkouts, bestFormScore, xp, bonusXP]);

  const checkAchievements = () => {
    const newUnlocks: string[] = [];
    setAchievements(prev => prev.map(a => {
      if (!a.unlocked && a.condition(stats)) {
        newUnlocks.push(a.id);
        setXp(x => x + (a.rewardXP || 0));
        if (a.rewardTitle) {
          setBonusXP(x => x + 100);
        }
        return { ...a, unlocked: true };
      }
      return a;
    }));
    if (newUnlocks.length > 0) {
      setRecentUnlocks(prev => [...newUnlocks, ...prev].slice(0, 5));
    }
    return newUnlocks;
  };

  const getProgress = (achievementId: string): number => {
    const a = achievements.find(ach => ach.id === achievementId);
    if (!a || !a.progress) return a?.unlocked ? 1 : 0;
    return a.progress(stats);
  };

  return { achievements, setAchievements, xp, setXp, bonusXP, recentUnlocks, checkAchievements, getProgress, stats };
}
