'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Hotel } from '@/types';

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/hotel/${hotel.slug || hotel.id}`} className="group/hotel block">
        <div className="relative overflow-hidden rounded-sm border border-white/10 hover-capable:hover:border-gold/30 transition-colors duration-300">
          <div className="relative h-64 overflow-hidden">
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover grayscale group-hover/hotel:grayscale-0 group-hover/hotel:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-transparent to-transparent" />

            {hotel.isTrending && (
              <div className="absolute top-4 left-4 bg-gold text-deepBlue px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Trending
              </div>
            )}

            <div className="absolute top-4 right-4 flex items-center bg-deepBlue/80 backdrop-blur-sm px-2 py-1 rounded-sm">
              <Star className="text-gold fill-gold" size={12} />
              <span className="ml-1 text-white text-xs font-bold">{hotel.rating}</span>
            </div>
          </div>

          <div className="p-6 bg-deepBlue">
            <div className="flex items-center text-gold text-xs uppercase tracking-widest mb-2">
              <span>{hotel.category}</span>
            </div>

            <h3 className="font-serif text-xl text-white mb-2 group-hover/hotel:text-gold transition-colors">
              {hotel.name}
            </h3>

            <div className="flex items-center text-slate-400 text-sm mb-4">
              <MapPin size={14} className="mr-1 text-gold" />
              <span>{hotel.city}, {hotel.country}</span>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-white/10">
              <div className="flex items-center text-white group-hover/hotel:text-gold transition-colors">
                <span className="text-xs uppercase tracking-widest mr-2">View Details</span>
                <ArrowRight size={14} className="group-hover/hotel:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
