import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  duration?: number;
  autoStart?: boolean;
  onComplete?: () => void;
  isLight?: boolean;
  show?: boolean;
}

export default function RestTimer({ duration = 60, autoStart = false, onComplete, isLight = false, show = true }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasBeeped = useRef(false);

  const playBeep = useCallback(() => {
    try {
      const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextCtor();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (error) { console.warn('[Timer] AudioContext error:', error); }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            setIsComplete(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    if (isComplete && !hasBeeped.current) {
      hasBeeped.current = true;
      playBeep();
    }
    if (timeLeft > 0) {
      hasBeeped.current = false;
    }
  }, [isComplete, timeLeft, playBeep]);

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(duration);
    setIsActive(false);
    setIsComplete(false);
  };

  const toggle = () => {
    if (isComplete) {
      reset();
      setTimeout(() => setIsActive(true), 100);
    } else {
      setIsActive(!isActive);
    }
  };

  if (!show) return null;

  const circumference = 2 * Math.PI * 40;
  const progress = timeLeft / duration;
  const offset = circumference * (1 - progress);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${isLight ? 'bg-white border-stone-200' : 'bg-zinc-900/80 border-zinc-800/50'}`}>
      <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Rest Timer</span>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)'} strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none"
            stroke={isComplete ? '#22c55e' : '#E31E24'}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>
        <motion.div
          className="text-center"
          animate={isComplete ? { scale: [1, 1.2, 1, 1.1, 1] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <span className={`text-3xl font-mono font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          <p className={`text-[8px] font-mono uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
            {isComplete ? 'Done!' : isActive ? 'Resting' : 'Paused'}
          </p>
        </motion.div>
      </div>
      <div className="flex gap-2">
        <button onClick={toggle} className={`p-2 rounded-lg transition-colors cursor-pointer ${isLight ? 'bg-stone-200 hover:bg-stone-300' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
          {isActive ? <Pause className={`w-4 h-4 ${isLight ? 'text-stone-700' : 'text-white'}`} /> : <Play className={`w-4 h-4 ${isLight ? 'text-stone-700' : 'text-white'}`} />}
        </button>
        <button onClick={reset} className={`p-2 rounded-lg transition-colors cursor-pointer ${isLight ? 'bg-stone-200 hover:bg-stone-300' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
          <RotateCcw className={`w-4 h-4 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`} />
        </button>
      </div>
    </div>
  );
}
