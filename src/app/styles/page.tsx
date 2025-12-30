'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Building2, Castle, Waves } from 'lucide-react';
import Footer from '@/components/Footer';
import { LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  'Eco-Lodges': Leaf,
  'Urban Suites': Building2,
  'Historic Castles': Castle,
  'Overwater Villas': Waves,
};

interface StyleData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  hotelCount: number;
}

interface StyleWithUI extends StyleData {
  featuredImage: string;
  Icon: LucideIcon;
}

export default function StylesPage() {
  const [stylesWithData, setStylesWithData] = useState<StyleWithUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch('/api/styles');
        const data = await response.json();

        if (response.ok && data.data?.items) {
          const styles = data.data.items as StyleData[];
          setStylesWithData(
            styles.map((style: StyleData) => ({
              ...style,
              featuredImage: style.imageUrl || 'https://picsum.photos/600/400',
              Icon: categoryIcons[style.name] || Building2,
            }))
          );
        } else {
          setError(data.error || 'Failed to fetch styles');
        }
      } catch (err) {
        console.error('Error fetching styles:', err);
        setError('Failed to fetch styles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStyles();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-white text-xl">Loading styles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4 text-white">Error Loading Styles</h2>
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
                Styles
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto">
                Find your perfect stay by accommodation style. Each category offers a unique experience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Styles Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stylesWithData.map((style, index) => (
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/styles/${style.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-sm border border-white/10 hover:border-gold/30 transition-colors duration-300">
                      <div className="grid md:grid-cols-2">
                        <div className="relative h-64 md:h-80 overflow-hidden">
                          <img
                            src={style.featuredImage}
                            alt={style.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deepBlue md:block hidden" />
                          <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-transparent to-transparent md:hidden" />
                        </div>

                        <div className="p-6 md:p-8 flex flex-col justify-center bg-deepBlue">
                          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                            <style.Icon className="text-gold" size={24} />
                          </div>

                          <h3 className="font-serif text-2xl md:text-3xl text-white mb-3 group-hover:text-gold transition-colors">
                            {style.name}
                          </h3>

                          <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                            {style.description || 'Discover unique properties in this style.'}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-gold font-bold">{style.hotelCount}</span>
                              <span className="text-slate-500 ml-1">{style.hotelCount === 1 ? 'Property' : 'Properties'}</span>
                            </div>
                            <div className="flex items-center text-white group-hover:text-gold transition-colors">
                              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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

        {/* Info Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-midnight/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white mb-6"
            >
              Not Sure Which Style Suits You?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mb-8 max-w-2xl mx-auto"
            >
              Our travel concierge can help you discover the perfect accommodation style based on your preferences, travel purpose, and desired experience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/offers"
                className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Browse All
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
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
