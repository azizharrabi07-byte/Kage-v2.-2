import React, { memo } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, CheckCircle2, Flame, Award, Calendar, Zap, Plus, Gift } from 'lucide-react';
import type { Pact, LeaderboardUser } from './types';
import LeaderboardBoard from './LeaderboardBoard';
import BountyBoard from './BountyBoard';

export interface DojoTabProps {
  isLight: boolean;
  pactData: Pact;
  isBattleCryActive: boolean;
  handleLeaderboardRefresh: () => void;
  setIsBattleCryModalOpen: (b: boolean) => void;
  setIsForgeModalOpen: (b: boolean) => void;
  leaderboard: LeaderboardUser[];
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
}

function DojoTab({
  isLight,
  pactData,
  isBattleCryActive,
  handleLeaderboardRefresh,
  setIsBattleCryModalOpen,
  setIsForgeModalOpen,
  leaderboard,
  soundSafe,
}: DojoTabProps) {
  return (
    <motion.div key="tab-dojo" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6 pt-2" style={{ willChange: 'transform, opacity' }}>
      
      <div className={`text-center py-2 flex justify-between items-center pb-4 ${isLight ? 'border-b border-stone-200' : 'border-b border-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="font-kanji font-black text-rose-500 text-3xl">道</span>
          <h2 className={`text-xl font-bold tracking-widest ${isLight ? 'text-stone-800' : 'text-white'}`}>SACRED ARENA</h2>
        </div>
        <motion.button
          onClick={handleLeaderboardRefresh}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 flex items-center gap-1.5 text-[10px] font-mono cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
        >
          <RefreshCw className="w-3 h-3 animate-spin" />
          STRIKE CLASH
        </motion.button>
      </div>

      {/* Top 60% — Warrior Pact Section */}
      <div className="space-y-4">
        <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'} uppercase tracking-wide`}>YOUR BLOOD PACT ALLY</p>
        
        <div className={`rounded-2xl border p-5 space-y-4 relative overflow-hidden shadow-2xl ${isLight ? 'backdrop-blur-xl bg-gradient-to-br from-amber-50/80 to-stone-100/80 border-stone-200' : 'backdrop-blur-xl bg-gradient-to-br from-sumi/80 to-void/80 border-white/10'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className={`text-4xl w-14 h-14 rounded-full flex items-center justify-center border-2 ${isLight ? 'bg-stone-200 border-stone-300' : 'bg-kachi border-hisui/60'}`}>{pactData.avatar}</span>
              <div>
                <h4 className={`font-bold text-md tracking-wide ${isLight ? 'text-stone-800' : 'text-white'}`}>{pactData.partnerName}</h4>
                <p className={`text-xs font-mono flex items-center gap-1 ${isLight ? 'text-teal-600' : 'text-hisui'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  SHIELD LEVEL: {pactData.partnerLevel} INTACT
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>SHARED STREAK</span>
              <p className="text-2xl font-black text-[#F2C94C] flex items-center justify-end gap-1 font-mono">
                <Flame className="w-5 h-5 fill-[#F2C94C]" />
                {pactData.sharedStreak}D
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`flex justify-between text-xs font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              <span>Joint Workout Target</span>
              <span className={isLight ? 'text-stone-400' : 'text-zinc-500'}>{pactData.jointWorkoutCount} / {pactData.targetCount} days</span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-void border border-white/5'}`}>
              <div className="h-full bg-gradient-to-r from-[#2196F3] via-hisui to-emerald-500 rounded-full" style={{ width: `${(pactData.jointWorkoutCount / pactData.targetCount) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>CHAINSTREAK PROTOCOL MILSTONES:</p>
            <div className={`flex justify-between items-center p-2.5 rounded-lg border ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-void border-white/5'}`}>
              <div className="flex items-center gap-1.5 flex-1 justify-around">
                <div className="flex flex-col items-center">
                  <Award className={`w-5 h-5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
                  <span className={`text-[8px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>7 DAYS</span>
                </div>
                <div className={`h-0.5 flex-1 mx-2 ${isLight ? 'bg-stone-300' : 'bg-zinc-700'}`} />
                <div className="flex flex-col items-center">
                  <Award className={`w-5 h-5 animate-pulse ${isLight ? 'text-rose-500' : 'text-zinc-300'}`} />
                  <span className={`text-[8px] font-mono mt-1 ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>15 DAYS</span>
                </div>
                <div className={`h-0.5 flex-1 mx-2 ${isLight ? 'bg-stone-300' : 'bg-zinc-700'}`} />
                <div className="flex flex-col items-center">
                  <Award className={`w-5 h-5 ${isLight ? 'text-stone-300' : 'text-zinc-700'}`} />
                  <span className={`text-[8px] font-mono mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-700'}`}>30 DAYS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.button
              onClick={() => setIsBattleCryModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-center py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors font-mono font-bold text-xs text-rose-400 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
            >
              <Zap className="w-3.5 h-3.5" />
              SEND BATTLE CRY
            </motion.button>
            <motion.button
              onClick={() => setIsForgeModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-center py-2 rounded-lg bg-indigo/30 hover:bg-indigo/40 border border-indigo/40 transition-colors font-mono font-bold text-xs text-indigo-400 cursor-pointer flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
            >
              <Plus className="w-3.5 h-3.5" />
              FORGE PACT
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mid Section — Discipline Calendar */}
      <div className="space-y-4 pt-2">
        <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'} uppercase tracking-wide flex items-center gap-2`}>
          <Calendar className="w-4 h-4" />
          HISTORIC DISCIPLINE RECORD
        </p>
        <div className={`rounded-2xl border p-5 ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
          <div className={`flex justify-between items-center mb-4 ${isLight ? 'text-stone-700' : 'text-white'}`}>
            <h3 className={`text-sm font-bold font-mono tracking-widest uppercase shadow-sm ${isLight ? 'text-stone-700' : 'text-white'}`}>JUNE 2026</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-[0_0_8px_rgba(227,30,36,0.5)]"></span><span className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>COMPLETE</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded border border-rose-500/50 border-dashed"></span><span className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>SCHEDULED</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
               <div key={i} className={`text-center text-[10px] font-mono font-bold ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{day}</div>
            ))}
            {Array.from({length: 30}).map((_, i) => {
               const isPast = i < 5;
               const isToday = i === 5;
               const isScheduled = i === 7 || i === 9 || i === 12 || i === 14;
               const isCompleted = isPast && (i === 0 || i === 1 || i === 3 || i === 4);
               
               return (
                 <div key={i} className={`aspect-square rounded-md flex items-center justify-center font-mono text-xs transition-all relative group cursor-pointer ${
                   isToday ? 'bg-rose-500 text-white border border-rose-400 shadow-[0_0_15px_rgba(227,30,36,0.6)] z-10 scale-105' : 
                   isCompleted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' :
                   isScheduled ? 'bg-void border border-rose-500/30 border-dashed text-zinc-400 hover:bg-white/5' :
                   `${isLight ? 'bg-stone-100 border-stone-200 text-stone-400 hover:bg-stone-200' : 'bg-void/40 border border-white/5 text-zinc-700 hover:bg-white/5'}`
                 }`}>
                   {i + 1}
                   
                   <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-[9px] rounded border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 ${isLight ? 'bg-stone-800 text-white border-stone-600' : 'bg-lacquer-black text-white border-white/10'}`}>
                     {isToday ? 'TODAY' : isCompleted ? 'COMPLETED' : isScheduled ? 'SCHEDULED' : 'REST'}
                   </div>
                 </div>
               )
            })}
          </div>
        </div>
      </div>

      {/* Dojo Bounties */}
      <BountyBoard isLight={isLight} />

      {/* Bottom 40% — Leaderboard Section */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-[#8E9EAF]'} uppercase tracking-wide`}>LEADERBOARD_INDEX (TOP 10)</p>
          <span className={`text-[9px] font-mono ${isLight ? 'text-emerald-600' : 'text-[#2D9C6E]'}`}>STATUS: CALCULATED LIVE</span>
        </div>
        <LeaderboardBoard isLight={isLight} data={leaderboard} />
      </div>

    </motion.div>
  );
}

export default memo(DojoTab);
