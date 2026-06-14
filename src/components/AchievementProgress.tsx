import React, { useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import type { Achievement, AchievementStats } from './types';

interface AchievementProgressProps {
  achievements: Achievement[];
  stats: AchievementStats;
  isLight?: boolean;
}

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  common: {
    bg: 'rgba(148,163,184,0.15)',
    text: '#94A3B8',
    border: 'rgba(148,163,184,0.3)',
    glow: 'rgba(148,163,184,0.15)',
  },
  rare: {
    bg: 'rgba(59,130,246,0.15)',
    text: '#60A5FA',
    border: 'rgba(59,130,246,0.3)',
    glow: 'rgba(59,130,246,0.2)',
  },
  epic: {
    bg: 'rgba(139,92,246,0.15)',
    text: '#A78BFA',
    border: 'rgba(139,92,246,0.3)',
    glow: 'rgba(139,92,246,0.2)',
  },
  legendary: {
    bg: 'rgba(251,191,36,0.15)',
    text: '#FBBF24',
    border: 'rgba(251,191,36,0.3)',
    glow: 'rgba(251,191,36,0.25)',
  },
};

const RARITY_KEYS = ['common', 'rare', 'epic', 'legendary'] as const;

const AchievementProgress = React.memo(function AchievementProgress({
  achievements,
  stats,
  isLight = false,
}: AchievementProgressProps) {
  const total = achievements.length;
  const unlocked = achievements.filter(a => a.unlocked).length;
  const pct = total > 0 ? unlocked / total : 0;

  // Donut circle geometry
  const cx = 56;
  const cy = 56;
  const r = 48;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  // Compute progress for each achievement
  const enriched = useMemo(
    () =>
      achievements.map(a => ({
        ...a,
        progressValue: a.progress ? Math.min(a.progress(stats), 1) : a.unlocked ? 1 : 0,
      })),
    [achievements, stats]
  );

  // Sort: unlocked first, then by progress descending
  const sorted = useMemo(
    () =>
      [...enriched].sort((a, b) => {
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
        return b.progressValue - a.progressValue;
      }),
    [enriched]
  );

  return (
    <div className="space-y-5">
      {/* Donut + Summary */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="112" height="112" viewBox="0 0 112 112">
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}
              strokeWidth="8"
            />
            {/* Progress arc */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="url(#donutGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              transform="rotate(-90 56 56)"
            />
            <defs>
              <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E31E24" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
            {/* Center text */}
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              fill={isLight ? '#44403C' : 'white'}
              fontSize="22"
              fontWeight="bold"
              fontFamily="'Inter', sans-serif"
            >
              {unlocked}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fill={isLight ? '#78716C' : '#8E9EAF'}
              fontSize="8"
              fontFamily="monospace"
            >
              / {total}
            </text>
          </svg>
          {/* Animated sparkle when new unlock */}
          {unlocked > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 text-[10px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ✦
            </motion.span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            UNLOCKED
          </p>
          <p className={`text-lg font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>
            {unlocked}/{total} MEDALLIONS
          </p>
          <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-void'}`}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #E31E24, #FBBF24)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
          <p className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            {Math.round(pct * 100)}% COMPLETE
          </p>
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 gap-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {sorted.map((ac, i) => {
          const rarity = RARITY_COLORS[ac.rarity] || RARITY_COLORS.common;
          const p = ac.progressValue;

          return (
            <motion.div
              key={ac.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className={`relative rounded-xl border p-3 transition-all ${
                ac.unlocked
                  ? isLight
                    ? 'bg-gradient-to-r from-amber-50 to-stone-50'
                    : 'bg-gradient-to-r from-sumi/60 to-kachi/40'
                  : isLight
                    ? 'bg-white/40'
                    : 'bg-void/40'
              } ${ac.unlocked ? isLight ? 'border-amber-200' : 'border-rose-500/20' : isLight ? 'border-stone-200' : 'border-white/5'}`}
              style={
                ac.unlocked
                  ? {
                      boxShadow: ac.unlocked
                        ? `0 0 12px ${rarity.glow}`
                        : undefined,
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border"
                  style={{
                    backgroundColor: rarity.bg,
                    borderColor: rarity.border,
                  }}
                >
                  {ac.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-bold font-mono ${
                        ac.unlocked
                          ? isLight
                            ? 'text-stone-800'
                            : 'text-white'
                          : isLight
                            ? 'text-stone-400'
                            : 'text-zinc-500'
                      }`}
                    >
                      {ac.title}
                    </span>
                    {/* Rarity badge */}
                    <span
                      className="text-[7px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                      style={{
                        color: rarity.text,
                        borderColor: rarity.border,
                        backgroundColor: rarity.bg,
                      }}
                    >
                      {ac.rarity}
                    </span>
                    {ac.unlocked && ac.rewardXP && (
                      <span className="text-[7px] font-mono text-amber-500">
                        +{ac.rewardXP}XP
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[9px] font-mono leading-tight ${
                      isLight ? 'text-stone-400' : 'text-zinc-500'
                    }`}
                  >
                    {ac.description}
                  </p>

                  {/* Progress bar */}
                  <div
                    className={`h-1.5 rounded-full overflow-hidden ${
                      isLight ? 'bg-stone-200' : 'bg-black/40'
                    }`}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: rarity.text }}
                      initial={{ width: 0 }}
                      animate={{ width: `${p * 100}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.1 + i * 0.03,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-[7px] font-mono ${
                        isLight ? 'text-stone-400' : 'text-zinc-600'
                      }`}
                    >
                      {ac.unlocked ? 'UNLOCKED' : `${Math.round(p * 100)}%`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default AchievementProgress;
