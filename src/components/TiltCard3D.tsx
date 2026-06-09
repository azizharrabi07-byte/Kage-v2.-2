import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltAmount?: number;
  onClick?: () => void;
}

export default function TiltCard3D({
  children,
  className = '',
  glowColor = 'rgba(227, 30, 36, 0.3)',
  tiltAmount = 10,
  onClick,
}: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const spring = { damping: 20, stiffness: 150, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const rotateX = useTransform(sy, [0, 1], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(sx, [0, 1], [-tiltAmount, tiltAmount]);
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    x.set(cx);
    y.set(cy);
  }
  function handleLeave() { x.set(0.5); y.set(0.5); }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, perspective: 1000, transformStyle: 'preserve-3d' }}
      className={`relative cursor-pointer rounded-xl overflow-hidden ${className}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, ${glowColor} 0%, transparent 60%)`
          ),
        }}
      />
    </motion.div>
  );
}
