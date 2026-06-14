import { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, Dumbbell, Clock, BarChart3, Target, Flame, Sparkles, X } from 'lucide-react';
import { REAL_PROGRAMS } from '../data/programs';
import type { TrainingProgram } from '../data/programs';

interface ProgramBrowserProps {
  isLight: boolean;
  onSelectProgram?: (program: TrainingProgram) => void;
}

const CATEGORY_FILTERS: { label: string; value: string; match: (p: TrainingProgram) => boolean }[] = [
  { label: 'All', value: 'all', match: () => true },
  { label: 'Strength', value: 'strength', match: (p) => p.category === 'strength' },
  { label: 'Hypertrophy', value: 'hypertrophy', match: (p) => p.category === 'hypertrophy' },
  { label: 'Powerlifting', value: 'powerlifting', match: (p) => p.category === 'powerlifting' },
  { label: 'Bodybuilding', value: 'bodybuilding', match: (p) => p.category === 'bodybuilding' },
  { label: 'Calisthenics', value: 'calisthenics', match: (p) => p.category === 'calisthenics' },
  { label: 'Cardio/HIIT', value: 'cardio-hiit', match: (p) => ['cardio', 'hiit', 'endurance'].includes(p.category) },
  { label: 'Flexibility', value: 'flexibility', match: (p) => p.category === 'flexibility' },
  { label: 'Powerbuilding', value: 'powerbuilding', match: (p) => ['strength', 'hypertrophy', 'powerlifting'].includes(p.category) },
  { label: 'Sports-Specific', value: 'sports-specific', match: () => false },
  { label: 'Health', value: 'health', match: (p) => ['fullbody', 'cardio', 'flexibility', 'endurance'].includes(p.category) },
  { label: 'Specialized', value: 'specialized', match: () => false },
  { label: 'Full Body', value: 'fullbody', match: (p) => p.category === 'fullbody' },
  { label: 'Split', value: 'split', match: (p) => p.category === 'split' },
];

const DIFFICULTY_FILTERS = [
  { label: 'All', value: 'all' as const },
  { label: 'Beginner', value: 'beginner' as const },
  { label: 'Intermediate', value: 'intermediate' as const },
  { label: 'Advanced', value: 'advanced' as const },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
};

const DIFFICULTY_COLORS_LIGHT: Record<string, string> = {
  beginner: 'text-emerald-700 bg-emerald-100 border-emerald-200',
  intermediate: 'text-amber-700 bg-amber-100 border-amber-200',
  advanced: 'text-rose-700 bg-rose-100 border-rose-200',
};

const CATEGORY_LABELS: Record<string, string> = {
  strength: 'Strength',
  hypertrophy: 'Hypertrophy',
  endurance: 'Endurance',
  powerlifting: 'Powerlifting',
  bodybuilding: 'Bodybuilding',
  calisthenics: 'Calisthenics',
  cardio: 'Cardio',
  hiit: 'HIIT',
  flexibility: 'Flexibility',
  fullbody: 'Full Body',
  split: 'Split',
};

