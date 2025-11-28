import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ExperienceSelector from '../components/ExperienceSelector';
import MoodMatcher from '../components/MoodMatcher';
import ConciergeRecommendations from '../components/ConciergeRecommendations';
import ValueProps from '../components/ValueProps';
import TrendingSection from '../components/TrendingSection';
import Footer from '../components/Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Home: React.FC = () => {
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
          {/* New Personalization Sections */}
          <MoodMatcher />
          <ConciergeRecommendations />

          {/* Original Sections */}
          <ValueProps />
          <TrendingSection />
          <Footer />
        </motion.div>
      )}
    </main>
  );
};

export default Home;
