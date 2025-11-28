'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, ShieldCheck, Wifi, Coffee, Globe, ChevronLeft, ChevronRight, MessageSquare, Send, X } from 'lucide-react';
import { TRENDING_HOTELS } from '@/lib/constants';
import Footer from '@/components/Footer';

export default function OfferDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const hotel = TRENDING_HOTELS.find(h => h.id === id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactModalOpen(false);
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Offer Expired</h2>
          <Link href="/" className="text-gold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deepBlue min-h-screen text-slate-100">
      {/* Hero Section */}
      <div className="relative h-[100dvh] w-full">
        <div className="absolute inset-0">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-28 left-4 md:top-32 md:left-8 z-20">
          <Link href="/" className="flex items-center text-white/70 hover:text-gold transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-bold">Back to Collection</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-2 text-gold mb-4">
              <Star className="fill-gold" size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">Premium Collection</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none break-words hyphens-auto">
              {hotel.name}
            </h1>
            <div className="flex items-center text-lg md:text-xl text-slate-300 font-light">
              <MapPin size={20} className="mr-2 text-gold" />
              <span>{hotel.location}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery Section */}
      {hotel.galleryImages && hotel.galleryImages.length > 0 && (
        <div className="bg-deepBlue border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-serif text-2xl text-white">Visual Narrative</h3>
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-2 border border-white/20 rounded-full hover:bg-gold hover:text-deepBlue hover:border-gold transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => scroll('right')} className="p-2 border border-white/20 rounded-full hover:bg-gold hover:text-deepBlue hover:border-gold transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x"
              data-lenis-prevent
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {hotel.galleryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] h-[250px] md:h-[300px] flex-shrink-0 snap-center relative group overflow-hidden rounded-sm border border-white/10"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        {/* Main Details */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-6 md:mb-8">The Experience</h2>
            <p className="font-serif text-xl md:text-3xl leading-relaxed text-white/90 mb-8 md:mb-12">
              {hotel.description}
            </p>

            <div className="border-t border-white/10 pt-12">
              <h3 className="text-lg font-serif text-white mb-6">Amenities & Privileges</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center text-slate-400">
                  <ShieldCheck className="mr-3 text-gold" size={20} />
                  <span className="text-sm md:text-base">Private Concierge</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Wifi className="mr-3 text-gold" size={20} />
                  <span className="text-sm md:text-base">High-Speed Privacy</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Coffee className="mr-3 text-gold" size={20} />
                  <span className="text-sm md:text-base">Bespoke Dining</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Globe className="mr-3 text-gold" size={20} />
                  <span className="text-sm md:text-base">Exclusive Access</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-5 relative order-first lg:order-last">
          <div className="sticky top-32 p-6 md:p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm">
            <h3 className="font-serif text-3xl text-white mb-2">Reserve Your Sanctuary</h3>
            <p className="text-slate-400 text-sm mb-8">Limited availability for the upcoming season.</p>

            <div className="space-y-4">
              <button className="w-full bg-gold text-deepBlue py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300">
                Request Private Access
              </button>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full bg-transparent border border-white/20 text-white py-4 font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors duration-300"
              >
                Contact Hotel
              </button>
            </div>

            <p className="mt-6 text-xs text-center text-slate-500">
              *Membership verification may be required for booking.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-midnight border-t border-white/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-white">Guest Impressions</h2>
            <div className="hidden md:flex items-center space-x-2 text-gold">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} className="fill-gold" />)}
              </div>
              <span className="text-sm font-bold tracking-widest uppercase ml-2">4.9/5 Average</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotel.reviews?.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 p-8 rounded-sm hover:border-gold/30 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">{review.date}</span>
                </div>
                <p className="text-slate-300 italic mb-6 leading-relaxed">&quot;{review.comment}&quot;</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-deepBlue border border-gold/30 flex items-center justify-center text-gold text-xs font-bold mr-3">
                    {review.user.charAt(0)}
                  </div>
                  <span className="text-white text-xs font-bold uppercase tracking-widest">{review.user}</span>
                </div>
              </motion.div>
            ))}

            {/* Add Review Visual CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-deepBlue border border-dashed border-white/10 p-8 rounded-sm flex flex-col justify-center items-center text-center group hover:border-gold/50 transition-colors cursor-pointer"
            >
              <MessageSquare size={32} className="text-slate-500 mb-4 group-hover:text-gold transition-colors" />
              <h4 className="text-white font-serif text-xl mb-2">Share Your Story</h4>
              <p className="text-slate-500 text-sm mb-6">We invite you to detail your experience.</p>
              <div className="w-full relative">
                <input
                  type="text"
                  disabled
                  placeholder="Begin typing..."
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none cursor-pointer"
                />
                <Send size={14} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsContactModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deepBlue border border-white/10 p-8 md:p-10 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="font-serif text-3xl text-white mb-2">Contact {hotel.name}</h3>
              <p className="text-slate-400 text-sm mb-8">Direct inquiry regarding your stay.</p>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="Inquiry details..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300"
                >
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
