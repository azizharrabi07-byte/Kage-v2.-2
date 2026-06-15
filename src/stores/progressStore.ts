import { create } from 'zustand';
import apiClient from '../services/apiClient';

interface Achievement {
  id: string;
  name: string;
  description: string;
}

interface Session {
  id: string;
  started_at: string;
  completed_at: string | null;
  total_xp_earned: number;
}

interface ProgressState {
  xp: number;
  level: number;
  rankIndex: number;
  streak: number;
  workoutsCompleted: number;
  achievements: Achievement[];
  recentSessions: Session[];
  totalSessions: number;
  loading: boolean;
  fetchProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  xp: 0,
  level: 1,
  rankIndex: 0,
  streak: 0,
  workoutsCompleted: 0,
  achievements: [],
  recentSessions: [],
  totalSessions: 0,
  loading: false,

  fetchProgress: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get('/api/progress/stats');
      set({
        xp: res.data.xp ?? 0,
        level: res.data.level ?? 1,
        rankIndex: res.data.rank_index ?? 0,
        streak: res.data.streak ?? 0,
        workoutsCompleted: res.data.workouts_completed ?? 0,
        achievements: res.data.achievements ?? [],
        recentSessions: res.data.recent_sessions ?? [],
        totalSessions: res.data.total_sessions ?? 0,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
