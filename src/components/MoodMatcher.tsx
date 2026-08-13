"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { trackMoodSelection, hasConsent } from "@/services/trackingService";
import { getIconForStyle, getColorForStyle, getDefaultImageUrl } from "@/utils/moodHelpers";

interface MoodCopy {
  tagline: string;
  description: string;
  keywords: string[];
  hotelMatchingReason: string;
}

interface Mood {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  keywords: string[];
  description: string;
  imageUrl: string;
  hotelCount?: number;
  aiContent?: MoodCopy;
}

interface Hotel {
  id: string;
  name: string;
  slug?: string;
  location: string;
  imageUrl: string;
  moodScore?: number;
  personalizedReason?: string;
}

/**
 * Hand-authored editorial copy, keyed by the style's stored slug.
 *
 * The backend generates this copy with Gemini and silently substitutes a mechanical
 * template when generation is unavailable, so curated copy always outranks whatever the
 * API returns. Styles with no entry here fall through to the API's copy.
 */
const CURATED_COPY: Record<string, MoodCopy> = {
  "riviera-lifestyle": {
    tagline: "For two hearts seeking solitude",
    description:
      "Secluded villas, candlelit dinners, and sunsets designed for two.",
    keywords: ["intimate", "couple", "honeymoon", "private"],
    hotelMatchingReason: "Perfect romantic escape at {hotelName}",
  },
  "wellness-rejuvenation": {
    tagline: "For body and mind renewal",
    description: "Spas, meditation gardens, and the sound of silence.",
    keywords: ["spa", "wellness", "retreat", "peaceful"],
    hotelMatchingReason: "Perfect wellness retreat at {hotelName}",
  },
  "timeless-elegance": {
    tagline: "For those who prefer the classics",
    description:
      "Paris and Évian, where heritage is quietly kept rather than staged.",
    keywords: ["heritage", "classic", "refined", "iconic"],
    hotelMatchingReason: "A study in enduring elegance at {hotelName}",
  },
  "urban-prestige": {
    tagline: "For the address that needs no explanation",
    description:
      "London, New York, Dubai — the corner of the city everyone can name.",
    keywords: ["landmark", "city", "prestige", "iconic"],
    hotelMatchingReason: "One of the city's great addresses at {hotelName}",
  },
  "global-power-hub": {
    tagline: "For those always between time zones",
    description:
      "Dubai, Istanbul, New York, where the deal and the departure gate align.",
    keywords: ["business", "connected", "metropolitan", "premium"],
    hotelMatchingReason: "Built for momentum at {hotelName}",
  },
  "contemporary-cool": {
    tagline: "For the design-led and easily bored",
    description:
      "Amsterdam and the sharper corners of Barcelona — modern, never stuffy.",
    keywords: ["design", "modern", "creative", "urban"],
    hotelMatchingReason: "Design-forward and refreshingly unstuffy at {hotelName}",
  },
  "alpine-escape": {
    tagline: "For thin air and long descents",
    description: "Courchevel in season: first tracks at dawn, firelight by four.",
    keywords: ["ski", "mountain", "alpine", "winter"],
    hotelMatchingReason: "Ski-in seclusion at {hotelName}",
  },
};

