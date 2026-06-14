import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, Apple, CheckCircle2, XCircle, Target, Flame, Sparkles, Dumbbell, Zap } from 'lucide-react';
import { DIET_PROGRAMS } from '../data/dietPrograms';
import type { DietProgram } from '../data/dietPrograms';

interface DietPlanViewProps {
  isLight: boolean;
}

const CATEGORY_FILTERS: { label: string; value: string; match: (d: DietProgram) => boolean }[] = [
  { label: 'All', value: 'all', match: () => true },
  { label: 'Fat Loss', value: 'fat-loss', match: (d) => d.category === 'fat-loss' },
  { label: 'Muscle Gain', value: 'muscle-gain', match: (d) => d.category === 'muscle-gain' },
  { label: 'Keto', value: 'keto', match: (d) => d.category === 'keto' || d.category === 'low-carb' },
  { label: 'Plant-Based', value: 'plant-based', match: (d) => d.category === 'plant-based' },
  { label: 'Intermittent Fasting', value: 'intermittent-fasting', match: (d) => d.category === 'intermittent-fasting' },
  { label: 'Mediterranean', value: 'mediterranean', match: (d) => d.category === 'mediterranean' },
  { label: 'Bodybuilding', value: 'bodybuilding', match: (d) => d.category === 'bodybuilding' },
  { label: 'Performance', value: 'performance', match: (d) => d.category === 'performance' },
  { label: 'Paleo', value: 'paleo', match: (d) => d.category === 'paleo' },
  { label: 'Maintenance', value: 'maintenance', match: (d) => d.category === 'maintenance' },
  { label: 'Recovery', value: 'recovery', match: (d) => d.category === 'specific' },
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
  'fat-loss': 'Fat Loss',
  'muscle-gain': 'Muscle Gain',
  maintenance: 'Maintenance',
  keto: 'Keto',
  'low-carb': 'Low Carb',
  'high-carb': 'High Carb',
  'plant-based': 'Plant-Based',
  'intermittent-fasting': 'IF',
  mediterranean: 'Mediterranean',
  performance: 'Performance',
  bodybuilding: 'Bodybuilding',
  paleo: 'Paleo',
  specific: 'Specific',
};

