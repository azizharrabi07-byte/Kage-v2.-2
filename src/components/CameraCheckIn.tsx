import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FormFeedback {
  score: number;
  tips: string[];
  passed: boolean;
}

const MOCK_FEEDBACK: FormFeedback[] = [
  { score: 92, tips: ['Core engagement looks solid', 'Slight hip rise at top - keep pelvis neutral', 'Breathing rhythm is excellent'], passed: true },
  { score: 78, tips: ['Back angle could be flatter', 'Drive through heels more', 'Knees tracking well over toes'], passed: true },
  { score: 65, tips: ['Shoulders are rounded - pull them back', 'Range of motion is shallow', 'Tempo is too fast - control the negative'], passed: false },
];

export default function CameraCheckIn() {
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);

  const runCheck = () => {
    setIsChecking(true);
    setFeedback(null);
    setTimeout(() => {
      setFeedback(MOCK_FEEDBACK[Math.floor(Math.random() * MOCK_FEEDBACK.length)]);
      setIsChecking(false);
    }, 2000);
  };

  return (
    <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          AI FORM CHECK
        </span>
        {feedback && (
          <span className={`text-[10px] font-mono ${feedback.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {feedback.passed ? 'PASSED' : 'NEEDS WORK'}
          </span>
        )}
      </div>

      <div className="aspect-video rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50 relative overflow-hidden">
        {isChecking ? (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-center">
            <Camera className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 font-mono">ANALYZING FORM...</p>
          </motion.div>
        ) : feedback ? (
          <div className="text-center p-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <span className={`text-5xl font-black font-mono ${feedback.score >= 85 ? 'text-emerald-400' : feedback.score >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                {feedback.score}%
              </span>
            </motion.div>
            <div className="mt-2 space-y-1">
              {feedback.tips.map((tip, i) => (
                <p key={i} className="text-[9px] text-zinc-400 font-mono leading-relaxed">• {tip}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-500 font-mono">POSITION YOUR PHONE TO CAPTURE FORM</p>
          </div>
        )}
      </div>

      <button
        onClick={runCheck}
        disabled={isChecking}
        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-widest transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
      >
        {isChecking ? (
          <>SCANNING...</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" /> CHECK FORM</>
        )}
      </button>
    </div>
  );
}
