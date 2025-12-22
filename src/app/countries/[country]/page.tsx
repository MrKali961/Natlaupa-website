'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useHotels } from '@/hooks/useHotels';
import HotelCard from '@/components/HotelCard';
import Footer from '@/components/Footer';

export default function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = React.use(params);
  const decodedCountry = decodeURIComponent(country).replace(/-/g, ' ');

  const { hotels: allHotels, countries, isLoading, error } = useHotels();

  const matchedCountry = countries.find(
    c => c.toLowerCase() === decodedCountry.toLowerCase()
  );

  const hotels = matchedCountry
    ? allHotels.filter(h => h.country.toLowerCase() === matchedCountry.toLowerCase())
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Error Loading Country</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link href="/countries" className="text-gold hover:underline">
            Browse All Countries
          </Link>
        </div>
      </div>
    );
  }

  if (!matchedCountry || hotels.length === 0) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Country Not Found</h2>
          <p className="text-slate-400 mb-8">We could not find properties in this location.</p>
          <Link href="/countries" className="text-gold hover:underline">
            Browse All Countries
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = hotels[0]?.imageUrl || 'https://picsum.photos/1920/1080?random=60';
  const avgRating = (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1);

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={matchedCountry}
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
          </div>

          {/* Back Button */}
          <div className="absolute top-28 left-4 md:top-32 md:left-8 z-20">
            <Link href="/countries" className="flex items-center text-white/70 hover:text-gold transition-colors group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-xs font-bold">All Countries</span>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center text-gold text-sm uppercase tracking-widest mb-4">
                <MapPin size={16} className="mr-2" />
                <span>{hotels.length} {hotels.length === 1 ? 'Property' : 'Properties'}</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
                {matchedCountry}
              </h1>
              <p className="text-slate-300 text-lg mb-4">
                {avgRating} avg. rating
              </p>
              {hotels[0]?.description && (
                <p className="text-slate-400 text-base font-light max-w-2xl leading-relaxed">
                  {hotels[0].description}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Hotels Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-white">
                Properties in {matchedCountry}
              </h2>
              <Link href="/offers" className="text-gold text-sm hover:underline">
                View All Offers
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, index) => (
                <HotelCard key={hotel.id} hotel={hotel} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Other Countries */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl text-white mb-8">Explore Other Countries</h2>
            <div className="flex flex-wrap gap-3">
              {countries.filter(c => c !== matchedCountry).map(c => (
                <Link
                  key={c}
                  href={`/countries/${c.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 border border-white/20 text-white hover:border-gold hover:text-gold transition-colors text-sm uppercase tracking-widest"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
