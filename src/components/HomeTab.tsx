import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Flame, Swords, Award, Activity, Zap } from 'lucide-react';
import { IMAGES } from '../assets';
import type { Achievement, Pact, WorkoutProgram, ExerciseLog } from './types';

export interface HomeTabProps {
  isLight: boolean;
  streak: number;
  achievements: Achievement[];
  pactData: Pact;
  battleCryText: string;
  battleCryTimer: string;
  isBattleCryActive: boolean;
  senseiWidgetProverbs: string[];
  currentTipIndex: number;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
  setLandingTheme: (theme: 'dark' | 'light') => void;
  setActiveRunningProgram: (p: WorkoutProgram | null) => void;
  setExerciseLogs: (logs: ExerciseLog[]) => void;
  setCurrentExerciseIndex: (i: number) => void;
  setRunningTimer: (t: number) => void;
  setIsRunning: (b: boolean) => void;
  setRestTimerDuration: (d: number) => void;
  setRestTimerKey: React.Dispatch<React.SetStateAction<number>>;
  setIsPartnerProfileOpen: (b: boolean) => void;
  setIsBattleCryModalOpen: (b: boolean) => void;
  setCurrentTipIndex: React.Dispatch<React.SetStateAction<number>>;
  mockPrograms: WorkoutProgram[];
}

