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
    <section
      className="relative w-full overflow-hidden bg-deepBlue flex flex-col"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop"
          alt="Luxury Landscape"
          className="w-full h-full object-cover grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Center content — grows to fill available space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 md:px-0 min-h-0">
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
          className="text-sm md:text-lg text-zinc-300 max-w-xs md:max-w-2xl font-light tracking-wide mb-4 md:mb-6 leading-relaxed"
        >
          Exclusive hotel rates, privileged upgrades, curated amenities.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xs md:text-sm text-zinc-400 max-w-xs md:max-w-2xl font-light tracking-widest mb-6 md:mb-10 uppercase"
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

      {/* Hotel Gallery — grid divides space into exact thirds, no overflow possible */}
      {showGallery && (
        <div className="relative z-10 flex-shrink-0 px-4 pb-12 md:pb-14">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[480px] mx-auto">
            {isGalleryLoading
              ? [0, 1, 2].map(i => (
                  <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse" />
                ))
              : latestHotels.map((hotel, i) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.2, duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ scale: 1.03 }}
                    className="relative aspect-[3/4] overflow-hidden border border-transparent hover:border-gold/50 transition-colors duration-300"
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
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 md:p-2.5">
                        <div className="text-white text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-wide truncate">
                          {hotel.name}
                        </div>
                        <div className="text-white/50 text-[8px] sm:text-[9px] md:text-[10px] mt-0.5 truncate">
                          {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      )}

      {/* Scroll indicator — above the offer strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 text-white/20 z-20 pointer-events-none hidden lg:flex"
      >
        <ChevronDown size={24} strokeWidth={1} />
      </motion.div>

      <LatestOfferStrip />
    </section>
  );
};

export default Hero;
