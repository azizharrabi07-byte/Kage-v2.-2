import { motion } from 'motion/react';

interface StatsBoardProps {
  stats: Record<string, number>;
}

const statLabels: Record<string, string> = {
  Strength: '力',
  Speed: '速',
  Spirit: '魂',
  Focus: '集',
  Endurance: '耐',
};

export default function StatsBoard({ stats }: StatsBoardProps) {
  const keys = Object.keys(stats);
  const cx = 120;
  const cy = 120;
  const radius = 80;
  const angleStep = (Math.PI * 2) / keys.length;
  const centerOffset = angleStep / 2;

  const points = keys.map((key, i) => {
    const val = stats[key] / 100;
    const angle = -Math.PI / 2 + i * angleStep + centerOffset;
    return { key, label: statLabels[key] || key, x: cx + radius * val * Math.cos(angle), y: cy + radius * val * Math.sin(angle), val };
  });

  const bgPoints = keys.map((_, i) => {
    const angle = -Math.PI / 2 + i * angleStep + centerOffset;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const bgD = bgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <div className="flex flex-col items-center">
      <svg width="240" height="240" viewBox="0 0 240 240">
        {/* Background grid rings */}
        {[0.25, 0.5, 0.75, 1].map((r, ri) => (
          <polygon
            key={ri}
            points={keys.map((_, i) => {
              const angle = -Math.PI / 2 + i * angleStep + centerOffset;
              return `${cx + radius * r * Math.cos(angle)},${cy + radius * r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {/* Background grid */}
        <polygon points={bgD} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {/* Data polygon */}
        <motion.path
          d={pathD}
          fill="rgba(227,30,36,0.15)"
          stroke="#E31E24"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={p.key}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#E31E24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1, type: 'spring' }}
          />
        ))}
        {/* Labels */}
        {points.map((p, i) => {
          const angle = -Math.PI / 2 + i * angleStep + centerOffset;
          const lx = cx + (radius + 20) * Math.cos(angle);
          const ly = cy + (radius + 20) * Math.sin(angle);
          return (
            <text key={'l' + p.key} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fill="#8E9EAF" fontSize="11" fontFamily="monospace" letterSpacing="2"
            >
              {p.label}
            </text>
          );
        })}
        {/* Center value */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold"
          fontFamily="'Inter', sans-serif"
        >
          {Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / keys.length)}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="#8E9EAF" fontSize="8"
          letterSpacing="3" fontFamily="monospace"
        >
          OVERALL
        </text>
      </svg>
      {/* Stat bars */}
      <div className="w-full space-y-2 mt-4">
        {keys.map((key) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-8 tracking-wider">{key}</span>
            <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#E31E24' }}
                initial={{ width: 0 }}
                animate={{ width: `${stats[key]}%` }}
                transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
            <span className="text-xs text-gray-500 w-6 text-right">{stats[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
