'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <>
      <main className="bg-deepBlue min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl text-white mb-8 text-center"
          >
            Our Story
          </motion.h1>

          <div className="prose prose-lg prose-invert mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 font-light leading-relaxed text-center mb-12"
            >
              Natlaupa was born from a simple belief: Travel is not just about moving from point A to point B. It is an art form.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
              <motion.img
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src="https://picsum.photos/600/800?random=88"
                alt="Founders"
                className="rounded-sm shadow-xl border border-white/5"
              />
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl text-gold font-serif mb-4">Curating the Exceptional</h3>
                <p className="text-slate-400 mb-6">
                  We scour the globe for properties that offer more than just a bed. We look for stories, for architectural marvels, and for service that anticipates your needs before you do.
                </p>
                <p className="text-slate-400">
                  From the icy fjords of Iceland to the sun-drenched coasts of the Mediterranean, our collection is meticulously handpicked to ensure every stay is a memory etched in gold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
