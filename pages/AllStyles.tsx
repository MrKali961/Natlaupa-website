import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import Footer from '../components/Footer';

const AllStyles: React.FC = () => {
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
              <Layers size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">Find Your Style</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
              Accommodation Styles
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              From eco-conscious retreats to historic grandeur, discover accommodations that match your vision of luxury.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Styles Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/style/${category.id}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden mb-4">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-serif text-3xl text-white mb-2 group-hover:text-gold transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-slate-300">{category.count} properties</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <p className="text-slate-400 text-sm">Explore {category.name.toLowerCase()} collection</p>
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

export default AllStyles;
