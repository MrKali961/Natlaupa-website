'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Building2, Castle, Waves } from 'lucide-react';
import { useHotels } from '@/hooks/useHotels';
import HotelCard from '@/components/HotelCard';
import Footer from '@/components/Footer';
import { LucideIcon } from 'lucide-react';
import type { Hotel, Category } from '@/types';

const categoryIcons: Record<string, LucideIcon> = {
  'Eco-Lodges': Leaf,
  'Urban Suites': Building2,
  'Historic Castles': Castle,
  'Overwater Villas': Waves,
};

interface Style {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  hotelCount: number;
}

export default function StylePage({ params }: { params: Promise<{ style: string }> }) {
  const { style: styleSlug } = React.use(params);
  const [style, setStyle] = useState<Style | null>(null);
  const [allStyles, setAllStyles] = useState<Style[]>([]);
  const [isLoadingStyle, setIsLoadingStyle] = useState(true);
  const [styleError, setStyleError] = useState<string | null>(null);

  // Fetch all styles for the "Explore Other Styles" section
  useEffect(() => {
    const fetchAllStyles = async () => {
      try {
        const response = await fetch('/api/styles');
        const data = await response.json();

        if (response.ok && data.data?.items) {
          setAllStyles(data.data.items);
        }
      } catch (err) {
        console.error('Error fetching all styles:', err);
      }
    };

    fetchAllStyles();
  }, []);

  // Fetch style by slug
  useEffect(() => {
    const fetchStyle = async () => {
      try {
        const response = await fetch(`/api/styles/${styleSlug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Style not found');
        }

        setStyle(data.data);
      } catch (err) {
        console.error('Error fetching style:', err);
        setStyleError(err instanceof Error ? err.message : 'Failed to fetch style');
      } finally {
        setIsLoadingStyle(false);
      }
    };

    fetchStyle();
  }, [styleSlug]);

  // Fetch hotels filtered by style ID (with high limit to fetch all)
  const { hotels, isLoading: isLoadingHotels, error: hotelsError } = useHotels(
    style ? { styleId: style.id, limit: 1000 } : undefined
  );

  const isLoading = isLoadingStyle || (style && isLoadingHotels);
  const error = styleError || hotelsError;

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
          <h2 className="text-4xl font-serif mb-4">Error Loading Style</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link href="/styles" className="text-gold hover:underline">
            Browse All Styles
          </Link>
        </div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Style Not Found</h2>
          <p className="text-slate-400 mb-8">We could not find this style.</p>
          <Link href="/styles" className="text-gold hover:underline">
            Browse All Styles
          </Link>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[style.name] || Building2;
  const description = style.description || 'Discover unique properties in this style.';
  const heroImage = hotels[0]?.imageUrl || style.imageUrl || 'https://picsum.photos/1920/1080';
  const avgRating = hotels.length > 0 ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1) : '0.0';

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[60vh] w-full">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={style.name}
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
          </div>

          {/* Back Button */}
          <div className="absolute top-28 left-4 md:top-32 md:left-8 z-20">
            <Link href="/styles" className="flex items-center text-white/70 hover:text-gold transition-colors group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-xs font-bold">All Styles</span>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Icon className="text-gold" size={20} />
                </div>
                <span className="text-gold text-sm uppercase tracking-widest">
                  {hotels.length} {hotels.length === 1 ? 'Property' : 'Properties'}
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
                {style.name}
              </h1>
              <p className="text-slate-300 text-lg max-w-2xl">
                {avgRating} avg. rating
              </p>
            </motion.div>
          </div>
        </div>

        {/* Description Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-300 text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </section>

        {/* Hotels Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-white">
                {style.name} Collection
              </h2>
              <Link href="/offers" className="text-gold text-sm hover:underline">
                View All Offers
              </Link>
            </div>

            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((hotel, index) => (
                  <HotelCard key={hotel.id} hotel={hotel} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  No properties available in this style yet.
                </p>
                <Link href="/styles" className="text-gold hover:underline mt-4 inline-block">
                  Explore Other Styles
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Other Styles */}
        {allStyles.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-serif text-2xl text-white mb-8">Explore Other Styles</h2>
              <div className="flex flex-wrap gap-3">
                {allStyles.filter(s => s.id !== style.id).map(s => (
                  <Link
                    key={s.id}
                    href={`/styles/${s.slug}`}
                    className="px-4 py-2 border border-white/20 text-white hover:border-gold hover:text-gold transition-colors text-sm uppercase tracking-widest"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
