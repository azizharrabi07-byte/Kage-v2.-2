import { useState, useEffect, type FormEvent } from 'react';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface Battle {
  id: string;
  challenger_id: string;
  opponent_id: string;
  status: string;
  wager_xp: number;
  winner_id?: string;
  created_at: string;
}

export default function Battles() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [opponentId, setOpponentId] = useState('');
  const [wager, setWager] = useState('0');
  const [loading, setLoading] = useState(false);

  const fetchBattles = () => {
    apiClient.get('/api/battles').then((r) => setBattles(r.data ?? [])).catch(() => {});
  };

  useEffect(() => { fetchBattles(); }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!opponentId) return;
    setLoading(true);
    try {
      await apiClient.post('/api/battles/create', { opponent_id: opponentId, wager_xp: parseInt(wager) || 0 });
      toast.success('Battle created!');
      setOpponentId('');
      fetchBattles();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-white text-lg font-bold font-mono">BATTLES</h1>

      <form onSubmit={handleCreate} className="space-y-3">
        <input value={opponentId} onChange={(e) => setOpponentId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder-zinc-600"
          placeholder="Opponent User ID" />
        <input value={wager} onChange={(e) => setWager(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono"
          placeholder="Wager XP" type="number" />
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-mono text-sm font-bold tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer">
          {loading ? 'CREATING...' : 'CHALLENGE'}
        </button>
      </form>

      <div className="space-y-2">
        {battles.map((b) => (
          <div key={b.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-xs font-mono font-bold">
                  vs {b.opponent_id.slice(0, 8)}...
                </p>
                <p className={`text-[10px] font-mono mt-1 ${
                  b.status === 'completed' ? 'text-emerald-400' :
                  b.status === 'active' ? 'text-amber-400' : 'text-zinc-500'
                }`}>{b.status.toUpperCase()}</p>
                {b.wager_xp > 0 && <p className="text-zinc-600 text-[9px] font-mono mt-1">Wager: {b.wager_xp} XP</p>}
              </div>
              <span className="text-zinc-600 text-[9px] font-mono">
                {new Date(b.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {battles.length === 0 && (
          <p className="text-zinc-600 text-xs font-mono text-center py-4">No battles yet. Challenge someone!</p>
        )}
      </div>
    </div>
  );
}
