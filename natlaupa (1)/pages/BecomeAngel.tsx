import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { Crown, Sparkles, Key } from 'lucide-react';

const BecomeAngel: React.FC = () => {
  return (
    <div className="bg-deepBlue min-h-screen pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block p-4 rounded-full border border-gold/30 mb-6"
                >
                    <Crown size={32} className="text-gold" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">The Angel Program</h1>
                <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto">
                    Unlock a world of privileges. Become part of the inner circle and experience travel without boundaries.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { icon: Key, title: "Priority Access", desc: "First rights to book new properties and limited-time seasonal collections." },
                    { icon: Sparkles, title: "Bespoke Concierge", desc: "A dedicated lifestyle manager available 24/7 for requests beyond the hotel." },
                    { icon: Crown, title: "Elite Status", desc: "Automatic room upgrades, late check-outs, and welcome amenities at all partner hotels." }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-midnight p-8 border border-white/5 text-center hover:border-gold/30 transition-colors"
                    >
                        <item.icon size={32} className="text-gold mx-auto mb-6" />
                        <h3 className="text-xl text-white font-serif mb-4">{item.title}</h3>
                        <p className="text-slate-400 font-light">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto text-center border-t border-white/10 pt-16 pb-24">
                <h2 className="text-3xl font-serif text-white mb-8">Request Invitation</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="flex-grow bg-white/5 border border-white/10 px-6 py-4 text-white focus:border-gold focus:outline-none"
                    />
                    <button className="bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap">
                        Join Waitlist
                    </button>
                </div>
                <p className="text-slate-500 text-xs mt-4">Membership is by invitation or application only.</p>
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default BecomeAngel;