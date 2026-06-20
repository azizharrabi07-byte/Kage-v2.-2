import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface Contract {
  id: string; exercise_name: string; weight_kg: number;
  reps: number; sets: number; xp_staked: number;
  xp_potential: number; status: string; narrative: string;
}

export default function TrainPage() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [hapticOn, setHapticOn] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchContract = async () => {
    try {
      const r = await apiClient.get('/api/contracts/today');
      if (r.data?.id) setContract(r.data);
    } catch {}
  };

  useEffect(() => { fetchContract(); }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const r = await apiClient.post('/api/contracts/generate');
      setContract(r.data);
      toast.success('Contract received!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Already have a contract today');
    } finally { setLoading(false); }
  };

  const handleStake = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const r = await apiClient.post(`/api/contracts/${contract.id}/stake`, { amount: contract.xp_potential });
      setContract(r.data);
      toast.success(`XP staked! Complete for ${contract.xp_potential * 2} XP!`);
    } catch { toast.error('Failed to stake'); }
    finally { setLoading(false); }
  };

  const handleComplete = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const r = await apiClient.post(`/api/contracts/${contract.id}/complete`, { sensor_data: {} });
      toast.success(`+${r.data.xp_earned} XP earned!`);
      setCompleted(true);
      // Upload ghost
      try {
        await apiClient.post('/api/ghosts/upload', {
          exercise_data: { exercise_name: contract.exercise_name, weight_kg: contract.weight_kg, reps: contract.reps, sets: contract.sets },
          xp_earned: r.data.xp_earned,
        });
      } catch {}
    } catch { toast.error('Failed to complete'); }
    finally { setLoading(false); }
  };

  const handleFail = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const r = await apiClient.post(`/api/contracts/${contract.id}/fail`);
      toast.error(`-${r.data.xp_lost} XP lost!`);
      setCompleted(true);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">TRAIN</h1>

      {/* Haptic/Audio Toggle */}
      <div className="flex items-center justify-between rounded-xl bg-zinc-900/80 border border-zinc-800 p-3">
        <span className="text-zinc-300 text-xs font-mono">Muscle Memory</span>
        <button
          onClick={() => setHapticOn(!hapticOn)}
          className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-colors ${
            hapticOn ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-500'
          }`}
        >
          {hapticOn ? '🔊 ON' : '🔇 OFF'}
        </button>
      </div>

      {/* Contract */}
      {contract && !completed && (
        <div className="rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/80 border border-amber-500/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 text-[10px] font-mono font-bold tracking-widest">⚔ DAILY CONTRACT</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              contract.status === 'active' ? 'bg-amber-500/20 text-amber-400' :
              contract.status === 'pending' ? 'bg-zinc-800 text-zinc-500' : ''
            }`}>{contract.status.toUpperCase()}</span>
          </div>

          <div className="text-center py-4">
            <h2 className="text-white text-xl font-black font-mono">{contract.exercise_name}</h2>
            <div className="flex justify-center gap-6 mt-3">
              <div className="text-center"><p className="text-amber-400 text-lg font-bold font-mono">{contract.sets}</p><p className="text-zinc-600 text-[8px] font-mono">SETS</p></div>
              <div className="text-center"><p className="text-amber-400 text-lg font-bold font-mono">{contract.reps}</p><p className="text-zinc-600 text-[8px] font-mono">REPS</p></div>
              {contract.weight_kg > 0 && <div className="text-center"><p className="text-amber-400 text-lg font-bold font-mono">{contract.weight_kg}kg</p><p className="text-zinc-600 text-[8px] font-mono">WEIGHT</p></div>}
            </div>
          </div>

          {contract.narrative && (
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-zinc-400 text-[10px] font-mono italic leading-relaxed">"{contract.narrative}"</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-zinc-500 text-xs font-mono">Potential: <span className="text-amber-400 font-bold">+{contract.xp_potential} XP</span></span>
            {contract.xp_staked > 0 && <span className="text-rose-400 text-xs font-mono font-bold">Staked: {contract.xp_staked} XP</span>}
          </div>

          <div className="flex gap-2">
            {contract.status === 'pending' && (
              <button onClick={handleStake} disabled={loading}
                className="flex-1 py-3 rounded-lg bg-amber-600 text-white font-mono text-xs font-bold hover:bg-amber-500 disabled:opacity-50 cursor-pointer">
                {loading ? '...' : 'STAKE XP (DOUBLE OR NOTHING)'}
              </button>
            )}
            <button onClick={handleComplete} disabled={loading || contract.status === 'pending'}
              className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
              {loading ? '...' : '⚔ COMPLETE'}
            </button>
            <button onClick={handleFail} disabled={loading}
              className="flex-1 py-3 rounded-lg bg-rose-600/30 text-rose-400 font-mono text-xs font-bold hover:bg-rose-600/50 disabled:opacity-50 cursor-pointer">
              FAIL
            </button>
          </div>
        </div>
      )}

      {!contract && !completed && (
        <div className="text-center py-12 space-y-4">
          <p className="text-zinc-500 text-sm font-mono">No contract for today</p>
          <button onClick={handleGenerate} disabled={loading}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-mono text-sm font-bold tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer">
            {loading ? 'SUMMONING...' : '⚔ OPEN CONTRACT'}
          </button>
        </div>
      )}

      {completed && (
        <div className="text-center py-8">
          <p className="text-emerald-400 text-lg font-mono font-bold">CONTRACT COMPLETE</p>
          <p className="text-zinc-500 text-xs font-mono mt-2">Your ghost has been uploaded to the dojo</p>
          <button onClick={() => { setCompleted(false); setContract(null); fetchContract(); }}
            className="mt-4 px-6 py-3 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-xs hover:bg-zinc-700 cursor-pointer">
            NEXT CONTRACT
          </button>
        </div>
      )}
    </div>
  );
}
