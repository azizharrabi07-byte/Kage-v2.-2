import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, CheckCircle2, Target } from 'lucide-react';

interface PushupSet {
  reps: number;
  timestamp: Date;
}

export default function PushupVerification({ target = 20, exerciseName = 'Push-Ups' }: { target?: number; exerciseName?: string }) {
  const [count, setCount] = useState(0);
  const [completedSets, setCompletedSets] = useState<PushupSet[]>([]);
  const [isCounting, setIsCounting] = useState(false);

  const handleRep = () => {
    if (count >= target) return;
    setCount(prev => prev + 1);
    if (!isCounting) setIsCounting(true);
  };

  const verifySet = () => {
    if (count === 0) return;
    setCompletedSets(prev => [...prev, { reps: count, timestamp: new Date() }]);
    setCount(0);
    setIsCounting(false);
  };

  const progress = count / target;

  return (
    <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-rose-400" />
          {exerciseName}
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          Sets: {completedSets.length}
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={handleRep}
          whileTap={{ scale: 0.92 }}
          className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-rose-500/30 flex flex-col items-center justify-center cursor-pointer active:bg-rose-500/10 transition-colors relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-rose-500/10"
            animate={{ scale: isCounting ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: isCounting ? Infinity : 0 }}
          />
          <span className="text-5xl font-black font-mono text-white">{count}</span>
          <span className="text-[10px] text-zinc-500 font-mono">reps</span>
        </motion.button>

        <span className="text-xs text-zinc-400 font-mono">
          Tap the circle to count each rep
        </span>
      </div>

      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
        <span>0</span>
        <span>{target} reps</span>
      </div>

      <button
        onClick={verifySet}
        disabled={count === 0}
        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-mono text-xs font-bold tracking-widest transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" />
        VERIFY SET ({count}/{target})
      </button>

      {completedSets.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-zinc-800">
          <span className="text-[9px] font-mono text-zinc-600 uppercase">Completed Sets</span>
          {completedSets.map((set, i) => (
            <div key={i} className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>Set {i + 1}</span>
              <span className="text-emerald-400">{set.reps} reps ✓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