const MoodMatcher: React.FC = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [moodsError, setMoodsError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices to prevent double-tap requirement on iOS
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Fetch dynamic moods from backend
  useEffect(() => {
    const fetchMoods = async () => {
      setMoodsLoading(true);
      setMoodsError(null);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hotel-styles/mood-matcher`);

        if (!response.ok) {
          throw new Error('Failed to fetch moods');
        }

        const data = await response.json();
        const styles = data.data?.styles || [];

        // Transform backend styles to Mood format
        const transformedMoods: Mood[] = styles.map((style: any, index: number) => {
          // Curated copy wins as a whole block when the style has one; the API still owns
          // identity, imagery and counts so the section tracks styles added in the admin.
          // A style with neither curated copy nor aiContent still has to render, so fall
          // back to its own name rather than reading .tagline off undefined.
          const copy: MoodCopy = CURATED_COPY[style.slug] ??
            style.aiContent ?? {
              tagline: style.name,
              description: '',
              keywords: [],
              hotelMatchingReason: 'A considered stay at {hotelName}',
            };

          return {
            id: style.id,
            name: style.name,
            slug: style.slug,
            tagline: copy.tagline,
            icon: getIconForStyle(style.name),
            color: getColorForStyle(style.name, index),
            keywords: copy.keywords,
            description: copy.description,
            imageUrl: style.imageUrl || getDefaultImageUrl(style.name),
            hotelCount: style.hotelCount,
            aiContent: copy, // Include full copy block for hotel matching
          };
        });

        setMoods(transformedMoods);
      } catch (error) {
        console.error('Error fetching moods:', error);
        setMoodsError('Unable to load mood options');
      } finally {
        setMoodsLoading(false);
      }
    };

    fetchMoods();
  }, []);

  const activeMood = moods.find((m) => m.id === selectedMood);

  // Fetch hotels when mood is selected - filters from actual hotel list
  const fetchMoodHotels = useCallback(async (moodId: string) => {
    setIsLoading(true);
    try {
      // Fetch all hotels from the database
      const response = await fetch('/api/hotels?limit=50');
      const data = await response.json();
      const allHotels = data.data?.items || data.data?.hotels || data.hotels || [];

      // Get mood keywords for matching from dynamic moods
      const mood = moods.find(m => m.id === moodId);
      if (!mood) {
        setHotels([]);
        return;
      }

      const moodKeywords = mood.keywords || [];

      // Score hotels based on mood matching
      const scoredHotels = allHotels.map((hotel: any) => {
        let score = 0;

        // HIGHEST PRIORITY: Hotels that match the mood's style ID (exact match)
        if (hotel.styleId === mood.id) {
          score += 100; // Perfect match - same style
        }

        // SECONDARY: Keyword matching in hotel content
        const hotelText = `${hotel.description || ''} ${hotel.shortDescription || ''} ${hotel.name || ''} ${hotel.style?.name || ''}`.toLowerCase();

        // Check for keyword matches from AI-generated keywords
        let keywordMatchCount = 0;
        moodKeywords.forEach((keyword: string) => {
          if (hotelText.includes(keyword.toLowerCase())) {
            score += 15; // Each keyword match adds points
            keywordMatchCount++;
          }
        });

        // Bonus for multiple keyword matches
        if (keywordMatchCount >= 3) {
          score += 20; // Strong keyword alignment
        } else if (keywordMatchCount >= 2) {
          score += 10; // Moderate keyword alignment
        }

        // Ensure score is between 0 and 100
        const finalScore = Math.min(100, Math.max(0, score));

        // Use AI-generated personalized reason with hotel name
        const personalizedReason = mood.aiContent?.hotelMatchingReason
          ? mood.aiContent.hotelMatchingReason.replace('{hotelName}', hotel.name)
          : `Perfect ${mood.name.toLowerCase()} experience at ${hotel.name}`;

        return {
          id: hotel.id,
          name: hotel.name,
          slug: hotel.slug || hotel.id,
          location: hotel.city || hotel.country,
          imageUrl: hotel.thumbnailImage || hotel.images?.[0]?.url || '',
          moodScore: finalScore / 100, // Normalize to 0-1 range for display
          personalizedReason,
        };
      });

      // Sort by score and take top 3
      const topHotels = scoredHotels
        .sort((a: { moodScore: number }, b: { moodScore: number }) => b.moodScore - a.moodScore)
        .slice(0, 3);

      setHotels(topHotels);
    } catch (error) {
      console.error("Error fetching mood hotels:", error);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, [moods]);

  // Handle mood selection
  const handleMoodSelect = async (moodId: string) => {
    const isDeselecting = selectedMood === moodId;

    if (isDeselecting) {
      setSelectedMood(null);
      setHotels([]);
    } else {
      setSelectedMood(moodId);

      // Track mood selection if consent is given
      if (hasConsent("personalization")) {
        await trackMoodSelection(moodId);
      }

      // Fetch hotels for this mood
      await fetchMoodHotels(moodId);
    }
  };

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
            <span className="text-gold text-sm uppercase tracking-[0.3em]">
              Personalize Your Journey
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
            How Do You Want To <span className="italic text-gold">Feel</span>?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tell us the experience you're looking for, and we'll curate the perfect escape.
          </p>
        </motion.div>

        {/* Loading State */}
        {moodsLoading && (
          <div className="flex items-center justify-center py-16 mb-16">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <span className="ml-3 text-slate-400">Loading mood options...</span>
          </div>
        )}

        {/* Error State */}
        {moodsError && !moodsLoading && (
          <div className="text-center py-16 mb-16">
            <p className="text-red-400 mb-4">{moodsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-gold hover:text-white transition-colors underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Mood Selection Cards */}
        {!moodsLoading && !moodsError && moods.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {moods.map((mood, index) => {
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
                onMouseEnter={() => !isTouchDevice && setHoveredMood(mood.id)}
                onMouseLeave={() => !isTouchDevice && setHoveredMood(null)}
                className={`relative p-6 md:p-8 rounded-sm border transition-all duration-500 text-left group ${
                  isSelected
                    ? "border-gold bg-gold/10"
                    : "border-white/10 hover-capable:hover:border-gold/50 bg-white/5"
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
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                    isSelected || isHovered ? "bg-gold" : "bg-white/10"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      isSelected || isHovered ? "text-deepBlue" : "text-gold"
                    }
                  />
                </div>

                {/* Content */}
                <h3
                  className={`font-serif text-lg md:text-xl mb-2 transition-colors ${
                    isSelected ? "text-gold" : "text-white"
                  }`}
                >
                  {mood.name}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm hidden md:block">
                  {mood.tagline}
                </p>
              </motion.button>
            );
          })}
        </div>
        )}

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
                      <span className="text-sm uppercase tracking-widest">
                        Selected Mood
                      </span>
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
                    We've curated a selection of properties that perfectly match
                    your desire for {activeMood.name.toLowerCase()}. Each stay
                    has been handpicked for its ability to deliver this unique
                    experience.
                  </p>
                  <Link
                    href={`/styles/${activeMood.slug}`}
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

        {/* Matching Properties - Only shown when a mood is selected */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="font-serif text-2xl text-white">
                Matching Properties
              </h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/hotel/${hotel.slug || hotel.id}`} className="group block">
                      <div className="relative h-64 overflow-hidden rounded-sm mb-4">
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deepBlue to-transparent opacity-60" />
                        <div className="absolute top-4 left-4 bg-gold/90 text-deepBlue px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                          {activeMood?.name} Match
                        </div>
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
        )}
      </div>
    </section>
  );
};

export default MoodMatcher;
