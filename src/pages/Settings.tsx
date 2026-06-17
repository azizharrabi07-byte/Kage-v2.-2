import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../lib/theme';
import { supabase } from '../lib/supabaseClient';

export default function Settings() {
  const { isLight, toggle } = useTheme();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleUpdateEmail = async () => {
    setMsg('');
    const { error } = await supabase.auth.updateUser({ email });
    setMsg(error ? error.message : 'Verification email sent.');
  };

  const handleUpdatePassword = async () => {
    if (password.length < 6) { setMsg('Password must be 6+ characters'); return; }
    setMsg('');
    const { error } = await supabase.auth.updateUser({ password });
    setMsg(error ? error.message : 'Password updated.');
    if (!error) setPassword('');
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-white text-lg font-bold font-mono">SETTINGS</h1>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-xs font-mono font-bold">Theme</p>
            <p className="text-zinc-600 text-[10px] font-mono">{isLight ? 'Light mode' : 'Dark mode'}</p>
          </div>
          <button onClick={toggle}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold hover:bg-zinc-700 cursor-pointer">
            {isLight ? '🌙 DARK' : '☀ LIGHT'}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 space-y-3">
        <h2 className="text-zinc-400 text-[10px] font-mono font-bold">ACCOUNT</h2>
        <p className="text-zinc-600 text-[10px] font-mono">{user?.email}</p>

        <div className="space-y-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="New email"
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
          <button onClick={handleUpdateEmail}
            className="w-full py-2 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold hover:bg-zinc-700 cursor-pointer">UPDATE EMAIL</button>
        </div>

        <div className="space-y-2">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="New password"
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-600" />
          <button onClick={handleUpdatePassword}
            className="w-full py-2 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold hover:bg-zinc-700 cursor-pointer">UPDATE PASSWORD</button>
        </div>

        {msg && <p className="text-amber-400 text-[10px] font-mono">{msg}</p>}
      </div>

      <button onClick={signOut}
        className="w-full py-3 rounded-lg bg-rose-600/20 border border-rose-600/30 text-rose-400 font-mono text-xs font-bold hover:bg-rose-600/30 cursor-pointer">
        SIGN OUT
      </button>
    </div>
  );
}
