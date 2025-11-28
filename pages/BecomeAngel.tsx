import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Gift, Globe, Star, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';

const BecomeAngel: React.FC = () => {
  const perks = [
    {
      icon: Gift,
      title: 'Exclusive Rewards',
      description: 'Earn points redeemable for complimentary stays and experiences.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Priority booking at partner properties worldwide.',
    },
    {
      icon: Star,
      title: 'VIP Treatment',
      description: 'Room upgrades, early check-in, and personalized amenities.',
    },
  ];

  const requirements = [
    'Passion for luxury travel and hospitality',
    'Active social media presence or professional network',
    'Commitment to sharing authentic experiences',
    'Alignment with Natlaupa brand values',
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
              <Heart size={16} />
              <span className="text-sm font-bold tracking-widest uppercase">Ambassador Program</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
              Become an Angel
            </h1>
            <p className="text-slate-400 text-lg">
              Join our exclusive community of travel connoisseurs and share the world's most
              exceptional experiences with those who seek them.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Perks Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perks.map((perk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 hover:border-gold/30 transition-colors"
              >
                <perk.icon size={32} className="text-gold mb-6" />
                <h3 className="font-serif text-2xl text-white mb-4">{perk.title}</h3>
                <p className="text-slate-400">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="bg-midnight border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-4xl text-white mb-6">Who We're Looking For</h2>
              <p className="text-slate-400 mb-8">
                Natlaupa Angels are more than ambassadors—they're curators of experience,
                storytellers who inspire others to explore the extraordinary.
              </p>
              <ul className="space-y-4 mb-8">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-slate-300"
                  >
                    <CheckCircle size={18} className="text-gold mr-3 flex-shrink-0" />
                    {req}
                  </motion.li>
                ))}
              </ul>
              <p className="text-slate-500 text-sm">
                Selected Angels receive a personalized welcome kit and dedicated concierge support.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-8 md:p-10"
            >
              <h3 className="font-serif text-2xl text-white mb-6">Apply Now</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Social Profile</label>
                  <input
                    type="url"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="Instagram, LinkedIn, or Website URL"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gold mb-2">Why Natlaupa?</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold focus:outline-none transition-colors"
                    placeholder="Tell us why you'd be a great Natlaupa Angel..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-deepBlue font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors duration-300"
                >
                  Submit Application
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

export default BecomeAngel;
