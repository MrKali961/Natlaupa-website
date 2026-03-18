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

      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <MoodMatcher />
          <ValueProps />
          <ConciergeRecommendations />
          <Footer />
        </motion.div>
      )}

      {/* SEO: crawlable text + navigation links when content is gated */}
      {!isUnlocked && (
        <div
          className="absolute w-px h-px overflow-hidden"
          style={{ clip: 'rect(0,0,0,0)', clipPath: 'inset(50%)' }}
          aria-hidden="true"
        >
          <p>Natlaupa offers luxury hotel accommodations worldwide with personalized AI-powered concierge services. Discover curated hotel experiences, mood-matched stays, and exclusive travel offers from handpicked properties.</p>
          <nav>
            <a href="/destinations">Destinations</a>
            <a href="/styles">Hotel Styles</a>
            <a href="/countries">Countries</a>
            <a href="/offers">Offers</a>
            <a href="/blog">Blog</a>
            <a href="/about">About Natlaupa</a>
            <a href="/contact">Contact</a>
            <a href="/for-hotels">For Hotels</a>
            <a href="/become-angel">Become an Angel</a>
          </nav>
        </div>
      )}
    </main>
  );
}
