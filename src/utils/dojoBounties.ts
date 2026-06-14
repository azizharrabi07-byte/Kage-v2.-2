export interface Bounty {
  id: string;
  title: string;
  description: string;
  objective: string;
  target: number;
  progress: number;
  rewardXP: number;
  rewardTitle?: string;
  rewardSkin?: string;
  expiresAt: string;
  claimed: boolean;
}

const WEEKLY_BOUNTIES: Omit<Bounty, 'id' | 'progress' | 'claimed' | 'expiresAt'>[] = [
  { title: 'Volume Crusher', description: 'Lift 5,000kg total this week', objective: 'totalVolume', target: 5000, rewardXP: 2000 },
  { title: 'Streak Guardian', description: 'Work out 5 days this week', objective: 'workoutDays', target: 5, rewardXP: 1500, rewardTitle: 'Guardian' },
  { title: 'Pull-Up King', description: 'Complete 100 pull-ups this week', objective: 'pullups', target: 100, rewardXP: 1800 },
  { title: 'Cardio Demon', description: 'Burn 2,000 calories through cardio', objective: 'cardioCalories', target: 2000, rewardXP: 1600 },
  { title: 'Early Bird', description: 'Log 3 workouts before 7 AM', objective: 'earlyWorkouts', target: 3, rewardXP: 1200 },
  { title: 'Iron Will', description: 'Complete every workout this week verified', objective: 'verifiedWorkouts', target: 5, rewardXP: 2500, rewardSkin: 'Iron Will' },
];

export function generateWeeklyBounties(): Bounty[] {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (7 - expiresAt.getDay()));
  expiresAt.setHours(23, 59, 59, 0);

  return WEEKLY_BOUNTIES.map((b, i) => ({
    ...b,
    id: `bounty_${i}_${Date.now()}`,
    progress: 0,
    claimed: false,
    expiresAt: expiresAt.toISOString(),
  }));
}

export function updateBountyProgress(bounties: Bounty[], objective: string, amount: number): Bounty[] {
  return bounties.map(b => {
    if (b.claimed || b.objective !== objective) return b;
    const newProgress = Math.min(b.target, b.progress + amount);
    return { ...b, progress: newProgress };
  });
}

export function getAvailableBounties(bounties: Bounty[]): { claimed: Bounty[]; active: Bounty[]; completed: Bounty[] } {
  return {
    claimed: bounties.filter(b => b.claimed),
    active: bounties.filter(b => !b.claimed && b.progress < b.target),
    completed: bounties.filter(b => !b.claimed && b.progress >= b.target),
  };
}
