'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';

interface DestinationData {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  hotelCount: number;
  isActive: boolean;
  country?: string | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 12;

export default function DestinationsPage() {
  const [destinationsWithData, setDestinationsWithData] = useState<Array<{
    id: string;
    name: string;
    slug: string;
    hotelCount: number;
    imageUrl: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const fetchDestinations = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/destinations?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = await response.json();

      if (response.ok && data.data?.items) {
        const destinations = data.data.items as DestinationData[];
        setDestinationsWithData(
          destinations
            .filter((d: DestinationData) => d.isActive && d.hotelCount > 0)
            .sort((a, b) => b.hotelCount - a.hotelCount)
            .map((d: DestinationData) => ({
              id: d.id,
              name: d.name,
              slug: d.slug,
              hotelCount: d.hotelCount,
              imageUrl: d.imageUrl || 'https://picsum.photos/600/400?random=50',
            }))
        );
        if (data.data.meta) {
          setPagination(data.data.meta);
        }
      } else {
        setError(data.error || 'Failed to fetch destinations');
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to fetch destinations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations(currentPage);
  }, [currentPage, fetchDestinations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-white text-xl">Loading destinations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4 text-white">Error Loading Destinations</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link href="/" className="text-gold hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-gold text-sm uppercase tracking-[0.3em] mb-4 block">Explore By</span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6">
                Destinations
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto">
                Discover extraordinary stays across {destinationsWithData.length} destinations worldwide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinationsWithData.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/destinations/${destination.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-colors duration-300">
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={destination.imageUrl}
                          alt={destination.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <div className="flex items-center text-gold text-xs uppercase tracking-widest mb-2">
                            <MapPin size={14} className="mr-1" />
                            <span>{destination.hotelCount} {destination.hotelCount === 1 ? 'Property' : 'Properties'}</span>
                          </div>

                          <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-gold transition-colors">
                            {destination.name}
                          </h3>

                          <div className="flex items-center justify-end">
                            <div className="flex items-center text-white group-hover:text-gold transition-colors">
                              <span className="text-xs uppercase tracking-widest mr-2">Explore</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-white/10 rounded-sm text-white hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - currentPage) <= 1;

                    const showEllipsis =
                      (page === 2 && currentPage > 3) ||
                      (page === pagination.totalPages - 1 && currentPage < pagination.totalPages - 2);

                    if (showEllipsis && !showPage) {
                      return (
                        <span key={page} className="px-2 text-slate-500">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 border rounded-sm text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-gold border-gold text-deepBlue'
                            : 'border-white/10 text-white hover:border-gold hover:text-gold'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 border border-white/10 rounded-sm text-white hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Page info */}
            {pagination && (
              <div className="mt-4 text-center text-sm text-slate-400">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} of {pagination.total} destinations
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center"
            >
              <Building2 className="text-gold" size={28} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white mb-6"
            >
              Cannot Find Your Destination?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mb-8"
            >
              Our concierge team can help you discover exclusive properties in any location worldwide.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
              >
                Contact Concierge
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
