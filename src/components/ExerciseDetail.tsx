import { useState, useEffect } from 'react';
import type { Exercise } from '../types/exercise';
import ExerciseImage from './ExerciseImage';

interface ExerciseDetailProps {
  exercise: Exercise;
  isLight: boolean;
  onClose: () => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

const difficultyConfig = {
  beginner: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  intermediate: { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  advanced: { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
} as const;

export default function ExerciseDetail({
  exercise,
  isLight,
  onClose,
  onAddToWorkout,
}: ExerciseDetailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // Entrance animation trigger
    const frame = requestAnimationFrame(() => setIsVisible(true));
    // Read favourite state from localStorage
    try {
      const stored = localStorage.getItem(`fav_${exercise.id}`);
      setIsFav(stored === 'true');
    } catch {
      /* localStorage unavailable */
    }
    return () => cancelAnimationFrame(frame);
  }, [exercise.id]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const toggleFav = () => {
    const next = !isFav;
    setIsFav(next);
    try {
      localStorage.setItem(`fav_${exercise.id}`, String(next));
    } catch {
      /* localStorage unavailable */
    }
  };

  const diff = difficultyConfig[exercise.difficulty];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isVisible ? 'backdrop-blur-sm bg-black/60' : 'backdrop-blur-0 bg-black/0'
        }`}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${
          isLight
            ? 'bg-white border-stone-200 text-zinc-800'
            : 'bg-[#0A0A0F] border-white/10 text-zinc-100'
        } custom-scrollbar`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close exercise detail"
          className={`absolute top-4 right-4 z-20 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight ? 'hover:bg-stone-100 text-stone-500' : 'hover:bg-white/5 text-zinc-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-0">
          {/* ── Exercise Image ── */}
          <ExerciseImage exercise={exercise} isLight={isLight} className="w-full rounded-b-none" />

          <div className="p-6">
          {/* ── Header ── */}
          <div className="flex items-start justify-between mb-4 pr-8">
            <div className="flex-1">
              <h2
                className={`text-xl font-bold flex items-center gap-3 ${isLight ? 'text-stone-800' : 'text-zinc-100'}`}
              >
                {exercise.name}
                <span className="font-kanji text-2xl opacity-40">{exercise.kanji}</span>
              </h2>
              <p className={`text-xs font-mono mt-1 leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                {exercise.description}
              </p>
            </div>
            {/* Favourite toggle */}
            <button
              onClick={toggleFav}
              aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
              className={`shrink-0 p-2 rounded-lg transition-all cursor-pointer ${
                isFav
                  ? 'text-rose-500 bg-rose-500/10'
                  : isLight
                    ? 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* ── Info badges ── */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold border ${
                isLight
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {exercise.muscleGroup}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold border ${
                isLight
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {exercise.equipment}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold border ${diff.bg} ${diff.text} ${diff.border}`}
            >
              {exercise.difficulty.toUpperCase()}
            </span>
          </div>

          {/* ── Default Prescription ── */}
          <div
            className={`mb-5 p-4 rounded-xl border ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-void/50 border-white/5'
            }`}
          >
            <p
              className={`text-[9px] font-mono uppercase tracking-wider mb-2 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
            >
              DEFAULT PRESCRIPTION
            </p>
            <div className="flex gap-6">
              <div>
                <span className={`text-xl font-bold font-mono ${isLight ? 'text-stone-800' : 'text-white'}`}>
                  {exercise.defaultSets}
                </span>
                <span className={`text-[10px] font-mono ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  SETS
                </span>
              </div>
              <div>
                <span className={`text-xl font-bold font-mono ${isLight ? 'text-stone-800' : 'text-white'}`}>
                  {exercise.defaultReps}
                </span>
                <span className={`text-[10px] font-mono ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  REPS
                </span>
              </div>
              <div>
                <span className={`text-xl font-bold font-mono ${isLight ? 'text-stone-800' : 'text-white'}`}>
                  {exercise.restSeconds}
                </span>
                <span className={`text-[10px] font-mono ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  REST (S)
                </span>
              </div>
            </div>
          </div>

          {/* ── Instructions ── */}
          <div className="mb-5">
            <h3
              className={`text-xs font-bold font-mono uppercase tracking-wider mb-2.5 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}
            >
              📋 INSTRUCTIONS
            </h3>
            <ol className="space-y-2">
              {exercise.instructions.map((inst, i) => (
                <li
                  key={i}
                  className={`text-xs font-mono flex gap-2 leading-relaxed ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}
                >
                  <span
                    className={`shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-bold mt-0.5 ${
                      isLight
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Tips ── */}
          {exercise.tips.length > 0 && (
            <div className="mb-5">
              <h3
                className={`text-xs font-bold font-mono uppercase tracking-wider mb-2.5 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}
              >
                💡 TIPS
              </h3>
              <ul className="space-y-1.5">
                {exercise.tips.map((tip, i) => (
                  <li
                    key={i}
                    className={`text-xs font-mono flex gap-2 leading-relaxed ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}
                  >
                    <span className="shrink-0 mt-0.5">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Benefits ── */}
          {exercise.benefits.length > 0 && (
            <div className="mb-5">
              <h3
                className={`text-xs font-bold font-mono uppercase tracking-wider mb-2.5 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}
              >
                ✅ BENEFITS
              </h3>
              <ul className="space-y-1.5">
                {exercise.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className={`text-xs font-mono flex gap-2 leading-relaxed ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}
                  >
                    <span className="shrink-0 mt-0.5 text-emerald-500">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Secondary Muscles / Synergists ── */}
          {exercise.secondaryMuscles.length > 0 && (
            <div className="mb-5">
              <h3
                className={`text-xs font-bold font-mono uppercase tracking-wider mb-2.5 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}
              >
                🔗 SYNERGISTS
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondaryMuscles.map((m) => (
                  <span
                    key={m}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-mono border ${
                      isLight
                        ? 'bg-stone-100 text-stone-600 border-stone-200'
                        : 'bg-void text-zinc-400 border-white/5'
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Add to Workout ── */}
          {onAddToWorkout && (
            <button
              onClick={() => {
                onAddToWorkout(exercise);
                handleClose();
              }}
              className="w-full py-3 rounded-xl text-sm font-mono font-bold tracking-wider transition-all duration-200 bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] cursor-pointer"
            >
              + ADD TO WORKOUT
            </button>
          )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'};
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)'};
        }
      `}</style>
    </div>
  );
}
