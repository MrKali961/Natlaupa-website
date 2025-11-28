import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DESTINATIONS, TRENDING_HOTELS } from '../constants';
import Footer from '../components/Footer';
import { ArrowLeft, MapPin } from 'lucide-react';

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const destination = DESTINATIONS.find(d => d.id === id);

  if (!destination) return <div className="p-20 text-white">Destination not found</div>;

  // Mock finding hotels in this destination (fuzzy match for demo)
  const hotels = TRENDING_HOTELS.filter(h => h.location.includes(destination.name) || h.location.includes(destination.country));

  return (
    <div className="bg-deepBlue min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] w-full">
        <img src={destination.imageUrl} className="w-full h-full object-cover grayscale brightness-50" alt={destination.name} />
        <div className="absolute top-32 left-8">
             <Link to="/destinations" className="flex items-center text-white/70 hover:text-gold transition-colors mb-6">
                <ArrowLeft size={20} className="mr-2" />
                <span className="uppercase tracking-widest text-xs font-bold">Back to Map</span>
             </Link>
             <h1 className="text-6xl md:text-8xl font-serif text-white mb-4">{destination.name}</h1>
             <p className="text-gold text-xl uppercase tracking-[0.2em]">{destination.country}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <p className="text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mb-16 border-l-4 border-gold pl-8">
            {destination.description} A place where history and modernity converge to create an atmosphere unlike any other.
        </p>

        <h2 className="text-3xl font-serif text-white mb-8">Available Properties</h2>
        {hotels.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {hotels.map(h => (
                   <Link key={h.id} to={`/offer/${h.id}`} className="block group">
                       <div className="flex items-start space-x-4 p-4 border border-white/10 hover:border-gold/30 transition-colors bg-white/5 rounded-sm">
                           <img src={h.imageUrl} className="w-24 h-24 object-cover" alt={h.name} />
                           <div>
                               <h3 className="text-xl text-white font-serif">{h.name}</h3>
                               <p className="text-gold text-xs uppercase tracking-wider mb-2">{h.category}</p>
                               <p className="text-slate-400 text-sm line-clamp-2">{h.description}</p>
                           </div>
                       </div>
                   </Link>
               ))}
           </div>
        ) : (
            <div className="p-8 border border-white/10 text-slate-400 text-center rounded-sm">
                No properties currently listed in the public collection for this region. 
                <br/>Contact our concierge for private listings.
            </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DestinationDetail;