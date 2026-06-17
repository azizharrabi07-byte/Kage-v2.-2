import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface Bounty {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  icon?: string;
}

interface UserBounty {
  id: string;
  bounty_id: string;
  status: string;
}

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [userBounties, setUserBounties] = useState<UserBounty[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const [bRes, ubRes] = await Promise.all([
        apiClient.get('/api/bounties'),
        apiClient.get('/api/bounties/my'),
      ]);
      setBounties(bRes.data ?? []);
      setUserBounties(ubRes.data ?? []);
    } catch {}
  };

  useEffect(() => { fetchAll(); }, []);

  const claimedIds = new Set(userBounties.map((ub) => ub.bounty_id));

  const handleClaim = async (id: string) => {
    setLoading(id);
    try {
      await apiClient.post(`/api/bounties/${id}/claim`);
      toast.success('Bounty claimed!');
      fetchAll();
    } catch { toast.error('Already claimed or failed'); }
    finally { setLoading(null); }
  };

  const handleComplete = async (id: string) => {
    setLoading(id);
    try {
      await apiClient.post(`/api/bounties/${id}/complete`);
      toast.success('Bounty completed! XP awarded.');
      fetchAll();
    } catch { toast.error('Failed to complete'); }
    finally { setLoading(null); }
  };

  const getStatus = (id: string) => {
    const ub = userBounties.find((b) => b.bounty_id === id);
    return ub?.status || null;
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-white text-lg font-bold font-mono">BOUNTIES</h1>

      <div className="space-y-2">
        {bounties.map((b) => {
          const status = getStatus(b.id);
          return (
            <div key={b.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{b.icon || '🎯'}</span>
                    <h3 className="text-white text-sm font-bold font-mono">{b.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-[10px] font-mono mt-1">{b.description}</p>
                  <p className="text-amber-400 text-[10px] font-mono mt-1 font-bold">+{b.xp_reward} XP</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {!status && (
                    <button onClick={() => handleClaim(b.id)} disabled={loading === b.id}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-[9px] font-bold hover:bg-rose-500 disabled:opacity-50 cursor-pointer">
                      {loading === b.id ? '...' : 'CLAIM'}
                    </button>
                  )}
                  {status === 'claimed' && (
                    <button onClick={() => handleComplete(b.id)} disabled={loading === b.id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono text-[9px] font-bold hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">
                      {loading === b.id ? '...' : 'COMPLETE'}
                    </button>
                  )}
                  {status === 'completed' && (
                    <span className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-500 font-mono text-[9px]">DONE</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {bounties.length === 0 && (
          <p className="text-zinc-600 text-xs font-mono text-center py-8">No bounties available</p>
        )}
      </div>
    </div>
  );
}
