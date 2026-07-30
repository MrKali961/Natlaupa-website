'use client';

import { useEffect, useState } from 'react';

export interface HotelSearchResult {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
}

export type HotelSearchStatus = 'idle' | 'pending' | 'settled';

/** Shared minimum query length before a search fires, on all three instances. */
export const HOTEL_SEARCH_MIN_LENGTH = 2;

interface UseHotelSearchOptions {
  minLength?: number;
  debounceMs?: number;
  limit?: number;
}

interface UseHotelSearchResult {
  results: HotelSearchResult[];
  status: HotelSearchStatus;
  /**
   * Returns the top hit's slug, but only once the in-flight request for the
   * CURRENT query has settled — reading a result mid-debounce would navigate
   * to the previous query's hit.
   */
  submitFirstResult: () => string | null;
}

/**
 * Debounce + fetch + abort + map, shared by Navbar (desktop/mobile) and the
 * hero ConciergePrompt. Deliberately does NOT own dropdown open/closed state —
 * that stays local to each caller (Navbar's pill toggle vs. the hero's
 * focus/escape behaviour diverge and shouldn't be forced into one shape).
 */
export function useHotelSearch(
  query: string,
  options?: UseHotelSearchOptions
): UseHotelSearchResult {
  const { minLength = HOTEL_SEARCH_MIN_LENGTH, debounceMs = 300, limit = 5 } = options || {};
  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [status, setStatus] = useState<HotelSearchStatus>('idle');

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minLength) {
      setResults([]);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    setStatus('pending');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/hotels?search=${encodeURIComponent(trimmed)}&limit=${limit}`,
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        const data = await res.json();
        if (controller.signal.aborted) return;

        if (res.ok) {
          const items: Record<string, unknown>[] = data.data?.items || data.data?.hotels || [];
          setResults(
            items.map((h) => ({
              id: h.id as string,
              name: h.name as string,
              slug: h.slug as string,
              city: (h.city as string) || '',
              country:
                (h.country as string) ||
                (h.destination as { country?: string } | undefined)?.country ||
                '',
            }))
          );
        } else {
          setResults([]);
        }
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setStatus('settled');
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, minLength, debounceMs, limit]);

  const submitFirstResult = (): string | null => {
    if (status !== 'settled') return null;
    return results[0]?.slug ?? null;
  };

  return { results, status, submitFirstResult };
}
