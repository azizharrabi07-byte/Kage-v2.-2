import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

interface Session {
  id: string;
  created_at: string;
  notes?: string;
}

export default function WorkoutChart({ isLight }: { isLight?: boolean }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    apiClient.get('/api/workout-sessions').then((r) => setSessions(r.data?.items ?? r.data ?? [])).catch(() => {});
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);

  const weekData = days.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = sessions.filter((s) => s.created_at?.startsWith(dateStr)).length;
    return { day: days[i], date: dateStr, count };
  });

  const maxCount = Math.max(1, ...weekData.map((d) => d.count));

  return (
    <div className={`rounded-xl p-4 border ${isLight ? 'bg-white/60 border-stone-200' : 'bg-black/20 border-white/10'}`}>
      <h3 className={`text-xs font-bold font-mono mb-3 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>THIS WEEK</h3>
      <div className="flex items-end gap-2 h-24">
        {weekData.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <span className={`text-[8px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{d.count || ''}</span>
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${(d.count / maxCount) * 80}px`,
                minHeight: d.count > 0 ? '4px' : '2px',
                background: d.count > 0
                  ? 'linear-gradient(180deg, #E31E24 0%, #7C1A1C 100%)'
                  : (isLight ? '#E7E5E4' : '#27272A'),
              }}
            />
            <span className={`text-[8px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-600'}`}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