function DifficultyBadge({ difficulty, isLight }: { difficulty: string; isLight: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${isLight ? DIFFICULTY_COLORS_LIGHT[difficulty] : DIFFICULTY_COLORS[difficulty]}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

function CategoryBadge({ category, isLight }: { category: string; isLight: boolean }) {
  const label = CATEGORY_LABELS[category] || category;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono border ${isLight ? 'bg-stone-100 text-stone-600 border-stone-200' : 'bg-white/5 text-zinc-400 border-white/10'}`}>
      {label}
    </span>
  );
}

function ProgramCard({
  program,
  isLight,
  onSelect,
}: {
  program: TrainingProgram;
  isLight: boolean;
  onSelect: () => void;
  key?: string | number;
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onSelect}
      className={`w-full text-left rounded-xl p-4 border transition-all cursor-pointer active:scale-[0.98] ${
        isLight
          ? 'bg-white border-stone-200 hover:border-rose-300 hover:shadow-md'
          : 'bg-kachi/50 border-white/5 hover:border-rose-500/30 hover:bg-kachi/70'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`text-sm font-bold leading-tight ${isLight ? 'text-stone-800' : 'text-white'}`}>
          {program.name}
        </h3>
        <DifficultyBadge difficulty={program.difficulty} isLight={isLight} />
      </div>
      <p className={`text-[10px] font-mono leading-relaxed mb-3 line-clamp-2 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
        {program.goal}
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`flex items-center gap-1 text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          <Clock className="w-3 h-3" />
          {program.duration}
        </span>
        <span className={`flex items-center gap-1 text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          <BarChart3 className="w-3 h-3" />
          {program.frequency}
        </span>
        <CategoryBadge category={program.category} isLight={isLight} />
      </div>
      <div className="flex items-center gap-1.5">
        <Dumbbell className={`w-3 h-3 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
        <span className={`text-[8px] font-mono truncate ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          {program.equipment.length > 40 ? program.equipment.slice(0, 40) + '…' : program.equipment}
        </span>
      </div>
      <div className={`mt-2 pt-2 border-t ${isLight ? 'border-stone-100' : 'border-white/5'}`}>
        <span className={`text-[8px] font-mono italic ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          Proven by: {program.provenBy.length > 50 ? program.provenBy.slice(0, 50) + '…' : program.provenBy}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {program.popularity === 'classic' && <Sparkles className="w-3 h-3 text-amber-400" />}
        {program.popularity === 'competitive' && <Flame className="w-3 h-3 text-rose-400" />}
        <span className={`text-[8px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          {program.sampleExercises.slice(0, 3).join(' • ')}
          {program.sampleExercises.length > 3 ? ' …' : ''}
        </span>
      </div>
    </motion.button>
  );
}

function DetailPanel({
  program,
  isLight,
  onClose,
  onStart,
}: {
  program: TrainingProgram;
  isLight: boolean;
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`rounded-xl border overflow-hidden ${
        isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/80 border-white/10'
      }`}
    >
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-lg font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>
                {program.name}
              </h3>
              <DifficultyBadge difficulty={program.difficulty} isLight={isLight} />
              <CategoryBadge category={program.category} isLight={isLight} />
            </div>
            <p className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              {program.goal}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'hover:bg-stone-200 text-stone-500' : 'hover:bg-zinc-800 text-zinc-400'
            }`}
            aria-label="Close detail panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: 'Duration', value: program.duration },
            { icon: BarChart3, label: 'Frequency', value: program.frequency },
            { icon: Dumbbell, label: 'Equipment', value: program.equipment.length > 30 ? program.equipment.slice(0, 30) + '…' : program.equipment },
            { icon: Flame, label: 'Style', value: program.popularity.charAt(0).toUpperCase() + program.popularity.slice(1) },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-3 ${isLight ? 'bg-white border border-stone-200' : 'bg-zinc-800/50 border border-white/5'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <item.icon className={`w-3 h-3 ${isLight ? 'text-rose-500' : 'text-rose-400'}`} />
                <span className={`text-[8px] font-mono uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{item.label}</span>
              </div>
              <p className={`text-[11px] font-mono font-medium ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h4 className={`text-xs font-bold font-mono mb-2 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
            <Target className="w-3.5 h-3.5 text-rose-400" />
            DESCRIPTION
          </h4>
          <p className={`text-[11px] font-mono leading-relaxed ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>
            {program.description}
          </p>
        </div>

        {/* Scientific Basis */}
        <div>
          <h4 className={`text-xs font-bold font-mono mb-2 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            SCIENTIFIC BASIS
          </h4>
          <p className={`text-[10px] font-mono leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            {program.scientificBasis}
          </p>
        </div>

        {/* What You Will Gain */}
        <div>
          <h4 className={`text-xs font-bold font-mono mb-2 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
            WHAT YOU WILL GAIN
          </h4>
          <p className={`text-[11px] font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            {program.whatYouWillGain}
          </p>
        </div>

        {/* Sample Exercises */}
        <div>
          <h4 className={`text-xs font-bold font-mono mb-2 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
            <Dumbbell className="w-3.5 h-3.5 text-rose-400" />
            SAMPLE EXERCISES
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {program.sampleExercises.slice(0, 8).map((ex, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                isLight ? 'bg-white text-stone-700 border-stone-200' : 'bg-zinc-800 text-zinc-300 border-white/10'
              }`}>
                {ex}
              </span>
            ))}
            {program.sampleExercises.length > 8 && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                +{program.sampleExercises.length - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Target Muscles */}
        <div>
          <h4 className={`text-xs font-bold font-mono mb-2 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
            TARGET MUSCLES
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {program.targetMuscles.map((muscle, i) => (
              <span key={i} className={`px-2 py-0.5 rounded-full text-[8px] font-mono border ${
                isLight
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}>
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Attribution */}
        <div className={`pt-2 border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
          <p className={`text-[8px] font-mono italic ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            {program.provenBy}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className={`w-full py-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
            isLight
              ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
              : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20 border border-rose-400/30'
          }`}
        >
          START THIS PROGRAM
        </button>
      </div>
    </motion.div>
  );
}

function ProgramBrowser({ isLight, onSelectProgram }: ProgramBrowserProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const filteredPrograms = useMemo(() => {
    const catFilter = CATEGORY_FILTERS.find((f) => f.value === categoryFilter) || CATEGORY_FILTERS[0];
    let results = REAL_PROGRAMS.filter(catFilter.match);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.goal.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (difficultyFilter !== 'all') {
      results = results.filter((p) => p.difficulty === difficultyFilter);
    }

    return results;
  }, [categoryFilter, searchQuery, difficultyFilter]);

  const handleSelectProgram = (program: TrainingProgram) => {
    setSelectedProgram(selectedProgram?.id === program.id ? null : program);
  };

  const handleStartProgram = () => {
    if (selectedProgram && onSelectProgram) {
      onSelectProgram(selectedProgram);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => { setCategoryFilter(filter.value); setSelectedProgram(null); }}
            className={`px-3 py-1 rounded-full text-[9px] font-mono font-semibold transition-all cursor-pointer ${
              categoryFilter === filter.value
                ? isLight
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : isLight
                  ? 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                  : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search + Difficulty */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${
          isLight ? 'bg-white border-stone-200' : 'bg-void border-white/10'
        }`}>
          <Search className={`w-4 h-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            placeholder="Search programs by name, goal, or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent text-xs font-mono outline-none placeholder:text-[10px] ${
              isLight ? 'text-stone-800 placeholder:text-stone-400' : 'text-zinc-200 placeholder:text-zinc-500'
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={`text-[9px] cursor-pointer ${isLight ? 'text-stone-400 hover:text-stone-600' : 'text-zinc-500 hover:text-zinc-300'}`}>
              CLEAR
            </button>
          )}
        </div>
        <div className={`flex p-0.5 rounded-lg border ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-void border-white/10'}`}>
          {DIFFICULTY_FILTERS.map((df) => (
            <button
              key={df.value}
              onClick={() => setDifficultyFilter(df.value)}
              className={`px-3 py-1.5 rounded-md text-[9px] font-mono font-semibold transition-all cursor-pointer ${
                difficultyFilter === df.value
                  ? isLight
                    ? 'bg-white text-stone-800 shadow-sm border border-stone-200'
                    : 'bg-kachi text-zinc-200 border border-white/10'
                  : isLight
                    ? 'text-stone-500 hover:text-stone-700'
                    : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isLight={isLight}
              onSelect={() => handleSelectProgram(program)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-white/5'}`}
        >
          <Target className={`w-8 h-8 mx-auto mb-3 ${isLight ? 'text-stone-300' : 'text-zinc-600'}`} />
          <p className={`text-sm font-bold mb-1 ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>No Programs Found</p>
          <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedProgram && (
          <DetailPanel
            program={selectedProgram}
            isLight={isLight}
            onClose={() => setSelectedProgram(null)}
            onStart={handleStartProgram}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProgramBrowser);
