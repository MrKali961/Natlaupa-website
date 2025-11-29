'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Compass, Palette, Leaf, Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { trackMoodSelection, hasConsent } from '@/services/trackingService';

interface Mood {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  keywords: string[];
  description: string;
  imageUrl: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  moodScore?: number;
  personalizedReason?: string;
}

const MOODS: Mood[] = [
  {
    id: 'romantic',
    name: 'Romantic Escape',
    tagline: 'For two hearts seeking solitude',
    icon: Heart,
    color: 'from-rose-500/20 to-pink-500/20',
    keywords: ['intimate', 'couple', 'honeymoon', 'private'],
    description: 'Secluded villas, candlelit dinners, and sunsets designed for two.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  },
  {
    id: 'adventure',
    name: 'Adventure Seeker',
    tagline: 'For the bold and curious',
    icon: Compass,
    color: 'from-orange-500/20 to-amber-500/20',
    keywords: ['active', 'nature', 'exploration', 'outdoor'],
    description: 'Wake up to mountains, dive into oceans, and chase horizons.',
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800'
  },
  {
    id: 'cultural',
    name: 'Cultural Immersion',
    tagline: 'For the curious soul',
    icon: Palette,
    color: 'from-purple-500/20 to-indigo-500/20',
    keywords: ['historic', 'art', 'heritage', 'local'],
    description: 'Stay where history whispers and art speaks volumes.',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
  },
  {
    id: 'wellness',
    name: 'Pure Relaxation',
    tagline: 'For body and mind renewal',
    icon: Leaf,
    color: 'from-emerald-500/20 to-teal-500/20',
    keywords: ['spa', 'wellness', 'retreat', 'peaceful'],
    description: 'Spas, meditation gardens, and the sound of silence.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'
  }
];

const MoodMatcher: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultHotels, setDefaultHotels] = useState<Hotel[]>([]);

  const activeMood = MOODS.find(m => m.id === selectedMood);

  // Fetch default trending hotels on mount
  useEffect(() => {
    const fetchDefaultHotels = async () => {
      try {
        const response = await fetch('/api/recommendations?type=trending&limit=3');
        const data = await response.json();
        if (data.hotels) {
          setDefaultHotels(data.hotels);
        }
      } catch (error) {
        console.error('Error fetching default hotels:', error);
      }
    };

    fetchDefaultHotels();
  }, []);

  // Fetch hotels when mood is selected
  const fetchMoodHotels = useCallback(async (moodId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/recommendations?type=mood&mood=${moodId}&limit=3`);
      const data = await response.json();
      if (data.hotels) {
        setHotels(data.hotels);
      }
    } catch (error) {
      console.error('Error fetching mood hotels:', error);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle mood selection
  const handleMoodSelect = async (moodId: string) => {
    const isDeselecting = selectedMood === moodId;

    if (isDeselecting) {
      setSelectedMood(null);
      setHotels([]);
    } else {
      setSelectedMood(moodId);

      // Track mood selection if consent is given
      if (hasConsent('personalization')) {
        await trackMoodSelection(moodId);
      }

      // Fetch hotels for this mood
      await fetchMoodHotels(moodId);
    }
  };

  // Get hotels to display
  const displayHotels = selectedMood && hotels.length > 0 ? hotels : defaultHotels;

  return (
    <section className="py-24 bg-deepBlue relative overflow-hidden">
      {/* Background Gradient based on selected mood */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-gradient-to-br ${activeMood?.color} pointer-events-none`}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-gold" size={20} />
            <span className="text-gold text-sm uppercase tracking-[0.3em]">Personalize Your Journey</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            What's Your <span className="italic text-gold">Mood</span>?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tell us how you want to feel, and we'll curate the perfect escape.
          </p>
        </motion.div>

        {/* Mood Selection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {MOODS.map((mood, index) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            const isHovered = hoveredMood === mood.id;

            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleMoodSelect(mood.id)}
                onMouseEnter={() => setHoveredMood(mood.id)}
                onMouseLeave={() => setHoveredMood(null)}
                className={`relative p-6 md:p-8 rounded-sm border transition-all duration-500 text-left group ${
                  isSelected
                    ? 'border-gold bg-gold/10'
                    : 'border-white/10 hover:border-gold/50 bg-white/5'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                  >
                    <Check size={14} className="text-deepBlue" />
                  </motion.div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                  isSelected || isHovered ? 'bg-gold' : 'bg-white/10'
                }`}>
                  <Icon size={24} className={isSelected || isHovered ? 'text-deepBlue' : 'text-gold'} />
                </div>

                {/* Content */}
                <h3 className={`font-serif text-lg md:text-xl mb-2 transition-colors ${
                  isSelected ? 'text-gold' : 'text-white'
                }`}>
                  {mood.name}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm hidden md:block">
                  {mood.tagline}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Mood Details */}
        <AnimatePresence mode="wait">
          {selectedMood && activeMood && (
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mb-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="relative h-[40vh] md:h-[50vh] overflow-hidden rounded-sm">
                  <img
                    src={activeMood.imageUrl}
                    alt={activeMood.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-deepBlue/80 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 text-gold mb-3">
                      <activeMood.icon size={20} />
                      <span className="text-sm uppercase tracking-widest">Selected Mood</span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white">
                      {activeMood.name}
                    </h3>
                  </div>
                </div>

                {/* Description & CTA */}
                <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm">
                  <p className="font-serif text-2xl text-white mb-6 leading-relaxed">
                    "{activeMood.description}"
                  </p>
                  <p className="text-slate-400 mb-8">
                    We've curated a selection of properties that perfectly match your desire for {activeMood.name.toLowerCase()}.
                    Each stay has been handpicked for its ability to deliver this unique experience.
                  </p>
                  <Link
                    href="/offers"
                    className="inline-flex items-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
                  >
                    View Curated Selection
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggested Hotels Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl text-white">
              {selectedMood ? 'Matching Properties' : 'Popular Picks'}
            </h3>
            <Link
              href="/offers"
              className="text-gold text-sm uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/offer/${hotel.id}`} className="group block">
                    <div className="relative h-64 overflow-hidden rounded-sm mb-4">
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deepBlue to-transparent opacity-60" />
                      {selectedMood && (
                        <div className="absolute top-4 left-4 bg-gold/90 text-deepBlue px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                          {activeMood?.name} Match
                        </div>
                      )}
                      {hotel.moodScore && hotel.moodScore > 0.8 && (
                        <div className="absolute top-4 right-4 bg-white/90 text-deepBlue px-2 py-1 text-xs font-bold rounded-full">
                          {Math.round(hotel.moodScore * 100)}% Match
                        </div>
                      )}
                    </div>
                    <h4 className="font-serif text-xl text-white group-hover:text-gold transition-colors mb-1">
                      {hotel.name}
                    </h4>
                    <p className="text-slate-400 text-sm">{hotel.location}</p>
                    {hotel.personalizedReason && (
                      <p className="text-gold/80 text-xs mt-2 line-clamp-2">
                        {hotel.personalizedReason}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MoodMatcher;
