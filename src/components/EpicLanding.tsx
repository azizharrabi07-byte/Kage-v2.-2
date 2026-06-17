import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, type MotionValue } from 'motion/react';
import { IMAGES } from '../assets';
import { EnergySphereScene } from './FloatingEnergySphere';
import TiltCard3D from './TiltCard3D';

/* =========================================================================
   CONSTANTS
   ========================================================================= */
const FLOATING_KANJI = ['武', '道', '魂', '禅', '風', '火', '水', '鉄', '心', '龍', '雷', '鬼'];

const TESTIMONIALS = [
  { name: 'Ryu Kenshi', handle: '@shadow_ryu', text: 'KAGE completely transformed my training. The AI coach pushes me harder than any human trainer ever could.', avatar: '⚔️', honor: '4,850' },
  { name: 'Mika Fox', handle: '@mikafox_fit', text: 'The pact system keeps me accountable. My partner and I haven\'t broken our 54-day streak!', avatar: '🦊', honor: '3,410' },
  { name: 'Takeshi', handle: '@iron_takeshi', text: 'IRON PHYSICAL program is no joke. Went from level 1 to 22 in 3 months. This dojo builds real warriors.', avatar: '🐉', honor: '4,850' },
  { name: 'Yuki Oni', handle: '@oni_yuki', text: 'Best fitness app I\'ve ever used. The aesthetic is unmatched and the community is incredible.', avatar: '👹', honor: '2,980' },
];

const FEATURES = [
  { icon: '🧘', title: 'AI HOLOGRAM SENSEI', desc: 'Real-time form correction, personalized workout generation, and ancient wisdom from your cybernetic mentor.' },
  { icon: '🤝', title: 'BLOOD PACT SYSTEM', desc: 'Forge pacts with training partners. Share streaks, unlock joint achievements, and rise together.' },
  { icon: '⚔️', title: 'WARRIOR LEADERBOARDS', desc: 'Compete in the Sacred Arena. Clash for honor points and prove your dominance among the KAGE elite.' },
  { icon: '🏆', title: 'ACHIEVEMENT DOJO', desc: 'Unlock rare and legendary titles by pushing your limits. Each achievement boosts your spirit stat.' },
];

const PLANS = [
  { name: 'BUSHI', nameKanji: '武士', price: 'FREE', sub: 'Beginner Warrior', color: 'from-zinc-500 to-zinc-400', features: ['Basic workouts', '1 training program', 'Local progress', 'Guest mode'] },
  { name: 'SAMURAI', nameKanji: '侍', price: '$9/mo', sub: 'Elite Path', color: 'from-rose-600 to-rose-500', popular: true, features: ['All programs unlocked', 'AI Sensei full access', 'Pact system', 'Leaderboards', 'Streak rewards'] },
  { name: 'SHOGUN', nameKanji: '将軍', price: '$19/mo', sub: 'Legendary Tier', color: 'from-amber-600 to-yellow-500', features: ['Everything in Samurai', 'Custom workout builder', 'Priority AI coaching', 'Exclusive gear', 'Early access'] },
];

/* =========================================================================
   SVG PATH COMPONENTS
   ========================================================================= */

/** Animated torii gate outline that draws itself */
function AnimatedTorii() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 opacity-30 pointer-events-none">
      <motion.svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Left pillar */}
        <motion.path
          d="M 50 20 L 50 120"
          stroke="#E31E24" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Right pillar */}
        <motion.path
          d="M 150 20 L 150 120"
          stroke="#E31E24" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
        />
        {/* Top horizontal beam */}
        <motion.path
          d="M 20 35 L 180 35"
          stroke="#E31E24" strokeWidth="4" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
        />
        {/* Middle horizontal beam */}
        <motion.path
          d="M 30 55 L 170 55"
          stroke="#E31E24" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Curved top */}
        <motion.path
          d="M 20 35 Q 100 10 180 35"
          stroke="#E31E24" strokeWidth="3" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.7 }}
        />
      </motion.svg>
    </div>
  );
}

