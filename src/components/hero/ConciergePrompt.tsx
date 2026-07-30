'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHotelSearch, HOTEL_SEARCH_MIN_LENGTH } from '@/hooks/useHotelSearch';
import HotelSearchDropdown from '@/components/search/HotelSearchDropdown';

interface ConciergePromptProps {
  /** Called when the field is submitted empty — funnels into the gate. */
  onScrollToGate: () => void;
}

/**
 * The hero's primary intent path. A single concierge-styled search field
 * (not an OTA date/guest widget — Natlaupa is advisory). Reuses the shared
 * /api/hotels?search= debounced autocomplete via useHotelSearch. Submitting
 * empty scrolls the user into the experience-selector gate, so the field
 * doubles as a funnel.
 */
const ConciergePrompt: React.FC<ConciergePromptProps> = ({ onScrollToGate }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, status, submitFirstResult } = useHotelSearch(query);

  // Open as soon as the query is long enough — NOT only after a successful
  // fetch — so the "Searching…" row is visible on the very first keystroke
  // past the threshold, not just once results land.
  useEffect(() => {
    if (query.trim().length >= HOTEL_SEARCH_MIN_LENGTH) setOpen(true);
  }, [query]);

  // Click-outside + Escape close the dropdown. Text is deliberately preserved
  // (divergence from Navbar, which clears on close) — this is the hero's
  // primary funnel and re-typing a query the user already committed to is bad UX.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (slug: string) => {
    router.push(`/hotel/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < HOTEL_SEARCH_MIN_LENGTH) {
      onScrollToGate();
      return;
    }
    const slug = submitFirstResult();
    if (slug) go(slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.8 }}
      ref={containerRef}
      className="relative z-30 w-full max-w-md md:max-w-xl mb-6 md:mb-8"
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full rounded-full bg-white/[0.08] backdrop-blur-md
                   border border-white/15 focus-within:border-gold/60
                   transition-colors duration-300 pl-5 pr-2 py-2 md:py-2.5
                   shadow-2xl shadow-black/30"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= HOTEL_SEARCH_MIN_LENGTH) setOpen(true);
          }}
          placeholder="Tell our concierge where you'd like to disappear to…"
          aria-label="Search hotels and destinations"
          className="flex-1 min-w-0 bg-transparent font-serif italic
                     text-sm md:text-base text-white placeholder-white/45
                     outline-none"
        />
        <button
          type="submit"
          aria-label={query.trim().length < HOTEL_SEARCH_MIN_LENGTH ? 'Explore offers' : 'Search'}
          className="flex-shrink-0 rounded-full px-5 py-2 md:px-7 md:py-2.5
                     bg-white text-zinc-900 font-sans text-[11px] md:text-xs
                     font-semibold uppercase tracking-[0.15em]
                     hover:bg-gold hover:text-black transition-colors duration-300"
        >
          Explore
        </button>
      </form>

      <HotelSearchDropdown
        results={results}
        status={status}
        open={open}
        onSelect={go}
        variant="hero"
      />
    </motion.div>
  );
};

export default ConciergePrompt;
