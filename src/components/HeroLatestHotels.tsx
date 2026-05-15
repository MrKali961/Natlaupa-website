'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GalleryHotel {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  imageUrl: string;
}

const FALLBACK_IMG = 'https://picsum.photos/300/400';

const HeroLatestHotels: React.FC = () => {
  const [latestHotels, setLatestHotels] = useState<GalleryHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hotels/latest')
      .then(r => r.json())
      .then(data => {
        const raw = data.data?.items || data.data?.hotels || data.data || [];
        const items = Array.isArray(raw) ? raw : [];
        setLatestHotels(
          items.slice(0, 6).map((h: Record<string, unknown>) => ({
            id: h.id as string,
            name: h.name as string,
            slug: h.slug as string,
            city: (h.city as string) || '',
            country:
              (h.country as string) ||
              ((h.destination as { country?: string })?.country) ||
              '',
            imageUrl:
              (h.thumbnailImage as string) ||
              ((h.images as { url: string }[])?.[0]?.url) ||
              FALLBACK_IMG,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Build one "group" long enough to exceed any desktop viewport, then
  // render it twice. Animating the track 0 → -50% moves exactly one group,
  // so the loop is perfectly seamless regardless of hotel count.
  const loopHotels = useMemo(() => {
    if (latestHotels.length === 0) return [];
    const group: GalleryHotel[] = [];
    while (group.length < 10) group.push(...latestHotels);
    return group;
  }, [latestHotels]);

  if (!isLoading && latestHotels.length === 0) return null;

  return (
    <motion.section
      aria-label="Latest hotels"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
      className="relative z-20 w-full flex-shrink-0 pb-12"
    >
      {/* Header — hairline + gold label, matched to LatestOfferStrip */}
      <div className="flex items-center gap-3 px-5 md:px-8 mb-3">
        <span className="text-gold text-[10px] leading-none">✦</span>
        <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-gold flex-shrink-0">
          Latest Hotels
        </span>
        <span className="h-px flex-1 bg-white/10" />
        <span className="hidden sm:block text-gold/50 text-[10px] leading-none">✦</span>
      </div>

      {/* Track viewport:
          mobile  → native swipe + scroll-snap (no auto motion)
          desktop → seamless auto-pan marquee, pauses on hover
          reduced-motion → no auto-pan, manual scroll instead */}
      <div
        className="hero-marquee-viewport relative w-full overflow-x-auto snap-x snap-mandatory
                   lg:overflow-hidden lg:snap-none lg:motion-reduce:overflow-x-auto
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="hero-marquee-track flex w-max gap-3 px-5 md:px-8">
          {isLoading
            ? [0, 1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="h-[155px] sm:h-[175px] lg:h-[195px] aspect-[3/4] flex-shrink-0 bg-white/5 animate-pulse"
                />
              ))
            : [...loopHotels, ...loopHotels].map((hotel, i) => (
                <div
                  key={`${hotel.id}-${i}`}
                  aria-hidden={i >= loopHotels.length}
                  className="group/card relative h-[155px] sm:h-[175px] lg:h-[195px] aspect-[3/4]
                             flex-shrink-0 snap-start overflow-hidden border border-white/10
                             hover:border-gold/50 transition-colors duration-300"
                >
                  <Link
                    href={`/hotel/${hotel.slug}`}
                    className="block w-full h-full"
                    tabIndex={i >= loopHotels.length ? -1 : 0}
                  >
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      onError={e => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <div className="text-white text-[10px] font-semibold tracking-wide truncate leading-tight">
                        {hotel.name}
                      </div>
                      <div className="text-white/50 text-[9px] mt-0.5 truncate">
                        {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>

        {/* Edge fades — let the ribbon dissolve into the hero on desktop */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 to-transparent hidden lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/40 to-transparent hidden lg:block" />
      </div>
    </motion.section>
  );
};

export default HeroLatestHotels;
