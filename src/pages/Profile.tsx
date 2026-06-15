import { useEffect } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { useAuthStore } from '../stores/authStore';

export default function Profile() {
  const { xp, level, rankIndex, streak, workoutsCompleted, achievements, fetchProgress } = useProgressStore();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-bold font-mono">{profile?.name || 'Warrior'}</h1>
          <p className="text-zinc-500 text-xs font-mono">{profile?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 font-mono text-[10px] hover:bg-zinc-700 cursor-pointer"
        >
          SIGN OUT
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="LEVEL" value={String(level)} />
        <StatCard label="XP" value={String(xp)} />
        <StatCard label="STREAK" value={`${streak} days`} />
        <StatCard label="WORKOUTS" value={String(workoutsCompleted)} />
      </div>

      {achievements.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-zinc-400 text-xs font-mono font-bold tracking-wider">ACHIEVEMENTS</h2>
          {achievements.map((ach) => (
            <div key={ach.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <p className="text-white text-sm font-mono">{ach.name}</p>
              <p className="text-zinc-500 text-[10px] font-mono">{ach.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
      <p className="text-zinc-500 text-[9px] font-mono tracking-wider">{label}</p>
      <p className="text-white text-xl font-bold font-mono mt-1">{value}</p>
    </div>
  );
}
