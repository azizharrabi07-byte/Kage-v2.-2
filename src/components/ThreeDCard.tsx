/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface ThreeDCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(255, 59, 48, 0.4)"
  onClick?: () => void;
  id?: string;
  isLight?: boolean;
}

const ThreeDCard = React.memo(function ThreeDCard({
  children,
  className = "",
  glowColor = "rgba(255, 59, 48, 0.15)",
  onClick,
  id,
  isLight = false,
}: ThreeDCardProps) {
  const defaultBg = isLight 
    ? "bg-[#EDE7DB] bg-opacity-95 border border-[#C2B7A0]/70 text-stone-900 shadow-sm"
    : "relative rounded-xl bg-kachi bg-opacity-90 border border-white/5 text-light";

  return (
    <motion.div
      id={id}
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        boxShadow: isLight 
          ? `0 10px 20px rgba(0, 0, 0, 0.15), 0 0 15px rgba(193, 39, 45, 0.15)`
          : `0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px ${glowColor}`
      }}
      whileTap={{ scale: 0.98, y: -1 }}
      onClick={onClick}
      className={`relative rounded-xl p-5 depth-3d-card transition-all duration-300 overflow-hidden cursor-pointer ${defaultBg} ${className}`}
    >
      {/* Background radial gradient to give it a 3D sheen */}
      <div 
        className={`absolute inset-0 pointer-events-none opacity-20 ${
          isLight 
            ? "bg-[radial-gradient(circle_at_50%_0%,rgba(193,39,45,0.08),transparent)]" 
            : "bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent)]"
        }`} 
      />
      {children}
    </motion.div>
  );
}

export default ThreeDCard;
