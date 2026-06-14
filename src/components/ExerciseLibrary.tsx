import { useState, useMemo, memo, useRef, useEffect, useCallback } from 'react';
import { Grid } from 'react-window';
import { exercises, exerciseCategories } from '../data/exercises';
import type { Exercise } from '../types/exercise';
import ExerciseDetail from './ExerciseDetail';
import ExerciseImage from './ExerciseImage';

interface ExerciseLibraryProps {
  isLight: boolean;
  onAddToWorkout?: (exercise: Exercise) => void;
}

/* ─── Build muscleGroup → category mapping ─── */
function buildMuscleToCategory(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const ex of exercises) {
    if (map[ex.muscleGroup]) continue;
    const l = ex.muscleGroup.toLowerCase();
    if (l.includes('chest')) map[ex.muscleGroup] = 'chest';
    else if (l.includes('back') || l.includes('lat')) map[ex.muscleGroup] = 'back';
    else if (l.includes('shoulder') || l.includes('delt') || l.includes('trap')) map[ex.muscleGroup] = 'shoulders';
    else if (l.includes('leg') || l.includes('glute') || l.includes('quad') || l.includes('hamstring') || l.includes('calf')) map[ex.muscleGroup] = 'legs';
    else if (l.includes('bicep') || l.includes('tricep') || l.includes('arm') || l.includes('forearm')) map[ex.muscleGroup] = 'arms';
    else if (l.includes('core') || l.includes('ab') || l.includes('oblique')) map[ex.muscleGroup] = 'core';
    else if (l.includes('cardio')) map[ex.muscleGroup] = 'cardio';
    else if (l.includes('stretch') || l.includes('flex') || l.includes('mobility')) map[ex.muscleGroup] = 'stretching';
    else map[ex.muscleGroup] = 'fullbody';
  }
  return map;
}

const muscleToCategory = buildMuscleToCategory();

const EQUIPMENT_OPTIONS = ['All', 'Barbell', 'Dumbbell', 'Bodyweight', 'Cable', 'Machine', 'Bands', 'Kettlebell'] as const;
type EquipmentFilter = (typeof EQUIPMENT_OPTIONS)[number];

const DIFFICULTY_OPTIONS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;
type DifficultyFilter = (typeof DIFFICULTY_OPTIONS)[number];

const EQUIPMENT_MAP: Record<string, string[]> = {
  Barbell: ['Barbell'],
  Dumbbell: ['Dumbbell', 'Dumbbells'],
  Bodyweight: ['Bodyweight', 'Parallel Bars', 'Pull-up Bar', 'Plyo Box', 'Medicine Ball', 'Bosu Ball', 'Gymnastic Rings'],
  Cable: ['Cable'],
  Machine: ['Machine'],
  Bands: ['Resistance Band'],
  Kettlebell: ['Kettlebell'],
};

const DIFFICULTY_VALUE: Record<string, string> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

