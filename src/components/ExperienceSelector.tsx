"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Building2,
  ThermometerSun,
  ArrowRight,
  Clock,
  MapPin,
  Plus,
  Sparkles,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// Interface for Destination
interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  imageUrl: string;
  temp: number;
  lat: number;
  lng: number;
  description: string;
}

type ExperienceMode = "destination" | "category" | null;

interface ExperienceSelectorProps {
  onSelection?: () => void;
}

// Pulsing Marker Component
const PulsingMarker: React.FC<{ active?: boolean; delay?: number }> = ({
  active = false,
  delay = 0,
}) => (
  <div className="relative">
    <motion.div
      className={`w-4 h-4 rounded-full ${active ? "bg-gold" : "bg-gold/50"}`}
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

// Location info interface
interface LocationInfo {
  location: string;
  city: string;
  country: string;
  time: string;
  hour: number;
  sunMoonStatus: string;
  imageUrl: string;
  timezone: string;
  isDefault?: boolean;
}

// Array of beautiful travel destinations for random selection
const RANDOM_LOCATIONS = [
  {
    city: "Santorini",
    country: "Greece",
    timezone: "Europe/Athens",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Kyoto",
    country: "Japan",
    timezone: "Asia/Tokyo",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Amalfi Coast",
    country: "Italy",
    timezone: "Europe/Rome",
    imageUrl: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Maldives",
    country: "Maldives",
    timezone: "Indian/Maldives",
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Bora Bora",
    country: "French Polynesia",
    timezone: "Pacific/Tahiti",
    imageUrl: "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Swiss Alps",
    country: "Switzerland",
    timezone: "Europe/Zurich",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Marrakech",
    country: "Morocco",
    timezone: "Africa/Casablanca",
    imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Bali",
    country: "Indonesia",
    timezone: "Asia/Makassar",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Paris",
    country: "France",
    timezone: "Europe/Paris",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2940&auto=format&fit=crop",
  },
  {
    city: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2940&auto=format&fit=crop",
  },
];

// Helper function to get sun/moon status based on hour
const getSunMoonStatus = (hour: number): string => {
  if (hour >= 5 && hour < 7) return "Golden hour begins...";
  if (hour >= 7 && hour < 12) return "Morning light bathes the city";
  if (hour >= 12 && hour < 17) return "The sun shines bright";
  if (hour >= 17 && hour < 19) return "Golden hour magic";
  if (hour >= 19 && hour < 21) return "Twilight descends";
  if (hour >= 21 || hour < 5) return "Stars illuminate the night";
  return "A beautiful moment";
};

// Helper function to get random location with current time
const getRandomLocation = (): LocationInfo => {
  const randomIndex = Math.floor(Math.random() * RANDOM_LOCATIONS.length);
  const location = RANDOM_LOCATIONS[randomIndex];

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    timeZone: location.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const hour = parseInt(
    now.toLocaleTimeString("en-US", {
      timeZone: location.timezone,
      hour: "2-digit",
      hour12: false,
    })
  );

  return {
    location: `${location.city}, ${location.country}`,
    city: location.city,
    country: location.country,
    time: timeString,
    hour: hour,
    sunMoonStatus: getSunMoonStatus(hour),
    imageUrl: location.imageUrl,
    timezone: location.timezone,
    isDefault: false,
  };
};

const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({
  onSelection,
}) => {
  const [mode, setMode] = useState<ExperienceMode>(null);
  const [hoveredChoice, setHoveredChoice] = useState<ExperienceMode>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [liveTemps, setLiveTemps] = useState<Record<string, number>>({});
  const [liveTimes, setLiveTimes] = useState<Record<string, string>>({});
  const [activeDestination, setActiveDestination] = useState<string | null>(
    null
  );
  const [clickedButton, setClickedButton] = useState<ExperienceMode>(null);
  const [showToast, setShowToast] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Location state for displaying random beautiful location
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch featured destinations (countries) and styles directly from API
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; imageUrl: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        // Fetch destinations and styles in parallel
        const [destinationsRes, stylesRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/styles')
        ]);

        const destinationsData = await destinationsRes.json();
        const stylesData = await stylesRes.json();

        // Process featured destinations (top 4 by hotel count)
        if (destinationsRes.ok && destinationsData.data?.items) {
          const destinations = destinationsData.data.items as Array<{ id: string; name: string; slug: string; imageUrl?: string; hotelCount: number; isActive: boolean }>;
          // Filter active destinations, sort by hotel count, take top 4
          const featuredDestinations = destinations
            .filter(d => d.isActive && d.hotelCount > 0)
            .sort((a, b) => b.hotelCount - a.hotelCount)
            .slice(0, 4)
            .map(d => ({
              id: d.id,
              name: d.name,
              slug: d.slug,
              country: d.name, // Use destination name as country for consistency
              imageUrl: d.imageUrl || 'https://picsum.photos/600/400',
              temp: 20,
              lat: 0,
              lng: 0,
              description: `Discover ${d.hotelCount} luxury ${d.hotelCount === 1 ? 'property' : 'properties'} in ${d.name}`,
            }));
          setDestinations(featuredDestinations);
        }

        // Process featured styles (top 4 by hotel count)
        if (stylesRes.ok && stylesData.data?.items) {
          const styles = stylesData.data.items as Array<{ id: string; name: string; imageUrl?: string; hotelCount: number; isActive: boolean }>;
          // Filter active styles, sort by hotel count, take top 4
          const featuredStyles = styles
            .filter(s => s.isActive)
            .sort((a, b) => b.hotelCount - a.hotelCount)
            .slice(0, 4)
            .map(s => ({
              id: s.id,
              name: s.name,
              imageUrl: s.imageUrl || 'https://picsum.photos/600/400',
              count: s.hotelCount,
            }));
          setCategories(featuredStyles);
        }
      } catch (error) {
        console.error('Error fetching featured data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  const DESTINATIONS = destinations;
  const CATEGORIES = categories;

  // Detect touch devices to prevent double-tap requirement on iOS
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleSelectionClick = (selected: ExperienceMode) => {
    // Immediate visual feedback - pulse effect
    setClickedButton(selected);

    // Very short delay before transition starts (snappy response)
    setTimeout(() => {
      setIsTransitioning(true);
      setShowToast(true);

      // Auto-dismiss toast after 2 seconds
      setTimeout(() => setShowToast(false), 2000);

      // Set pending mode to trigger location fetch
      // The actual mode will be set after location is loaded
      setPendingMode(selected);
      if (onSelection) onSelection();

      setTimeout(() => {
        setClickedButton(null);
      }, 400);
    }, 150); // Reduced from 300ms to 150ms
  };

  // Track pending mode selection (before location is loaded)
  const [pendingMode, setPendingMode] = useState<ExperienceMode>(null);

  // Set random location when user selects experience
  useEffect(() => {
    if (!pendingMode) return;

    // Immediately set a random beautiful location - no geolocation needed!
    const randomLocation = getRandomLocation();
    setUserLocation(randomLocation);

    // Quick transition (just for visual effect)
    setTimeout(() => {
      setMode(pendingMode);
      setIsTransitioning(false);
      setLocationLoading(false);
    }, 400);

    // Update time every minute to keep it current
    const interval = setInterval(() => {
      setUserLocation(prev => {
        if (!prev) return null;
        const now = new Date();
        const newTime = now.toLocaleTimeString("en-US", {
          timeZone: prev.timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const newHour = parseInt(
          now.toLocaleTimeString("en-US", {
            timeZone: prev.timezone,
            hour: "2-digit",
            hour12: false,
          })
        );
        return {
          ...prev,
          time: newTime,
          hour: newHour,
          sunMoonStatus: getSunMoonStatus(newHour),
        };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [pendingMode]);

  // Fallback data if location isn't loaded yet
  const goldenHourData = useMemo(() => {
    if (userLocation) {
      return {
        location: userLocation.location,
        time: userLocation.time,
        status: userLocation.sunMoonStatus,
        image: userLocation.imageUrl,
      };
    }
    // Default fallback while loading
    const now = new Date();
    return {
      location: "Your Location",
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      status: "Discovering your world...",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2940&auto=format&fit=crop",
    };
  }, [userLocation]);

  // Fetch Live Weather
  useEffect(() => {
    if (mode === "destination" && DESTINATIONS.length > 0) {
      const fetchWeather = async () => {
        const promises = DESTINATIONS.map(async (dest: Destination) => {
          if (!dest.lat || !dest.lng) return { id: dest.id, temp: null };
          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lng}&current_weather=true`
            );
            const data = await response.json();
            return {
              id: dest.id,
              temp: data.current_weather
                ? Math.round(data.current_weather.temperature)
                : null,
            };
          } catch {
            return { id: dest.id, temp: null };
          }
        });
        const results = await Promise.all(promises);
        const newTemps: Record<string, number> = {};
        results.forEach((res) => {
          if (res.temp !== null) newTemps[res.id] = res.temp;
        });
        setLiveTemps(newTemps);
      };
      fetchWeather();
    }
  }, [mode, DESTINATIONS]);

  // Update Live Times
  useEffect(() => {
    if (mode !== "destination" || DESTINATIONS.length === 0) return;
    const updateTimes = () => {
      const times: Record<string, string> = {};
      DESTINATIONS.forEach((dest: Destination) => {
        const timeZones: Record<string, string> = {
          Japan: "Asia/Tokyo",
          Greece: "Europe/Athens",
          USA: "America/New_York",
          Iceland: "Atlantic/Reykjavik",
        };
        const tz = timeZones[dest.country] || "UTC";
        times[dest.id] = new Date().toLocaleTimeString("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      });
      setLiveTimes(times);
    };
    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, [mode, DESTINATIONS]);

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="bg-deepBlue min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <span className="text-gold text-sm uppercase tracking-[0.3em]">
            Loading experiences...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-deepBlue relative z-20 overflow-hidden"
    >
      {/* Blackout Curtain for Smooth Transition with Loading Indicator */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="blackout-curtain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-deepBlue z-[100] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 z-[110] bg-deepBlue/95 backdrop-blur-md border border-gold/30 px-6 py-4 rounded-sm shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-white text-sm">
                You selected{" "}
                <span className="text-gold font-semibold">
                  {clickedButton === "destination" ? "Destination" : "Mood"}
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
          className="w-full relative bg-black overflow-hidden"
          style={{ height: "calc(var(--vh, 1vh) * 100)" }}
        >
          {/* ═══════════════════════════════════════════════════════════════
              MOBILE/TABLET PORTRAIT LAYOUT - Minimal Centered Design (< 768px)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="md:hidden absolute inset-0 flex flex-col px-6 pt-24 pb-16">
            {/* Background Images - appear on hover/tap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredChoice === "destination" || clickedButton === "destination" ? 0.4 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none z-0"
            >
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop"
                alt="Nature Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredChoice === "category" || clickedButton === "category" ? 0.4 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none z-0"
            >
              <img
                src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=3456&auto=format&fit=crop"
                alt="Interior Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
            </motion.div>

            {/* Default gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95 -z-10" />

            {/* Header - Fixed at top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 text-center"
            >
              <h2 className="text-gold text-[11px] font-medium uppercase tracking-[0.35em] mb-3">
                Pick Your Experience
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-8 h-[1px] bg-gold/40 mx-auto"
              />
            </motion.div>

            {/* Main Content - Fills remaining space */}
            <div className="relative z-10 flex-1 flex flex-col w-full max-w-xs mx-auto">

              {/* DESTINATION Section - Top Half */}
              <div className="flex-1 flex items-center justify-center">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredChoice === "category" ? 0.3 : 1,
                    y: 0,
                    scale: hoveredChoice === "destination" ? 1.05 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => !isTouchDevice && setHoveredChoice("destination")}
                  onMouseLeave={() => !isTouchDevice && setHoveredChoice(null)}
                  onTouchStart={() => setHoveredChoice("destination")}
                  onTouchEnd={() => setTimeout(() => setHoveredChoice(null), 150)}
                  onClick={() => handleSelectionClick("destination")}
                  className="group relative w-full text-center py-4 focus:outline-none cursor-pointer"
                >
                  {/* Hover/Active underline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredChoice === "destination" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gold origin-center"
                  />
                  {/* Glow effect on tap */}
                  <AnimatePresence>
                    {clickedButton === "destination" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/15 to-transparent rounded-sm"
                      />
                    )}
                  </AnimatePresence>

                  {/* "Pick your" label */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredChoice === "destination" ? 1 : 0.6
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-gold text-[10px] uppercase tracking-[0.4em] mb-2 block"
                  >
                    pick your
                  </motion.span>
                  <motion.span
                    className="font-serif text-[2.5rem] sm:text-[2.75rem] leading-none text-white font-medium tracking-tight block"
                    animate={{
                      color: hoveredChoice === "destination" || clickedButton === "destination" ? "#D4AF37" : "#ffffff",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Destination
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: hoveredChoice === "destination" ? 0.8 : 0.4,
                      y: 0
                    }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="text-white/40 text-[10px] uppercase tracking-[0.4em] mt-3 block"
                  >
                    where to go
                  </motion.span>
                </motion.button>
              </div>

              {/* Center Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />

              {/* MOOD Section - Bottom Half */}
              <div className="flex-1 flex items-center justify-center">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredChoice === "destination" ? 0.3 : 1,
                    y: 0,
                    scale: hoveredChoice === "category" ? 1.05 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => !isTouchDevice && setHoveredChoice("category")}
                  onMouseLeave={() => !isTouchDevice && setHoveredChoice(null)}
                  onTouchStart={() => setHoveredChoice("category")}
                  onTouchEnd={() => setTimeout(() => setHoveredChoice(null), 150)}
                  onClick={() => handleSelectionClick("category")}
                  className="group relative w-full text-center py-4 focus:outline-none cursor-pointer"
                >
                  {/* Hover/Active underline */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredChoice === "category" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gold origin-center"
                  />
                  {/* Glow effect on tap */}
                  <AnimatePresence>
                    {clickedButton === "category" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/15 to-transparent rounded-sm"
                      />
                    )}
                  </AnimatePresence>

                  {/* "Pick your" label */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredChoice === "category" ? 1 : 0.6
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-gold text-[10px] uppercase tracking-[0.4em] mb-2 block"
                  >
                    pick your
                  </motion.span>
                  <motion.span
                    className="font-serif text-[2.5rem] sm:text-[2.75rem] leading-none text-white font-medium tracking-tight block"
                    animate={{
                      color: hoveredChoice === "category" || clickedButton === "category" ? "#D4AF37" : "#ffffff",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Mood
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: hoveredChoice === "category" ? 0.8 : 0.4,
                      y: 0
                    }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="text-white/40 text-[10px] uppercase tracking-[0.4em] mt-3 block"
                  >
                    how to feel
                  </motion.span>
                </motion.button>
              </div>
            </div>

            {/* Footer Text - Fixed at bottom */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="relative z-10 text-white/25 text-[9px] uppercase tracking-[0.5em] text-center"
            >
              Define Your Journey
            </motion.p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              DESKTOP/TABLET LANDSCAPE LAYOUT (>= 768px)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="hidden md:flex flex-row items-center justify-center absolute inset-0">
            {/* Background Layer: DESTINATION (WHERE) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredChoice === "destination" ? 0.6 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 pointer-events-none z-0"
            >
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop"
                alt="Nature Background"
                className="w-full h-full object-cover grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </motion.div>

            {/* Background Layer: STYLE (HOW) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredChoice === "category" ? 0.6 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 pointer-events-none z-0"
            >
              <img
                src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=3456&auto=format&fit=crop"
                alt="Interior Background"
                className="w-full h-full object-cover grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
            </motion.div>

            {/* Hint Text - Top Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute top-28 md:top-32 lg:top-36 left-0 right-0 flex flex-col items-center justify-center text-center z-20 px-4"
            >
              <h2 className="text-gold text-base md:text-lg lg:text-xl font-semibold uppercase tracking-[0.3em] mb-3 drop-shadow-lg">
                Pick Your Experience
              </h2>
              <p className="text-white/60 text-sm md:text-base tracking-wide max-w-md drop-shadow-md">
                Choose how you&apos;d like to explore our collection
              </p>
            </motion.div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-row w-full h-full px-4">
              {/* CHOICE 1: DESTINATION */}
              <div className="flex-1 flex justify-center items-center">
                <motion.div
                  className="group relative cursor-pointer flex flex-col items-center w-full max-w-lg"
                  onMouseEnter={() => !isTouchDevice && setHoveredChoice("destination")}
                  onMouseLeave={() => !isTouchDevice && setHoveredChoice(null)}
                  onClick={() => handleSelectionClick("destination")}
                  animate={clickedButton === "destination" ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {/* "Pick your" text indicator */}
                  <motion.div
                    className="absolute -top-10 md:-top-12 lg:-top-14 flex flex-col items-center w-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em]">pick your</span>
                  </motion.div>

                  <AnimatePresence>
                    {clickedButton === "destination" && (
                      <motion.div
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 border-2 border-gold rounded-sm pointer-events-none"
                        style={{ boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    animate={{
                      opacity: hoveredChoice && hoveredChoice !== "destination" ? 0.2 : 1,
                      scale: hoveredChoice === "destination" ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className="font-serif text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight text-center"
                  >
                    DESTINATION
                  </motion.h2>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hoveredChoice === "destination" ? "100%" : "0%" }}
                    className="h-1 bg-gold mt-4"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredChoice === "destination" ? 1 : 0,
                      y: hoveredChoice === "destination" ? 0 : 10,
                    }}
                    className="absolute -bottom-12 left-0 w-full text-center text-sm text-gold uppercase tracking-[0.3em]"
                  >
                    Where
                  </motion.p>
                </motion.div>
              </div>

              {/* DIVIDER - Desktop only */}
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-32 bg-white/20" />

              {/* CHOICE 2: MOOD */}
              <div className="flex-1 flex justify-center items-center">
                <motion.div
                  className="group relative cursor-pointer flex flex-col items-center w-full max-w-lg"
                  onMouseEnter={() => !isTouchDevice && setHoveredChoice("category")}
                  onMouseLeave={() => !isTouchDevice && setHoveredChoice(null)}
                  onClick={() => handleSelectionClick("category")}
                  animate={clickedButton === "category" ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {/* "Pick your" text indicator */}
                  <motion.div
                    className="absolute -top-10 md:-top-12 lg:-top-14 flex flex-col items-center w-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em]">pick your</span>
                  </motion.div>

                  <AnimatePresence>
                    {clickedButton === "category" && (
                      <motion.div
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 border-2 border-gold rounded-sm pointer-events-none"
                        style={{ boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.h2
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    animate={{
                      opacity: hoveredChoice && hoveredChoice !== "category" ? 0.2 : 1,
                      scale: hoveredChoice === "category" ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className="font-serif text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight text-center"
                  >
                    MOOD
                  </motion.h2>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hoveredChoice === "category" ? "100%" : "0%" }}
                    className="h-1 bg-gold mt-4"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredChoice === "category" ? 1 : 0,
                      y: hoveredChoice === "category" ? 0 : 10,
                    }}
                    className="absolute -bottom-12 left-0 w-full text-center text-sm text-gold uppercase tracking-[0.3em]"
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
            >
              Define Your Journey
            </motion.div>
          </div>
        </section>
      )}

      {/* GOLDEN HOUR PREVIEW */}
      {mode && (
        <section
          className="w-full relative overflow-hidden flex items-center justify-center"
          style={{ height: "calc(var(--vh, 1vh) * 100)" }}
        >
          {/* Background with Slow Zoom */}
          <motion.div
            key={goldenHourData.image}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={goldenHourData.image}
              alt={userLocation?.country || "Your Location"}
              className="w-full h-full object-cover grayscale-[30%] contrast-110"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="flex items-center justify-center space-x-3 text-gold mb-6">
                <Clock size={18} />
                <span className="text-sm uppercase tracking-widest font-bold">
                  Local Time
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-7xl text-white mb-6 leading-tight">
                It is currently {goldenHourData.time} in <br />
                <span className="italic text-gold">
                  {goldenHourData.location.split(",")[0]}
                </span>
                .
              </h2>
              <div className="flex items-center justify-center space-x-3 text-slate-300">
                {userLocation && userLocation.hour >= 6 && userLocation.hour < 19 ? (
                  <Sun size={18} className="text-gold" />
                ) : (
                  <Moon size={18} className="text-gold" />
                )}
                <p className="text-lg font-light tracking-wide">
                  {goldenHourData.status}
                </p>
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
                    {mode === "destination" ? (
                      <Map className="text-gold" size={24} />
                    ) : (
                      <Building2 className="text-gold" size={24} />
                    )}
                    <span className="text-gold text-sm uppercase tracking-[0.3em]">
                      {mode === "destination"
                        ? "The Living Map"
                        : "Curated Collections"}
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
                    {mode === "destination"
                      ? "Discover Your Next Chapter"
                      : "Architecture of Dreams"}
                  </h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    {mode === "destination"
                      ? "Each destination pulses with its own rhythm. Find yours."
                      : "From historic grandeur to modern minimalism, find stays that speak to your soul."}
                  </p>
                </motion.div>

                {/* Mini Map Overview - Destinations only */}
                {mode === "destination" && DESTINATIONS.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative h-32 mb-16 hidden md:block"
                  >
                    <div className="absolute inset-0 flex items-center justify-center gap-8">
                      {DESTINATIONS.map((dest: Destination, idx: number) => (
                        <motion.button
                          key={dest.id}
                          onClick={() =>
                            setActiveDestination(
                              activeDestination === dest.id ? null : dest.id
                            )
                          }
                          className="flex flex-col items-center gap-2 group"
                          whileHover={{ scale: 1.1 }}
                        >
                          <PulsingMarker
                            active={activeDestination === dest.id}
                            delay={idx * 0.2}
                          />
                          <span
                            className={`text-xs uppercase tracking-widest transition-colors ${
                              activeDestination === dest.id
                                ? "text-gold"
                                : "text-slate-500 group-hover:text-white"
                            }`}
                          >
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
                  {mode === "destination"
                    ? DESTINATIONS.map((dest: Destination, index: number) => (
                        <motion.div
                          key={dest.id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative ${
                            index % 2 === 0 ? "md:pr-[20%]" : "md:pl-[20%]"
                          }`}
                        >
                          <Link
                            href={`/destinations/${dest.slug}`}
                            className="block group"
                          >
                            <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-all duration-500">
                              <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
                                <img
                                  src={dest.imageUrl}
                                  alt={dest.name}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
                                <div className="absolute top-6 right-6 flex flex-col gap-3">
                                  <div className="bg-deepBlue/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                    <Clock size={14} className="text-gold" />
                                    <span className="text-white text-sm font-light">
                                      {liveTimes[dest.id] || "--:--"}
                                    </span>
                                  </div>
                                  <div className="bg-deepBlue/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                                    <ThermometerSun
                                      size={14}
                                      className="text-gold"
                                    />
                                    <span className="text-white text-sm font-light">
                                      {liveTemps[dest.id] !== undefined
                                        ? `${liveTemps[dest.id]}°C`
                                        : `${dest.temp}°C`}
                                    </span>
                                  </div>
                                </div>
                                <div className="absolute top-6 left-6">
                                  <PulsingMarker
                                    active={true}
                                    delay={index * 0.3}
                                  />
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="flex items-center gap-2 text-gold mb-4">
                                  <MapPin size={16} />
                                  <span className="text-sm uppercase tracking-[0.2em]">
                                    {dest.country}
                                  </span>
                                </div>
                                <h3 className="font-serif text-4xl md:text-7xl text-white mb-4 group-hover:text-gold transition-colors">
                                  {dest.name}
                                </h3>
                                <p className="text-slate-300 text-lg font-light max-w-xl border-l-2 border-gold pl-6 mb-6 line-clamp-2">
                                  {dest.description && dest.description.length > 120
                                    ? `${dest.description.substring(0, 120)}...`
                                    : dest.description}
                                </p>
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
                    : CATEGORIES.map((cat, index: number) => (
                        <motion.div
                          key={cat.id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative ${
                            index % 2 === 0 ? "md:pr-[20%]" : "md:pl-[20%]"
                          }`}
                        >
                          <Link
                            href={`/styles/${cat.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="block group"
                          >
                            <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-all duration-500">
                              <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.name}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/30 to-transparent" />
                              </div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="relative"
                                >
                                  <h3 className="font-serif text-4xl md:text-7xl text-white mb-6 group-hover:text-gold transition-colors">
                                    {cat.name}
                                  </h3>
                                  <div className="w-24 h-0.5 bg-gold mx-auto mb-6 group-hover:w-48 transition-all duration-500" />
                                  <div className="flex items-center justify-center gap-2 text-gold">
                                    <Sparkles size={16} />
                                    <span className="text-lg uppercase tracking-[0.2em]">
                                      {cat.count} Properties
                                    </span>
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
                      ))}

                  {/* Show More Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Link
                      href={mode === "destination" ? "/destinations" : "/styles"}
                      className="block group"
                    >
                      <div className="relative h-[40vh] overflow-hidden rounded-sm border border-dashed border-white/20 hover:border-gold/50 transition-all duration-500 bg-gradient-to-br from-midnight to-deepBlue flex items-center justify-center">
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="text-center z-10">
                          <div className="w-20 h-20 rounded-full border-2 border-gold/30 group-hover:border-gold flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110">
                            <Plus size={32} className="text-gold" />
                          </div>
                          <h4 className="font-serif text-3xl text-white mb-4 group-hover:text-gold transition-colors">
                            {mode === "destination"
                              ? "Explore All Destinations"
                              : "View All Styles"}
                          </h4>
                          <p className="text-slate-400 mb-6">
                            {mode === "destination"
                              ? "Discover more extraordinary places"
                              : "Find your perfect accommodation style"}
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