/** Animated decorative rings that pulse */
function AnimatedRings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const rings = [1.2, 1.5, 1.9, 2.3];
  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-rose-500/20"
          style={{ width: `${r * 80}px`, height: `${r * 80}px` }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? {
            scale: [0.5, 1, 0.8],
            opacity: [0, 0.4, 0.1],
          } : {}}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Japanese wave section divider */
function WaveDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-20 overflow-hidden pointer-events-none ${className}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <motion.path
          d="M0 40 Q 60 10 120 40 T 240 40 T 360 40 T 480 40 T 600 40 T 720 40 T 840 40 T 960 40 T 1080 40 T 1200 40 T 1320 40 T 1440 40 L1440 80 L0 80 Z"
          fill="rgba(227,30,36,0.03)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M0 50 Q 80 30 160 50 T 320 50 T 480 50 T 640 50 T 800 50 T 960 50 T 1120 50 T 1280 50 T 1440 50 L1440 80 L0 80 Z"
          fill="rgba(227,30,36,0.02)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </svg>
    </div>
  );
}

/** Animated Japanese crest */
function AnimatedCrest({ className = '' }: { className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={`relative w-24 h-24 mx-auto ${className}`}>
      <motion.svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        {/* Outer ring */}
        <motion.circle
          cx="50" cy="50" r="45"
          stroke="#E31E24" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Middle ring */}
        <motion.circle
          cx="50" cy="50" r="35"
          stroke="#E31E24" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.35 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Inner ring */}
        <motion.circle
          cx="50" cy="50" r="25"
          stroke="#E31E24" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.25 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
        />
        {/* Decorative dots on outer ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 42 * Math.cos(rad);
          const cy = 50 + 42 * Math.sin(rad);
          return (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r="2"
              fill="#E31E24"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: [0, 0.8, 0.3] } : {}}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1, repeat: Infinity, repeatType: "reverse" }}
            />
          );
        })}
      </motion.svg>
      {/* Kanji in center */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center font-kanji font-black text-2xl text-rose-500"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        影
      </motion.span>
    </div>
  );
}

/* =========================================================================
   ANIMATION COMPONENTS
   ========================================================================= */

function FloatingKanji() {
  const items = useMemo(() =>
    FLOATING_KANJI.map((char) => ({
      char,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 24,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 30,
    })),
  []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute font-kanji font-black text-white/[0.04] select-none"
          style={{ left: `${item.x}%`, top: `${item.y}%`, fontSize: `${item.size}px` }}
          animate={{
            y: [0, -20 - item.drift, 0],
            opacity: [0.02, 0.06, 0.02],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.char}
        </motion.div>
      ))}
    </div>
  );
}

function EmberParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: 1.5 + Math.random() * 3,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 8,
      driftX: (Math.random() - 0.5) * 40,
    })),
  []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(255,${120 + Math.random() * 80},${40 + Math.random() * 40},${0.4 + Math.random() * 0.4}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(255,120,40,0.3)`,
          }}
          animate={{
            y: [0, -120 - Math.random() * 60],
            x: [0, p.driftX],
            opacity: [0, 0.8, 0.3, 0],
            scale: [0.5, 1, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function TypewriterText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return (
    <span className={className}>
      {displayed}
      {!done && <span className="ml-0.5 animate-pulse text-rose-400">|</span>}
    </span>
  );
}

/** Scroll-triggered counter animation */
function CountUp({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(to / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(interval); }
      else setVal(start);
    }, 20);
    return () => clearInterval(interval);
  }, [isInView, to]);
  return <span ref={ref} className={className}>{val}{suffix}</span>;
}

/** Section wrapper with scroll reveal */
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* =========================================================================
   FLOATING 3D GHOSTS (wireframe geometries across the page)
   ========================================================================= */

function FloatingGhosts() {
  const ghosts = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const shapes = ['diamond', 'cube', 'tetra', 'ring'] as const;
      const shape = shapes[i % shapes.length];
      const size = 20 + Math.random() * 40;
      const edges = shape === 'cube' ? 12 : shape === 'tetra' ? 8 : shape === 'diamond' ? 6 : 0;
      return {
        shape, size, edges,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 18,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 40,
        opacity: 0.04 + Math.random() * 0.06,
        color: i % 3 === 0 ? '#E31E24' : i % 3 === 1 ? '#22D3EE' : '#FF6B35',
      };
    }),
  []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {ghosts.map((g, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: g.size,
            height: g.size,
          }}
          animate={{
            x: [0, g.driftX, 0],
            y: [0, g.driftY, 0],
            rotate: [g.rotation, g.rotation + 360, g.rotation],
            opacity: [g.opacity * 0.5, g.opacity, g.opacity * 0.5],
          }}
          transition={{
            duration: g.duration,
            repeat: Infinity,
            delay: g.delay,
            ease: "easeInOut",
          }}
        >
          {/* Cube: wireframe square */}
          {g.shape === 'cube' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke={g.color} strokeWidth="1" opacity="0.6" />
              <rect x="25" y="25" width="80" height="80" rx="4" fill="none" stroke={g.color} strokeWidth="0.5" opacity="0.3" />
              <line x1="10" y1="10" x2="25" y2="25" stroke={g.color} strokeWidth="0.5" opacity="0.4" />
              <line x1="90" y1="10" x2="105" y2="25" stroke={g.color} strokeWidth="0.5" opacity="0.4" />
              <line x1="10" y1="90" x2="25" y2="105" stroke={g.color} strokeWidth="0.5" opacity="0.4" />
              <line x1="90" y1="90" x2="105" y2="105" stroke={g.color} strokeWidth="0.5" opacity="0.4" />
            </svg>
          )}
          {/* Diamond: rotated square */}
          {g.shape === 'diamond' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke={g.color} strokeWidth="1" opacity="0.5" />
              <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke={g.color} strokeWidth="0.5" opacity="0.25" />
            </svg>
          )}
          {/* Tetra: triangle */}
          {g.shape === 'tetra' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,5 95,90 5,90" fill="none" stroke={g.color} strokeWidth="1" opacity="0.5" />
              <line x1="50" y1="5" x2="50" y2="70" stroke={g.color} strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="70" x2="95" y2="90" stroke={g.color} strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="70" x2="5" y2="90" stroke={g.color} strokeWidth="0.5" opacity="0.3" />
            </svg>
          )}
          {/* Ring: circle */}
          {g.shape === 'ring' && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke={g.color} strokeWidth="1.5" opacity="0.4" />
              <circle cx="50" cy="50" r="25" fill="none" stroke={g.color} strokeWidth="0.5" opacity="0.2" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* =========================================================================
   3D TILT BUTTON
   ========================================================================= */

function TiltButton3D({ children, onClick, className = '', href }: { children: React.ReactNode; onClick?: () => void; className?: string; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const spring = { damping: 20, stiffness: 200, mass: 0.3 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);

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

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, perspective: 1000, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) return <a href={href}>{content}</a>;
  return <div onClick={onClick}>{content}</div>;
}

/* =========================================================================
   HERO SECTION
   ========================================================================= */

function HeroSection({ onEnter }: { onEnter: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const bgX = useMotionValue(0);
  const bgY = useMotionValue(0);
  const smoothBgX = useSpring(bgX, { damping: 30, stiffness: 100 });
  const smoothBgY = useSpring(bgY, { damping: 30, stiffness: 100 });

  function handleBgMove(e: React.MouseEvent) {
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    bgX.set(-x);
    bgY.set(-y);
    setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleBgMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Energy Sphere Background */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <EnergySphereScene />
      </div>

      {/* Samurai Image Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(${IMAGES.bgSamurai})`,
          x: smoothBgX,
          y: smoothBgY,
          scale: bgScale,
        }}
      />

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/80 via-[#0A0A0F]/50 to-[#0A0A0F]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-rose-900/15 via-transparent to-rose-900/5" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Floating Kanji */}
      <FloatingKanji />

      {/* Ember Particles */}
      <EmberParticles />

      {/* SVG Decorative Torii */}
      <AnimatedTorii />

      {/* Animated Rings behind hero content */}
      <AnimatedRings />

      {/* Hero Content */}
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 text-center px-6">
        {/* Kanji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], type: "spring", damping: 15 }}
          className="mb-4"
        >
          <span className="font-kanji font-black text-8xl md:text-9xl bg-gradient-to-b from-rose-400 via-rose-500 to-rose-700 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(227,30,36,0.5)]">
            影
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-5xl md:text-6xl font-black tracking-[0.15em] text-white mb-3"
        >
          KAGE
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-sm md:text-base tracking-[0.3em] text-zinc-400 mb-2"
        >
          YOUR DIGITAL DOJO
        </motion.p>

        {/* Typewriter Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="font-mono text-xs text-zinc-500 mb-10 h-5"
        >
          <TypewriterText text="FORGE BODY. SHARPEN SPIRIT. RISE ABOVE." delay={1} />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <TiltButton3D onClick={onEnter} className="[&>div]:!cursor-pointer">
            <div className="group relative px-10 py-4 rounded-xl font-bold font-mono text-sm tracking-[0.2em] text-white overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 group-hover:from-rose-500 group-hover:to-rose-400 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:bg-[position:100%_100%]" />
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                ENTER DOJO
              </span>
            </div>
          </TiltButton3D>

          <TiltButton3D href="#what" className="[&>a]:!cursor-pointer">
            <div className="px-8 py-4 rounded-xl font-bold font-mono text-xs tracking-[0.2em] text-zinc-300 border border-zinc-700/50 hover:border-zinc-500 hover:text-white transition-all duration-300 cursor-pointer">
              LEARN MORE
            </div>
          </TiltButton3D>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] font-mono tracking-[0.3em] text-zinc-600">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-0.5 h-6 bg-rose-500/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   WHAT IS KAGE SECTION
   ========================================================================= */

function WhatSection() {
  return (
    <Section className="py-24 px-6" id="what">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedCrest className="mb-8" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-kanji font-black text-5xl text-rose-500 mb-4"
        >
          影
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-2xl tracking-[0.3em] text-white mb-6"
        >
          WHAT IS KAGE?
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-sm leading-relaxed text-zinc-400 max-w-2xl mx-auto mb-12"
        >
          KAGE is a premium gamified fitness companion — your digital dojo. 
          Train with AI-powered coaching, forge blood pacts with training partners, 
          compete on warrior leaderboards, and unlock achievements as you forge your body and sharpen your spirit.
        </motion.p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'WORKOUTS', value: 50, suffix: '+', icon: '⚔️' },
            { label: 'ACTIVE WARRIORS', value: 1000, suffix: '+', icon: '👺' },
            { label: 'COMBINED STREAKS', value: 15000, suffix: '+', icon: '🔥' },
            { label: 'HONOR POINTS EARNED', value: 500000, suffix: '+', icon: '🏆' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/5 rounded-xl p-5"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-mono text-2xl font-black text-white">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   FEATURES SECTION
   ========================================================================= */

function FeaturesSection() {
  return (
    <Section className="py-24 px-6" id="features">
      <WaveDivider className="mb-12" />
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-mono text-2xl tracking-[0.3em] text-white text-center mb-16"
        >
          WHY KAGE?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TiltCard3D glowColor="rgba(227,30,36,0.2)" className="h-full">
                <div className="p-6 bg-[#1A1A24]/80 backdrop-blur-sm border border-white/5 h-full">
                  <div className="text-4xl mb-4">{feat.icon}</div>
                  <h3 className="font-mono text-sm font-bold text-rose-400 tracking-[0.15em] mb-2">{feat.title}</h3>
                  <p className="font-mono text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   PRICING SECTION
   ========================================================================= */

function PricingSection() {
  return (
    <Section className="py-24 px-6" id="pricing">
      <WaveDivider className="mb-12" />
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-mono text-2xl tracking-[0.3em] text-white text-center mb-4"
        >
           CHOOSE YOUR PATH
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="font-mono text-xs text-zinc-500 text-center mb-16 tracking-[0.1em]"
        >
          EVERY WARRIOR STARTS SOMEWHERE. RISE THROUGH THE RANKS.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-2xl border ${
                plan.popular ? 'border-rose-500/50 bg-[#1A1A24]/90' : 'border-white/5 bg-[#1A1A24]/60'
              } backdrop-blur-sm overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-600 to-rose-500 text-center py-1.5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white font-bold">MOST POPULAR</span>
                </div>
              )}
              <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-kanji font-black text-lg text-rose-500">{plan.nameKanji}</span>
                  <h3 className="font-mono text-sm font-bold text-white tracking-[0.2em]">{plan.name}</h3>
                </div>
                <div className="mt-4 mb-2">
                  <span className="font-mono text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent from-white to-zinc-300">{plan.price}</span>
                </div>
                <p className="font-mono text-[10px] text-zinc-500 tracking-[0.15em] mb-6">{plan.sub}</p>

                <div className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="font-mono text-[11px] text-zinc-400">{f}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-bold font-mono text-xs tracking-[0.2em] text-white cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400'
                      : 'bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50'
                  } transition-all duration-300`}
                >
                  {plan.popular ? 'START FREE TRIAL' : 'GET STARTED'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   TESTIMONIALS SECTION
   ========================================================================= */

function TestimonialsSection() {
  return (
    <Section className="py-24 px-6" id="testimonials">
      <WaveDivider className="mb-12" />
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-mono text-2xl tracking-[0.3em] text-white text-center mb-16"
        >
          WARRIOR TESTIMONIALS
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/5 rounded-xl p-5 relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 text-6xl text-rose-500/5 font-serif select-none">"</div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <div className="font-mono text-xs font-bold text-white">{t.name}</div>
                  <div className="font-mono text-[9px] text-zinc-500">{t.handle}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-mono text-[10px] text-amber-500">{t.honor}</div>
                  <div className="font-mono text-[7px] text-zinc-600 tracking-[0.2em]">HONOR</div>
                </div>
              </div>
              <p className="font-mono text-xs text-zinc-300 leading-relaxed italic">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   FINAL CTA / LOGIN CARD
   ========================================================================= */

function LoginCard({ onGoogleLogin, onEmailLogin, onEmailSignUp }: {
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, password: string) => void;
  onEmailSignUp: (email: string, password: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const spring = { damping: 25, stiffness: 200, mass: 0.3 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const rotateX = useTransform(sy, [0, 1], [8, -8]);
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    try {
      if (showSignUp) {
        await onEmailSignUp(loginEmail, loginPassword);
      } else {
        await onEmailLogin(loginEmail, loginPassword);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-24 px-6" id="enter">
      <WaveDivider className="mb-12" />
      <div className="max-w-sm mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-mono text-xl tracking-[0.3em] text-white mb-8"
        >
          ENTER THE DOJO
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, perspective: 1000, transformStyle: 'preserve-3d' }}
          >
            <div className="bg-[#1A1A24]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl text-center w-full shadow-2xl relative overflow-hidden">
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: useTransform(
                    [glareX, glareY] as unknown as MotionValue<string>[],
                    ([gx, gy]: string[]) => `radial-gradient(circle at ${gx} ${gy}, rgba(227,30,36,0.15) 0%, transparent 60%)`
                  ),
                }}
              />

              <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 blur-[60px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/10 blur-[60px] rounded-full" />

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], type: "spring" }}
              >
                <span className="font-kanji font-black text-7xl md:text-8xl bg-gradient-to-b from-rose-400 to-rose-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(227,30,36,0.4)]">
                  影
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-mono text-xl tracking-[0.3em] text-white mb-1 mt-2"
              >
                KAGE DOJO
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xs text-zinc-500 font-mono mb-8"
              >
                <TypewriterText text="VERIFY YOUR SPIRIT" delay={0.5} />
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-3"
              >
                {/* Email/Password Inputs */}
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-700/50 text-white text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-700/50 text-white text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !loginEmail || !loginPassword}
                  className="group relative w-full py-3.5 rounded-xl font-bold font-mono text-sm tracking-wider text-white overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 group-hover:from-rose-500 group-hover:to-rose-400 transition-all duration-300" />
                  <span className="relative z-10">
                    {loading ? '...' : showSignUp ? 'JOIN DOJO' : 'ENTER DOJO'}
                  </span>
                </button>

                <p className="text-[10px] text-zinc-600 font-mono">
                  {showSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setShowSignUp(!showSignUp)}
                    className="text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    {showSignUp ? 'Log in' : 'Sign up'}
                  </button>
                </p>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#1A1A24]/80 px-3 text-[10px] text-zinc-600 font-mono">OR</span>
                  </div>
                </div>

                <button
                  onClick={onGoogleLogin}
                  className="group relative w-full py-3 rounded-xl font-bold font-mono text-xs tracking-wider text-zinc-300 overflow-hidden transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-zinc-800/40 group-hover:bg-zinc-700/40 transition-colors duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    CONTINUE WITH GOOGLE
                  </span>
                </button>

                <button
                  onClick={() => {
                    setLoginEmail('guest@kage.dojo');
                    setLoginPassword('guest123456');
                    setTimeout(() => onEmailLogin('guest@kage.dojo', 'guest123456'), 100);
                  }}
                  className="w-full py-2 rounded-lg text-[10px] text-zinc-600 font-mono hover:text-zinc-400 transition-colors cursor-pointer"
                >
                  GUEST DEMO
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-[10px] text-zinc-600 font-mono"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500/50 animate-pulse mr-1.5 align-middle" />
                DOJO STATUS: AWAITING INITIATE
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-8 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-kanji font-black text-lg text-rose-500">影</span>
          <span className="font-mono text-xs text-zinc-600 tracking-[0.2em]">KAGE DOJO © 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] text-zinc-600 tracking-[0.15em] cursor-pointer hover:text-zinc-400 transition-colors">PRIVACY</span>
          <span className="font-mono text-[10px] text-zinc-600 tracking-[0.15em] cursor-pointer hover:text-zinc-400 transition-colors">TERMS</span>
          <span className="font-mono text-[10px] text-zinc-600 tracking-[0.15em] cursor-pointer hover:text-zinc-400 transition-colors">CONTACT</span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   MAIN LANDING COMPONENT
   ========================================================================= */

export default function EpicLanding({ onGoogleLogin, onEmailLogin, onEmailSignUp }: {
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, password: string) => void;
  onEmailSignUp: (email: string, password: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] overflow-x-hidden">
      {/* Floating Ghost Geometries (full page) */}
      <FloatingGhosts />

      {/* Hero Section */}
      <HeroSection onEnter={onGoogleLogin} />

      {/* What is KAGE */}
      <WhatSection />

      {/* Features */}
      <FeaturesSection />

      {/* Pricing */}
      <PricingSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <LoginCard onGoogleLogin={onGoogleLogin} onEmailLogin={onEmailLogin} onEmailSignUp={onEmailSignUp} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
