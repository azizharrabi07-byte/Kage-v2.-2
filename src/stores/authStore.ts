import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

const DEV_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@kage.dojo',
  app_metadata: {},
  user_metadata: { name: 'Dev Warrior' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

interface AuthState {
  session: unknown | null;
  user: User | null;
  profile: Record<string, unknown> | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  devLogin: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  initialized: false,

  initialize: async () => {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ session, user: session.user, initialized: true });
      } else {
        // Check if backend has DEV_BYPASS_AUTH by hitting an endpoint
        const apiClient = (await import('../services/apiClient')).default;
        try {
          const r = await apiClient.get('/api/auth/me');
          if (r.status === 200 || r.status < 500) {
            set({ user: DEV_USER, profile: r.data, initialized: true });
            return;
          }
        } catch {
          // Backend might not be running - still set dev user
          set({ user: DEV_USER, initialized: true });
          return;
        }
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }

    try {
      const { supabase } = await import('../lib/supabaseClient');
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user ?? null });
        if (session?.user) {
          try {
            const apiClient = (await import('../services/apiClient')).default;
            const res = await apiClient.get('/api/auth/me');
            set({ profile: res.data });
          } catch {
            set({ profile: null });
          }
        } else {
          set({ profile: null });
        }
      });
    } catch {}
  },

  signIn: async (email, password) => {
    const { supabase } = await import('../lib/supabaseClient');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signUp: async (email, password, name) => {
    const { supabase } = await import('../lib/supabaseClient');
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) throw error;
  },

  devLogin: () => {
    set({ user: DEV_USER, session: { user: DEV_USER }, initialized: true });
  },

  signOut: async () => {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      await supabase.auth.signOut();
    } catch {}
    set({ session: null, user: null, profile: null });
  },
}));
