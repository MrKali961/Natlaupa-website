import React, { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThermometerSun, ArrowRight, Plus, Clock, Moon, Building2 } from 'lucide-react';
import { DESTINATIONS, CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ExperienceMode = 'destination' | 'category' | null;

interface ExperienceSelectorProps {
  onSelection?: () => void;
}

const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({ onSelection }) => {
  const [mode, setMode] = useState<ExperienceMode>(null);
  const [hoveredChoice, setHoveredChoice] = useState<ExperienceMode>(null);
  
  // State for the blackout curtain transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  
  // State for live temperatures
  const [liveTemps, setLiveTemps] = useState<Record<string, number>>({});

  const handleSelectionClick = (selected: ExperienceMode) => {
    // Start transition
    setIsTransitioning(true);

    // Wait for blackout to cover screen before switching content
    setTimeout(() => {
        setMode(selected);
        if (onSelection) onSelection();
        
        // Remove blackout to reveal new content
        setTimeout(() => {
            setIsTransitioning(false);
        }, 800);
    }, 1000);
  };

  // Fetch Live Weather when mode changes to 'destination'
  useEffect(() => {
    if (mode === 'destination') {
      const fetchWeather = async () => {
        const promises = DESTINATIONS.map(async (dest) => {
          if (!dest.lat || !dest.lng) return { id: dest.id, temp: null };
          
          try {
            // Using Open-Meteo API (Free, no key required)
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lng}&current_weather=true`
            );
            const data = await response.json();
            return { 
              id: dest.id, 
              temp: data.current_weather ? Math.round(data.current_weather.temperature) : null 
            };
          } catch (error) {
            console.error(`Failed to fetch weather for ${dest.name}`, error);
            return { id: dest.id, temp: null };
          }
        });

        const results = await Promise.all(promises);
        const newTemps: Record<string, number> = {};
        results.forEach(res => {
          if (res.temp !== null) {
            newTemps[res.id] = res.temp;
          }
        });
        setLiveTemps(newTemps);
      };

      fetchWeather();
    }
  }, [mode]);

  // GSAP Parallax Deck Animation
  useLayoutEffect(() => {
    if (!mode || !deckRef.current) return;

    // Wait for DOM
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.deck-card') as HTMLElement[];
      
      // We want to pin the deck-container
      // And animate the cards inside it based on scroll
      
      ScrollTrigger.create({
        trigger: deckRef.current,
        start: "top top",
        end: `+=${cards.length * 100}vh`, // Scroll distance proportional to number of cards
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
            // Manual parallax math for smoother feel than timeline sometimes
            const progress = self.progress * (cards.length - 1); // 0 to n-1
            
            cards.forEach((card, i) => {
                // For each card, determine its state based on total progress
                
                // if progress is 0, card 0 is visible.
                // if progress is 0.5, card 0 is fading out/moving up, card 1 is scaling up.
                // if progress is 1, card 0 is gone, card 1 is fully visible.
                
                const relativeProgress = progress - i; 

                if (relativeProgress >= 0 && relativeProgress < 1) {
                    // Current Card (Leaving)
                    // Move up and Fade out
                    gsap.set(card, {
                        yPercent: -100 * relativeProgress,
                        opacity: 1 - relativeProgress,
                        scale: 1,
                        zIndex: 10
                    });
                } else if (relativeProgress < 0 && relativeProgress > -1) {
                    // Next Card (Entering from background)
                    // Scale up from 0.8 to 1, Opacity 0 to 1
                    const enterProgress = 1 + relativeProgress; // 0 to 1
                    gsap.set(card, {
                        yPercent: 0,
                        opacity: enterProgress,
                        scale: 0.8 + (0.2 * enterProgress),
                        zIndex: 5
                    });
                } else if (relativeProgress >= 1) {
                    // Already passed
                     gsap.set(card, { yPercent: -100, opacity: 0 });
                } else {
                    // Waiting in queue
                     gsap.set(card, { opacity: 0, scale: 0.8, yPercent: 0 });
                }
            });
        }
      });

    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [mode]);

  // Golden Hour Mock Data
  const goldenHourData = useMemo(() => {
    if (mode === 'destination') {
       return {
          location: 'Santorini, Greece',
          time: '19:42',
          status: 'The sun has just set.',
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2940&auto=format&fit=crop' // Sunset Santorini
       }
    } else {
        return {
          location: 'Milan, Italy',
          time: '20:15',
          status: 'The city is waking up.',
          image: 'https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?q=80&w=2940&auto=format&fit=crop' // Dark elegant interior/city
        }
    }
  }, [mode]);

  return (
    <div ref={containerRef} className="bg-deepBlue relative z-20 overflow-hidden">
      
      {/* Blackout Curtain for Smooth Transition */}
      <AnimatePresence>
        {isTransitioning && (
            <motion.div 
                key="blackout-curtain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="fixed inset-0 bg-black z-[100] pointer-events-none"
            />
        )}
      </AnimatePresence>

      {/* SELECTION SCREEN: THE MINIMALIST MANIFESTO */}
      {!mode && (
        <section 
            id="experience-selector" 
            className="h-[100dvh] w-full relative flex flex-col md:flex-row items-center justify-center bg-black overflow-hidden"
        >
           {/* Background Layer: DESTINATIONS (WHERE) */}
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

           {/* Background Layer: STYLES (HOW) */}
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

           {/* Content Layer */}
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-40 lg:gap-60">
              
              {/* CHOICE 1: WHERE */}
              <div 
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredChoice('destination')}
                onMouseLeave={() => setHoveredChoice(null)}
                onClick={() => handleSelectionClick('destination')}
              >
                  <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    animate={{ 
                        opacity: hoveredChoice && hoveredChoice !== 'destination' ? 0.2 : 1,
                        scale: hoveredChoice === 'destination' ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className="font-serif text-6xl md:text-8xl lg:text-9xl text-white font-bold tracking-tight"
                  >
                    WHERE
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
                  >
                    Destinations
                  </motion.p>
              </div>

              {/* DIVIDER (Visual Only) */}
              <div className="hidden md:block w-[1px] h-32 bg-white/10" />

              {/* CHOICE 2: HOW */}
              <div 
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredChoice('category')}
                onMouseLeave={() => setHoveredChoice(null)}
                onClick={() => handleSelectionClick('category')}
              >
                  <motion.h2 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    animate={{ 
                        opacity: hoveredChoice && hoveredChoice !== 'category' ? 0.2 : 1,
                        scale: hoveredChoice === 'category' ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className="font-serif text-6xl md:text-8xl lg:text-9xl text-white font-bold tracking-tight"
                  >
                    HOW
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
                  >
                    Styles
                  </motion.p>
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

        </section>
      )}

      {/* EXTENSION 1: THE GOLDEN HOUR PREVIEW */}
      {mode && (
        <section className="h-[100dvh] w-full relative overflow-hidden flex items-center justify-center">
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
           
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 2.5, duration: 1 }}
             className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs uppercase tracking-widest"
           >
              <span className="mb-2">Scroll to Explore</span>
              <div className="w-[1px] h-12 bg-white/30" />
           </motion.div>
        </section>
      )}

      {/* EXTENSION 2: THE PARALLAX DECK (Vertical Stack) */}
      {mode && (
        <section ref={deckRef} className="h-[100dvh] w-full overflow-hidden bg-black relative">
          
          {/* Deck Container */}
          <div className="w-full h-full flex items-center justify-center relative perspective-[1000px]">
             
             {/* Items Logic */}
             {(mode === 'destination' ? DESTINATIONS : CATEGORIES).map((item: any, index) => (
                <div 
                   key={item.id} 
                   className="deck-card absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 md:p-12 will-change-transform"
                   style={{ zIndex: 1 }} // Initial zIndex, GSAP overrides
                >
                   {/* Card Content Wrapper */}
                   <div className="w-full max-w-5xl h-[85vh] md:h-[80vh] relative rounded-lg overflow-hidden shadow-2xl bg-midnight border border-white/10">
                      
                      {/* Background Image */}
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale-[50%]" 
                      />
                      
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                         
                         {/* Top Tag */}
                         <div className="absolute top-8 right-8 flex items-center bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            {mode === 'destination' ? (
                                <>
                                    <ThermometerSun size={16} className="text-gold mr-2" />
                                    <span className="text-white text-sm">{liveTemps[item.id] ?? item.temp}°C</span>
                                </>
                            ) : (
                                <>
                                    <Building2 size={16} className="text-gold mr-2" />
                                    <span className="text-white text-sm">{item.count} Properties</span>
                                </>
                            )}
                         </div>

                         {/* Main Text */}
                         <div className="max-w-2xl">
                             <p className="text-gold text-sm md:text-base uppercase tracking-[0.3em] mb-4">
                                {mode === 'destination' ? item.country : 'Curated Collection'}
                             </p>
                             <h2 className="text-5xl md:text-8xl font-serif text-white mb-6 md:mb-8 leading-none">
                                {item.name}
                             </h2>
                             <div className="w-24 h-1 bg-gold mb-8" />
                             <p className="text-slate-200 text-lg md:text-xl font-light leading-relaxed mb-8 md:mb-12 line-clamp-3 md:line-clamp-none">
                                {mode === 'destination' ? item.description : `Experience the epitome of ${item.name.toLowerCase()} design. Selected for those who seek immersion.`}
                             </p>
                             
                             <Link 
                               to={mode === 'destination' ? `/destination/${item.id}` : `/style/${item.id}`}
                               className="inline-flex items-center px-8 py-4 border border-white text-white uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
                             >
                                Explore {item.name}
                             </Link>
                         </div>
                      </div>

                   </div>
                </div>
             ))}

             {/* THE FINAL "SHOW MORE" CARD */}
             <div 
               className="deck-card absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 md:p-12 will-change-transform"
               style={{ zIndex: 0 }}
             >
                <Link 
                    to={mode === 'destination' ? '/destinations' : '/styles'}
                    className="w-full max-w-5xl h-[85vh] md:h-[80vh] relative rounded-lg overflow-hidden shadow-2xl bg-midnight border border-white/10 flex flex-col items-center justify-center group hover:bg-white/5 transition-colors duration-500"
                >
                    <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center group-hover:scale-110 group-hover:border-gold transition-all duration-500 mb-8">
                        <Plus size={40} className="text-gold" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif text-white text-center mb-6">
                        View All <br/> {mode === 'destination' ? 'Destinations' : 'Styles'}
                    </h2>
                    <p className="text-slate-400 text-lg font-light tracking-wide flex items-center group-hover:text-white transition-colors">
                        Browse Full Collection <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </p>
                </Link>
             </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default ExperienceSelector;