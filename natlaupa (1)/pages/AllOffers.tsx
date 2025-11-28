import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TRENDING_HOTELS } from '../constants';
import Footer from '../components/Footer';
import { Star, ArrowRight } from 'lucide-react';

const AllOffers: React.FC = () => {
  return (
    <div className="bg-deepBlue min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl text-white mb-6"
        >
          The Collection
        </motion.h1>
        <p className="text-slate-400 text-lg font-light max-w-2xl">
          An exclusive anthology of the world's most distinguished properties. Each chosen for its character, service, and ability to transport you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRENDING_HOTELS.map((hotel, idx) => (
             <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
             >
                <Link to={`/offer/${hotel.id}`} className="block group">
                  <div className="bg-midnight rounded-sm overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={hotel.imageUrl} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                      />
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center">
                        <Star size={12} className="text-gold fill-gold mr-1" />
                        <span className="text-white text-xs font-bold">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gold text-xs uppercase tracking-wider mb-2">{hotel.category}</p>
                      <h3 className="text-2xl text-white font-serif mb-1 group-hover:text-gold transition-colors">{hotel.name}</h3>
                      <p className="text-slate-400 text-sm mb-6">{hotel.location}</p>
                      
                      <div className="flex items-center text-white/70 text-sm uppercase tracking-widest font-bold group-hover:text-white transition-colors">
                        Explore <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
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

export default AllOffers;