import { useState, useEffect, type FormEvent } from 'react';
import { useWorkoutStore } from '../stores/workoutStore';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
}

export default function WorkoutLog() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedEx, setSelectedEx] = useState<string>('');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('0');
  const [sessionName, setSessionName] = useState('Training Session');
  const { startWorkout, logSet, completeWorkout, loading } = useWorkoutStore();

  useEffect(() => {
    apiClient.get('/api/exercises').then((res) => setExercises(res.data ?? [])).catch(() => {});
  }, []);

  const handleStart = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEx) return toast.error('Select an exercise');
    try {
      await startWorkout(sessionName, [
        { exercise_id: selectedEx, sort_order: 0, completed: false, sets: [] },
      ]);
      toast.success('Workout started');
    } catch {
      toast.error('Failed to start workout');
    }
  };

  const handleLog = () => {
    logSet(0, {
      set_number: Date.now(),
      reps: parseInt(reps) || 10,
      weight_kg: parseInt(weight) || 0,
      completed: true,
    });
    toast.success('Set logged');
  };

  const handleComplete = async () => {
    try {
      await completeWorkout();
      toast.success('Workout saved! XP earned.');
    } catch {
      toast.error('Failed to save workout');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-white text-lg font-bold font-mono">WORKOUT LOG</h1>

      <form onSubmit={handleStart} className="space-y-3">
        <input
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono"
          placeholder="Session name"
        />
        <select
          value={selectedEx}
          onChange={(e) => setSelectedEx(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono"
        >
          <option value="">Select exercise</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono"
            placeholder="Reps"
            type="number"
          />
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono"
            placeholder="Weight (kg)"
            type="number"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-rose-600 text-white font-mono text-sm font-bold tracking-widest hover:bg-rose-500 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'STARTING...' : 'START WORKOUT'}
        </button>
      </form>

      <div className="flex gap-2">
        <button
          onClick={handleLog}
          className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-mono text-xs font-bold hover:bg-zinc-700 cursor-pointer"
        >
          LOG SET
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-500 cursor-pointer"
        >
          COMPLETE
        </button>
      </div>
    </div>
  );
}
