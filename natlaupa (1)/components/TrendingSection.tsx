import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRENDING_HOTELS } from '../constants';

const TrendingSection: React.FC = () => {
  return (
    <section className="py-24 bg-deepBlue overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-3xl md:text-4xl text-white">Trending Now</h2>
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <Flame className="relative text-red-500" size={24} />
            </div>
          </div>
          <Link to="/offers" className="hidden md:flex items-center text-gold text-sm uppercase tracking-widest hover:text-white transition-colors">
            View All <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRENDING_HOTELS.map((hotel) => (
            <Link key={hotel.id} to={`/offer/${hotel.id}`} className="block">
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-midnight rounded-sm overflow-hidden group border border-white/5 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-300 h-full flex flex-col"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={hotel.imageUrl} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <Star size={12} className="text-gold fill-gold mr-1" />
                    <span className="text-deepBlue text-xs font-bold">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-gold text-xs uppercase tracking-wider mb-3">{hotel.category}</p>
                  
                  <div className="mb-6 flex-grow">
                    <h3 className="text-2xl text-white font-serif mb-2 group-hover:text-gold transition-colors duration-300">{hotel.name}</h3>
                    <p className="text-slate-400 text-sm font-light tracking-wide uppercase">{hotel.location}</p>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 mt-auto">
                    <button className="w-full text-center py-3 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-[0.2em] group-hover:bg-gold group-hover:text-deepBlue group-hover:border-gold transition-all duration-300">
                      {hotel.ctaPhrase || "Discover More"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {/* Mobile Link for View All */}
        <div className="md:hidden mt-8 text-center">
            <Link to="/offers" className="inline-flex items-center text-gold text-sm uppercase tracking-widest hover:text-white transition-colors">
                View All Offers <ArrowRight size={16} className="ml-2" />
            </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;