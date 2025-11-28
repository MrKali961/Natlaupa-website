'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="bg-deepBlue min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <h1 className="font-serif text-[150px] md:text-[200px] leading-none text-gold/20 select-none">
            404
          </h1>

          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl text-white -mt-8 mb-6">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto">
            The destination you're looking for seems to have moved or doesn't exist.
            Let us help you find your way back.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/#experience-selector"
              className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:border-gold hover:text-gold transition-colors"
            >
              <Search size={18} />
              Explore Destinations
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      </div>
    </main>
  );
}
