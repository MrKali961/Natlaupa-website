import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const ForHotels: React.FC = () => {
  return (
    <div className="bg-deepBlue min-h-screen pt-32">
       <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold">Partnership</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mt-4 mb-8">Join the Collection</h1>
          <p className="text-slate-300 text-lg font-light leading-relaxed">
            Natlaupa invites exceptional properties to join our curated portfolio. 
            We look for the unique, the historic, and the architecturally significant.
          </p>
       </div>

       <div className="max-w-2xl mx-auto px-4 pb-24">
          <div className="bg-midnight border border-white/10 p-8 md:p-12 rounded-sm">
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white text-xs uppercase tracking-wide mb-2">Property Name</label>
                        <input type="text" className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-white text-xs uppercase tracking-wide mb-2">Location</label>
                        <input type="text" className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-white text-xs uppercase tracking-wide mb-2">Website URL</label>
                    <input type="url" className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                    <label className="block text-white text-xs uppercase tracking-wide mb-2">Contact Person</label>
                    <input type="text" className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none" />
                </div>
                <div>
                    <label className="block text-white text-xs uppercase tracking-wide mb-2">Tell us about your property</label>
                    <textarea rows={5} className="w-full bg-deepBlue border border-white/10 p-3 text-white focus:border-gold focus:outline-none"></textarea>
                </div>
                <button className="w-full bg-gold text-deepBlue py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Submit Application
                </button>
             </form>
          </div>
       </div>
       <Footer />
    </div>
  );
};

export default ForHotels;