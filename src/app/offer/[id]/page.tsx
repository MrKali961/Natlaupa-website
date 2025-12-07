'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  Send,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';
import Footer from '@/components/Footer';
import type { Offer } from '@/lib/types';
import { isCuid } from '@/lib/slugify';

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('accommodation');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    travelDates: '',
    guests: ''
  });

  // Fetch offer data and handle redirects
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`/api/offers/${id}`);
        if (!response.ok) throw new Error('Offer not found');
        const data = await response.json();
        setOffer(data.offer);

        // Redirect ID-based URLs to slug-based URLs (SEO best practice)
        const isId = isCuid(id);
        if (isId && data.offer.slug) {
          router.replace(`/offer/${data.offer.slug}`);
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
    window.scrollTo(0, 0);
  }, [id, router]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isContactModalOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }

    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isContactModalOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          offerTitle: offer.title,
          hotelId: offer.hotel.id,
          hotelName: offer.hotel.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message,
          travelDates: formData.travelDates || undefined,
          guests: formData.guests || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '', travelDates: '', guests: '' });

      setTimeout(() => {
        setIsContactModalOpen(false);
        setFormSubmitted(false);
      }, 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group activities by category
  const activityCategories = offer?.activities.reduce((acc, activity) => {
    const category = activity.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(activity);
    return acc;
  }, {} as Record<string, typeof offer.activities>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-white mb-4">Offer Not Found</h1>
          <p className="text-slate-400 mb-8">The offer you're looking for doesn't exist.</p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Offers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Back Button */}
        <div className="fixed top-8 left-8 z-50">
          <Link
            href="/offers"
            className="flex items-center gap-2 bg-deepBlue/80 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 hover:border-gold transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm uppercase tracking-wider">All Offers</span>
          </Link>
        </div>

        {/* Hero Section - Split Screen */}
        <section className="relative h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left: Large Image */}
            <div className="relative h-full">
              <img
                src={offer.imageUrl}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deepBlue/80 lg:to-deepBlue" />
            </div>

            {/* Right: Offer Details Overlay */}
            <div className="absolute lg:relative inset-0 lg:inset-auto flex items-center justify-center lg:justify-start p-8 lg:p-16">
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gold/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                      <Clock size={14} className="text-gold" />
                      <span className="text-gold text-sm font-bold">{offer.duration} Days</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white text-sm font-bold">{offer.experienceType}</span>
                    </div>
                  </div>

                  <h1 className="font-serif text-5xl md:text-6xl text-white mb-4 leading-tight">
                    {offer.title}
                  </h1>

                  {offer.tagline && (
                    <p className="text-2xl text-gold/80 mb-8 font-light italic">
                      "{offer.tagline}"
                    </p>
                  )}

                  <div className="flex items-start gap-3 text-slate-300 mb-8">
                    <MapPin size={20} className="text-gold flex-shrink-0 mt-1" />
                    <div>
                      <Link
                        href={`/hotel/${offer.hotel.slug || offer.hotel.id}`}
                        className="text-white hover:text-gold transition-colors font-medium"
                      >
                        {offer.hotel.name}
                      </Link>
                      <p className="text-sm text-slate-400">{offer.hotel.location}, {offer.hotel.country}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="bg-gold text-deepBlue px-10 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors inline-flex items-center gap-3"
                  >
                    Reserve This Experience
                    <Send size={18} />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* The Essence */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-midnight">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="text-gold" size={20} />
                <span className="text-gold text-sm uppercase tracking-[0.3em]">The Essence</span>
              </div>
              <p className="font-serif text-3xl text-white leading-relaxed">
                {offer.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* At A Glance - 3 Column Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-deepBlue">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-4xl text-white text-center mb-16">At A Glance</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Your Base */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-sm"
              >
                <h3 className="text-gold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MapPin size={16} />
                  Your Base
                </h3>
                <Link
                  href={`/hotel/${offer.hotel.slug || offer.hotel.id}`}
                  className="group block"
                >
                  <div className="relative h-48 mb-4 overflow-hidden rounded-sm">
                    <img
                      src={offer.hotel.imageUrl}
                      alt={offer.hotel.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-serif text-2xl text-white group-hover:text-gold transition-colors mb-2">
                    {offer.hotel.name}
                  </h4>
                  <p className="text-slate-400 text-sm mb-3">{offer.hotel.category}</p>
                  <div className="flex items-center gap-2 text-gold text-sm">
                    <Star className="fill-gold" size={14} />
                    <span className="font-bold">{offer.hotel.rating}</span>
                    <span className="text-slate-500">rating</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-gold text-sm group-hover:text-white transition-colors">
                    <span>Explore Property</span>
                    <ExternalLink size={14} />
                  </div>
                </Link>
              </motion.div>

              {/* Column 2: Your Adventures */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 p-8 rounded-sm"
              >
                <h3 className="text-gold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Sparkles size={16} />
                  Your Adventures
                </h3>
                <div className="space-y-4">
                  {offer.activities.slice(0, 5).map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <Check size={16} className="text-gold mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">{activity.name}</p>
                        <p className="text-slate-400 text-xs">{activity.duration}</p>
                      </div>
                    </div>
                  ))}
                  {offer.activities.length > 5 && (
                    <p className="text-gold text-sm">+ {offer.activities.length - 5} more activities</p>
                  )}
                </div>
              </motion.div>

              {/* Column 3: Your Privileges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 p-8 rounded-sm"
              >
                <h3 className="text-gold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Star size={16} />
                  Your Privileges
                </h3>
                <div className="space-y-4">
                  {offer.hotel.amenities?.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check size={16} className="text-gold mt-1 flex-shrink-0" />
                      <p className="text-white">{amenity}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Visual Gallery - Masonry Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-midnight">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-4xl text-white text-center mb-16">Visual Journey</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {offer.galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-sm ${
                    index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${offer.title} gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                    style={{ minHeight: '200px' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Breakdown - Accordion */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-deepBlue">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl text-white text-center mb-16">Experience Breakdown</h2>

            <div className="space-y-4">
              {/* Accommodation Details */}
              <div className="border border-white/10 rounded-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'accommodation' ? null : 'accommodation')}
                  className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="font-serif text-xl text-white">Accommodation Details</span>
                  <ChevronDown
                    size={24}
                    className={`text-gold transition-transform ${
                      expandedSection === 'accommodation' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'accommodation' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 text-slate-300 space-y-3">
                        <p><strong className="text-white">Property:</strong> {offer.hotel.name}</p>
                        <p><strong className="text-white">Category:</strong> {offer.hotel.category}</p>
                        <p><strong className="text-white">Location:</strong> {offer.hotel.location}, {offer.hotel.country}</p>
                        <p className="text-sm text-slate-400">{offer.hotel.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Included Activities */}
              {Object.entries(activityCategories || {}).map(([category, activities]) => (
                <div key={category} className="border border-white/10 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === category ? null : category)}
                    className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="font-serif text-xl text-white">{category} Experiences</span>
                    <ChevronDown
                      size={24}
                      className={`text-gold transition-transform ${
                        expandedSection === category ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 space-y-4">
                          {activities.map((activity) => (
                            <div key={activity.id} className="border-b border-white/5 pb-4 last:border-0">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-medium">{activity.name}</h4>
                                <span className="text-gold text-sm">{activity.duration}</span>
                              </div>
                              <p className="text-slate-400 text-sm">{activity.description}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guest Reviews */}
        {offer.reviews && offer.reviews.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-midnight">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-4xl text-white text-center mb-16">Guest Stories</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {offer.reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 p-6 rounded-sm"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-gold fill-gold" />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-4 italic">"{review.comment}"</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-medium">{review.user}</span>
                      <span className="text-slate-500">{review.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Floating CTA Bar - Bottom Sticky */}
        <div className="fixed bottom-0 left-0 right-0 bg-deepBlue/95 backdrop-blur-sm border-t border-white/10 p-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:block">
              <p className="text-white font-serif text-lg">{offer.title}</p>
              <p className="text-slate-400 text-sm">{offer.duration} days at {offer.hotel.name}</p>
            </div>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-gold text-deepBlue px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors w-full md:w-auto"
            >
              Reserve This Experience
            </button>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-deepBlue border border-white/20 rounded-sm p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-3xl text-white">Reserve Your Experience</h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-gold" size={32} />
                  </div>
                  <h4 className="font-serif text-2xl text-white mb-2">Thank You!</h4>
                  <p className="text-slate-400">
                    We've received your inquiry and will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="bg-gold/10 border border-gold/20 p-4 rounded-sm">
                    <p className="text-white text-sm mb-1">
                      <strong>{offer.title}</strong>
                    </p>
                    <p className="text-slate-400 text-xs">
                      {offer.duration} days · {offer.hotel.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white text-sm mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm mb-2">Number of Guests</label>
                      <input
                        type="text"
                        name="guests"
                        value={formData.guests}
                        onChange={handleFormChange}
                        placeholder="e.g., 2 adults"
                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Preferred Travel Dates</label>
                    <input
                      type="text"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleFormChange}
                      placeholder="e.g., June 2025"
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Special Requests or Questions</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold focus:outline-none resize-none"
                    />
                  </div>

                  {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm text-sm">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <Send size={18} />
                      </>
                    )}
                  </button>

                  <p className="text-slate-500 text-xs text-center">
                    By submitting this form, you agree to be contacted by our team regarding your inquiry.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
