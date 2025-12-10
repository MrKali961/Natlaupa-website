'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Star, Users, Crown, ArrowRight, Shield, Lock, CheckCircle, X, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const perks = [
  {
    icon: Gift,
    title: 'Exclusive Rewards',
    description: 'Earn generous commissions and exclusive travel credits for every successful referral you make.'
  },
  {
    icon: Star,
    title: 'VIP Access',
    description: 'Get early access to new properties, special rates, and members-only experiences before anyone else.'
  },
  {
    icon: Crown,
    title: 'Elite Status',
    description: 'Join an exclusive community of travel connoisseurs and hospitality enthusiasts worldwide.'
  }
];

const membershipDetails = [
  {
    icon: Shield,
    title: 'Annual Fee',
    description: '$60 per year',
    note: 'Open to verified mid-level hospitality professionals only'
  },
  {
    icon: Lock,
    title: 'Member Expectations',
    description: 'Uphold the highest standards of professionalism, maintain strict confidentiality, and actively contribute to the Angel community\'s growth and reputation.'
  }
];

const steps = [
  { number: '01', title: 'Apply', description: 'Submit your application with your hospitality credentials' },
  { number: '02', title: 'Verification', description: 'Our team verifies your professional background' },
  { number: '03', title: 'Activate', description: 'Complete your membership fee to activate your account' },
  { number: '04', title: 'Connect', description: 'Join the community and start earning rewards' }
];

const benefits = [
  'Priority booking access',
  'Exclusive member rates',
  'Quarterly networking events',
  'Dedicated Angel support line',
  'Early access to new properties',
  'Personalized travel recommendations'
];

export default function BecomeAngel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/angel-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit application');
      }

      setFormSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        reason: '',
      });

      setTimeout(() => {
        setIsModalOpen(false);
        setFormSubmitted(false);
      }, 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lock scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // Pause Lenis smooth scroll if active
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      // Resume Lenis smooth scroll
      if (window.lenis) {
        window.lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isModalOpen]);

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Sparkles className="text-gold" size={28} />
              <span className="text-gold text-sm uppercase tracking-[0.3em]">Angel Program</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-8"
            >
              Join Natlaupa's Elite Angel Program
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Step into a world where your expertise fuels luxury travel—and your performance is richly rewarded. <strong className="text-white">Connect. Collaborate. Earn.</strong> As a Natlaupa Angel, you become an integral part of our global network. Drive high-impact partnerships, share bespoke experiences with discerning clients, and unlock a revenue stream that grows with every referral.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Apply Now
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Perks Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white text-center mb-16"
            >
              Angel Benefits
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {perks.map((perk, index) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-8 border border-white/10 rounded-sm hover:border-gold/30 transition-colors"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <perk.icon className="text-gold" size={28} />
                  </div>
                  <h3 className="font-serif text-xl text-white mb-4">{perk.title}</h3>
                  <p className="text-slate-400">{perk.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Details Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm uppercase tracking-[0.3em] mb-4 block">Exclusive Membership</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white">
                Membership Details
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {membershipDetails.map((detail, index) => (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 border border-white/10 rounded-sm bg-deepBlue/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <detail.icon className="text-gold" size={24} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-white mb-2">{detail.title}</h3>
                      <p className="text-gold font-serif text-lg mb-2">{detail.description}</p>
                      {detail.note && (
                        <p className="text-slate-500 text-sm italic">{detail.note}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 border border-gold/20 rounded-sm bg-gold/5"
            >
              <h3 className="font-serif text-xl text-white mb-6 text-center">What You Receive</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="text-gold flex-shrink-0" size={18} />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white text-center mb-16"
            >
              How It Works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
                    <span className="font-serif text-xl text-gold">{step.number}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-midnight/50 to-deepBlue">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center"
            >
              <Users className="text-gold" size={36} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl text-white mb-6"
            >
              Join the Community
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mb-4"
            >
              Connect with fellow Angels, share travel stories, and be part of an exclusive network
              that shapes the future of luxury travel.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-slate-500 text-sm mb-8 italic"
            >
              No payment on the website. Submit the form and our team will contact you to complete the registration.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Start Your Journey
                <ArrowRight size={18} />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deepBlue border border-white/10 p-8 md:p-10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              data-lenis-prevent
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                    <ShieldCheck className="text-gold" size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-2">Application Received</h3>
                  <p className="text-slate-400">Our team will contact you shortly to verify your credentials and complete your registration.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-gold" size={24} />
                    <h3 className="font-serif text-2xl text-white">Angel Application</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">
                    Complete the form below to apply for the Angel Program.
                  </p>
                  <p className="text-gold text-sm mb-6">
                    Annual membership: $60/year (verified hospitality professionals only)
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm">
                        {formError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gold mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                          placeholder="Jane"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gold mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">Location (Optional)</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="New York, NY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">Hospitality Experience (Optional)</label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="Describe your professional background in hospitality (e.g., Concierge at The Ritz for 5 years)..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gold mb-2">Why do you want to become an Angel? (Min 50 characters)</label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        required
                        minLength={50}
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                        placeholder="Tell us about your passion for hospitality and how you can contribute to our community (minimum 50 characters)..."
                      />
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                      <p className="text-slate-400 text-xs">
                        By submitting this application, you confirm that you are a mid-level hospitality professional
                        and agree to uphold the highest standards of professionalism and confidentiality.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