function HomeTab({
  isLight,
  streak,
  achievements,
  pactData,
  battleCryText,
  battleCryTimer,
  isBattleCryActive,
  senseiWidgetProverbs,
  currentTipIndex,
  soundSafe,
  setLandingTheme,
  setActiveRunningProgram,
  setExerciseLogs,
  setCurrentExerciseIndex,
  setRunningTimer,
  setIsRunning,
  setRestTimerDuration,
  setRestTimerKey,
  setIsPartnerProfileOpen,
  setIsBattleCryModalOpen,
  setCurrentTipIndex,
  mockPrograms,
}: HomeTabProps) {
  return (
    <motion.div key="tab-home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-5 flex-1 flex flex-col relative" style={{ willChange: 'transform, opacity' }}>
      
      {/* Theme Toggle */}
      <div className="flex justify-center">
        <div className={`inline-flex p-0.5 rounded-full transition-colors ${
          isLight ? 'bg-stone-200' : 'bg-zinc-800/60'
        }`}>
          <motion.button onClick={() => setLandingTheme('dark')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${!isLight ? 'bg-rose-600 text-white shadow' : 'text-stone-500 hover:text-stone-800'}`}>DARK</motion.button>
          <motion.button onClick={() => setLandingTheme('light')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-amber-600 text-white shadow' : 'text-stone-500 hover:text-stone-800'}`}>LIGHT</motion.button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-lg">
        <motion.img 
          src={IMAGES.bgSamurai} 
          className="w-full h-full object-cover" 
          style={{ scale: 1.05 }}
          alt="Kage Dojo" 
          loading="lazy" decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-end gap-3">
          <div>
            <span className="font-kanji font-black text-5xl text-rose-500 drop-shadow-[0_0_15px_rgba(227,30,36,0.6)]">影</span>
            <p className={`text-[10px] font-mono tracking-widest mt-1 ${isLight ? 'text-stone-300' : 'text-zinc-400'}`}>KAGE PREMIUM DOJO V2</p>
          </div>
          <div className="flex gap-1 ml-auto">
            <img src={IMAGES.warriorHelmet} className="w-10 h-10 rounded-lg object-cover border border-white/10 shadow" loading="lazy" decoding="async" />
            <img src={IMAGES.hologramSensei} className="w-10 h-10 rounded-lg object-cover border border-white/10 shadow" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: 'LEVEL', value: '16', icon: '⭐', color: 'text-amber-400' },
          { label: 'STREAK', value: `${streak}d`, icon: '🔥', color: 'text-rose-500' },
          { label: 'HONOR', value: '2,450', icon: '⚔️', color: 'text-cyan-400' },
          { label: 'PACT', value: '22', icon: '🤝', color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-2.5 text-center transition-colors ${
            isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
          }`}>
            <div className={`text-base ${stat.color}`}>{stat.icon}</div>
            <div className={`text-sm font-extrabold mt-0.5 ${isLight ? 'text-stone-800' : 'text-white'}`}>{stat.value}</div>
            <div className={`text-[7px] font-mono tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Streak Card + Photos */}
      <div className={`flex items-center justify-between rounded-xl p-4 transition-colors ${
        isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden">
            <img src={IMAGES.warriorHelmet} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>FLAME STREAK</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">{streak}</span>
              <span className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>DAYS</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Flame className="w-8 h-8 text-rose-500 drop-shadow-[0_0_10px_rgba(255,59,48,0.6)]" />
          <div className="text-right">
            <div className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>BEST</div>
            <div className="text-xs font-bold text-amber-400">89d</div>
          </div>
        </div>
      </div>

      {/* Progress Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-3 transition-colors ${
          isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
        }`}>
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            <span className={`text-[9px] font-mono tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>ACHIEVEMENTS</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-amber-400">{achievements.filter(a => a.unlocked).length}</span>
            <span className={`text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>/ {achievements.length}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-zinc-700/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }} />
          </div>
        </div>
        <div className={`rounded-xl p-3 transition-colors ${
          isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
        }`}>
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span className={`text-[9px] font-mono tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>THIS WEEK</span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-extrabold text-emerald-400">5</span>
            <span className={`text-[10px] ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>workouts</span>
          </div>
          <div className="mt-1.5 flex gap-1">
            {[1,1,1,1,0,0,0].map((d, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${d ? 'bg-emerald-500' : isLight ? 'bg-stone-200' : 'bg-zinc-700/50'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* BEGIN TRAINING */}
      <motion.button
        onClick={() => {
          soundSafe('clash');
          setActiveRunningProgram(mockPrograms[0]);
          setExerciseLogs(mockPrograms[0].moves.map(m => ({
            name: m.name,
            sets: [],
            targetSets: m.sets || 3,
            targetReps: m.reps || 10
          })));
          setCurrentExerciseIndex(0);
          setRunningTimer(0);
          setIsRunning(true);
          setRestTimerDuration(90);
          setRestTimerKey(prev => prev + 1);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-full py-4 rounded-xl font-bold font-mono tracking-widest bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-[0_4px_20px_rgba(227,30,36,0.3)] flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
      >
        <Swords className="w-5 h-5" />
        BEGIN TRAINING
      </motion.button>

      {/* Pact + Battle Cry Row */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          onClick={() => setIsPartnerProfileOpen(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`rounded-xl p-3 cursor-pointer ${
            isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{pactData.avatar}</span>
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>{pactData.partnerName}</p>
              <p className="text-[10px] text-emerald-400 font-mono">{pactData.sharedStreak}d streak</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          onClick={() => setIsBattleCryModalOpen(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`rounded-xl p-3 cursor-pointer ${
            isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/60 border border-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-rose-400" />
            <div>
              <p className={`text-xs font-semibold ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>BATTLE CRY</p>
              <p className={`text-[9px] font-mono truncate ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{battleCryText}</p>
            </div>
          </div>
          {isBattleCryActive && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 animate-ping" />}
        </motion.div>
      </div>

      {/* Sensei Widget */}
      <motion.div 
        onClick={() => setCurrentTipIndex((currentTipIndex + 1) % senseiWidgetProverbs.length)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer ${
          isLight ? 'bg-white/70 border border-stone-200' : 'bg-zinc-900/40 border border-zinc-800/40'
        }`}
      >
        <img src={IMAGES.hologramSensei} alt="" className="w-10 h-10 rounded-full object-cover border border-cyan-500/30" loading="lazy" decoding="async" />
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-mono text-cyan-400 tracking-widest">SENSEI</span>
          <p className={`text-xs truncate ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>"{senseiWidgetProverbs[currentTipIndex]}"</p>
        </div>
      </motion.div>

      {/* Photo Gallery Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl overflow-hidden h-20">
          <img src={IMAGES.warriorHelmet} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="rounded-xl overflow-hidden h-20">
          <img src={IMAGES.bgSamurai} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="rounded-xl overflow-hidden h-20">
          <img src={IMAGES.hologramSensei} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
      </div>

    </motion.div>
  );
}

export default memo(HomeTab);
