import { memo, useMemo } from 'react';
import type { Exercise } from '../types/exercise';
import {
  muscleGroupToCategory,
  exerciseCategoryColors,
  exerciseCategoryEmojis,
} from '../utils/exerciseUtils';

interface ExerciseImageProps {
  exercise: Exercise;
  isLight?: boolean;
  className?: string;
}

function ExerciseImage({ exercise, isLight = false, className = '' }: ExerciseImageProps) {
  const category = useMemo(() => muscleGroupToCategory(exercise.muscleGroup), [exercise.muscleGroup]);
  const [startColor, endColor] = useMemo(
    () => exerciseCategoryColors[category] ?? ['#6B7280', '#374151'],
    [category],
  );
  const emoji = useMemo(
    () => exerciseCategoryEmojis[category] ?? '\uD83C\uDFCB',
    [category],
  );

  // Use real image if available, otherwise show generated placeholder
  if (exercise.imageUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl ${className}`}
        style={{ aspectRatio: '400 / 300', minHeight: '200px' }}
      >
        <img
          src={exercise.imageUrl}
          alt={exercise.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="font-bold text-lg">{exercise.name}</p>
          <p className="text-sm opacity-80">{exercise.kanji} • {exercise.muscleGroup}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ aspectRatio: '400 / 300', minHeight: '200px' }}
    >
      <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={`Demonstration of ${exercise.name}`}
        >
          <defs>
            <linearGradient id={`bg-grad-${exercise.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor={endColor} stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id={`shine-${exercise.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" rx="12" ry="12" fill={`url(#bg-grad-${exercise.id})`} />
          <rect width="400" height="300" rx="12" ry="12" fill={`url(#shine-${exercise.id})`} />
          <text
            x="200" y="95"
            textAnchor="middle"
            fontSize="64"
            fontFamily="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
          >
            {emoji}
          </text>
          <text
            x="200" y="155"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {exercise.name}
          </text>
          <text
            x="200" y="183"
            textAnchor="middle"
            fontSize="14"
            fill={startColor}
            fontFamily="serif, Noto Serif SC, serif"
            opacity="0.85"
          >
            {exercise.kanji}
          </text>
          <rect
            x={200 - (exercise.muscleGroup.length * 4 + 12)}
            y={205}
            width={exercise.muscleGroup.length * 8 + 24}
            height="24"
            rx="12"
            fill="rgba(255,255,255,0.15)"
          />
          <text
            x="200" y="221"
            textAnchor="middle"
            fontSize="11"
            fill="#FFFFFF"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontWeight="600"
          >
            {exercise.muscleGroup}
          </text>
        </svg>

      <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none" />
    </div>
  );
}

export default memo(ExerciseImage);
