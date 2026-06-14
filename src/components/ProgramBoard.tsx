import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Timer, Zap, Target, ChevronRight, Play, Info, AlertCircle } from 'lucide-react';
import TiltCard3D from './TiltCard3D';
import type { WorkoutProgram } from '../types';

const difficultyStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function ProgramCard({ program, onSelect, isLight }: { program: WorkoutProgram; onSelect: (p: WorkoutProgram) => void; isLight?: boolean }) {
  return (
    <TiltCard3D onClick={() => onSelect(program)} glowColor="rgba(227,30,36,0.25)"
      className={isLight ? 'bg-white/90 border border-stone-200 p-5' : 'bg-[#1A1A24]/90 border border-white/5 p-5'}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs tracking-[0.25em] text-red-400 mb-1">{program.nameKanji}</div>
          <h3 className={`text-lg font-bold tracking-wider ${isLight ? 'text-stone-900' : 'text-white'}`}>{program.nameEnglish}</h3>
        </div>
        <div className="text-amber-400 text-sm tracking-wider">{difficultyStars(program.difficulty)}</div>
      </div>
      <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-gray-400'} leading-relaxed mb-4`}>{program.description}</p>
      <div className={`flex items-center gap-4 text-xs ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>
        <span className="flex items-center gap-1"><Timer size={12} />{program.duration}</span>
        <span className="flex items-center gap-1"><Zap size={12} />{program.workoutCount} moves</span>
        <span className="flex items-center gap-1"><Dumbbell size={12} />{program.equipmentNeeded ? 'Gear' : 'Body'}</span>
      </div>
    </TiltCard3D>
  );
}

interface ExerciseInput {
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

const EXERCISE_STEPS: Record<string, string[]> = {
  default: [
    'Assume proper starting position with neutral spine',
    'Engage core and brace throughout the movement',
    'Execute with controlled tempo - 2s eccentric, 1s concentric',
    'Breathe: exhale on exertion, inhale on return',
    'Rest 60-90s between sets'
  ]
};

const EXERCISE_TIPS: Record<string, string[]> = {
  default: [
    'Keep shoulders down and back, not hunched',
    'If form breaks, reduce weight immediately',
    'Drive through the full range of motion',
    'Warm up with 50% working weight for 1 set'
  ]
};

export function ProgramDetailBoard({ program, onClose, onBegin, isLight }: { program: WorkoutProgram; onClose: () => void; onBegin?: (inputs: ExerciseInput[]) => void; isLight?: boolean }) {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [exerciseInputs, setExerciseInputs] = useState<ExerciseInput[]>(
    program.moves.map(() => ({
      sets: 3,
      reps: 10,
      weight: 0,
      notes: ''
    }))
  );

  const updateInput = (index: number, field: keyof ExerciseInput, value: number | string) => {
    setExerciseInputs(prev => prev.map((input, i) =>
      i === index ? { ...input, [field]: value } : input
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isLight ? 'bg-stone-200/90 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm'}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto no-scrollbar ${isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24]/95 border border-white/10'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs tracking-[0.25em] text-red-400">{program.nameKanji}</span>
            <h2 className={`text-2xl font-black tracking-wider mt-1 ${isLight ? 'text-stone-900' : 'text-white'}`}>{program.nameEnglish}</h2>
          </div>
          <button onClick={onClose} className={`text-xl cursor-pointer ${isLight ? 'text-stone-400 hover:text-stone-900' : 'text-gray-500 hover:text-white'}`}>&times;</button>
        </div>
        <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-stone-500' : 'text-gray-400'}`}>{program.description}</p>
        <div className={`flex gap-3 mb-4 text-xs ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>
          <span className="flex items-center gap-1"><Timer size={14} /> {program.duration}</span>
          <span className="flex items-center gap-1"><Target size={14} /> {program.workoutCount} moves</span>
          <span className="text-amber-400">{difficultyStars(program.difficulty)}</span>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className={`text-xs tracking-wider uppercase font-mono ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>Exercises</h4>
          {program.moves.map((move, i) => (
            <div key={i} className={`rounded-xl overflow-hidden border ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-black/20 border-white/5'}`}>
              <button
                onClick={() => setActiveExercise(activeExercise === i ? null : i)}
                className={`w-full flex items-center gap-3 p-3 cursor-pointer transition-colors ${isLight ? 'hover:bg-stone-200' : 'hover:bg-white/5'}`}
              >
                <span className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-[10px] text-rose-400 font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 text-left min-w-0">
                  <span className={`text-sm font-medium truncate block ${isLight ? 'text-stone-900' : 'text-white'}`}>{move.name}</span>
                  <span className={`text-[9px] font-mono ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>
                    {exerciseInputs[i].sets} × {exerciseInputs[i].reps}
                    {exerciseInputs[i].weight > 0 && ` @ ${exerciseInputs[i].weight}kg`}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isLight ? 'text-stone-400' : 'text-gray-600'} ${activeExercise === i ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {activeExercise === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-3 pb-3 space-y-3 border-t pt-3 ${isLight ? 'border-stone-200' : 'border-white/5'}`}>
                      {/* Steps */}
                      <div>
                        <span className={`text-[9px] font-mono uppercase flex items-center gap-1 mb-1.5 ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>
                          <Info className="w-3 h-3" /> Steps
                        </span>
                        <div className="space-y-1">
                            {(EXERCISE_STEPS.default || []).map((step, si) => (
                            <p key={si} className={`text-[10px] font-mono leading-relaxed flex gap-2 ${isLight ? 'text-stone-500' : 'text-gray-400'}`}>
                              <span className="text-rose-500/70 shrink-0">{si + 1}.</span>
                              <span>{step}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                          <span className={`text-[9px] font-mono uppercase flex items-center gap-1 mb-1.5 ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>
                            <AlertCircle className="w-3 h-3" /> Pro Tips
                        </span>
                        <div className="space-y-0.5">
                          {(EXERCISE_TIPS.default || []).map((tip, ti) => (
                            <p key={ti} className="text-[10px] text-amber-400/80 font-mono">• {tip}</p>
                          ))}
                        </div>
                      </div>

                      {/* User Input: Sets, Reps, Weight */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className={`text-[8px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>Sets</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={exerciseInputs[i].sets}
                            onChange={(e) => updateInput(i, 'sets', parseInt(e.target.value) || 1)}
                            className={`w-full rounded-lg px-2 py-1.5 text-xs font-mono text-center outline-none focus:border-rose-500/50 ${isLight ? 'bg-stone-100 border-stone-300 text-stone-900 border' : 'bg-black/40 border border-white/10 text-white'}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[8px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>Reps</label>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={exerciseInputs[i].reps}
                            onChange={(e) => updateInput(i, 'reps', parseInt(e.target.value) || 1)}
                            className={`w-full rounded-lg px-2 py-1.5 text-xs font-mono text-center outline-none focus:border-rose-500/50 ${isLight ? 'bg-stone-100 border-stone-300 text-stone-900 border' : 'bg-black/40 border border-white/10 text-white'}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[8px] font-mono uppercase block mb-1 ${isLight ? 'text-stone-400' : 'text-gray-500'}`}>Weight</label>
                          <input
                            type="number"
                            min={0}
                            max={500}
                            value={exerciseInputs[i].weight}
                            onChange={(e) => updateInput(i, 'weight', parseInt(e.target.value) || 0)}
                            className={`w-full rounded-lg px-2 py-1.5 text-xs font-mono text-center outline-none focus:border-rose-500/50 ${isLight ? 'bg-stone-100 border-stone-300 text-stone-900 border' : 'bg-black/40 border border-white/10 text-white'}`}
                            placeholder="kg"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <button
          onClick={() => onBegin?.(exerciseInputs)}
          className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold tracking-widest transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(227,30,36,0.3)]"
        >
          <Play className="w-4 h-4" />
          BEGIN WORKOUT
        </button>
      </motion.div>
    </motion.div>
  );
}
