'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useHotels } from '@/hooks/useHotels';
import HotelCard from '@/components/HotelCard';
import Footer from '@/components/Footer';

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoadingDestination, setIsLoadingDestination] = useState(true);
  const [destinationError, setDestinationError] = useState<string | null>(null);

  // Fetch destination details
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations`);
        const data = await response.json();

        if (response.ok && data.data?.items) {
          const destinations = data.data.items as Destination[];
          const found = destinations.find(d => d.slug === slug);
          setDestination(found || null);
          setDestinationError(found ? null : 'Destination not found');
        } else {
          setDestinationError('Failed to fetch destination');
        }
      } catch (err) {
        console.error('Error fetching destination:', err);
        setDestinationError('Failed to fetch destination');
      } finally {
        setIsLoadingDestination(false);
      }
    };

    fetchDestination();
  }, [slug]);

  // Fetch hotels filtered by destination (with high limit to fetch all)
  const { hotels, isLoading: isLoadingHotels, error: hotelsError } = useHotels(
    destination ? { destinationId: destination.id, limit: 1000 } : undefined
  );

  const isLoading = isLoadingDestination || (destination && isLoadingHotels);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (destinationError || hotelsError) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Error Loading Destination</h2>
          <p className="text-slate-400 mb-8">{destinationError || hotelsError}</p>
          <Link href="/destinations" className="text-gold hover:underline">
            Browse All Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Destination Not Found</h2>
          <p className="text-slate-400 mb-8">We could not find this destination.</p>
          <Link href="/destinations" className="text-gold hover:underline">
            Browse All Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (!isLoading && hotels.length === 0) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">{destination.name}</h2>
          <p className="text-slate-400 mb-8">No properties available in this destination yet.</p>
          <Link href="/destinations" className="text-gold hover:underline">
            Browse All Destinations
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = destination.imageUrl || hotels[0]?.imageUrl || 'https://picsum.photos/1920/1080?random=60';
  const avgRating = hotels.length > 0 ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1) : '0.0';

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] w-full">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={destination.name}
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
          </div>

          {/* Back Button */}
          <div className="absolute top-28 left-4 md:top-32 md:left-8 z-20">
            <Link href="/destinations" className="flex items-center text-white/70 hover:text-gold transition-colors group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-xs font-bold">All Destinations</span>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-12 lg:p-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center text-gold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-4">
                <MapPin size={14} className="mr-1.5 sm:mr-2 flex-shrink-0" />
                <span>{hotels.length} {hotels.length === 1 ? 'Property' : 'Properties'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-2 sm:mb-4">
                {destination.name}
              </h1>
              {hotels.length > 0 && (
                <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-2 sm:mb-4">
                  {avgRating} avg. rating
                </p>
              )}
              {destination.description && (
                <div className="max-w-2xl">
                  <p className={`text-slate-400 text-xs sm:text-sm md:text-base font-light leading-relaxed ${
                    !isDescriptionExpanded ? 'line-clamp-2 sm:line-clamp-3' : ''
                  }`}>
                    {destination.description}
                  </p>
                  {destination.description.length > 100 && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="flex items-center gap-1 text-gold text-xs sm:text-sm mt-2 hover:underline transition-all group"
                    >
                      <span>{isDescriptionExpanded ? 'See less' : 'See more'}</span>
                      {isDescriptionExpanded ? (
                        <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                      ) : (
                        <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Hotels Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
