import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Dumbbell, Utensils, BookOpen, Compass, Activity, Send } from 'lucide-react';
import { IMAGES } from '../assets';
import type { ChatMessage } from './types';

export interface SenseiTabProps {
  isLight: boolean;
  chatMessages: ChatMessage[];
  isSenseiTyping: boolean;
  queryInput: string;
  setQueryInput: (v: string) => void;
  handleQuerySubmit: (customAction?: string) => void;
  soundSafe: (type: 'clash' | 'tap' | 'chime' | 'hum') => void;
}

function SenseiTab({
  isLight,
  chatMessages,
  isSenseiTyping,
  queryInput,
  setQueryInput,
  handleQuerySubmit,
  soundSafe,
}: SenseiTabProps) {
  return (
    <motion.div key="tab-sensei" initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 20, filter: 'blur(5px)' }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex-1 flex flex-col h-full space-y-4 pt-2" style={{ willChange: 'transform, opacity' }}>
      
      <div className={`text-center py-2 flex justify-between items-center pb-4 ${isLight ? 'border-b border-stone-200' : 'border-b border-white/5'}`}>
        <div className="flex items-center gap-2">
          <span className="font-kanji font-black text-rose-500 text-3xl">先</span>
          <div>
            <h2 className={`text-xl font-bold tracking-widest text-left ${isLight ? 'text-stone-800' : 'text-white'}`}>CYBER-SENSEI</h2>
            <p className="text-[8px] text-cyan-400 font-mono text-left uppercase">GEMINI NEURAL GRID MODULE ADAPTIVE</p>
          </div>
        </div>
        <div className="px-2 py-1 rounded bg-[#F2C94C]/10 border border-[#F2C94C]/20 text-[9px] text-yellow-500 font-mono animate-pulse">
          MASTER STATUS
        </div>
      </div>

      {/* Holographic Big Floating Avatar */}
      <div className={`flex flex-col items-center py-4 relative rounded-2xl border overflow-hidden ${isLight ? 'backdrop-blur-xl bg-white/60 border-stone-200' : 'backdrop-blur-xl bg-black/20 border-white/10'}`}>
        <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-stone-100' : 'from-void'} to-transparent`} />
        
        <div className={`absolute left-0 right-0 top-1/2 h-[1px] animate-pulse ${isLight ? 'bg-cyan-300/40' : 'bg-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.5)]'}`} />

        <div className="relative w-36 h-36 flex items-center justify-center z-10 select-none">
          <div className={`absolute w-28 h-28 rounded-full border animate-ping pointer-events-none ${isLight ? 'border-cyan-400/30' : 'border-cyan-500/30'}`} />
          <div className={`absolute w-32 h-32 rounded-full border animate-pulse pointer-events-none ${isLight ? 'border-cyan-300/20' : 'border-cyan-400/20'}`} />
          <img 
            src={IMAGES.hologramSensei} 
            alt="Cybermaster" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" 
            loading="lazy" decoding="async"
          />
        </div>
        
        <h3 className="text-xs font-mono text-center text-cyan-500 tracking-wider font-extrabold uppercase mt-2 z-10">UNIT-IV COVENANT SENSEI</h3>
        <p className={`text-[10px] text-center font-mono z-10 px-4 mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>"The sword cut determines your essence."</p>
      </div>

      {/* 6 Quick Action Gems */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { action: 'inspire', icon: Sparkles, color: '#F2C94C', label: 'INSPIRE' },
          { action: 'form', icon: Dumbbell, color: 'text-rose-500', label: 'FORM CHECK' },
          { action: 'diet', icon: Utensils, color: 'text-emerald-400', label: 'DIET TIPS' },
          { action: 'lore', icon: BookOpen, color: 'text-purple-400', label: 'SHADOW LORE' },
          { action: 'meditate', icon: Compass, color: 'text-cyan-400', label: 'MEDITATE' },
          { action: 'random', icon: Activity, color: 'text-orange-400', label: 'SHADOW REAP' },
        ].map(gem => (
          <button key={gem.action} onClick={() => handleQuerySubmit(gem.action)}
            className={`rounded-xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer transform active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none ${isLight ? 'bg-white border border-stone-200 hover:border-rose-300 hover:bg-stone-50' : 'bg-kachi/50 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30'}`}>
            <gem.icon className={`w-4 h-4 mb-1 shrink-0 ${gem.color.startsWith('text-') ? gem.color : ''}`} style={gem.color.startsWith('#') ? { color: gem.color } : undefined} />
            <span className={`text-[9px] font-mono ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>{gem.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className={`flex-1 min-h-[160px] max-h-[300px] overflow-y-auto no-scrollbar rounded-xl border p-3 space-y-3 flex flex-col justify-end ${isLight ? 'bg-white/80 border-stone-200' : 'bg-kachi/30 border-white/5'}`} aria-live="polite">
        <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[280px]">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                msg.sender === 'user' 
                  ? isLight ? 'bg-rose-100 border border-rose-200 text-stone-800 rounded-tr-none' : 'bg-[#1A1A24]/90 border border-rose-500/30 text-white rounded-tr-none'
                  : isLight ? 'bg-stone-100 border border-cyan-200 text-stone-700 rounded-tl-none' : 'bg-void/40 backdrop-blur-md border border-cyan-500/10 text-cyan-50 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                <span className={`block text-[8px] font-mono text-right mt-1.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{msg.timestamp}</span>
              </div>
            </div>
          ))}
          
          {isSenseiTyping && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-xl rounded-tl-none p-3 border flex items-center gap-1.5 font-mono text-[10px] ${isLight ? 'bg-stone-100 border-cyan-200 text-cyan-600' : 'bg-void/50 border-cyan-500/20 text-cyan-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
                <span>SENSEI RETRIEVING...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive bottom writing field */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask and learn our code..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleQuerySubmit(); }}
          className={`flex-1 text-xs font-mono rounded-xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-rose-500/50 outline-none border ${isLight ? 'bg-white border-stone-300 text-stone-800' : 'bg-void border-white/10 text-zinc-200'}`}
        />
        <button onClick={() => handleQuerySubmit()}
          className="bg-rose-500 hover:bg-rose-600 rounded-xl p-3 text-white transition-colors cursor-pointer active:scale-95 flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:outline-none"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </motion.div>
  );
}

export default memo(SenseiTab);
