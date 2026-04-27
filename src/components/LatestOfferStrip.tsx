'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useOffers } from '@/hooks/useOffers';

export default function LatestOfferStrip() {
  const { offers, isLoading } = useOffers({ limit: 1 });
  const offer = offers[0];

  if (isLoading || !offer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
      className="absolute top-[133px] left-0 right-0 z-20"
    >
      <Link
        href={`/offer/${offer.slug || offer.id}`}
        className="group flex items-center gap-3 md:gap-5 px-5 md:px-8 h-10 bg-black/50 backdrop-blur-sm border-y border-white/[0.07] hover:bg-black/65 transition-colors duration-300"
      >
        <span className="text-gold text-[10px] flex-shrink-0">✦</span>

        <span className="hidden sm:block font-sans text-[9px] tracking-[0.22em] uppercase text-gold flex-shrink-0">
          Latest Offer
        </span>

        <span className="hidden sm:block w-px h-3 bg-white/15 flex-shrink-0" />

        <span className="font-serif italic text-white/75 text-sm truncate min-w-0 flex-1">
          {offer.title}
        </span>

        <span className="hidden md:block text-zinc-600 text-xs flex-shrink-0">·</span>
        <span className="hidden md:block font-sans text-zinc-400 text-xs tracking-wide truncate max-w-[220px]">
          {offer.hotel.name}&nbsp;·&nbsp;{offer.hotel.location}
        </span>

        <div className="ml-auto flex-shrink-0 flex items-center gap-2 text-gold group-hover:text-white transition-colors duration-300">
          <span className="hidden sm:block font-sans text-[9px] tracking-[0.18em] uppercase">
            View Offer
          </span>
          <span className="text-sm leading-none">→</span>
        </div>
      </Link>
    </motion.div>
  );
}
