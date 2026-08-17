'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X, ArrowRight, MessageCircle, Loader2 } from 'lucide-react';
import type { ServerBlogFull } from '@/lib/server-api';
import { normalizeTags } from '@/lib/blog';
import { BLOG_PAGE_SIZE } from '@/lib/constants';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import BlogCard from '@/components/BlogCard';
import StickyConciergeCTA from '@/components/blog/StickyConciergeCTA';
import Footer from '@/components/Footer';

const EASE = [0.25, 1, 0.5, 1] as const;
// Search/filter is pure entropy at low article counts — only reveal it past this threshold.
const FILTER_THRESHOLD = 7;

type FetchStatus = 'idle' | 'pending' | 'settled';

// Isolated in its own Suspense boundary so ONLY this (invisible) reader opts
// into client rendering for useSearchParams — the H1 above stays server-rendered.
// Seeds the search box exactly once; it must not re-fire every time the URL
// is rewritten by the debounced ?q= sync below.
function BlogQuerySeed({ onSeed }: { onSeed: (q: string) => void }) {
  const searchParams = useSearchParams();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const q = searchParams.get('q');
    if (q) onSeed(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function BlogIndex({ blogs }: { blogs: ServerBlogFull[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [liveBlogs, setLiveBlogs] = useState<ServerBlogFull[] | null>(null);
  const [status, setStatus] = useState<FetchStatus>('idle');

  const debouncedQuery = useDebouncedValue(query, 300);
  const trimmedQuery = debouncedQuery.trim();
  const isFiltering = Boolean(query.trim()) || Boolean(activeTag);

  // The SSR payload never changes — showControls/allTags stay derived from it
  // so a sparse server result can't flip showControls false and unmount the
  // search input mid-typing (the FILTER_THRESHOLD trap).
  const allTags = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => normalizeTags(b.tags).forEach((t) => set.add(t)));
    return [...set];
  }, [blogs]);

  const showControls = blogs.length >= FILTER_THRESHOLD;

  // Keep ?q= in sync for deep-linking — no full navigation, no scroll jump.
  useEffect(() => {
    const url = trimmedQuery ? `${pathname}?q=${encodeURIComponent(trimmedQuery)}` : pathname;
    router.replace(url, { scroll: false });
  }, [trimmedQuery, pathname, router]);

  // Server-driven search/tag filtering. Only fires once a query or tag is
  // active — the SSR first page stays static otherwise, so /blog doesn't fire
  // a request on every load.
  useEffect(() => {
    if (!trimmedQuery && !activeTag) {
      setLiveBlogs(null);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    setStatus('pending');

    (async () => {
      try {
        const params = new URLSearchParams();
        if (trimmedQuery) params.append('search', trimmedQuery);
        if (activeTag) params.append('tag', activeTag);
        params.append('limit', String(BLOG_PAGE_SIZE));

        const res = await fetch(`/api/blogs?${params.toString()}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        const data = await res.json();
        if (controller.signal.aborted) return;

        setLiveBlogs(res.ok && Array.isArray(data.blogs) ? (data.blogs as ServerBlogFull[]) : []);
      } catch {
        if (!controller.signal.aborted) setLiveBlogs([]);
      } finally {
        if (!controller.signal.aborted) setStatus('settled');
      }
    })();

    return () => controller.abort();
  }, [trimmedQuery, activeTag]);

  const clearFilters = () => {
    setQuery('');
    setActiveTag(null);
  };

  // Render list: server results while filtering, the static SSR page otherwise.
  const filtered = isFiltering ? liveBlogs ?? [] : blogs;
  const isSearchBusy = isFiltering && status !== 'settled';
  const showEmptyState = isFiltering ? status === 'settled' && filtered.length === 0 : filtered.length === 0;

  // No filter active → featured + grid. Filtering → uniform grid of matches.
  const featured = !isFiltering ? filtered[0] : undefined;
  const rest = !isFiltering ? filtered.slice(1) : filtered;

  return (
    <>
      <Suspense fallback={null}>
        <BlogQuerySeed onSeed={setQuery} />
      </Suspense>
      <main className="bg-noir min-h-screen">
        {/* Hero — text-only, one-glance; H1 is the LCP element (server-rendered) */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <span className="text-gold text-xs uppercase tracking-[0.35em] mb-5 block">The Journal</span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">The Natlaupa Journal</h1>
              <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                Field notes for the discerning traveller — the properties, places and stays our editors and
                concierge team have vetted in person.
              </p>
            </motion.div>

            {showControls && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the journal…"
                    className="w-full bg-white/5 border border-white/10 pl-12 pr-11 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition-colors"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {allTags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
                          activeTag === tag
                            ? 'bg-gold text-noir border-gold'
                            : 'border-white/20 text-slate-300 hover:border-gold hover:text-gold'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
                {/* Reset is available whenever a filter is active — not only when the result
                    set is empty, which previously left 1..n-hit searches with no way back. */}
                {isFiltering && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-gold transition-colors"
                  >
                    <X size={13} /> Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Searching state — avoids flashing "No articles match" during the debounce/fetch window */}
        {isSearchBusy && (
          <section className="py-28 px-4 text-center">
            <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Searching the journal…</p>
          </section>
        )}

        {/* Empty state */}
        {!isSearchBusy && showEmptyState && (
          <section className="py-28 px-4 text-center">
            <p className="text-slate-400 text-lg mb-4">No articles match your search.</p>
            {isFiltering && (
              <button onClick={clearFilters} className="inline-flex items-center gap-2 text-gold hover:underline">
                <X size={14} /> Clear filters
              </button>
            )}
          </section>
        )}

        {/* Featured (single pop-out) — shown only when not filtering */}
        {!isSearchBusy && featured && (
          <section className="px-4 sm:px-6 lg:px-8 pt-16">
            <div className="max-w-7xl mx-auto">
              <BlogCard blog={featured} featured />
            </div>
          </section>
        )}

        {/* Grid — omitted entirely when there's nothing beyond the featured (no empty/sparse grid) */}
        {!isSearchBusy && rest.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Concierge band — AFTER the articles, restrained, subordinate in mass to the cards */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-gold text-xs uppercase tracking-[0.35em] mb-5 block">The Concierge</span>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-5">
              Reading is the easy part.
            </h2>
            <p className="text-slate-300 font-light leading-relaxed mb-8">
              Our concierge has stayed in these places. Tell us what you&rsquo;re planning and we&rsquo;ll handle the rest.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-gold text-gold px-8 py-4 font-medium uppercase tracking-[0.15em] text-sm hover:bg-gold hover:text-noir transition-colors"
            >
              <MessageCircle size={17} />
              Speak to a concierge
              <ArrowRight size={16} />
            </Link>
            <p className="text-slate-500 text-xs mt-5">
              Real people, 24/7. No account, no obligation — a reply, not a sales pitch.
            </p>
          </div>
        </section>
      </main>

      <StickyConciergeCTA />
      <Footer />
    </>
  );
}
