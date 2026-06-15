import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

interface Program {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    apiClient.get('/api/programs').then((res) => setPrograms(res.data ?? [])).catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-white text-lg font-bold font-mono">PROGRAMS</h1>
      {programs.map((p) => (
        <div key={p.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <h3 className="text-white text-sm font-bold font-mono">{p.name}</h3>
          <p className="text-zinc-400 text-[10px] font-mono mt-1">{p.description}</p>
          <div className="flex gap-3 mt-2 text-[9px] font-mono text-zinc-600">
            <span>{p.difficulty}</span>
            <span>{p.duration}</span>
          </div>
        </div>
      ))}
      {programs.length === 0 && (
        <p className="text-zinc-600 text-xs font-mono text-center py-8">No programs loaded yet. Connect to backend.</p>
      )}
    </div>
  );
}
