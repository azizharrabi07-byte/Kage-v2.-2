import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !user) {
      navigate('/login', { replace: true });
    }
  }, [initialized, user, navigate]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
        <p className="text-zinc-500 font-mono text-xs">LOADING...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
