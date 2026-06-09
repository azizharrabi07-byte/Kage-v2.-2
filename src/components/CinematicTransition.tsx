import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.97, filter: 'blur(4px)', transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9, rotateX: 10 },
  animate: { opacity: 1, scale: 1, rotateX: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

interface CinematicTransitionProps {
  children: ReactNode;
  variant?: 'page' | 'slideUp' | 'scaleIn';
  className?: string;
  delay?: number;
  id?: string;
}

export default function CinematicTransition({
  children,
  variant = 'page',
  className = '',
  delay = 0,
  id = 'page',
}: CinematicTransitionProps) {
  const vars = variant === 'slideUp' ? slideUp : variant === 'scaleIn' ? scaleIn : pageVariants;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={vars}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function StaggerList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
