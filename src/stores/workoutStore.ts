import { create } from 'zustand';
import apiClient from '../services/apiClient';

interface ExerciseSet {
  set_number: number;
  reps: number;
  weight_kg: number;
  completed: boolean;
}

interface SessionExercise {
  exercise_id: string;
  sort_order: number;
  completed: boolean;
  sets: ExerciseSet[];
}

interface WorkoutState {
  currentSessionId: string | null;
  exercises: SessionExercise[];
  loading: boolean;
  startWorkout: (name: string, exercises: SessionExercise[]) => Promise<string>;
  logSet: (exerciseIndex: number, set: ExerciseSet) => void;
  completeWorkout: () => Promise<void>;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentSessionId: null,
  exercises: [],
  loading: false,

  startWorkout: async (name, exercises) => {
    set({ loading: true });
    try {
      const res = await apiClient.post('/api/workout-sessions', {
        name,
        exercises,
        started_at: new Date().toISOString(),
      });
      set({ currentSessionId: res.data.id, exercises, loading: false });
      return res.data.id;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logSet: (exerciseIndex, setData) => {
    const exercises = [...get().exercises];
    if (exercises[exerciseIndex]) {
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        sets: [...exercises[exerciseIndex].sets, setData],
      };
      set({ exercises });
    }
  },

  completeWorkout: async () => {
    const { currentSessionId, exercises } = get();
    if (!currentSessionId) return;
    set({ loading: true });
    try {
      await apiClient.post('/api/workout-sessions/log', {
        session_id: currentSessionId,
        exercises: exercises.map((ex) => ({
          ...ex,
          completed: true,
        })),
        completed_at: new Date().toISOString(),
      });
      set({ loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  reset: () => set({ currentSessionId: null, exercises: [], loading: false }),
}));
