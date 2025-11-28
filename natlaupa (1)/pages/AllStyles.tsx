import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import Footer from '../components/Footer';

const AllStyles: React.FC = () => {
  return (
    <div className="bg-deepBlue min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl text-white mb-6"
        >
          Curated Styles
        </motion.h1>
        <p className="text-slate-400 text-lg font-light max-w-2xl">
          Find the architecture that speaks to your soul.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => (
             <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
             >
                <Link to={`/style/${cat.id}`} className="block group">
                  <div className="relative h-96 overflow-hidden rounded-sm border border-white/5">
                    <img 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale" 
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex flex-col justify-center items-center text-center p-6">
                      <h3 className="text-3xl text-white font-serif mb-2">{cat.name}</h3>
                      <div className="w-12 h-0.5 bg-gold group-hover:w-24 transition-all duration-300 mb-4" />
                      <p className="text-white/70 text-sm uppercase tracking-widest">{cat.count} Properties</p>
                    </div>
                  </div>
                </Link>
             </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllStyles;