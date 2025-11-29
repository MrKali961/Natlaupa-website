'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Snowflake, Leaf, Flower2, TrendingUp, Clock, MapPin, Star, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getUserMoodPreferences, getRecentViews, hasConsent } from '@/services/trackingService';

type RecommendationType = 'seasonal' | 'trending' | 'for-you';

interface SeasonData {
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  category: string;
  rating: number;
  imageUrl: string;
  personalizedReason?: string;
  moodScore?: number;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  temp: number;
}

const SEASONS: Record<string, SeasonData> = {
  winter: { name: 'Winter', icon: Snowflake, color: 'from-blue-400/20 to-cyan-400/20', description: 'Cozy retreats and alpine adventures' },
  spring: { name: 'Spring', icon: Flower2, color: 'from-pink-400/20 to-rose-400/20', description: 'Blooming gardens and renewal' },
  summer: { name: 'Summer', icon: Sun, color: 'from-amber-400/20 to-orange-400/20', description: 'Sun-soaked escapes and coastal bliss' },
  autumn: { name: 'Autumn', icon: Leaf, color: 'from-orange-400/20 to-red-400/20', description: 'Golden hues and harvest experiences' }
};

const getCurrentSeason = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

const ConciergeRecommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RecommendationType>('seasonal');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const currentSeason = getCurrentSeason();
  const seasonData = SEASONS[currentSeason];
  const SeasonIcon = seasonData.icon;

  // Fetch recommendations based on tab
  const fetchRecommendations = useCallback(async (type: RecommendationType, forceRefresh = false) => {
    setIsLoading(true);

    try {
      // Build query params
      const params = new URLSearchParams({
        type,
        limit: '4'
      });

      // Add user preferences for "for-you" tab
      if (type === 'for-you' && hasConsent('personalization')) {
        const preferences = getUserMoodPreferences();
        const recentViews = getRecentViews(10);

        if (preferences.length > 0) {
          params.append('preferences', JSON.stringify(preferences));
        }
        if (recentViews.length > 0) {
          params.append('recentViews', JSON.stringify(recentViews.map(v => v.hotelId)));
        }
      }

      // Add cache buster for refresh
      if (forceRefresh) {
        params.append('_t', Date.now().toString());
      }

      const response = await fetch(`/api/recommendations?${params.toString()}`);
      const data = await response.json();

      if (data.hotels) {
        setHotels(data.hotels.slice(0, 2));
      }

      // Fetch destinations separately (from database)
      const destResponse = await fetch('/api/recommendations?type=trending&limit=2');
      const destData = await destResponse.json();
      if (destData.hotels) {
        // Create destination-like objects from hotel countries
        const uniqueDestinations: Destination[] = [];
        const seenCountries = new Set<string>();

        destData.hotels.forEach((hotel: Hotel) => {
          if (!seenCountries.has(hotel.country) && uniqueDestinations.length < 2) {
            seenCountries.add(hotel.country);
            uniqueDestinations.push({
              id: hotel.id,
              name: hotel.location.split(',')[0],
              country: hotel.country,
              imageUrl: hotel.imageUrl,
              temp: Math.floor(Math.random() * 20) + 15 // Random temp 15-35
            });
          }
        });

        setDestinations(uniqueDestinations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch on mount and tab change
  useEffect(() => {
    fetchRecommendations(activeTab);
  }, [activeTab, fetchRecommendations]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRecommendations(activeTab, true);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const tabs = [
    { id: 'seasonal' as const, label: 'This Season', icon: SeasonIcon },
    { id: 'trending' as const, label: 'Trending Now', icon: TrendingUp },
    { id: 'for-you' as const, label: 'For You', icon: Sparkles }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'seasonal':
        return {
          title: `Perfect for ${seasonData.name}`,
          subtitle: seasonData.description
        };
      case 'trending':
        return {
          title: "What's Hot Right Now",
          subtitle: 'Most searched destinations this week'
        };
      case 'for-you':
        return {
          title: 'Curated Just For You',
          subtitle: hasConsent('personalization')
            ? 'Based on your preferences'
            : 'Enable personalization for tailored recommendations'
        };
      default:
        return { title: '', subtitle: '' };
    }
  };

  const tabContent = getTabContent();

  return (
    <section className="py-24 bg-midnight relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${seasonData.color} opacity-30 transition-all duration-1000`} />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Concierge Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Sparkles className="text-gold" size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{getGreeting()}</p>
                <p className="text-gold text-xs uppercase tracking-widest">Your Personal Concierge</p>
              </div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-2">
              Today's <span className="italic">Recommendations</span>
            </h2>
            <p className="text-slate-400">
              Handpicked selections updated daily just for you.
            </p>
          </motion.div>

          {/* Refresh Button */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="mt-6 md:mt-0 flex items-center gap-2 text-gold hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="text-sm uppercase tracking-widest">Refresh</span>
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${
                  isActive
                    ? 'bg-gold text-deepBlue border-gold'
                    : 'bg-white/5 text-white border-white/10 hover:border-gold/50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm uppercase tracking-wider">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Recommendations Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Title */}
            <div className="mb-8">
              <h3 className="font-serif text-2xl text-white mb-2">{tabContent.title}</h3>
              <p className="text-slate-400">{tabContent.subtitle}</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Hotels */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="text-gold" size={16} />
                    <span className="text-gold text-xs uppercase tracking-widest">Featured Properties</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotels.map((hotel, index) => (
                      <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={`/offer/${hotel.id}`} className="group block">
                          <div className="relative h-72 overflow-hidden rounded-sm mb-4 border border-white/10 group-hover:border-gold/30 transition-colors">
                            <img
                              src={hotel.imageUrl}
                              alt={hotel.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-transparent to-transparent" />

                            {/* Rating Badge */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                              <Star size={12} className="text-gold fill-gold" />
                              <span className="text-deepBlue text-xs font-bold">{hotel.rating}</span>
                            </div>

                            {/* Tab-specific Badge */}
                            {activeTab === 'seasonal' && (
                              <div className="absolute top-4 left-4 bg-gold/90 text-deepBlue px-3 py-1 rounded-full flex items-center gap-1">
                                <SeasonIcon size={12} />
                                <span className="text-xs font-bold uppercase">{seasonData.name} Pick</span>
                              </div>
                            )}
                            {activeTab === 'trending' && (
                              <div className="absolute top-4 left-4 bg-gold/90 text-deepBlue px-3 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp size={12} />
                                <span className="text-xs font-bold uppercase">Trending</span>
                              </div>
                            )}
                            {activeTab === 'for-you' && hotel.moodScore && (
                              <div className="absolute top-4 left-4 bg-gold/90 text-deepBlue px-3 py-1 rounded-full flex items-center gap-1">
                                <Sparkles size={12} />
                                <span className="text-xs font-bold uppercase">{Math.round(hotel.moodScore * 100)}% Match</span>
                              </div>
                            )}

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                              <p className="text-gold text-xs uppercase tracking-widest mb-2">{hotel.category}</p>
                              <h4 className="font-serif text-2xl text-white group-hover:text-gold transition-colors mb-2">
                                {hotel.name}
                              </h4>
                              <div className="flex items-center gap-2 text-slate-300 text-sm">
                                <MapPin size={14} />
                                {hotel.location}
                              </div>
                              {hotel.personalizedReason && (
                                <p className="text-gold/80 text-xs mt-2 line-clamp-2">
                                  {hotel.personalizedReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Destinations Sidebar */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-gold" size={16} />
                    <span className="text-gold text-xs uppercase tracking-widest">Trending Destinations</span>
                  </div>

                  <div className="space-y-4">
                    {destinations.map((dest, index) => (
                      <motion.div
                        key={dest.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                      >
                        <Link href={`/countries/${dest.country.toLowerCase().replace(/\s+/g, '-')}`} className="group block">
                          <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-sm hover:border-gold/30 transition-all">
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-sm">
                              <img
                                src={dest.imageUrl}
                                alt={dest.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-serif text-lg text-white group-hover:text-gold transition-colors truncate">
                                {dest.name}
                              </h5>
                              <p className="text-slate-400 text-sm mb-2">{dest.country}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  Now: {dest.temp}°C
                                </span>
                              </div>
                            </div>
                            <ArrowRight size={16} className="text-slate-500 group-hover:text-gold transition-colors self-center" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Stats Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 rounded-sm"
                  >
                    <h5 className="font-serif text-lg text-white mb-4">This Week's Insights</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Searches up</span>
                        <span className="text-gold font-bold">+34%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Top search</span>
                        <span className="text-white text-sm">Maldives</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Avg. stay</span>
                        <span className="text-white text-sm">5 nights</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* View All CTA */}
                  <Link
                    href="/offers"
                    className="flex items-center justify-center gap-2 w-full py-4 border border-gold text-gold hover:bg-gold hover:text-deepBlue transition-all duration-300 rounded-sm font-bold uppercase tracking-widest text-sm"
                  >
                    <span>View All Recommendations</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ConciergeRecommendations;
