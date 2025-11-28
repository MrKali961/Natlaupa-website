'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle newsletter signup
    setTimeout(() => {
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-black">
      {/* Top Section - Brand & Social */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h2 className="font-serif text-4xl text-white tracking-wide mb-2">
                NATLAUPA
              </h2>
              <div className="w-16 h-px bg-gold mx-auto md:mx-0 mb-4" />
              <p className="text-slate-500 text-sm tracking-widest uppercase">
                Redefining the Art of Stay
              </p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-6"
            >
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Facebook, href: '#', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-slate-500 hover:text-gold transition-colors duration-300"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Middle Section - Navigation */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-x-3 gap-y-4"
          >
            {navLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link
                  href={link.path}
                  className="text-slate-400 text-sm tracking-wide hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="text-slate-700">·</span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-8">
              Subscribe for exclusive access
            </p>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex border-b border-slate-700 focus-within:border-gold transition-colors duration-300">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-transparent py-4 text-white text-center text-sm tracking-wide focus:outline-none placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 text-gold hover:text-white transition-colors duration-300 disabled:opacity-50"
                >
                  <ArrowRight size={20} strokeWidth={1.5} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - Copyright & Credits */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} Natlaupa. All rights reserved.</p>
          <p>
            Powered by{' '}
            <span className="text-gold font-medium">The Elites</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
