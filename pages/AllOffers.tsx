import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { TRENDING_HOTELS } from '../constants';
import Footer from '../components/Footer';

const AllOffers: React.FC = () => {
  return (
    <div className="bg-deepBlue min-h-screen text-slate-100">
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-gold mb-4">
              <Star className="fill-gold" size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">Curated Collection</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
              All Offers
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Discover our handpicked selection of the world's most extraordinary accommodations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Offers Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TRENDING_HOTELS.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/offer/${hotel.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-4">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                    <div className="absolute top-4 left-4 bg-gold text-deepBlue px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      {hotel.category}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl text-white group-hover:text-gold transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-gold">
                        <Star size={14} className="fill-gold mr-1" />
                        <span className="text-sm">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin size={14} className="mr-1" />
                      {hotel.location}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-white font-serif text-lg">
                        ${hotel.price}<span className="text-slate-500 text-sm">/night</span>
                      </span>
                      <ArrowRight size={18} className="text-slate-500 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllOffers;
