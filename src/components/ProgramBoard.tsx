import { motion } from 'motion/react';
import { Dumbbell, Timer, Zap, Target } from 'lucide-react';
import TiltCard3D from './TiltCard3D';
import type { WorkoutProgram } from '../types';

const difficultyStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function ProgramCard({ program, onSelect }: { program: WorkoutProgram; onSelect: (p: WorkoutProgram) => void }) {
  return (
    <TiltCard3D onClick={() => onSelect(program)} glowColor="rgba(227,30,36,0.25)"
      className="bg-[#1A1A24]/90 border border-white/5 p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs tracking-[0.25em] text-red-400 mb-1">{program.nameKanji}</div>
          <h3 className="text-lg font-bold tracking-wider text-white">{program.nameEnglish}</h3>
        </div>
        <div className="text-amber-400 text-sm tracking-wider">{difficultyStars(program.difficulty)}</div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{program.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Timer size={12} />{program.duration}</span>
        <span className="flex items-center gap-1"><Zap size={12} />{program.workoutCount} moves</span>
        <span className="flex items-center gap-1"><Dumbbell size={12} />{program.equipmentNeeded ? 'Gear' : 'Body'}</span>
      </div>
    </TiltCard3D>
  );
}

export function ProgramDetailBoard({ program, onClose }: { program: WorkoutProgram; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-[#1A1A24]/95 border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs tracking-[0.25em] text-red-400">{program.nameKanji}</span>
            <h2 className="text-2xl font-black tracking-wider text-white mt-1">{program.nameEnglish}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">&times;</button>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">{program.description}</p>
        <div className="flex gap-3 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Timer size={14} /> {program.duration}</span>
          <span className="flex items-center gap-1"><Target size={14} /> {program.workoutCount} moves</span>
          <span className="text-amber-400">{difficultyStars(program.difficulty)}</span>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs tracking-wider text-gray-500 uppercase">Moves</h4>
          {program.moves.map((move, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
              <img src={move.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-sm text-gray-300">{move.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
