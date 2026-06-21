import { useState, useEffect } from 'react';
import { get, post } from '../services/api';
import toast from 'react-hot-toast';

export default function LegacyPage() {
  const [stats, setStats] = useState({ level: 1, xp: 0, streak: 0, workoutsCompleted: 0 });
  const [oracle, setOracle] = useState<any>(null);
  const [scrolls, setScrolls] = useState<any[]>([]);
  const [currentScroll, setCurrentScroll] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    get('/api/progress/stats').then(setStats).catch(() => {});
    get('/api/legacy/oracle').then(setOracle).catch(() => {});
    get('/api/legacy/scrolls').then((r) => {
      setScrolls(r ?? []);
      if (r?.length > 0) setCurrentScroll(r[0]);
    }).catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const r = await post('/api/legacy/scrolls/generate');
      setCurrentScroll(r);
      setScrolls((prev) => [r, ...prev]);
      toast.success('Scroll generated!');
    } catch { toast.error('Failed'); }
    finally { setGenerating(false); }
  };

  const handleShare = async () => {
    if (!currentScroll) return;
    try {
      await post(`/api/legacy/scrolls/${currentScroll.id}/share`);
      toast.success('Scroll shared!');
    } catch { toast.error('Failed'); }
  };

  const xpPct = stats.level > 0 ? ((stats.xp % 500) / 500) * 100 : 0;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-20">
      <h1 className="text-white text-lg font-bold font-mono">LEGACY</h1>

      {/* Profile Card */}
      <div className="rounded-xl bg-[#1a1a2e] border-l-4 border-[#e94560] p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#ffd700] text-xl font-bold font-mono">LV.{stats.level}</span>
          <span className="text-zinc-500 text-xs font-mono">{stats.xp} / {(stats.level) * 500} XP</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#e94560] to-[#ff6b35]" style={{ width: `${Math.min(xpPct, 100)}%` }} />
        </div>
        <div className="flex justify-around mt-3 text-center">
          <div><p className="text-white text-sm font-bold font-mono">{stats.streak}</p><p className="text-zinc-600 text-[8px] font-mono">STREAK</p></div>
          <div><p className="text-white text-sm font-bold font-mono">{stats.workoutsCompleted}</p><p className="text-zinc-600 text-[8px] font-mono">WORKOUTS</p></div>
        </div>
      </div>

      {/* Oracle */}
      {oracle && (
        <div className={`rounded-xl p-4 ${oracle.safe ? 'bg-[#1a1a2e] border-l-4 border-[#4caf50]' : 'bg-[#1a1a2e] border-l-4 border-[#e94560]'}`}>
          <p className="text-[10px] font-mono font-bold tracking-widest mb-1" style={{ color: oracle.safe ? '#4caf50' : '#e94560' }}>🔮 ORACLE PROPHECY</p>
          <p className="text-zinc-300 text-[10px] font-mono leading-relaxed">{oracle.warning}</p>
          {oracle.risk_level > 0 && <p className="text-[#e94560] text-[9px] font-mono mt-1">Risk: {oracle.risk_level}%</p>}
        </div>
      )}

      {/* Scroll */}
      {currentScroll?.content?.chapters ? (
        <div className="rounded-xl bg-[#1a1a2e] border border-zinc-800 p-6 space-y-4">
          <div className="text-center">
            <span className="text-[#ffd700] text-[10px] font-mono tracking-widest">WEEK {currentScroll.week_number} · LEGACY SCROLL</span>
            <h2 className="text-white text-base font-black font-mono mt-1">{currentScroll.content.title}</h2>
          </div>
          {currentScroll.content.chapters.map((ch: any, i: number) => (
            <div key={i}>
              <h3 className="text-[#e94560] text-xs font-mono font-bold mb-1">{['⚔', '🔥', '✨'][i]} {ch.scene}</h3>
              <p className="text-zinc-400 text-[10px] font-mono leading-relaxed">{ch.text}</p>
            </div>
          ))}
          <button onClick={handleShare}
            className="w-full py-2 rounded-lg bg-[#ffd700]/20 border border-[#ffd700]/30 text-[#ffd700] font-mono text-[10px] font-bold hover:opacity-80 cursor-pointer">
            {currentScroll.shared ? '✓ SHARED' : '📤 SHARE SCROLL'}
          </button>
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <p className="text-zinc-500 text-sm font-mono">No scrolls yet</p>
          <button onClick={handleGenerate} disabled={generating}
            className="px-6 py-3 rounded-xl bg-[#e94560] text-white font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer">
            {generating ? 'WRITING...' : '📜 GENERATE SCROLL'}
          </button>
        </div>
      )}

      {/* Previous Scrolls */}
      {scrolls.length > 1 && (
        <div className="space-y-1">
          <p className="text-zinc-500 text-[10px] font-mono font-bold">PREVIOUS SCROLLS</p>
          {scrolls.slice(1).map((s) => (
            <button key={s.id} onClick={() => setCurrentScroll(s)}
              className="w-full text-left p-3 rounded-lg bg-[#1a1a2e] border border-zinc-800 hover:border-zinc-700 cursor-pointer">
              <span className="text-zinc-400 text-xs font-mono">Week {s.week_number}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
