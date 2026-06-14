import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, CheckCircle2 } from 'lucide-react';

interface PoseDetectorProps {
  isLight: boolean;
  onClose: () => void;
  onComplete: (count: number) => void;
  targetCount?: number;
  exerciseName?: string;
}

export default function PoseDetector({ isLight, onClose, onComplete, targetCount = 10, exerciseName = 'Exercise' }: PoseDetectorProps) {
  const [streamActive, setStreamActive] = useState(false);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'ready' | 'complete' | 'unavailable'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStreamActive(true);
      setStatus('ready');
    } catch {
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => { startCamera(); return () => streamRef.current?.getTracks().forEach(t => t.stop()); }, [startCamera]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isLight ? 'bg-stone-100' : 'bg-[#0A0A0F]'}`}>
      <div className="flex items-center justify-between p-4">
        <div>
          <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>AI POSE DETECTION</span>
          <h2 className={`text-sm font-bold ${isLight ? 'text-stone-800' : 'text-white'}`}>{exerciseName}</h2>
        </div>
        <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); onClose(); }}
          className={`p-2 rounded-full cursor-pointer ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`}>
          <X className={`w-5 h-5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`} />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className={`relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden border mb-4 ${isLight ? 'border-stone-200' : 'border-zinc-800'}`}>
          {streamActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <p className="text-xs font-mono text-zinc-500">{status === 'unavailable' ? 'Camera unavailable' : 'Starting camera...'}</p>
            </div>
          )}
          <div className="absolute inset-0 border-2 border-rose-500/30 rounded-2xl pointer-events-none">
            <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-rose-500/20" />
            <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-rose-500/20" />
          </div>
        </div>
        <div className="text-center mb-4">
          <div className={`text-6xl font-bold font-mono ${isLight ? 'text-stone-800' : 'text-white'}`}>{count}</div>
          <span className={`text-xs font-mono ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>/ {targetCount} reps</span>
        </div>
        <div className={`w-full max-w-sm h-2 rounded-full mb-4 ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`}>
          <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-emerald-400 transition-all duration-300" style={{ width: `${(count / targetCount) * 100}%` }} />
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          {status !== 'complete' ? (
            <>
              <button onClick={() => { setCount(c => { const n = c + 1; if (n >= targetCount) setStatus('complete'); return n; }); }}
                className={`flex-1 py-4 rounded-xl font-mono font-bold text-sm cursor-pointer active:scale-95 transition-all ${
                  isLight ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                }`}>
                +1 REP
              </button>
              <button onClick={() => { setCount(0); setStatus('ready'); }}
                className={`px-4 py-4 rounded-xl font-mono font-bold text-xs cursor-pointer active:scale-95 transition-all border ${
                  isLight ? 'bg-stone-200 text-stone-600 border-stone-300' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                RESET
              </button>
            </>
          ) : (
            <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); onComplete(count); }}
              className="w-full py-4 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
              <CheckCircle2 className="w-5 h-5" /> LOG {count} REPS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