const difficultyBadge: Record<string, string> = {
  beginner: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  advanced: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

function activeTab(isLight: boolean) {
  return isLight
    ? 'bg-rose-100 text-rose-700 border border-rose-300'
    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
}

function inactiveTab(isLight: boolean) {
  return isLight
    ? 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
    : 'bg-void text-zinc-400 border border-white/5 hover:bg-white/5';
}

/* ─── Constants for card sizing ─── */
const GAP = 12; // matches Tailwind gap-3
const PADDING = GAP / 2; // 6px
const CARD_CONTENT_HEIGHT = 116; // px for text content area below the image
const IMAGE_ASPECT_RATIO = 300 / 400; // 0.75

/* ─── Card inner component ─── */
interface CardItemData {
  exercises: Exercise[];
  isLight: boolean;
  columnCount: number;
  onSelect: (ex: Exercise) => void;
}

const CardItem = memo(function CardItem({
  data,
  columnIndex,
  rowIndex,
  style,
}: {
  data: CardItemData;
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}) {
  const { exercises, isLight, columnCount, onSelect } = data;
  const index = rowIndex * columnCount + columnIndex;
  if (index >= exercises.length) return null;

  const ex = exercises[index];

  return (
    <div
      style={{
        ...style,
        padding: PADDING,
        boxSizing: 'border-box',
      }}
    >
      <div
        onClick={() => onSelect(ex)}
        className={`rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer active:scale-[0.98] h-full ${
          isLight
            ? 'bg-white border-stone-200 hover:border-rose-500/50 shadow-sm hover:shadow-md'
            : 'bg-kachi/50 border-white/5 hover:border-rose-500/50'
        }`}
      >
        {/* Exercise image */}
        <ExerciseImage exercise={ex} isLight={isLight} className="w-full" />

        {/* Content area */}
        <div className="p-4">
          {/* Header row: name + kanji */}
          <div className="flex items-start justify-between mb-2.5">
            <h3 className={`text-sm font-bold leading-tight ${isLight ? 'text-stone-800' : 'text-white'}`}>
              {ex.name}
            </h3>
            <span className="font-kanji text-lg opacity-40 shrink-0 ml-2">{ex.kanji}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span
              className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold border ${
                isLight
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {ex.muscleGroup}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold border ${
                isLight
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {ex.equipment}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold border ${difficultyBadge[ex.difficulty]}`}
            >
              {ex.difficulty.toUpperCase()}
            </span>
          </div>

          {/* Sets × Reps */}
          <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            {ex.defaultSets} × {ex.defaultReps} · {ex.restSeconds}s rest
          </p>
        </div>
      </div>
    </div>
  );
});

/* ─── Helper to compute column count from width ─── */
function getColumnCount(width: number): number {
  if (width >= 1024) return 3; // lg breakpoint
  if (width >= 768) return 2;  // md breakpoint
  return 1;                    // mobile
}

/* ─── Main component ─── */
function ExerciseLibrary({ isLight, onAddToWorkout }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentFilter>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('All');
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);
  const [isReady, setIsReady] = useState(false);

  /* Grid sizing */
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Mark as ready after mount so skeleton shows briefly
    const readyTimer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions((prev) => {
          if (prev.width !== Math.floor(width) || prev.height !== Math.floor(height)) {
            return { width: Math.floor(width), height: Math.floor(height) };
          }
          return prev;
        });
      }
    });

    observer.observe(el);
    // Initial measurement
    const rect = el.getBoundingClientRect();
    setDimensions({ width: Math.floor(rect.width), height: Math.floor(rect.height) });

    return () => observer.disconnect();
  }, []);

  const containerWidth = dimensions.width;
  const containerHeight = dimensions.height;

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      /* Search */
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        if (
          !ex.name.toLowerCase().includes(t) &&
          !ex.muscleGroup.toLowerCase().includes(t) &&
          !ex.equipment.toLowerCase().includes(t)
        )
          return false;
      }

      /* Category */
      if (selectedCategory !== 'all' && muscleToCategory[ex.muscleGroup] !== selectedCategory)
        return false;

      /* Equipment */
      if (selectedEquipment !== 'All') {
        const valid = EQUIPMENT_MAP[selectedEquipment] ?? [];
        if (!valid.some((eq) => ex.equipment === eq)) return false;
      }

      /* Difficulty */
      if (selectedDifficulty !== 'All' && ex.difficulty !== DIFFICULTY_VALUE[selectedDifficulty])
        return false;

      return true;
    });
  }, [searchTerm, selectedCategory, selectedEquipment, selectedDifficulty]);

  const columnCount = useMemo(() => getColumnCount(containerWidth), [containerWidth]);
  const columnWidth = useMemo(() => Math.floor(containerWidth / columnCount), [containerWidth, columnCount]);
  const rowCount = useMemo(
    () => Math.ceil(filteredExercises.length / columnCount),
    [filteredExercises.length, columnCount],
  );
  const cardImageHeight = useMemo(() => Math.floor(columnWidth * IMAGE_ASPECT_RATIO), [columnWidth]);
  const cardHeight = useMemo(() => cardImageHeight + CARD_CONTENT_HEIGHT, [cardImageHeight]);
  const rowHeight = useMemo(() => cardHeight + GAP, [cardHeight]);

  const itemData = useMemo<CardItemData>(
    () => ({
      exercises: filteredExercises,
      isLight,
      columnCount,
      onSelect: setDetailExercise,
    }),
    [filteredExercises, isLight, columnCount],
  );

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedEquipment('All');
    setSelectedDifficulty('All');
  };

  return (
    <>
      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises by name, muscle, or equipment…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2.5 pl-10 rounded-xl border text-sm font-mono outline-none transition-all ${
              isLight
                ? 'bg-white border-stone-200 text-stone-800 placeholder:text-stone-400 focus:border-rose-400'
                : 'bg-void border-white/5 text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500/50'
            }`}
          />
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all' ? activeTab(isLight) : inactiveTab(isLight)
            }`}
          >
            ALL
          </button>
          {exerciseCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id ? activeTab(isLight) : inactiveTab(isLight)
              }`}
            >
              {cat.kanji} {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Equipment + Difficulty row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Equipment */}
          <div className="flex-1">
            <p
              className={`text-[9px] font-mono uppercase tracking-wider mb-1.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
            >
              EQUIPMENT
            </p>
            <div className="flex flex-wrap gap-1.5">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <button
                  key={eq}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all cursor-pointer ${
                    selectedEquipment === eq ? activeTab(isLight) : inactiveTab(isLight)
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <p
              className={`text-[9px] font-mono uppercase tracking-wider mb-1.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
            >
              DIFFICULTY
            </p>
            <div className="flex gap-1.5">
              {DIFFICULTY_OPTIONS.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all cursor-pointer ${
                    selectedDifficulty === diff ? activeTab(isLight) : inactiveTab(isLight)
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className={`text-[10px] font-mono mt-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
        {filteredExercises.length} EXERCISE{filteredExercises.length !== 1 ? 'S' : ''} FOUND
      </p>

      {/* Skeleton loading state */}
      {!isReady ? (
        <div className="mt-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-xl overflow-hidden animate-pulse ${isLight ? 'bg-white border border-stone-200' : 'bg-kachi/50 border border-white/5'}`}>
              <div className={`w-full ${isLight ? 'bg-stone-200' : 'bg-zinc-800/60'}`} style={{ aspectRatio: '300/400', maxHeight: 200 }} />
              <div className="p-4 space-y-2.5">
                <div className={`h-3 w-3/4 rounded ${isLight ? 'bg-stone-200' : 'bg-zinc-800/60'}`} />
                <div className="flex gap-1.5">
                  <div className={`h-4 w-14 rounded-md ${isLight ? 'bg-stone-200' : 'bg-zinc-800/60'}`} />
                  <div className={`h-4 w-16 rounded-md ${isLight ? 'bg-stone-200' : 'bg-zinc-800/60'}`} />
                  <div className={`h-4 w-20 rounded-md ${isLight ? 'bg-stone-200' : 'bg-zinc-800/60'}`} />
                </div>
                <div className={`h-2.5 w-1/2 rounded ${isLight ? 'bg-stone-200' : 'bg-zinc-800/60'}`} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredExercises.length > 0 ? (
        <div ref={gridContainerRef} className="mt-3" style={{ height: Math.min(rowCount * rowHeight + GAP, containerHeight) }}>
          <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={Math.min(rowCount * rowHeight + GAP, containerHeight)}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={containerWidth}
            itemData={itemData}
            overscanRowCount={2}
          >
            {CardItem}
          </Grid>
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-16">
          <p className={`text-sm font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            No exercises match your filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-2 text-xs font-mono text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Detail overlay */}
      {detailExercise && (
        <ExerciseDetail
          exercise={detailExercise}
          isLight={isLight}
          onClose={() => setDetailExercise(null)}
          onAddToWorkout={onAddToWorkout}
        />
      )}
    </>
  );
}

export default memo(ExerciseLibrary);
