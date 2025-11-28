import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ValueProps: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      id: "01",
      category: "The Standard",
      title: "Curated Quality",
      desc: "We accept less than 1% of applicants. Every property in our collection is rigorously vetted for architectural significance, design pedigree, and service excellence.",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" // Abstract dark interior
    },
    {
      id: "02",
      category: "The Promise",
      title: "Best Price Guarantee",
      desc: "True luxury is transparent. We negotiate directly with properties to ensure you receive the most competitive rates available, without hidden premiums.",
      img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2000&auto=format&fit=crop" // Minimalist architecture
    },
    {
      id: "03",
      category: "The Service",
      title: "24/7 Concierge",
      desc: "Our global support team acts as your personal attaché. From last-minute reservations to private aviation, we handle the logistics so you can handle the moment.",
      img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2000&auto=format&fit=crop" // Luxury Concierge/Butler
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const sections = gsap.utils.toArray<HTMLElement>('.value-section');
        
        sections.forEach((section) => {
            const img = section.querySelector('.parallax-img');
            const maskTexts = section.querySelectorAll('.mask-reveal');
            const line = section.querySelector('.reveal-line');

            // 1. Parallax Image Effect (Desktop Only primarily, but works on mobile too)
            if (img) {
              gsap.fromTo(img, 
                  { y: '-15%', scale: 1.1 }, 
                  {
                      y: '15%',
                      ease: 'none',
                      scrollTrigger: {
                          trigger: section,
                          start: 'top bottom',
                          end: 'bottom top',
                          scrub: true
                      }
                  }
              );
            }

            // 2. Text Mask Reveal
            if (maskTexts.length > 0) {
              gsap.fromTo(maskTexts,
                  { y: '110%' },
                  {
                      y: '0%',
                      duration: 1.2,
                      stagger: 0.15,
                      ease: 'power4.out',
                      scrollTrigger: {
                          trigger: section,
                          start: 'top 80%', // Trigger earlier on scroll
                          toggleActions: 'play none none reverse'
                      }
                  }
              );
            }

            // 3. Gold Line Expansion
            if (line) {
              gsap.fromTo(line,
                { width: 0 },
                {
                  width: '100px',
                  duration: 1,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                  }
                }
              );
            }
        });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-deepBlue relative z-10 pt-24 pb-0">
      
      {/* Intro Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 text-center">
         <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">The Natlaupa Philosophy</h2>
         <p className="text-slate-400 font-light max-w-2xl mx-auto text-sm md:text-base">
            We believe that where you stay shapes who you become. Our three pillars ensure that your journey is as seamless as it is unforgettable.
         </p>
      </div>

      {/* Cinematic Bands */}
      <div className="flex flex-col">
        {features.map((f, index) => (
          <div key={index} className="value-section group relative flex flex-col md:flex-row min-h-[90vh] md:min-h-0 md:h-[70vh] w-full overflow-hidden border-t border-white/5 last:border-b">
            
            {/* Left: Cinematic Image (Parallax) */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-deepBlue z-10 opacity-20 group-hover:opacity-0 transition-opacity duration-700" />
                <img 
                    src={f.img} 
                    alt={f.title}
                    className="parallax-img w-full h-[140%] object-cover grayscale contrast-125 brightness-75"
                />
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 bg-deepBlue flex flex-col justify-center px-6 py-12 md:px-24 relative z-20">
                
                {/* ID & Category */}
                <div className="overflow-hidden mb-4 md:mb-6 flex items-center space-x-4">
                     <span className="mask-reveal block text-white/20 font-serif text-5xl md:text-8xl leading-none">
                        {f.id}
                     </span>
                     <div className="flex flex-col">
                        <div className="overflow-hidden">
                             <span className="mask-reveal block text-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
                                {f.category}
                            </span>
                        </div>
                     </div>
                </div>

                {/* Title */}
                <div className="overflow-hidden mb-6 md:mb-8">
                    <h3 className="mask-reveal block font-serif text-3xl md:text-6xl text-white leading-tight">
                        {f.title}
                    </h3>
                </div>

                {/* Divider Line */}
                <div className="reveal-line h-0.5 bg-gold mb-6 md:mb-8" />

                {/* Description */}
                <div className="overflow-hidden">
                    <p className="mask-reveal block text-slate-300 text-base md:text-xl font-light leading-relaxed max-w-md">
                        {f.desc}
                    </p>
                </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueProps;