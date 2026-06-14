import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxHeroProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  kanji?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

const ParallaxHero = React.memo(function ParallaxHero({
  imageUrl,
  title,
  subtitle,
  kanji,
  overlayOpacity = 0.6,
  children,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div ref={ref} className="relative h-[50vh] min-h-[320px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale: imageScale, y: imageY }}>
        <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0B0B10]" style={{ opacity: overlayOpacity + 0.2 }} />
      <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ y: contentY, opacity }}>
        {kanji && (
          <span className="text-[80px] leading-none font-light text-white/10 mb-4 select-none" style={{ fontFamily: "'Noto Sans JP', serif" }}>
            {kanji}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-white text-center uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm tracking-[0.15em] text-red-400 mt-3 uppercase">{subtitle}</p>
        )}
        {children}
      </motion.div>
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0B10] to-transparent" />
    </div>
  );
});

export default ParallaxHero;
