"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useOffers } from "@/hooks/useOffers";
import OfferCard from "@/components/OfferCard";
import Footer from "@/components/Footer";

export default function OffersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExperienceType, setSelectedExperienceType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"duration" | "title">("duration");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch offers from server
  const { offers, experienceTypes, isLoading } = useOffers();

  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        const matchesSearch =
          offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.hotel.country.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesExperienceType =
          !selectedExperienceType || offer.experienceType === selectedExperienceType;
        return matchesSearch && matchesExperienceType;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return a.duration - b.duration;
      });
  }, [offers, searchQuery, selectedExperienceType, sortBy]);

  return (
    <>
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

            {/* Search and Filters */}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 border border-white/10 text-white hover:border-gold hover:text-gold transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  <span className="text-sm uppercase tracking-widest">
                    Filters
                  </span>
                </button>

                <select
                  title="Sort By"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none cursor-pointer"
                >
                  <option value="duration">Duration: Short to Long</option>
                  <option value="title">Title: A to Z</option>
                </select>
              </div>
            </motion.div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 bg-white/5 border border-white/10 rounded-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-serif text-lg">
                    Filter by Experience Type
                  </h3>
                  {selectedExperienceType && (
                    <button
                      onClick={() => setSelectedExperienceType(null)}
                      className="text-gold text-sm flex items-center gap-1 hover:underline"
                    >
                      <X size={14} />
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {experienceTypes.map((experienceType) => (
                    <button
                      key={experienceType}
                      onClick={() =>
                        setSelectedExperienceType(
                          selectedExperienceType === experienceType
                            ? null
                            : experienceType
                        )
                      }
                      className={`px-4 py-2 text-sm uppercase tracking-widest border transition-colors ${
                        selectedExperienceType === experienceType
                          ? "bg-gold text-deepBlue border-gold"
                          : "border-white/20 text-white hover:border-gold hover:text-gold"
                      }`}
                    >
                      {experienceType}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-400">
                Showing{" "}
                <span className="text-white font-bold">
                  {filteredOffers.length}
                </span>{" "}
                {filteredOffers.length === 1 ? "offer" : "offers"}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-24">
                <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading offers...</p>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-400 text-lg">
                  No offers match your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedExperienceType(null);
                  }}
                  className="mt-4 text-gold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOffers.map((offer, index) => (
                  <OfferCard key={offer.id} offer={offer} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
