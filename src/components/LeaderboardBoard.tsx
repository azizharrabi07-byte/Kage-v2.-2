import { motion } from 'motion/react';
import { Crown, Medal, Shield } from 'lucide-react';
import type { LeaderboardUser } from '../types';

const rankIcons = ['', <Crown key="1" size={14} className="text-amber-400" />, <Medal key="2" size={14} className="text-gray-300" />, <Medal key="3" size={14} className="text-amber-600" />];
const rankColors = ['', 'from-amber-400/20 to-transparent', 'from-gray-300/10 to-transparent', 'from-amber-600/10 to-transparent'];

export default function LeaderboardBoard({ data }: { data: LeaderboardUser[] }) {
  return (
    <div className="space-y-2">
      {data.map((user, i) => (
        <motion.div
          key={user.rank}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            user.isCurrentUser
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-[#1A1A24]/60 border-white/5'
          }`}
        >
          {/* Rank */}
          <div className="w-8 text-center">
            {user.rank <= 3 ? (
              rankIcons[user.rank]
            ) : (
              <span className="text-xs text-gray-600 font-mono">{user.rank}</span>
            )}
          </div>
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-lg">
            {user.avatar}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-semibold truncate">{user.name}</span>
              {user.isCurrentUser && <Shield size={10} className="text-red-400 shrink-0" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span>Lv.{user.level}</span>
              <span>🔥 {user.streak}d</span>
            </div>
          </div>
          {/* Points */}
          <div className="text-right">
            <div className="text-sm text-gray-300 font-mono">{user.honorPoints.toLocaleString()}</div>
            <div className="text-[9px] text-gray-600 tracking-wider">HONOR</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
