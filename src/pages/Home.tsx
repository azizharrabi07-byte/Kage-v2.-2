import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../lib/theme';

export default function Home() {
  const profile = useAuthStore((s) => s.profile);
  const { isLight, toggle } = useTheme();

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6 pb-8">
      <div className="flex justify-between items-center py-4">
        <div>
          <h1 className="text-3xl font-black text-white font-mono">KAGE</h1>
          <p className="text-zinc-500 text-xs font-mono mt-1">
            Welcome{profile?.name ? `, ${profile.name}` : ' Warrior'}
          </p>
        </div>
        <button
          onClick={toggle}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 font-mono text-[10px] hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {isLight ? '🌙 DARK' : '☀ LIGHT'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NavCard to="/workout" label="TRAIN" sub="Log your workout" />
        <NavCard to="/programs" label="PROGRAMS" sub="Find your path" />
        <NavCard to="/diet" label="DIET PLANS" sub="Nutrition programs" />
        <NavCard to="/nutrition" label="NUTRITION" sub="Track meals" />
        <NavCard to="/sensei" label="SENSEI" sub="AI coach" />
        <NavCard to="/battles" label="BATTLES" sub="Compete" />
        <NavCard to="/bounties" label="BOUNTIES" sub="Daily challenges" />
        <NavCard to="/leaderboard" label="RANKINGS" sub="Leaderboard" />
        <NavCard to="/calendar" label="CALENDAR" sub="Workout history" />
        <NavCard to="/profile" label="PROFILE" sub="Your stats" />
        <NavCard to="/settings" label="SETTINGS" sub="Preferences" />
      </div>
    </div>
  );
}

function NavCard({ to, label, sub }: { to: string; label: string; sub: string }) {
  return (
    <Link
      to={to}
      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-rose-500/50 transition-colors block"
    >
      <p className="text-white text-sm font-bold font-mono">{label}</p>
      <p className="text-zinc-500 text-[9px] font-mono mt-1">{sub}</p>
    </Link>
  );
}
