import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Skull, Clock } from 'lucide-react';
import { enableRoninMode, disableRoninMode, getRoninState, roninDaysRemaining, isRoninComplete, type RoninState } from '../utils/roninMode';

interface Props {
  isLight: boolean;
}

export default function RoninSettings({ isLight }: Props) {
  const [state, setState] = useState<RoninState>(getRoninState());
  const [confirmEnable, setConfirmEnable] = useState(false);
  const [blockMsg, setBlockMsg] = useState('');

  const bg = isLight ? 'bg-white border-stone-200' : 'bg-[#1A1A24] border-zinc-800';
  const text = isLight ? 'text-stone-800' : 'text-zinc-200';
  const muted = isLight ? 'text-stone-500' : 'text-zinc-500';

  const handleEnable = () => {
    enableRoninMode();
    setState(getRoninState());
    setConfirmEnable(false);
  };

  const handleDisable = () => {
    const success = disableRoninMode();
    if (success) {
      setState(getRoninState());
      setBlockMsg('');
    } else {
      setBlockMsg('Ronin Mode is locked for 7 days. You cannot disable it yet.');
      setTimeout(() => setBlockMsg(''), 3000);
    }
  };

  const remaining = roninDaysRemaining();
  const complete = isRoninComplete();

  return (
    <div className={`${bg} border rounded-xl p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {state.enabled ? (
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          ) : (
            <Shield className="w-5 h-5 text-zinc-500" />
          )}
          <h3 className={`font-mono font-bold text-sm ${text}`}>RONIN HARDCORE MODE</h3>
        </div>
        {state.enabled && !complete && (
          <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
            <Clock className="w-3 h-3" />
            {remaining}d remaining
          </div>
        )}
      </div>

      <p className={`text-xs ${muted} leading-relaxed`}>
        {state.enabled
          ? complete
            ? 'You have completed 7 days of Ronin Mode. Claim your reward!'
            : 'Rest timer cannot be skipped. Gym photo required for all programs. All workouts must be verified.'
          : 'Once enabled, Ronin mode locks for 7 days. No skipped rest timers. Gym photo required. All workouts must be verified. Reward: exclusive "Ronin" title + Shadow skin.'}
      </p>

      {complete && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-900/30 to-rose-900/30 border border-amber-500/30 text-center space-y-2">
          <Skull className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="text-xs font-mono text-amber-300">RONIN MODE COMPLETE — You earned the "Ronin" title + Shadow Ronin skin!</p>
        </div>
      )}

      {blockMsg && (
        <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400 text-center">
          {blockMsg}
        </div>
      )}

      <div className="flex gap-2">
        {!state.enabled ? (
          !confirmEnable ? (
            <button
              onClick={() => setConfirmEnable(true)}
              className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              ENABLE RONIN MODE
            </button>
          ) : (
            <div className="flex-1 space-y-2">
              <p className="text-[10px] font-mono text-rose-400 text-center">
                This locks for 7 days. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleEnable}
                  className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono rounded-lg transition-colors cursor-pointer active:scale-95"
                >
                  CONFIRM
                </button>
                <button
                  onClick={() => setConfirmEnable(false)}
                  className={`flex-1 px-3 py-2 ${isLight ? 'bg-stone-200 text-stone-600' : 'bg-zinc-800 text-zinc-400'} text-xs font-mono rounded-lg transition-colors cursor-pointer active:scale-95`}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )
        ) : (
          <button
            onClick={handleDisable}
            disabled={!complete}
            className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer active:scale-95 ${
              complete
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : `${isLight ? 'bg-stone-200 text-stone-400' : 'bg-zinc-800 text-zinc-600'} cursor-not-allowed`
            }`}
          >
            {complete ? 'DISABLE & CLAIM REWARD' : `LOCKED (${remaining}d)`}
          </button>
        )}
      </div>
    </div>
  );
}
