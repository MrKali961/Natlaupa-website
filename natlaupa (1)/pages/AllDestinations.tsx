import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DESTINATIONS } from '../constants';
import Footer from '../components/Footer';

const AllDestinations: React.FC = () => {
  return (
    <div className="bg-deepBlue min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-6xl text-white mb-6"
        >
          Destinations
        </motion.h1>
        <p className="text-slate-400 text-lg font-light max-w-2xl">
          From the arctic circle to the equator. Discover locations that redefine the map.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DESTINATIONS.map((dest, idx) => (
             <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
             >
                <Link to={`/destination/${dest.id}`} className="block group relative h-80 rounded-sm overflow-hidden">
                    <img 
                      src={dest.imageUrl} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 p-8">
                        <p className="text-gold text-xs uppercase tracking-widest mb-2">{dest.country}</p>
                        <h3 className="text-4xl text-white font-serif">{dest.name}</h3>
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

export default AllDestinations;