import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
  const profile = useAuthStore((s) => s.profile);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-black text-white font-mono">KAGE</h1>
        <p className="text-zinc-500 text-xs font-mono mt-2">
          Welcome{profile?.name ? `, ${profile.name}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NavCard to="/workout" label="TRAIN" sub="Log your workout" />
        <NavCard to="/programs" label="PROGRAMS" sub="Find your path" />
        <NavCard to="/sensei" label="SENSEI" sub="AI coach" />
        <NavCard to="/battles" label="BATTLES" sub="Compete" />
        <NavCard to="/profile" label="PROFILE" sub="Your stats" />
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
