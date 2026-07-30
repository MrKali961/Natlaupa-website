'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HotelSearchResult, HotelSearchStatus } from '@/hooks/useHotelSearch';

type Variant = 'desktop' | 'mobile' | 'hero';

interface HotelSearchDropdownProps {
  results: HotelSearchResult[];
  status: HotelSearchStatus;
  /** Caller-owned — driven by query length, not fetch success (see useHotelSearch). */
  open: boolean;
  onSelect: (slug: string) => void;
  variant: Variant;
}

const containerClasses: Record<Variant, string> = {
  desktop:
    'absolute right-0 top-full mt-1 w-[280px] bg-black/95 backdrop-blur-md border border-white/10 z-[60] overflow-hidden',
  hero: 'absolute left-0 right-0 top-full mt-2 text-left bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden',
  mobile: 'mt-3 flex flex-col gap-0.5',
};

const rowClasses: Record<Variant, string> = {
  desktop:
    'w-full text-left px-4 py-3 hover:bg-gold/10 transition-colors duration-150 border-b border-white/[0.06] last:border-0 group',
  hero: 'w-full text-left px-5 py-3 hover:bg-gold/10 transition-colors duration-150 border-b border-white/[0.06] last:border-0 group',
  mobile: 'text-left py-2 border-b border-white/[0.06] last:border-0 group',
};

const nameClasses: Record<Variant, string> = {
  desktop: 'text-white text-xs font-semibold group-hover:text-gold transition-colors duration-150',
  hero: 'text-white text-xs font-semibold group-hover:text-gold transition-colors duration-150',
  mobile: 'font-serif italic text-lg text-white/80 group-hover:text-gold transition-colors duration-150 block',
};

const locationClasses: Record<Variant, string> = {
  desktop: 'text-white/40 text-[10px] mt-0.5 tracking-wide',
  hero: 'text-white/40 text-[10px] mt-0.5 tracking-wide',
  mobile: 'text-white/30 text-[10px] font-sans tracking-wide block',
};

const searchingClasses: Record<Variant, string> = {
  desktop: 'px-4 py-3 text-white/30 text-[10px] tracking-widest uppercase',
  hero: 'px-5 py-3 text-white/30 text-[10px] tracking-widest uppercase',
  mobile: 'mt-2 text-white/20 text-[10px] tracking-widest uppercase text-center',
};

/**
 * Shared hotel-search results dropdown for Navbar (desktop/mobile) and the
 * hero ConciergePrompt. Owns the "when is this visible" rule so it can't
 * drift per-instance again: visible whenever the caller says it's open AND
 * there's something to show — a hit, or a request in flight.
 */
export default function HotelSearchDropdown({
  results,
  status,
  open,
  onSelect,
  variant,
}: HotelSearchDropdownProps) {
  const isPending = status === 'pending';
  const visible = open && (results.length > 0 || isPending);

  const rows = (
    <>
      {results.map((result) => (
        <button
          key={result.id}
          type="button"
          onClick={() => onSelect(result.slug)}
          className={rowClasses[variant]}
        >
          <div className={nameClasses[variant]}>{result.name}</div>
          <div className={locationClasses[variant]}>
            {[result.city, result.country].filter(Boolean).join(', ')}
          </div>
        </button>
      ))}
      {isPending && <div className={searchingClasses[variant]}>Searching…</div>}
    </>
  );

  if (variant === 'mobile') {
    return visible ? <div className={containerClasses.mobile}>{rows}</div> : null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: variant === 'hero' ? 0.18 : 0.15 }}
          className={containerClasses[variant]}
        >
          {rows}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
