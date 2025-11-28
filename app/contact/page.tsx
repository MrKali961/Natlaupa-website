'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <>
      <main className="bg-deepBlue min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl text-white mb-6">Get in Touch</h1>
            <p className="text-slate-400 text-lg font-light mb-12">
              Our concierge team is available 24/7 to assist with your inquiries. Whether you are planning a honeymoon or a corporate retreat, we are here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Mail className="text-gold mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Email Us</h4>
                  <p className="text-slate-400">concierge@natlaupa.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="text-gold mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Call Us</h4>
                  <p className="text-slate-400">+1 (800) 555-0199</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="text-gold mt-1" />
                <div>
                  <h4 className="text-white font-semibold">Visit Us</h4>
                  <p className="text-slate-400">101 Luxury Lane, Suite 500<br />Beverly Hills, CA 90210</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-midnight/50 p-8 border border-white/5 rounded-sm backdrop-blur-sm"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-white text-sm uppercase tracking-wide mb-2">Name</label>
                <input type="text" className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-white text-sm uppercase tracking-wide mb-2">Email</label>
                <input type="email" className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-white text-sm uppercase tracking-wide mb-2">Message</label>
                <textarea rows={5} className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors" placeholder="How can we assist you?"></textarea>
              </div>
              <button className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
