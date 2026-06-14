import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface VolumeDataPoint {
  day: string;
  volume: number;
}

interface WeeklyVolumeChartProps {
  data: VolumeDataPoint[];
  isLight?: boolean;
}

const DAY_COLORS: Record<string, string> = {
  Sun: '#E31E24',
  Mon: '#F59E0B',
  Tue: '#22D3EE',
  Wed: '#10B981',
  Thu: '#8B5CF6',
  Fri: '#F97316',
  Sat: '#EC4899',
};

const DAY_GRADIENTS: Record<string, string> = {
  Sun: 'url(#gradSun)',
  Mon: 'url(#gradMon)',
  Tue: 'url(#gradTue)',
  Wed: 'url(#gradWed)',
  Thu: 'url(#gradThu)',
  Fri: 'url(#gradFri)',
  Sat: 'url(#gradSat)',
};

function formatVolume(vol: number): string {
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
  return String(vol);
}

const WeeklyVolumeChart = React.memo(function WeeklyVolumeChart({
  data,
  isLight = false,
}: WeeklyVolumeChartProps) {
  const maxVolume = useMemo(() => Math.max(...data.map(d => d.volume), 1), [data]);

  const height = 200;
  const width = 320;
  const padding = { top: 20, right: 8, bottom: 28, left: 36 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barGap = 6;
  const barW = (chartW - barGap * (data.length - 1)) / data.length;

  const yTicks = useMemo(() => {
    const target = 4;
    const rawStep = maxVolume / (target - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const nice = [1, 2, 2.5, 5, 10].reduce((best, m) =>
      Math.abs(m * magnitude - rawStep) < Math.abs(best - rawStep) ? m * magnitude : best,
      rawStep
    );
    const ticks: number[] = [];
    for (let v = 0; v <= maxVolume; v += nice) {
      ticks.push(Math.round(v));
    }
    if (ticks[ticks.length - 1] < maxVolume) ticks.push(Math.ceil(maxVolume / nice) * nice);
    return ticks;
  }, [maxVolume]);

  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
            const c = DAY_COLORS[day] || '#E31E24';
            return (
              <linearGradient key={day} id={`grad${day}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={c} stopOpacity={0.3} />
                <stop offset="100%" stopColor={c} stopOpacity={0.9} />
              </linearGradient>
            );
          })}
          {/* Glow filter */}
          <filter id="barGlow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feFlood floodColor="#E31E24" floodOpacity="0.35" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis grid lines and labels */}
        {yTicks.map((tick, i) => {
          const y = padding.top + chartH - (tick / maxVolume) * chartH;
          return (
            <g key={`ytick-${i}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}
                strokeWidth="1"
                strokeDasharray={i === 0 ? 'none' : '3,3'}
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                fill={isLight ? '#78716C' : '#8E9EAF'}
                fontSize="8"
                fontFamily="monospace"
              >
                {formatVolume(tick)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.volume / maxVolume) * chartH;
          const x = padding.left + i * (barW + barGap);
          const y = padding.top + chartH - barH;
          const labelColor = DAY_COLORS[d.day] || '#E31E24';

          return (
            <g key={d.day}>
              {/* Glow bar behind */}
              {d.volume > 0 && (
                <motion.rect
                  x={x - 1}
                  y={y - 1}
                  width={barW + 2}
                  height={barH + 2}
                  rx={6}
                  ry={6}
                  fill={DAY_COLORS[d.day] || '#E31E24'}
                  opacity={0.08 + (d.volume / maxVolume) * 0.12}
                  initial={{ height: 0, y: padding.top + chartH }}
                  animate={{ height: barH + 2, y: y - 1 }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
              {/* Main bar */}
              <motion.rect
                x={x}
                y={y}
                width={barW}
                height={0}
                rx={4}
                ry={4}
                fill={DAY_GRADIENTS[d.day] || '#E31E24'}
                initial={{ height: 0, y: padding.top + chartH }}
                animate={{ height: barH, y }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              />
              {/* Volume label on top of bar */}
              {d.volume > 0 && (
                <motion.text
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={labelColor}
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="monospace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
                >
                  {formatVolume(d.volume)}
                </motion.text>
              )}
              {/* Day label */}
              <text
                x={x + barW / 2}
                y={padding.top + chartH + 16}
                textAnchor="middle"
                fill={isLight ? '#78716C' : '#8E9EAF'}
                fontSize="8"
                fontFamily="monospace"
              >
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

export default WeeklyVolumeChart;