const CATEGORY_BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'fat-loss': { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30' },
  'muscle-gain': { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  keto: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  'low-carb': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  'plant-based': { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-500/30' },
  'intermittent-fasting': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  mediterranean: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30' },
  bodybuilding: { bg: 'bg-orange-500/10', text: 'text-orange-300', border: 'border-orange-500/30' },
  performance: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  paleo: { bg: 'bg-yellow-500/10', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  maintenance: { bg: 'bg-sky-500/10', text: 'text-sky-300', border: 'border-sky-500/30' },
  specific: { bg: 'bg-zinc-500/10', text: 'text-zinc-300', border: 'border-zinc-500/30' },
};

const CATEGORY_BADGE_COLORS_LIGHT: Record<string, { bg: string; text: string; border: string }> = {
  'fat-loss': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  'muscle-gain': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  keto: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  'low-carb': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  'plant-based': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  'intermittent-fasting': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  mediterranean: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  bodybuilding: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  performance: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  paleo: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
  maintenance: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
  specific: { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' },
};

function macroBar(value: string, isLight: boolean): { pct: number; color: string; lightColor: string } {
  const num = parseInt(value);
  if (value.includes('g')) {
    const v = parseFloat(value);
    if (v > 200) return { pct: 100, color: 'bg-rose-500', lightColor: 'bg-rose-400' };
    if (v > 100) return { pct: 70, color: 'bg-rose-500', lightColor: 'bg-rose-400' };
    return { pct: Math.max(10, (v / 200) * 100), color: 'bg-rose-500', lightColor: 'bg-rose-400' };
  }
  if (value.includes('kcal') || value.toUpperCase().includes('TDEE') || value.includes('–') || value.includes('-')) {
    return { pct: 60, color: 'bg-amber-500', lightColor: 'bg-amber-400' };
  }
  return { pct: 50, color: 'bg-amber-500', lightColor: 'bg-amber-400' };
}

const MACRO_COLORS: Record<string, { bar: string; text: string; label: string }> = {
  protein: { bar: 'bg-rose-500', text: 'text-rose-400', label: 'PROTEIN' },
  carbs: { bar: 'bg-amber-500', text: 'text-amber-400', label: 'CARBS' },
  fat: { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'FAT' },
};

const MACRO_COLORS_LIGHT: Record<string, { bar: string; text: string; label: string }> = {
  protein: { bar: 'bg-rose-400', text: 'text-rose-600', label: 'PROTEIN' },
  carbs: { bar: 'bg-amber-400', text: 'text-amber-600', label: 'CARBS' },
  fat: { bar: 'bg-emerald-400', text: 'text-emerald-600', label: 'FAT' },
};

function DifficultyBadge({ difficulty, isLight }: { difficulty: string; isLight: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${isLight ? DIFFICULTY_COLORS_LIGHT[difficulty] : DIFFICULTY_COLORS[difficulty]}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

function CategoryBadge({ category, isLight }: { category: string; isLight: boolean }) {
  const colors = isLight ? CATEGORY_BADGE_COLORS_LIGHT : CATEGORY_BADGE_COLORS;
  const c = colors[category] || (isLight
    ? { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' }
    : { bg: 'bg-white/5', text: 'text-zinc-400', border: 'border-white/10' }
  );
  const label = CATEGORY_LABELS[category] || category;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono border ${c.bg} ${c.text} ${c.border}`}>
      {label}
    </span>
  );
}

function DietCard({
  diet,
  isLight,
  isExpanded,
  onToggle,
}: {
  diet: DietProgram;
  isLight: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  key?: string | number;
}) {
  const calDisplay = diet.typicalMacros.calories;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`rounded-xl border overflow-hidden transition-all ${
        isLight
          ? 'backdrop-blur-xl bg-white/60 border-stone-200'
          : 'backdrop-blur-xl bg-black/20 border-white/10'
      }`}
    >
      {/* Card Header (always visible) */}
      <button
        onClick={onToggle}
        className={`w-full text-left p-4 cursor-pointer transition-colors ${
          isLight ? 'hover:bg-stone-50' : 'hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-bold leading-tight ${isLight ? 'text-stone-800' : 'text-white'}`}>
              {diet.name}
            </h3>
            <p className={`text-[9px] font-mono mt-0.5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              {diet.goal}
            </p>
          </div>
          <DifficultyBadge difficulty={diet.difficulty} isLight={isLight} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={diet.category} isLight={isLight} />
          <span className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            ~{calDisplay}
          </span>
        </div>

        <p className={`text-[10px] font-mono leading-relaxed line-clamp-2 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
          {diet.description}
        </p>

        <div className={`mt-2 pt-2 border-t flex items-center justify-between ${isLight ? 'border-stone-100' : 'border-white/5'}`}>
          <span className={`text-[8px] font-mono italic ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            {diet.bestFor.length > 60 ? diet.bestFor.slice(0, 60) + '…' : diet.bestFor}
          </span>
          <div className="flex items-center gap-1">
            {isExpanded ? (
              <ChevronUp className={`w-3.5 h-3.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
            ) : (
              <ChevronDown className={`w-3.5 h-3.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
            )}
          </div>
        </div>
      </button>

      {/* Expandable Detail */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 space-y-4 border-t ${isLight ? 'border-stone-200' : 'border-white/5'}`}>
              {/* Description */}
              <div className="pt-3">
                <h4 className={`text-[10px] font-bold font-mono mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                  <Target className="w-3 h-3 text-rose-400" />
                  OVERVIEW
                </h4>
                <p className={`text-[10px] font-mono leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                  {diet.description}
                </p>
              </div>

              {/* Scientific Basis */}
              <div>
                <h4 className={`text-[10px] font-bold font-mono mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  SCIENTIFIC BASIS
                </h4>
                <p className={`text-[9px] font-mono leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                  {diet.scientificBasis}
                </p>
              </div>

              {/* Macros */}
              <div>
                <h4 className={`text-[10px] font-bold font-mono mb-2 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                  TYPICAL MACROS
                </h4>
                <div className="space-y-2">
                  {(['protein', 'carbs', 'fat'] as const).map((key) => {
                    const value = diet.typicalMacros[key];
                    const mc = isLight ? MACRO_COLORS_LIGHT[key] : MACRO_COLORS[key];
                    const bar = macroBar(value, isLight);
                    const barColor = isLight ? bar.lightColor : bar.color;
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-[8px] font-mono font-semibold ${mc.text}`}>{mc.label}</span>
                          <span className={`text-[8px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>{value}</span>
                        </div>
                        <div className={`h-1.5 rounded-full ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`}>
                          <div
                            className={`h-full rounded-full ${barColor} transition-all duration-500`}
                            style={{ width: `${Math.min(bar.pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center pt-1">
                    <span className={`text-[8px] font-mono font-semibold ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>CALORIES</span>
                    <span className={`text-[9px] font-mono font-bold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{diet.typicalMacros.calories}</span>
                  </div>
                </div>
              </div>

              {/* Sample Meals */}
              <div>
                <h4 className={`text-[10px] font-bold font-mono mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                  <Apple className="w-3 h-3 text-emerald-400" />
                  SAMPLE MEALS
                </h4>
                <div className="space-y-1">
                  {diet.sampleMeals.slice(0, 4).map((meal, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1.5 rounded text-[9px] font-mono leading-relaxed ${
                        isLight ? 'bg-stone-100 text-stone-600' : 'bg-zinc-800/50 text-zinc-300'
                      }`}
                    >
                      {meal}
                    </div>
                  ))}
                  {diet.sampleMeals.length > 4 && (
                    <p className={`text-[8px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                      +{diet.sampleMeals.length - 4} more meals in full plan
                    </p>
                  )}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className={`text-[10px] font-bold font-mono mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    PROS
                  </h4>
                  <ul className="space-y-0.5">
                    {diet.pros.slice(0, 4).map((pro, i) => (
                      <li key={i} className={`flex items-start gap-1 text-[9px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                        <span className="text-emerald-400 mt-0.5">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={`text-[10px] font-bold font-mono mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                    <XCircle className="w-3 h-3 text-rose-400" />
                    CONS
                  </h4>
                  <ul className="space-y-0.5">
                    {diet.cons.slice(0, 4).map((con, i) => (
                      <li key={i} className={`flex items-start gap-1 text-[9px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                        <span className="text-rose-400 mt-0.5">−</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className={`text-[10px] font-bold font-mono mb-1 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                  BEST FOR
                </h4>
                <p className={`text-[9px] font-mono leading-relaxed ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {diet.bestFor}
                </p>
              </div>

              {/* Pair with Program */}
              {diet.recommendedProgramTypes.length > 0 && (
                <div>
                  <h4 className={`text-[10px] font-bold font-mono mb-1.5 flex items-center gap-1.5 ${isLight ? 'text-stone-700' : 'text-zinc-200'}`}>
                    <Dumbbell className="w-3 h-3 text-rose-400" />
                    PAIR WITH PROGRAM
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {diet.recommendedProgramTypes.slice(0, 6).map((progId, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-[8px] font-mono border ${
                          isLight
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {progId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    ))}
                    {diet.recommendedProgramTypes.length > 6 && (
                      <span className={`text-[8px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                        +{diet.recommendedProgramTypes.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Proven By */}
              <div className={`pt-1 border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                <p className={`text-[7px] font-mono italic ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  {diet.provenBy}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DietPlanView({ isLight }: DietPlanViewProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [expandedDiet, setExpandedDiet] = useState<string | null>(null);

  const filteredDiets = useMemo(() => {
    const catFilter = CATEGORY_FILTERS.find((f) => f.value === categoryFilter) || CATEGORY_FILTERS[0];
    let results = DIET_PROGRAMS.filter(catFilter.match);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.goal.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.bestFor.toLowerCase().includes(q)
      );
    }

    if (difficultyFilter !== 'all') {
      results = results.filter((d) => d.difficulty === difficultyFilter);
    }

    return results;
  }, [categoryFilter, searchQuery, difficultyFilter]);

  const handleToggle = (id: string) => {
    setExpandedDiet(expandedDiet === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => { setCategoryFilter(filter.value); setExpandedDiet(null); }}
            className={`px-3 py-1 rounded-full text-[9px] font-mono font-semibold transition-all cursor-pointer ${
              categoryFilter === filter.value
                ? isLight
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
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
            placeholder="Search diet plans by name, goal, or description…"
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
          {filteredDiets.length} diet plan{filteredDiets.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Diet List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredDiets.map((diet) => (
            <DietCard
              key={diet.id}
              diet={diet}
              isLight={isLight}
              isExpanded={expandedDiet === diet.id}
              onToggle={() => handleToggle(diet.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredDiets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900/50 border-white/5'}`}
        >
          <Apple className={`w-8 h-8 mx-auto mb-3 ${isLight ? 'text-stone-300' : 'text-zinc-600'}`} />
          <p className={`text-sm font-bold mb-1 ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>No Diet Plans Found</p>
          <p className={`text-[10px] font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}
    </div>
  );
}
