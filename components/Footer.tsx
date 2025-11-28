import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Send, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
          alt="Luxury Hotel Lobby"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deepBlue via-deepBlue/95 to-deepBlue" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Ambient Gold Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">

        {/* Main CTA Section */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6">Begin Your Journey</p>
              <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
                Reserve Your <span className="italic">Experience</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg font-light">
                Join the world's most discerning travelers in discovering accommodations that transcend the ordinary.
              </p>
              <Link
                to="/offers"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-3 bg-gold text-deepBlue px-10 py-5 font-bold uppercase tracking-[0.2em] text-sm hover:bg-white transition-all duration-500 group"
              >
                <span>Explore Collection</span>
                <ArrowRight
                  size={18}
                  className={`transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`}
                />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Glassmorphism Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

            {/* Brand Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 hover:border-gold/30 transition-all duration-500"
            >
              <span className="font-serif text-3xl font-bold tracking-wider text-white block mb-2">
                NATLAUPA
              </span>
              <div className="w-12 h-0.5 bg-gold mb-6" />
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Curating the world's finest stays for the discerning traveler.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:border-gold hover:text-gold transition-all duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:border-gold hover:text-gold transition-all duration-300">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:border-gold hover:text-gold transition-all duration-300">
                  <Facebook size={18} />
                </a>
              </div>
            </motion.div>

            {/* Explore Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 hover:border-gold/30 transition-all duration-500"
            >
              <h4 className="text-white font-serif text-xl mb-6">Explore</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'About Us', path: '/about' },
                  { name: 'Destinations', path: '/destinations' },
                  { name: 'All Offers', path: '/offers' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-400 text-sm hover:text-gold transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Partner Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 hover:border-gold/30 transition-all duration-500"
            >
              <h4 className="text-white font-serif text-xl mb-6">Partner</h4>
              <ul className="space-y-4">
                {[
                  { name: 'For Hotels', path: '/for-hotels' },
                  { name: 'Become an Angel', path: '/become-angel' },
                  { name: 'Accommodation Styles', path: '/styles' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-400 text-sm hover:text-gold transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/5">
                <h5 className="text-white text-xs uppercase tracking-widest mb-4">Legal</h5>
                <ul className="space-y-2">
                  {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
                    <li key={item}>
                      <Link to="#" className="text-slate-500 text-xs hover:text-gold transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Newsletter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gold/20 to-gold/5 backdrop-blur-xl border border-gold/20 rounded-sm p-8"
            >
              <h4 className="text-white font-serif text-xl mb-2">VIP Access</h4>
              <p className="text-slate-400 text-sm mb-6">
                Exclusive offers and hidden gems, delivered to your inbox.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full bg-deepBlue/50 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-deepBlue py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <Send size={14} />
                </button>
              </form>
              <p className="text-slate-500 text-xs mt-4">
                Join 10,000+ luxury travelers worldwide.
              </p>
            </motion.div>

          </div>

          {/* Contact Info Bar */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-t border-b border-white/5 mb-8">
            <a href="#" className="flex items-center text-slate-400 hover:text-gold transition-colors group">
              <MapPin size={16} className="mr-2 text-gold" />
              <span className="text-sm">London, United Kingdom</span>
            </a>
            <a href="tel:+44123456789" className="flex items-center text-slate-400 hover:text-gold transition-colors">
              <Phone size={16} className="mr-2 text-gold" />
              <span className="text-sm">+44 123 456 789</span>
            </a>
            <a href="mailto:hello@natlaupa.com" className="flex items-center text-slate-400 hover:text-gold transition-colors">
              <Mail size={16} className="mr-2 text-gold" />
              <span className="text-sm">hello@natlaupa.com</span>
            </a>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; 2024 Natlaupa. All rights reserved.</p>
            <p className="mt-2 md:mt-0 italic">Designed for those who seek the extraordinary.</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
