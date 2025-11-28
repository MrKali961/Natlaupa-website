
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Sequence timing
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 1000); // Wait for exit animation to finish before unmounting logic
    }, 2500); // Total duration of logo display

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={exit ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Custom bezier for "curtain" effect
      className="fixed inset-0 z-[9999] bg-deepBlue flex items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center relative z-10">
        
        {/* Logo Mark Container */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8">
          {/* Gold Arch Background */}
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* The Arch */}
            <path 
              d="M25 100 V 40 C 25 10 75 10 75 40 V 100 Z" 
              fill="#D4AF37" 
            />
          </motion.svg>

          {/* The Bird (Flying Right) - Animated Mask/Overlay */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          >
            {/* Stylized Bird Silhouette mimicking the provided image */}
            <path 
              d="M20 55 C 35 50, 45 40, 50 35 C 55 30, 80 32, 85 35 C 75 45, 65 50, 60 55 C 70 50, 80 40, 90 35 C 80 60, 50 70, 35 65 C 20 60, 10 65, 5 65 C 10 60, 15 58, 20 55 Z" 
              fill="#000000" // Black bird on Gold Arch
            />
          </motion.svg>
        </div>

        {/* Typography Container */}
        <div className="text-center overflow-hidden">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="font-serif text-4xl md:text-6xl text-white tracking-wider mb-4"
          >
            NATLAUPA
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
            className="h-[1px] bg-white/20 mx-auto mb-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-gold text-[10px] md:text-xs font-sans uppercase tracking-[0.3em]"
          >
            Luxury One Step Closer
          </motion.p>
        </div>

      </div>
      
      {/* Background Texture/Noise Overlay for premium feel */}
      <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E")' }} />

    </motion.div>
  );
};

export default Preloader;
