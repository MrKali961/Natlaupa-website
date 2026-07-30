"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useOffers } from "@/hooks/useOffers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import OfferCard from "@/components/OfferCard";
import Footer from "@/components/Footer";

const ITEMS_PER_PAGE = 20;

// Isolated in its own Suspense boundary so ONLY this (invisible) reader opts
// into client rendering for useSearchParams. Seeds the search box exactly
// once — it must not re-fire every time the URL is rewritten by the
// debounced ?q= sync below.
function OffersQuerySeed({ onSeed }: { onSeed: (q: string) => void }) {
  const searchParams = useSearchParams();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const q = searchParams.get("q");
    if (q) onSeed(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function OffersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"duration" | "title">("duration");

  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const trimmedSearch = debouncedSearch.trim();

  // Fetch offers from the server — search is server-driven, not filtered in memory.
  const { offers, total, isLoading } = useOffers({
    search: trimmedSearch || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  });

  // Keep ?q= in sync for deep-linking — no full navigation, no scroll jump.
  useEffect(() => {
    const url = trimmedSearch ? `${pathname}?q=${encodeURIComponent(trimmedSearch)}` : pathname;
    router.replace(url, { scroll: false });
  }, [trimmedSearch, pathname, router]);

  // Reset to page 1 in the SAME handler that changes the search term — never
  // in a useEffect keyed on the debounced value, which would fire a query for
  // the old page against the new term before the reset lands.
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Client-side sort of the current page only — sorting isn't forwarded to the
  // server in this pass, so it's scoped to whichever 20 offers are loaded.
  const sortedOffers = useMemo(() => {
    return [...offers].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.duration - b.duration;
    });
  }, [offers, sortBy]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Suspense fallback={null}>
        <OffersQuerySeed onSeed={handleSearchChange} />
      </Suspense>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="text-gold text-sm uppercase tracking-[0.3em] mb-4 block">
                Our Collection
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">
                Natlaupa redefines the way you travel.
              </h1>
              <h2 className="font-serif text-2xl md:text-3xl text-gold mb-4">
                WE DON'T JUST BOOK ROOMS. WE CURATE ESCAPES.
              </h2>
              <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto">
                Through privileged relationships with the world's finest hotels, we offer more than just a stay, we offer access. Preferential rates, tailored experiences, and discreet privileges curated with intention and elegance. Because true luxury should feel like it was made just for you.
              </p>
            </motion.div>

            {/* Search and Sort */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              <div className="relative w-full md:w-96">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search offers, hotels, locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <select
                title="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none cursor-pointer"
              >
                <option value="duration">Duration: Short to Long</option>
                <option value="title">Title: A to Z</option>
              </select>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-400">
                {total > 0 ? (
                  <>
                    Showing{" "}
                    <span className="text-white font-bold">
                      {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, total)}
                    </span>{" "}
                    of <span className="text-white font-bold">{total}</span>{" "}
                    {total === 1 ? "offer" : "offers"}
                  </>
                ) : (
                  "No offers found"
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-24">
                <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading offers...</p>
              </div>
            ) : sortedOffers.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-400 text-lg">
                  No offers match your search criteria.
                </p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-4 text-gold hover:underline inline-flex items-center gap-2"
                >
                  <X size={14} />
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedOffers.map((offer, index) => (
                  <OfferCard key={offer.id} offer={offer} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 border border-white/10 rounded-sm text-white hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const showPage = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    const showEllipsis =
                      (p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2);

                    if (showEllipsis && !showPage) {
                      return (
                        <span key={p} className="px-2 text-slate-500">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 border rounded-sm text-sm font-medium transition-colors ${
                          page === p
                            ? "bg-gold border-gold text-deepBlue"
                            : "border-white/10 text-white hover:border-gold hover:text-gold"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 border border-white/10 rounded-sm text-white hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
