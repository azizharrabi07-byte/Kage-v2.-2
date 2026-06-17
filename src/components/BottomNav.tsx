import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'HOME', icon: '⌂' },
  { path: '/workout', label: 'TRAIN', icon: '⚔' },
  { path: '/programs', label: 'PROGRAMS', icon: '⊞' },
  { path: '/sensei', label: 'SENSEI', icon: '◉' },
  { path: '/profile', label: 'PROFILE', icon: '◎' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname;

  if (current === '/login') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0A0A0F]/95 backdrop-blur-xl">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = current === item.path || (item.path !== '/' && current.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                active ? 'text-rose-400' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[8px] font-mono font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
