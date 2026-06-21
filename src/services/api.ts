import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const BASE_URL = 'http://192.168.1.7:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      supabase.auth.signOut().catch(() => {});
    }
    return Promise.reject(err);
  },
);

export async function get(path: string) {
  const res = await api.get(path);
  return res.data;
}

export async function post(path: string, body?: Record<string, unknown>) {
  const res = await api.post(path, body ?? {});
  return res.data;
}

export default api;
