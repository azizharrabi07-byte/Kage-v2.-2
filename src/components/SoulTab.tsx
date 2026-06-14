import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Droplets, Timer, Flame, Download, Award } from 'lucide-react';
import { IMAGES } from '../assets';
import type { Achievement, ExercisePR, WorkoutSession } from './types';
import StatsBoard from './StatsBoard';
import WeeklyVolumeChart from './WeeklyVolumeChart';
import AchievementProgress from './AchievementProgress';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import RoninSettings from './RoninSettings';
import { exportWorkoutsCSV, exportPRsCSV, downloadCSV, exportAsPDF } from '../utils/dataExport';

export interface SoulTabProps {
  isLight: boolean;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
  getTotalWorkouts: () => number;
  xp: number;
  bonusXP: number;
  getTotalVolume: () => number;
  achievements: Achievement[];
  stats: { Strength: number; Speed: number; Spirit: number; Focus: number; Endurance: number };
  setIsPremiumOpen: (b: boolean) => void;
  setIsOathOpen: (b: boolean) => void;
  setIsMuted: (b: boolean | ((prev: boolean) => boolean)) => void;
  isMuted: boolean;
  prs: Record<string, ExercisePR>;
}

function SoulTab({
  isLight,
  soundSafe,
  getTotalWorkouts,
  xp,
  bonusXP,
  getTotalVolume,
  achievements,
  stats,
  setIsPremiumOpen,
  setIsOathOpen,
  setIsMuted,
  isMuted,
  prs,
}: SoulTabProps) {
  // ─── Meditation Timer State ───────────────────────────────────────────────
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationGoal, setMeditationGoal] = useState(300);
  const meditationRef = useRef<ReturnType<typeof setInterval>>();

  // ─── Breathing Exercise State ─────────────────────────────────────────────
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold-in' | 'exhale' | 'hold-out'>('inhale');
  const breathingRef = useRef<ReturnType<typeof setInterval>>();

  // ─── Meditation Timer Effect ──────────────────────────────────────────────
  useEffect(() => {
    if (isMeditating) {
      meditationRef.current = setInterval(() => {
        setMeditationSeconds(s => {
          if (s >= meditationGoal) {
            setIsMeditating(false);
            soundSafe('chime');
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => { if (meditationRef.current) clearInterval(meditationRef.current); };
  }, [isMeditating, meditationGoal, soundSafe]);

  // ─── Breathing Animation Effect (4-4-4-4 box breathing) ──────────────────
  useEffect(() => {
    if (!isBreathing) {
      setBreathingPhase('inhale');
      return;
    }

    const phases: Array<'inhale' | 'hold-in' | 'exhale' | 'hold-out'> = ['inhale', 'hold-in', 'exhale', 'hold-out'];
    let index = 0;

    const tick = () => {
      setBreathingPhase(phases[index]);
      index = (index + 1) % phases.length;
    };

    breathingRef.current = setInterval(tick, 4000);
    tick(); // immediately set first phase

    return () => { if (breathingRef.current) clearInterval(breathingRef.current); };
  }, [isBreathing]);

  // ─── Workout History for Weekly Volume ──────────────────────────────────
  const { getWeeklyVolume } = useWorkoutHistory();

  // ─── Memoized Chart Data from real hook ──────────────────────────────────
  const chartData = useMemo(() => getWeeklyVolume(), [getWeeklyVolume]);

  // ─── Fallback Demo Data (if no workouts recorded) ───────────────────────
  const displayChartData = useMemo(() => {
    const hasVolume = chartData.some(d => d.volume > 0);
    if (hasVolume) return chartData;
    // Generate demo data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, i) => ({
      day,
      volume: [0, 340, 0, 520, 0, 780, 410][i],
    }));
  }, [chartData]);

  // ─── Demo Meditation Stats ───────────────────────────────────────────────
  const meditationStats = useMemo(() => ({
    totalMinutes: 147,
    totalSessions: 31,
    currentStreak: 5,
  }), []);

  // ─── Demo Water / Hydration Stats ────────────────────────────────────────
  const [waterCups, setWaterCups] = useState(5);
  const waterGoal = 8;
  const waterPct = waterCups / waterGoal;

  // ─── Achievement Stats object for AchievementProgress component ──────────
  const achievementStatsData = useMemo(() => ({
    totalWorkouts: getTotalWorkouts(),
    verifiedWorkouts: Math.floor(getTotalWorkouts() * 0.7),
    totalVolume: getTotalVolume(),
    currentStreak: meditationStats.currentStreak,
    bestStreak: 12,
    totalXP: xp + bonusXP,
    hydrationDays: 4,
    pactWorkouts: 3,
    bestFormScore: 92,
  }), [getTotalWorkouts, getTotalVolume, xp, bonusXP, meditationStats.currentStreak]);

  return (
    <motion.div key="tab-soul" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2" style={{ willChange: 'transform, opacity' }}>
      
      <div className={`text-center py-2 flex justify-between items-center pb-4 ${isLight ? 'border-b border-stone-200' : 'border-b border-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="font-kanji font-black text-rose-500 text-3xl">魂</span>
          <h2 className={`text-xl font-bold tracking-widest ${isLight ? 'text-stone-800' : 'text-white'}`}>INNER SANCTUM</h2>
        </div>
        <button
          onClick={() => setIsPremiumOpen(true)}
          className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-[#F2C94C] text-xs font-mono font-bold text-black rounded-lg gold-shimmer-btn shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:outline-none"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          PREMIUM
        </button>
      </div>

      {/* Profile Card */}
      <div className={`rounded-2xl border p-5 flex flex-col items-center text-center relative overflow-hidden ${isLight ? 'backdrop-blur-xl bg-gradient-to-br from-amber-50/80 to-stone-100/80 border-stone-200' : 'backdrop-blur-xl bg-gradient-to-br from-[#1A1A24]/80 to-void/80 border-white/10'}`}>
        <div className={`absolute top-2 right-2 border text-[9px] font-mono px-2 py-0.5 rounded-full ${isLight ? 'bg-rose-100 border-rose-200 text-rose-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          SOUL STAGE 16
        </div>

        <div className="relative w-24 h-24 mb-3">
          <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
          <img src={IMAGES.warriorHelmet} className={`w-full h-full rounded-full border-2 object-cover ${isLight ? 'bg-stone-200 border-rose-300' : 'bg-kachi/75 border-rose-500/40'}`} alt="KAGE Avatar" loading="lazy" decoding="async" />
          <div className={`absolute bottom-0 right-0 p-1.5 rounded-full border cursor-pointer text-xs ${isLight ? 'bg-stone-200 border-stone-300' : 'bg-neutral-800 border-neutral-700'}`}>📸</div>
        </div>

        <h3 className={`font-bold text-lg font-mono tracking-wider ${isLight ? 'text-stone-800' : 'text-white'}`}>You (KAGE Master)</h3>
        <p className="text-xs text-rose-400 font-mono">CODE_ID: #432963e9</p>
        <p className={`text-[10px] font-mono uppercase mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>SWORN UNDER OATH ON 2026-06-05</p>
      </div>

      {/* 4 Lifetime Stats Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3.5 rounded-xl border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>LIFETIME WORKOUTS</span>
          <p className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-stone-800' : 'text-white'}`}>{getTotalWorkouts()} STRIKES</p>
        </div>
        <div className={`p-3.5 rounded-xl border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>HONOUR POINTS</span>
          <p className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-amber-600' : 'text-[#F2C94C]'}`}>{xp + bonusXP} HP</p>
        </div>
        <div className={`p-3.5 rounded-xl border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>TOTAL VOLUME</span>
          <p className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>{getTotalVolume().toLocaleString()} KG</p>
        </div>
        <div className={`p-3.5 rounded-xl border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <span className={`text-[9px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>TOTAL XP</span>
          <p className={`text-xl font-bold font-mono mt-1 ${isLight ? 'text-sky-600' : 'text-sky-400'}`}>{xp + bonusXP} XP</p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="space-y-3">
        <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>CAPABILITY SPECTRUM MAP</p>
        <div className={`rounded-2xl border p-5 flex flex-col items-center ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <StatsBoard isLight={isLight} stats={stats} />
        </div>
      </div>

      {/* Meditation & Breathing */}
      <div className="space-y-3">
        <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>MIND FORGING CHAMBER</p>

        <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-sm font-bold ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>🧘 MEDITATION TIMER</h3>
            <select value={meditationGoal} onChange={e => setMeditationGoal(Number(e.target.value))}
              className={`text-[10px] font-mono rounded px-2 py-1 outline-none ${isLight ? 'bg-white border border-stone-300 text-stone-700' : 'bg-void border border-white/10 text-zinc-300'}`}>
              <option value={60}>1 MIN</option>
              <option value={180}>3 MIN</option>
              <option value={300}>5 MIN</option>
              <option value={600}>10 MIN</option>
              <option value={900}>15 MIN</option>
            </select>
          </div>
          <div className="flex flex-col items-center py-4">
            <svg width="120" height="120" className="transform -rotate-90 mb-3">
              <circle cx="60" cy="60" r="52" className={`fill-none ${isLight ? 'stroke-stone-200' : 'stroke-zinc-800'}`} strokeWidth="6" />
              <circle cx="60" cy="60" r="52" className="fill-none stroke-cyan-400 transition-all duration-1000" strokeWidth="6" strokeDasharray={326.7} strokeDashoffset={326.7 * (1 - meditationSeconds / meditationGoal)} strokeLinecap="round" />
            </svg>
            <span className={`text-3xl font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>
              {Math.floor(meditationSeconds / 60)}:{(meditationSeconds % 60).toString().padStart(2, '0')}
            </span>
            <span className={`text-[10px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>/ {Math.floor(meditationGoal / 60)}:00</span>
          </div>
          <button onClick={() => {
            if (isMeditating) { setIsMeditating(false); if (meditationRef.current) clearInterval(meditationRef.current); }
            else { if (meditationSeconds >= meditationGoal) setMeditationSeconds(0); setIsMeditating(true); soundSafe('tap'); }
          }}
            className={`w-full py-3 rounded-xl font-mono font-bold text-xs tracking-widest cursor-pointer active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isMeditating ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'}`}>
            {isMeditating ? '■ STOP' : meditationSeconds > 0 ? '↻ RESET' : '▶ BEGIN'}
          </button>
        </div>

        <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <h3 className={`text-sm font-bold mb-3 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>🌬️ BOX BREATHING</h3>
          <div className="flex flex-col items-center py-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-rose-500 transition-all duration-[4000ms] flex items-center justify-center"
              style={{ transform: `scale(${breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'exhale' ? 0.7 : 1})`, opacity: breathingPhase === 'hold-in' || breathingPhase === 'hold-out' ? 0.7 : 1 }}>
              <span className="text-xs font-mono font-bold text-white uppercase">{breathingPhase}</span>
            </div>
            <p className={`text-[10px] font-mono mt-2 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>4s In — 4s Hold — 4s Out — 4s Hold</p>
          </div>
          <button onClick={() => {
            setIsBreathing(!isBreathing); soundSafe('tap');
            if (!isBreathing) { setBreathingPhase('inhale'); }
          }}
            className={`w-full py-3 rounded-xl font-mono font-bold text-xs tracking-widest cursor-pointer active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isBreathing ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'}`}>
            {isBreathing ? '■ STOP' : '▶ START BREATHING'}
          </button>
        </div>
      </div>

      {/* Weekly Volume Chart */}
      <div className="space-y-3">
        <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>TRAINING VOLUME</p>
        <div className={`rounded-2xl border p-4 flex flex-col items-center ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <WeeklyVolumeChart data={displayChartData} isLight={isLight} />
        </div>
      </div>

      {/* Meditation Stats & Hydration */}
      <div className="grid grid-cols-2 gap-3">
        {/* Meditation Stats */}
        <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <h3 className={`text-[9px] font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            <Timer className="w-3 h-3" /> MEDITATION STATS
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>Total Minutes</span>
              <span className={`text-sm font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>{meditationStats.totalMinutes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>Sessions</span>
              <span className={`text-sm font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>{meditationStats.totalSessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>
                <Flame className="w-2.5 h-2.5 inline mr-0.5 text-orange-400" />
                Streak
              </span>
              <span className={`text-sm font-mono font-bold text-orange-400`}>{meditationStats.currentStreak} days</span>
            </div>
          </div>
        </div>

        {/* Hydration Ring */}
        <div className={`rounded-xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <h3 className={`text-[9px] font-mono uppercase tracking-wider mb-3 flex items-center gap-1.5 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            <Droplets className="w-3 h-3 text-sky-400" /> HYDRATION
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <svg width="80" height="80" viewBox="0 0 80 80">
                {/* Background ring */}
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}
                  strokeWidth="6"
                />
                {/* Progress arc */}
                <motion.circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="url(#waterGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={213.6}
                  initial={{ strokeDashoffset: 213.6 }}
                  animate={{ strokeDashoffset: 213.6 * (1 - waterPct) }}
                  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                  transform="rotate(-90 40 40)"
                />
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                </defs>
                {/* Center text */}
                <text
                  x="40" y="36" textAnchor="middle"
                  fill={isLight ? '#44403C' : 'white'}
                  fontSize="18" fontWeight="bold" fontFamily="'Inter', sans-serif"
                >
                  {waterCups}
                </text>
                <text
                  x="40" y="50" textAnchor="middle"
                  fill={isLight ? '#78716C' : '#8E9EAF'}
                  fontSize="7" fontFamily="monospace"
                >
                  / {waterGoal}
                </text>
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setWaterCups(c => Math.max(0, c - 1))}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono cursor-pointer active:scale-90 transition-all ${isLight ? 'bg-stone-200 text-stone-500 hover:bg-stone-300' : 'bg-void text-zinc-400 hover:bg-zinc-800 border border-white/5'}`}
              >
                −
              </button>
              <span className={`text-[10px] font-mono w-8 text-center ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>CUPS</span>
              <button
                onClick={() => setWaterCups(c => Math.min(waterGoal, c + 1))}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono cursor-pointer active:scale-90 transition-all ${isLight ? 'bg-sky-100 text-sky-600 hover:bg-sky-200' : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 border border-sky-500/20'}`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Season Track */}
      <div className="space-y-2">
        <div className={`flex justify-between items-center text-xs font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
          <span>🍂 SEASON: AUTUMN OF FURY</span>
          <span className="text-rose-500 font-bold">14 DAYS LEFT</span>
        </div>
        <div className={`rounded-xl p-3 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <div className={`flex justify-between text-[10px] font-mono mb-1.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            <span>SECTOR A</span><span>SECTOR B (MILSTONE)</span><span>ASCENSION</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden relative ${isLight ? 'bg-stone-200 border border-stone-300' : 'bg-void border border-white/10'}`}>
            <div className="absolute top-0 bottom-0 left-[25%] w-[1.5px] bg-sky-400" />
            <div className="absolute top-0 bottom-0 left-[50%] w-[1.5px] bg-[#F2C94C]" />
            <div className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-rose-500" />
            <div className="h-full bg-gradient-to-r from-indigo via-rose-500 to-[#F2C94C] rounded-full" style={{ width: '61%' }} />
          </div>
        </div>
      </div>

      {/* Enhanced Achievements */}
      <div className="space-y-3">
        <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>ACHIEVEMENT MEDALLIONS ({achievements.filter(a => a.unlocked).length}/{achievements.length})</p>
        <div className={`rounded-2xl p-4 border ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <AchievementProgress achievements={achievements} stats={achievementStatsData} isLight={isLight} />
        </div>
      </div>

      {/* Personal Records */}
      <div className="space-y-2">
        <p className={`text-xs font-mono uppercase tracking-wide ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'}`}>SHADOW RECORDS MAXIMUMS</p>
        
        <div className={`divide-y rounded-xl border ${isLight ? 'divide-stone-200 backdrop-blur-xl bg-white/60 border-stone-200' : 'divide-white/5 backdrop-blur-xl bg-black/20 border-white/10'}`}>
          {[
            { name: 'PUSH-UPS (Max 1-Min reps)', val: '64 REPS', desc: 'Executed during GALE-FORCE Wind session.' },
            { name: 'PULL-UPS (Heaviest Weight Added)', val: '+20 KG', desc: 'Weighted pull up personal record.' },
            { name: 'MEDITATION QUIET SITTING', val: '45 MINS', desc: 'Held perfect spinal alignment.' },
            { name: 'BENCH PRESS (Estimated 1RM)', val: prs['Bench Press']?.max1RM ? `${prs['Bench Press'].max1RM} KG` : '--', desc: 'Based on logged sets.' },
            { name: 'DEADLIFTS (Estimated 1RM)', val: prs['Deadlifts']?.max1RM ? `${prs['Deadlifts'].max1RM} KG` : '--', desc: 'Based on logged sets.' },
          ].map((rec, i) => (
            <details key={i} className="group p-3">
              <summary className={`list-none flex justify-between items-center cursor-pointer text-xs font-semibold ${isLight ? 'text-stone-700' : 'text-white'}`}>
                <span>⛩️ {rec.name}</span>
                <span className="text-rose-500 font-mono font-bold flex items-center gap-1.5 uppercase">
                  {rec.val}
                  <ChevronDown className={`w-4 h-4 group-open:rotate-180 transition-transform ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
                </span>
              </summary>
              <p className={`text-[10px] font-mono mt-2 leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>{rec.desc}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Ronin Hardcore Mode */}
      <RoninSettings isLight={isLight} />

      {/* Data Export */}
      <div className="space-y-2">
        <p className={`text-xs font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>DATA EXPORT</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              const csv = exportWorkoutsCSV([]);
              downloadCSV(csv, 'kage_workouts.csv');
            }}
            className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50' : 'bg-kachi/50 border border-white/5 text-zinc-300 hover:bg-rose-500/10'}`}
          >
            <Download className="w-3.5 h-3.5" /> WORKOUTS
          </button>
          <button
            onClick={() => {
              const csv = exportPRsCSV({});
              downloadCSV(csv, 'kage_prs.csv');
            }}
            className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50' : 'bg-kachi/50 border border-white/5 text-zinc-300 hover:bg-rose-500/10'}`}
          >
            <Download className="w-3.5 h-3.5" /> PRs
          </button>
          <button
            onClick={() => exportAsPDF('KAGE Training Log — PDF Export', 'kage_export')}
            className={`py-2 rounded-lg font-mono text-[10px] transition-all cursor-pointer active:scale-95 flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50' : 'bg-kachi/50 border border-white/5 text-zinc-300 hover:bg-rose-500/10'}`}
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-2 pt-2">
        <p className={`text-xs font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>SANCTUM SETTINGS</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setIsOathOpen(true)}
            className={`py-2.5 rounded-lg font-mono text-xs transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50' : 'bg-kachi/50 border border-white/5 text-zinc-300 hover:bg-rose-500/10'}`}>
            ⚖️ DECLARE OATH
          </button>
          <button onClick={() => { soundSafe('tap'); setIsMuted(!isMuted); }}
            className={`py-2.5 rounded-lg font-mono text-xs transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50' : 'bg-kachi/50 border border-white/5 text-zinc-300 hover:bg-rose-500/10'}`}>
            🔊 SFX: {isMuted ? 'MUTED' : 'ACTIVE'}
          </button>
        </div>
      </div>

    </motion.div>
  );
}

export default memo(SoulTab);
