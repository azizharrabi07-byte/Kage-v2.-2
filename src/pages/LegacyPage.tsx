import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface Scroll {
  id: string; week_number: number;
  content: { scenes: { title: string; text: string }[] };
  shared: boolean; created_at: string;
}

interface Progress { xp: number; level: number; streak: number; workoutsCompleted: number; }

export default function LegacyPage() {
  const [scrolls, setScrolls] = useState<Scroll[]>([]);
  const [currentScroll, setCurrentScroll] = useState<Scroll | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    apiClient.get('/api/legacy/scrolls').then((r) => {
      setScrolls(r.data ?? []);
      if (r.data?.length > 0) setCurrentScroll(r.data[0]);
    }).catch(() => {});
    apiClient.get('/api/progress/stats').then((r) => setProgress(r.data)).catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const r = await apiClient.post('/api/legacy/scrolls/generate');
      setCurrentScroll(r.data);
      setScrolls((prev) => [r.data, ...prev]);
      toast.success('Your legacy scroll has been written!');
    } catch { toast.error('Failed to generate scroll'); }
    finally { setGenerating(false); }
  };

  const handleShare = async () => {
    if (!currentScroll) return;
    try {
      await apiClient.post(`/api/legacy/scrolls/${currentScroll.id}/share`);
      toast.success('Scroll shared!');
      setCurrentScroll({ ...currentScroll, shared: true });
    } catch { toast.error('Failed to share'); }
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">LEGACY</h1>

      {/* Progress Summary */}
      {progress && (
        <div className="flex justify-around rounded-xl bg-zinc-900/80 border border-zinc-800 p-3">
          <div className="text-center"><p className="text-amber-400 text-lg font-bold font-mono">{progress.level}</p><p className="text-zinc-600 text-[8px] font-mono">LEVEL</p></div>
          <div className="text-center"><p className="text-white text-lg font-bold font-mono">{progress.xp}</p><p className="text-zinc-600 text-[8px] font-mono">XP</p></div>
          <div className="text-center"><p className="text-rose-400 text-lg font-bold font-mono">🔥{progress.streak}</p><p className="text-zinc-600 text-[8px] font-mono">STREAK</p></div>
        </div>
      )}

      {/* Current Scroll */}
      {currentScroll?.content?.scenes && (
        <div className="rounded-xl bg-gradient-to-b from-amber-900/20 to-zinc-900/80 border border-amber-500/20 p-6 space-y-4">
          <div className="text-center">
            <span className="text-amber-400 text-[10px] font-mono tracking-widest">WEEK {currentScroll.week_number}</span>
            <h2 className="text-white text-lg font-black font-mono mt-1">LEGACY SCROLL</h2>
          </div>

          <div className="space-y-4">
            {currentScroll.content.scenes.map((scene, i) => (
              <div key={i}>
                <h3 className="text-rose-400 text-xs font-mono font-bold mb-1">
                  {['⚔', '🔥', '✨'][i]} {scene.title}
                </h3>
                <p className="text-zinc-300 text-[10px] font-mono leading-relaxed">{scene.text}</p>
              </div>
            ))}
          </div>

          <button onClick={handleShare}
            className="w-full py-2 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold hover:bg-amber-600/30 cursor-pointer">
            {currentScroll.shared ? '✓ SHARED' : '📤 SHARE YOUR SCROLL'}
          </button>
        </div>
      )}

      {!currentScroll && (
        <div className="text-center py-12 space-y-4">
          <p className="text-zinc-500 text-sm font-mono">No scrolls yet</p>
          <button onClick={handleGenerate} disabled={generating}
            className="px-6 py-3 rounded-xl bg-amber-600 text-white font-mono text-xs font-bold hover:bg-amber-500 disabled:opacity-50 cursor-pointer">
            {generating ? 'WRITING...' : '📜 GENERATE YOUR LEGACY'}
          </button>
        </div>
      )}

      {/* Scroll Archive */}
      {scrolls.length > 1 && (
        <div className="space-y-1">
          <p className="text-zinc-500 text-[10px] font-mono font-bold">ARCHIVE</p>
          {scrolls.slice(1).map((s) => (
            <button key={s.id} onClick={() => setCurrentScroll(s)}
              className="w-full text-left p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
              <span className="text-zinc-400 text-xs font-mono">Week {s.week_number}</span>
              <span className="text-zinc-600 text-[9px] font-mono ml-2">{new Date(s.created_at).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
