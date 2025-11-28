import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, TRENDING_HOTELS } from '../constants';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

const StyleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const category = CATEGORIES.find(c => c.id === id);

  if (!category) return <div className="p-20 text-white">Category not found</div>;

  const hotels = TRENDING_HOTELS.filter(h => h.category === category.name);

  return (
    <div className="bg-deepBlue min-h-screen pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
             <Link to="/styles" className="flex items-center text-white/70 hover:text-gold transition-colors mb-8">
                <ArrowLeft size={20} className="mr-2" />
                <span className="uppercase tracking-widest text-xs font-bold">Back to Styles</span>
             </Link>

             <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/10 pb-8">
                <h1 className="text-5xl md:text-7xl font-serif text-white">{category.name}</h1>
                <p className="text-slate-400 mt-4 md:mt-0 max-w-md text-right">
                    Discover our collection of {category.name.toLowerCase()}. 
                    {category.count} properties curated for their unique architectural narrative.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {hotels.map(hotel => (
                     <Link key={hotel.id} to={`/offer/${hotel.id}`} className="group">
                        <div className="relative overflow-hidden aspect-[4/5] mb-4">
                             <img 
                                src={hotel.imageUrl} 
                                alt={hotel.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-2xl text-white font-serif">{hotel.name}</h3>
                                <p className="text-gold text-xs uppercase tracking-widest">{hotel.location}</p>
                            </div>
                        </div>
                     </Link>
                ))}
             </div>
        </div>
        <Footer />
    </div>
  );
};

export default StyleDetail;