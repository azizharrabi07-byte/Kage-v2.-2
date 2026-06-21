import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/api';
import toast from 'react-hot-toast';

export default function WorkoutSessionPage() {
  const navigate = useNavigate();
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('0');
  const [sets, setSets] = useState<{ reps: number; weight: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const startTimer = () => {
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t >= 90) { clearInterval(interval); setTimerActive(false); return 0; }
        return t + 1;
      });
    }, 1000);
  };

  const handleAddSet = () => {
    const r = parseInt(reps) || 10;
    const w = parseInt(weight) || 0;
    setSets((prev) => [...prev, { reps: r, weight: w }]);

    // Muscle Memory: haptic feedback
    try {
      navigator.vibrate([100, 50, 100]);
    } catch {}
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 800;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 100);
    } catch {}

    startTimer();
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await post('/api/workout-sessions', {
        exercises: [{ exercise_id: '00000000-0000-0000-0000-000000000001', sets: sets.map((s, i) => ({ set_number: i + 1, reps: s.reps, weight_kg: s.weight, completed: true })) }],
      });
      // Upload ghost
      try {
        await post('/api/ghosts/upload', {
          exercise_data: { sets: sets.map((s) => ({ reps: s.reps, weight: s.weight })) },
          xp_earned: sets.reduce((sum, s) => sum + s.reps * s.weight, 0) / 10,
        });
      } catch {}
      toast.success('Workout saved! Ghost uploaded.');
      navigate('/');
    } catch {
      toast.error('Failed to save workout');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">WORKOUT</h1>

      {/* Timer */}
      <div className="rounded-xl bg-[#1a1a2e] border border-zinc-800 p-4 text-center">
        <p className="text-4xl font-mono font-bold text-white">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
        <p className="text-zinc-600 text-[10px] font-mono mt-1">{timerActive ? 'Rest between sets' : 'Tap + to log a set'}</p>
      </div>

      {/* Sets Logged */}
      <div className="space-y-1">
        {sets.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800">
            <span className="text-zinc-400 text-xs font-mono">Set {i + 1}</span>
            <span className="text-white text-xs font-mono">{s.reps} reps × {s.weight}kg</span>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div className="flex gap-2">
        <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" type="number"
          className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a2e] border border-zinc-800 text-white text-sm font-mono" />
        <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" type="number"
          className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a2e] border border-zinc-800 text-white text-sm font-mono" />
        <button onClick={handleAddSet}
          className="px-6 py-3 rounded-xl bg-[#e94560] text-white font-mono text-xs font-bold hover:opacity-90 cursor-pointer">+ SET</button>
      </div>

      {sets.length > 0 && (
        <button onClick={handleComplete} disabled={saving}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4caf50] to-[#2e7d32] text-white font-mono text-sm font-bold tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer">
          {saving ? 'SAVING...' : '✓ COMPLETE WORKOUT'}
        </button>
      )}
    </div>
  );
}
