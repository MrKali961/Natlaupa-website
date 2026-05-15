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
      className="relative w-full overflow-hidden bg-deepBlue flex flex-col"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <HeroBackground progress={scrollYProgress} />

      {/* Center content — grows to fill available space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 md:px-0 min-h-0">
        <HeroHeadline />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sm md:text-lg text-zinc-300 max-w-xs md:max-w-2xl font-light tracking-wide mb-4 md:mb-6 leading-relaxed"
        >
          Exclusive hotel rates, privileged upgrades, curated amenities.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xs md:text-sm text-zinc-400 max-w-xs md:max-w-2xl font-light tracking-widest mb-6 md:mb-8 uppercase"
        >
          24/7 Concierge Support
        </motion.p>

        <ConciergePrompt onScrollToGate={handleScrollDown} />

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.65 }}
          onClick={handleScrollDown}
          className="px-8 py-3 md:px-10 md:py-4 bg-white text-zinc-900 rounded-full font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-black transition-all duration-300 shadow-2xl shadow-black/20"
        >
          Explore Offers
        </motion.button>
      </div>

      {/* Latest hotels — unified responsive filmstrip */}
      <HeroLatestHotels />
    </section>
  );
};

export default Hero;
