'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
}

interface ConciergePromptProps {
  /** Called when the field is submitted empty — funnels into the gate. */
  onScrollToGate: () => void;
}

/**
 * The hero's primary intent path. A single concierge-styled search field
 * (not an OTA date/guest widget — Natlaupa is advisory). Reuses the proven
 * /api/hotels?search= debounced autocomplete. Submitting empty scrolls the
 * user into the experience-selector gate, so the field doubles as a funnel.
 */
const ConciergePrompt: React.FC<ConciergePromptProps> = ({ onScrollToGate }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search — mirrors the navbar implementation.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/hotels?search=${encodeURIComponent(q)}&limit=5`
        );
        const data = await res.json();
        if (res.ok) {
          const items: Record<string, unknown>[] =
            data.data?.items || data.data?.hotels || [];
          setResults(
            items.map(h => ({
              id: h.id as string,
              name: h.name as string,
              slug: h.slug as string,
              city: (h.city as string) || '',
              country:
                (h.country as string) ||
                ((h.destination as { country?: string })?.country) ||
                '',
            }))
          );
          setOpen(true);
        }
      } catch {
        /* silent — concierge field degrades to the scroll funnel */
      }
      setIsSearching(false);
    }, 300);
    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [query]);

  // Click-outside + Escape close the dropdown.
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
    if (query.trim().length < 2) {
      onScrollToGate();
      return;
    }
    if (results.length > 0) go(results[0].slug);
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
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Tell our concierge where you'd like to disappear to…"
          aria-label="Search hotels and destinations"
          className="flex-1 min-w-0 bg-transparent font-serif italic
                     text-sm md:text-base text-white placeholder-white/45
                     outline-none"
        />
        <button
          type="submit"
          aria-label={query.trim().length < 2 ? 'Explore offers' : 'Search'}
          className="flex-shrink-0 rounded-full px-5 py-2 md:px-7 md:py-2.5
                     bg-white text-zinc-900 font-sans text-[11px] md:text-xs
                     font-semibold uppercase tracking-[0.15em]
                     hover:bg-gold hover:text-black transition-colors duration-300"
        >
          Explore
        </button>
      </form>

      {open && (results.length > 0 || isSearching) && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute left-0 right-0 top-full mt-2 text-left
                     bg-black/95 backdrop-blur-md border border-white/10
                     rounded-2xl overflow-hidden"
        >
          {results.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => go(r.slug)}
              className="w-full text-left px-5 py-3 hover:bg-gold/10
                         transition-colors duration-150
                         border-b border-white/[0.06] last:border-0 group"
            >
              <div className="text-white text-xs font-semibold group-hover:text-gold transition-colors duration-150">
                {r.name}
              </div>
              <div className="text-white/40 text-[10px] mt-0.5 tracking-wide">
                {[r.city, r.country].filter(Boolean).join(', ')}
              </div>
            </button>
          ))}
          {isSearching && (
            <div className="px-5 py-3 text-white/30 text-[10px] tracking-widest uppercase">
              Searching…
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConciergePrompt;
