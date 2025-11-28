import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  
  const handleScrollDown = () => {
    // Check if Lenis is initialized and available on window
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo('#experience-selector', { duration: 1.5 });
    } else {
      // Fallback to native smooth scroll
      document.getElementById('experience-selector')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-deepBlue">
      {/* Background Image - Grayscale Mountains */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop"
          alt="Luxury Landscape"
          className="w-full h-full object-cover grayscale contrast-125 brightness-75" 
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 md:px-0">
        
        {/* Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 md:mb-8"
        >
            <span className="px-4 py-2 md:px-5 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] md:text-sm font-medium uppercase tracking-[0.2em] text-white/90">
                Curated Collection 2025
            </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white mb-6 tracking-tight leading-tight"
        >
          Redefining <br className="hidden md:block" />
          <span className="italic font-light text-white/90 block md:inline mt-2 md:mt-0">the Art of Stay.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sm md:text-lg text-zinc-300 max-w-xs md:max-w-xl font-light tracking-wide mb-10 md:mb-12 leading-relaxed"
        >
          From hidden gems to world-class luxury. <br className="hidden md:block" />
          Experience technology designed to disappear into your life.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.6 }}
          onClick={handleScrollDown}
          className="px-8 py-3 md:px-10 md:py-4 bg-white text-zinc-900 rounded-full font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-black transition-all duration-300 shadow-2xl shadow-black/20"
        >
          Begin Your Search
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 text-white/30"
      >
        <ChevronDown size={28} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

export default Hero;