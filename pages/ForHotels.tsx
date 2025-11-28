import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, Shield, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';

const ForHotels: React.FC = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increased Visibility',
      description: 'Reach high-net-worth travelers actively seeking luxury accommodations.',
    },
    {
      icon: Users,
      title: 'Quality Clientele',
      description: 'Connect with discerning guests who appreciate premium experiences.',
    },
    {
      icon: Shield,
      title: 'Brand Protection',
      description: 'Your property is presented alongside other world-class establishments.',
    },
  ];

  const features = [
    'Dedicated property page with full gallery',
    'Featured placement in curated collections',
    'Direct booking integration',
    'Performance analytics dashboard',
    'Priority customer support',
    'Marketing collaboration opportunities',
  ];

  return (
    <div className="bg-deepBlue min-h-screen text-slate-100">
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center space-x-2 text-gold mb-4">
              <Building2 size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">Partner With Us</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
              For Hotels
            </h1>
            <p className="text-slate-400 text-lg">
              Join Natlaupa's exclusive network of premium properties and connect with travelers
              who seek extraordinary experiences.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 hover:border-gold/30 transition-colors"
              >
                <benefit.icon size={32} className="text-gold mb-6" />
                <h3 className="font-serif text-2xl text-white mb-4">{benefit.title}</h3>
                <p className="text-slate-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-midnight border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl text-white mb-6">What We Offer</h2>
              <p className="text-slate-400 mb-8">
                Our partnership program is designed to showcase your property to the right audience
                while maintaining the exclusivity that defines luxury hospitality.
              </p>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-slate-300"
                  >
                    <CheckCircle size={18} className="text-gold mr-3 flex-shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-8 md:p-10"
            >
              <h3 className="font-serif text-2xl text-white mb-6">Request Partnership</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Property Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="The Grand Hotel"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Contact Email</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="partnerships@hotel.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Message</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="Tell us about your property..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForHotels;
