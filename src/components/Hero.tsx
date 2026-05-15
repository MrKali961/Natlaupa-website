'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LatestOfferStrip from '@/components/LatestOfferStrip';

interface GalleryHotel {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  imageUrl: string;
}

const Hero: React.FC = () => {
  const [latestHotels, setLatestHotels] = useState<GalleryHotel[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hotels/latest')
      .then(r => r.json())
      .then(data => {
        const raw = data.data?.items || data.data?.hotels || data.data || [];
        const items = Array.isArray(raw) ? raw : [];
        setLatestHotels(
          items.slice(0, 3).map((h: Record<string, unknown>) => ({
            id: h.id as string,
            name: h.name as string,
            slug: h.slug as string,
            city: (h.city as string) || '',
            country: (h.country as string) || ((h.destination as { country?: string })?.country) || '',
            imageUrl:
              (h.thumbnailImage as string) ||
              ((h.images as { url: string }[])?.[0]?.url) ||
              'https://picsum.photos/300/400',
          }))
        );
      })
      .catch(() => {})
      .finally(() => setIsGalleryLoading(false));
  }, []);

  const handleScrollDown = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo('#experience-selector', { duration: 1.5 });
    } else {
      document.getElementById('experience-selector')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const showGallery = isGalleryLoading || latestHotels.length > 0;

  return (
    <section className="relative w-full overflow-hidden bg-deepBlue" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop"
          alt="Luxury Landscape"
          className="w-full h-full object-cover grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 md:px-0">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white mb-6 tracking-tight leading-tight"
        >
          You travel, We handle everything
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-sm md:text-lg text-zinc-300 max-w-xs md:max-w-2xl font-light tracking-wide mb-10 md:mb-12 leading-relaxed"
        >
          Exclusive hotel rates, privileged upgrades, curated amenities.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xs md:text-sm text-zinc-400 max-w-xs md:max-w-2xl font-light tracking-widest mb-10 md:mb-12 uppercase"
        >
          24/7 Concierge Support
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.6 }}
          onClick={handleScrollDown}
          className="px-8 py-3 md:px-10 md:py-4 bg-white text-zinc-900 rounded-full font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-black transition-all duration-300 shadow-2xl shadow-black/20"
        >
          Explore Offers
        </motion.button>
      </div>

      {/* Latest Hotels Gallery */}
      {showGallery && (
        <div className="absolute bottom-16 md:bottom-20 left-0 right-0 z-10 flex justify-center gap-2 md:gap-3 px-4 pointer-events-none">
          {isGalleryLoading
            ? [0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-[110px] md:w-[150px] h-[150px] md:h-[200px] bg-white/5 animate-pulse flex-shrink-0"
                />
              ))
            : latestHotels.map((hotel, i) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ scale: 1.03 }}
                  className="relative w-[110px] md:w-[150px] h-[150px] md:h-[200px] overflow-hidden flex-shrink-0 border border-transparent hover:border-gold/50 transition-colors duration-300 pointer-events-auto"
                >
                  <Link href={`/hotel/${hotel.slug}`} className="block w-full h-full">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/300/400';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                      <div className="text-white text-[10px] md:text-xs font-semibold tracking-wide truncate">
                        {hotel.name}
                      </div>
                      <div className="text-white/50 text-[9px] md:text-[10px] mt-0.5 truncate">
                        {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      )}

      <LatestOfferStrip />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex justify-center text-white/30 z-30"
      >
        <ChevronDown size={28} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

export default Hero;
