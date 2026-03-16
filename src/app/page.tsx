'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import ExperienceSelector from '@/components/ExperienceSelector';
import ValueProps from '@/components/ValueProps';
import ConciergeRecommendations from '@/components/ConciergeRecommendations';
import MoodMatcher from '@/components/MoodMatcher';
import Footer from '@/components/Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  // Gatekeeper state: false initially, restricting scroll past the selector
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSelection = () => {
    setIsUnlocked(true);
    // Refresh ScrollTrigger after a slight delay to allow DOM to update
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <main className="bg-deepBlue min-h-screen">
      <Hero />
      <ExperienceSelector onSelection={handleSelection} />

      {/* Always in DOM for SEO crawlability; hidden via CSS until unlocked */}
      <div
        style={{
          opacity: isUnlocked ? 1 : 0,
          maxHeight: isUnlocked ? 'none' : '0px',
          overflow: isUnlocked ? 'visible' : 'hidden',
          transition: 'opacity 1s ease-out',
        }}
        aria-hidden={!isUnlocked}
      >
        {isUnlocked ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <MoodMatcher />
            <ValueProps />
            <ConciergeRecommendations />
          </motion.div>
        ) : (
          <>
            <MoodMatcher />
            <ValueProps />
            <ConciergeRecommendations />
          </>
        )}
      </div>

      {/* Footer always visible for SEO — contains navigation links */}
      <Footer />
    </main>
  );
}
