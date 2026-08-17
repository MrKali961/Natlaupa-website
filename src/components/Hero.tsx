'use client';

import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import HeroLatestHotels from '@/components/HeroLatestHotels';
import HeroBackground from '@/components/hero/HeroBackground';
import HeroHeadline from '@/components/hero/HeroHeadline';
import ConciergePrompt from '@/components/hero/ConciergePrompt';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // 0 at rest → 1 as the hero scrolls out toward the experience-selector gate.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const handleScrollDown = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo('#experience-selector', { duration: 1.5 });
    } else {
      document
        .getElementById('experience-selector')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-noir flex flex-col"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeroBackground progress={scrollYProgress} />

      {/* Center content — vertically centered in the space above the filmstrip */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 md:px-0 min-h-0">
        <HeroHeadline />

        <ConciergePrompt onScrollToGate={handleScrollDown} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xs md:text-sm text-zinc-400 max-w-xs md:max-w-2xl font-light tracking-widest uppercase"
        >
          24/7 Concierge Support
        </motion.p>
      </div>

      {/* Latest hotels — unified responsive filmstrip */}
      <HeroLatestHotels />
    </section>
  );
};

export default Hero;
