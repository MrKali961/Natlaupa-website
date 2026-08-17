'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Offer } from '@/lib/types';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

export default function OfferCard({ offer, index = 0 }: OfferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/offer/${offer.slug || offer.id}`} className="group/offer block">
        <div className="relative overflow-hidden rounded-sm border border-white/10 hover-capable:hover:border-gold/30 transition-colors duration-300">
          <div className="relative h-64 overflow-hidden">
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="w-full h-full object-cover grayscale group-hover/offer:grayscale-0 group-hover/offer:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />

            {offer.isTrending && (
              <div className="absolute top-4 left-4 bg-gold text-noir px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Trending
              </div>
            )}

            {offer.isFeatured && !offer.isTrending && (
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Featured
              </div>
            )}

            <div className="absolute top-4 right-4 flex items-center bg-noir/80 backdrop-blur-sm px-3 py-1 rounded-sm">
              <Clock className="text-gold" size={12} />
              <span className="ml-1 text-white text-xs font-bold">{offer.duration} Days</span>
            </div>
          </div>

          <div className="p-6 bg-noir">
            <div className="flex items-center text-gold text-xs uppercase tracking-widest mb-2">
              <Sparkles size={12} className="mr-1" />
              <span>{offer.experienceType}</span>
            </div>

            <h3 className="font-serif text-xl text-white mb-2 group-hover/offer:text-gold transition-colors line-clamp-2">
              {offer.title}
            </h3>

            {offer.tagline && (
              <p className="text-slate-400 text-sm mb-3 italic line-clamp-1">
                "{offer.tagline}"
              </p>
            )}

            <div className="flex items-center text-slate-400 text-sm mb-4">
              <MapPin size={14} className="mr-1 text-gold" />
              <span className="line-clamp-1">{offer.hotel.name} • {offer.hotel.location}</span>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-white/10">
              <div className="flex items-center text-white group-hover/offer:text-gold transition-colors">
                <span className="text-xs uppercase tracking-widest mr-2">View Offer</span>
                <ArrowRight size={14} className="group-hover/offer:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
