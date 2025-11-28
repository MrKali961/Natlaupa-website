import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, ArrowRight } from 'lucide-react';
import { CATEGORIES, TRENDING_HOTELS } from '../constants';
import Footer from '../components/Footer';

const StyleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const category = CATEGORIES.find(c => c.id === id);
  const filteredHotels = TRENDING_HOTELS.filter(h => h.category === category?.name);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!category) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-serif mb-4">Style Not Found</h2>
          <Link to="/styles" className="text-gold hover:underline">View All Styles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deepBlue min-h-screen text-slate-100">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/50 to-transparent" />
        </div>

        <div className="absolute top-28 left-4 md:top-32 md:left-8 z-20">
          <Link to="/styles" className="flex items-center text-white/70 hover:text-gold transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-bold">All Styles</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-gold text-sm font-bold tracking-widest uppercase mb-4 block">
              {category.count} Properties
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none">
              {category.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Properties Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-white mb-12">{category.name} Collection</h2>

          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel, index) => (
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
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-6">No properties currently available in this category.</p>
              <Link to="/offers" className="text-gold hover:underline">Browse All Offers</Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StyleDetail;
