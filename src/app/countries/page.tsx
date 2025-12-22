'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';
import { useHotels } from '@/hooks/useHotels';
import Footer from '@/components/Footer';

export default function CountriesPage() {
  const { hotels, countries, isLoading, error } = useHotels();

  const countriesWithData = countries
    .map(country => {
      const countryHotels = hotels.filter(h => h.country === country);
      const featuredImage = countryHotels[0]?.imageUrl || 'https://picsum.photos/600/400?random=50';
      return {
        name: country,
        slug: country.toLowerCase().replace(/\s+/g, '-'),
        hotelCount: countryHotels.length,
        imageUrl: featuredImage,
      };
    })
    .filter(country => country.hotelCount > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-white text-xl">Loading countries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4 text-white">Error Loading Countries</h2>
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
                Countries
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto">
                Discover extraordinary stays across {countriesWithData.length} destinations worldwide.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Countries Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countriesWithData.map((country, index) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/countries/${country.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-colors duration-300">
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={country.imageUrl}
                          alt={country.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                          <div className="flex items-center text-gold text-xs uppercase tracking-widest mb-2">
                            <MapPin size={14} className="mr-1" />
                            <span>{country.hotelCount} {country.hotelCount === 1 ? 'Property' : 'Properties'}</span>
                          </div>

                          <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-gold transition-colors">
                            {country.name}
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
