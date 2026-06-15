import { useState, type FormEvent } from 'react';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export default function Battles() {
  const [opponentId, setOpponentId] = useState('');
  const [wager, setWager] = useState('0');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!opponentId) return;
    setLoading(true);
    try {
      await apiClient.post('/api/battles/create', {
        opponent_id: opponentId,
        wager_xp: parseInt(wager) || 0,
      });
      toast.success('Battle created! Waiting for opponent.');
      setOpponentId('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create battle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-white text-lg font-bold font-mono">BATTLES</h1>

      <form onSubmit={handleCreate} className="space-y-3">
        <input
          value={opponentId}
          onChange={(e) => setOpponentId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-rose-500"
          placeholder="Opponent User ID"
        />
        <input
          value={wager}
          onChange={(e) => setWager(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-rose-500"
          placeholder="Wager XP"
          type="number"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-mono text-sm font-bold tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'CREATING...' : 'CHALLENGE'}
        </button>
      </form>

      <p className="text-zinc-600 text-[10px] font-mono text-center">
        Battles list and accept/complete actions coming with full UI.
      </p>
    </div>
  );
}
