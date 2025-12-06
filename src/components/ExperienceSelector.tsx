'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Building2, ThermometerSun, ArrowRight, Clock, MapPin, Plus, Sparkles, Moon, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DESTINATIONS, CATEGORIES } from '@/lib/constants';

type ExperienceMode = 'destination' | 'category' | null;

interface ExperienceSelectorProps {
  onSelection?: () => void;
}

// Pulsing Marker Component
const PulsingMarker: React.FC<{ active?: boolean; delay?: number }> = ({ active = false, delay = 0 }) => (
  <div className="relative">
    <motion.div
      className={`w-4 h-4 rounded-full ${active ? 'bg-gold' : 'bg-gold/50'}`}
      animate={active ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, delay }}
    />
    {active && (
      <motion.div
        className="absolute inset-0 w-4 h-4 rounded-full bg-gold"
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      />
    )}
  </div>
);

const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({ onSelection }) => {
  const [mode, setMode] = useState<ExperienceMode>(null);
  const [hoveredChoice, setHoveredChoice] = useState<ExperienceMode>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [liveTemps, setLiveTemps] = useState<Record<string, number>>({});
  const [liveTimes, setLiveTimes] = useState<Record<string, string>>({});
  const [activeDestination, setActiveDestination] = useState<string | null>(null);
  const [clickedButton, setClickedButton] = useState<ExperienceMode>(null);
  const [showToast, setShowToast] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect touch devices to prevent double-tap requirement on iOS
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleSelectionClick = (selected: ExperienceMode) => {
    // Immediate visual feedback - pulse effect
    setClickedButton(selected);

    // Short delay before transition starts (snappier response)
    setTimeout(() => {
      setIsTransitioning(true);
      setShowToast(true);

      // Auto-dismiss toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);
    }, 300);

    setTimeout(() => {
      setMode(selected);
      if (onSelection) onSelection();

      setTimeout(() => {
        setIsTransitioning(false);
        setClickedButton(null);
      }, 800);
    }, 800);
  };

  // Golden Hour Mock Data
  const goldenHourData = useMemo(() => {
    if (mode === 'destination') {
      return {
        location: 'Santorini, Greece',
        time: '19:42',
        status: 'The sun has just set.',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2940&auto=format&fit=crop'
      }
    } else {
      return {
        location: 'Milan, Italy',
        time: '20:15',
        status: 'The city is waking up.',
        image: 'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?q=80&w=2940&auto=format&fit=crop'
      }
    }
  }, [mode]);

  // Fetch Live Weather
  useEffect(() => {
    if (mode === 'destination') {
      const fetchWeather = async () => {
        const promises = DESTINATIONS.map(async (dest) => {
          if (!dest.lat || !dest.lng) return { id: dest.id, temp: null };
          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lng}&current_weather=true`
            );
            const data = await response.json();
            return {
              id: dest.id,
              temp: data.current_weather ? Math.round(data.current_weather.temperature) : null
            };
          } catch {
            return { id: dest.id, temp: null };
          }
        });
        const results = await Promise.all(promises);
        const newTemps: Record<string, number> = {};
        results.forEach(res => {
          if (res.temp !== null) newTemps[res.id] = res.temp;
        });
        setLiveTemps(newTemps);
      };
      fetchWeather();
    }
  }, [mode]);

  // Update Live Times
  useEffect(() => {
    if (mode !== 'destination') return;
    const updateTimes = () => {
      const times: Record<string, string> = {};
      DESTINATIONS.forEach(dest => {
        const timeZones: Record<string, string> = {
          'Japan': 'Asia/Tokyo',
          'Greece': 'Europe/Athens',
          'USA': 'America/New_York',
          'Iceland': 'Atlantic/Reykjavik'
        };
        const tz = timeZones[dest.country] || 'UTC';
        times[dest.id] = new Date().toLocaleTimeString('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      });
      setLiveTimes(times);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div ref={containerRef} className="bg-deepBlue relative z-20 overflow-hidden">

      {/* Blackout Curtain for Smooth Transition with Loading Indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="blackout-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-deepBlue z-[100] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <span className="text-gold text-sm uppercase tracking-[0.3em]">
                Preparing your journey...
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Toast Notification */}
      <AnimatePresence>
        {showToast && clickedButton && (
          <motion.div
            key="selection-toast"
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 z-[110] bg-deepBlue/95 backdrop-blur-md border border-gold/30 px-6 py-4 rounded-sm shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-white text-sm">
                You selected{' '}
                <span className="text-gold font-semibold">
                  {clickedButton === 'destination' ? 'Destination' : 'Style'}
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SELECTION SCREEN: THE MINIMALIST MANIFESTO */}
      {!mode && (
        <section
          id="experience-selector"
          className="w-full relative flex flex-col md:flex-row items-center justify-center bg-black overflow-hidden"
          style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
        >
          {/* Background Layer: DESTINATION (WHERE) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredChoice === 'destination' ? 0.6 : 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop"
              alt="Nature Background"
              className="w-full h-full object-cover grayscale-[20%]"
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </motion.div>

          {/* Background Layer: STYLE (HOW) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredChoice === 'category' ? 0.6 : 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <img
              src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=3456&auto=format&fit=crop"
              alt="Interior Background"
              className="w-full h-full object-cover grayscale-[20%]"
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </motion.div>

          {/* Hint Text - Top Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-20 sm:top-24 md:top-28 lg:top-32 left-0 right-0 flex flex-col items-center justify-center text-center z-10 px-4"
          >
            <p className="text-gold/80 text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-1 sm:mb-2">
              Pick Your Experience
            </p>
            <p className="text-white/40 text-[10px] sm:text-xs md:text-sm tracking-wide max-w-xs sm:max-w-sm">
              Choose how you'd like to explore our collection
            </p>
          </motion.div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-6xl mx-auto px-4">

            {/* CHOICE 1: DESTINATION */}
            <div className="flex-1 flex justify-center md:justify-end md:pr-16 lg:pr-24 py-8 md:py-0">
              <motion.div
                className="group relative cursor-pointer"
                onMouseEnter={() => !isTouchDevice && setHoveredChoice('destination')}
                onMouseLeave={() => !isTouchDevice && setHoveredChoice(null)}
                onClick={() => handleSelectionClick('destination')}
                animate={clickedButton === 'destination' ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{ duration: 0.6 }}
              >
                {/* Flickering arrow indicator */}
                <motion.div
                  className="absolute -top-10 sm:-top-12 md:-top-14 lg:-top-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
                  animate={{
                    y: [0, 6, 0],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </motion.div>
                {/* Pulse ring effect */}
                <AnimatePresence>
                  {clickedButton === 'destination' && (
                    <motion.div
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 border-2 border-gold rounded-sm pointer-events-none"
                      style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)' }}
                    />
                  )}
                </AnimatePresence>
                <motion.h2
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  animate={{
                    opacity: hoveredChoice && hoveredChoice !== 'destination' ? 0.2 : 1,
                    scale: hoveredChoice === 'destination' ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight"
                >
                  DESTINATION
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hoveredChoice === 'destination' ? '100%' : '0%' }}
                  className="h-1 bg-gold mt-2 md:mt-4"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredChoice === 'destination' ? 1 : 0, y: hoveredChoice === 'destination' ? 0 : 10 }}
                  className="absolute -bottom-8 md:-bottom-12 left-0 w-full text-center text-xs md:text-sm text-gold uppercase tracking-[0.3em]"
                  style={{ marginRight: '-0.3em' }}
                >
                  Where
                </motion.p>
              </motion.div>
            </div>

            {/* DIVIDER (Visual Only) - Absolutely centered */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-32 bg-white/20" />

            {/* Mobile divider */}
            <div className="block md:hidden w-24 h-[1px] bg-white/20" />

            {/* CHOICE 2: STYLE */}
            <div className="flex-1 flex justify-center md:justify-start md:pl-16 lg:pl-24 py-8 md:py-0">
              <motion.div
                className="group relative cursor-pointer"
                onMouseEnter={() => !isTouchDevice && setHoveredChoice('category')}
                onMouseLeave={() => !isTouchDevice && setHoveredChoice(null)}
                onClick={() => handleSelectionClick('category')}
                animate={clickedButton === 'category' ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{ duration: 0.6 }}
              >
                {/* Flickering arrow indicator */}
                <motion.div
                  className="absolute -top-10 sm:-top-12 md:-top-14 lg:-top-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
                  animate={{
                    y: [0, 6, 0],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </motion.div>
                {/* Pulse ring effect */}
                <AnimatePresence>
                  {clickedButton === 'category' && (
                    <motion.div
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 border-2 border-gold rounded-sm pointer-events-none"
                      style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)' }}
                    />
                  )}
                </AnimatePresence>
                <motion.h2
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  animate={{
                    opacity: hoveredChoice && hoveredChoice !== 'category' ? 0.2 : 1,
                    scale: hoveredChoice === 'category' ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight"
                >
                  STYLE
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hoveredChoice === 'category' ? '100%' : '0%' }}
                  className="h-1 bg-gold mt-2 md:mt-4"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: hoveredChoice === 'category' ? 1 : 0, y: hoveredChoice === 'category' ? 0 : 10 }}
                  className="absolute -bottom-8 md:-bottom-12 left-0 w-full text-center text-xs md:text-sm text-gold uppercase tracking-[0.3em]"
                  style={{ marginRight: '-0.3em' }}
                >
                  How
                </motion.p>
              </motion.div>
            </div>

          </div>

          {/* Instruction Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredChoice ? 0 : 0.5 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 text-[10px] uppercase tracking-[0.4em]"
            style={{ marginRight: '-0.4em' }}
          >
            Define Your Journey
          </motion.div>

        </section>
      )}

      {/* GOLDEN HOUR PREVIEW */}
      {mode && (
        <section className="w-full relative overflow-hidden flex items-center justify-center" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
          {/* Background with Slow Zoom */}
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={goldenHourData.image}
              alt="Golden Hour"
              className="w-full h-full object-cover grayscale-[30%] contrast-110"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="flex items-center justify-center space-x-3 text-gold mb-6">
                <Clock size={18} />
                <span className="text-sm uppercase tracking-widest font-bold">Local Time</span>
              </div>
              <h2 className="font-serif text-4xl md:text-7xl text-white mb-6 leading-tight">
                It is currently {goldenHourData.time} in <br/>
                <span className="italic text-gold">{goldenHourData.location.split(',')[0]}</span>.
              </h2>
              <div className="flex items-center justify-center space-x-3 text-slate-300">
                <Moon size={18} />
                <p className="text-lg font-light tracking-wide">{goldenHourData.status}</p>
              </div>
            </motion.div>
          </div>

        </section>
      )}

      {/* THE LIVING MAP - VERTICAL EXPERIENCE */}
      <AnimatePresence>
        {mode && (
          <motion.section
            key="living-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Section Header */}
            <div className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-16"
                >
                  <div className="flex items-center justify-center gap-3 mb-6">
                    {mode === 'destination' ? (
                      <Map className="text-gold" size={24} />
                    ) : (
                      <Building2 className="text-gold" size={24} />
                    )}
                    <span className="text-gold text-sm uppercase tracking-[0.3em]">
                      {mode === 'destination' ? 'The Living Map' : 'Curated Collections'}
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
                    {mode === 'destination' ? 'Discover Your Next Chapter' : 'Architecture of Dreams'}
                  </h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    {mode === 'destination'
                      ? 'Each destination pulses with its own rhythm. Find yours.'
                      : 'From historic grandeur to modern minimalism, find stays that speak to your soul.'}
                  </p>
                </motion.div>

                {/* Mini Map Overview - Destinations only */}
                {mode === 'destination' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative h-32 mb-16 hidden md:block"
                  >
                    <div className="absolute inset-0 flex items-center justify-center gap-8">
                      {DESTINATIONS.map((dest, idx) => (
                        <motion.button
                          key={dest.id}
                          onClick={() => setActiveDestination(activeDestination === dest.id ? null : dest.id)}
                          className="flex flex-col items-center gap-2 group"
                          whileHover={{ scale: 1.1 }}
                        >
                          <PulsingMarker active={activeDestination === dest.id} delay={idx * 0.2} />
                          <span className={`text-xs uppercase tracking-widest transition-colors ${
                            activeDestination === dest.id ? 'text-gold' : 'text-slate-500 group-hover:text-white'
                          }`}>
                            {dest.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  </motion.div>
                )}

                {/* Destination/Style Cards - Vertical Layout */}
                <div className="space-y-8 md:space-y-16">
                  {mode === 'destination' ? (
                    DESTINATIONS.map((dest, index) => (
                      <motion.div
                        key={dest.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative ${index % 2 === 0 ? 'md:pr-[20%]' : 'md:pl-[20%]'}`}
                      >
                        <Link href={`/countries/${dest.country.toLowerCase().replace(/\s+/g, '-')}`} className="block group">
                          <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-all duration-500">
                            <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
                              <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
                              <div className="absolute top-6 right-6 flex flex-col gap-3">
                                <div className="bg-deepBlue/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                  <Clock size={14} className="text-gold" />
                                  <span className="text-white text-sm font-light">{liveTimes[dest.id] || '--:--'}</span>
                                </div>
                                <div className="bg-deepBlue/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                  <ThermometerSun size={14} className="text-gold" />
                                  <span className="text-white text-sm font-light">
                                    {liveTemps[dest.id] !== undefined ? `${liveTemps[dest.id]}°C` : `${dest.temp}°C`}
                                  </span>
                                </div>
                              </div>
                              <div className="absolute top-6 left-6">
                                <PulsingMarker active={true} delay={index * 0.3} />
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                              <div className="flex items-center gap-2 text-gold mb-4">
                                <MapPin size={16} />
                                <span className="text-sm uppercase tracking-[0.2em]">{dest.country}</span>
                              </div>
                              <h3 className="font-serif text-4xl md:text-7xl text-white mb-4 group-hover:text-gold transition-colors">{dest.name}</h3>
                              <p className="text-slate-300 text-lg font-light max-w-xl border-l-2 border-gold pl-6 mb-6">{dest.description}</p>
                              <div className="flex items-center gap-4">
                                <span className="text-gold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                                  Explore <ArrowRight size={16} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    CATEGORIES.map((cat, index) => (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative ${index % 2 === 0 ? 'md:pr-[20%]' : 'md:pl-[20%]'}`}
                      >
                        <Link href={`/styles/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="block group">
                          <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-all duration-500">
                            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/30 to-transparent" />
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                                <h3 className="font-serif text-4xl md:text-7xl text-white mb-6 group-hover:text-gold transition-colors">{cat.name}</h3>
                                <div className="w-24 h-0.5 bg-gold mx-auto mb-6 group-hover:w-48 transition-all duration-500" />
                                <div className="flex items-center justify-center gap-2 text-gold">
                                  <Sparkles size={16} />
                                  <span className="text-lg uppercase tracking-[0.2em]">{cat.count} Properties</span>
                                </div>
                                <div className="mt-8 flex items-center justify-center gap-2 text-gold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span>View Collection</span>
                                  <ArrowRight size={16} />
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}

                  {/* Show More Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Link href={mode === 'destination' ? '/countries' : '/styles'} className="block group">
                      <div className="relative h-[40vh] overflow-hidden rounded-sm border border-dashed border-white/20 hover:border-gold/50 transition-all duration-500 bg-gradient-to-br from-midnight to-deepBlue flex items-center justify-center">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="text-center z-10">
                          <div className="w-20 h-20 rounded-full border-2 border-gold/30 group-hover:border-gold flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110">
                            <Plus size={32} className="text-gold" />
                          </div>
                          <h4 className="font-serif text-3xl text-white mb-4 group-hover:text-gold transition-colors">
                            {mode === 'destination' ? 'Explore All Destinations' : 'View All Styles'}
                          </h4>
                          <p className="text-slate-400 mb-6">
                            {mode === 'destination' ? 'Discover more extraordinary places' : 'Find your perfect accommodation style'}
                          </p>
                          <span className="inline-flex items-center gap-2 text-gold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            Show More <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceSelector;
