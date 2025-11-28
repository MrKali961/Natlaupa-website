import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../constants';
import Footer from '../components/Footer';

const AllDestinations: React.FC = () => {
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
              <MapPin size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">Explore the World</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
              Destinations
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Journey to the world's most captivating corners, where luxury meets authentic experience.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Destinations Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DESTINATIONS.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/destination/${destination.id}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden mb-4">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-gold transition-colors">
                        {destination.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{destination.country}</span>
                        <div className="flex items-center text-gold">
                          <Thermometer size={14} className="mr-1" />
                          <span className="text-sm">{destination.temp}°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <p className="text-slate-400 text-sm">{destination.description}</p>
                    <ArrowRight size={18} className="text-slate-500 group-hover:text-gold group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
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

export default AllDestinations;
