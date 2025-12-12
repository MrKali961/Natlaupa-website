'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar style based on scroll
  const navbarClasses = scrolled
    ? 'bg-black/80 backdrop-blur-md py-4 shadow-lg shadow-black/50'
    : 'bg-transparent py-6';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarClasses}`}>
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">
          
          {/* Left: Logo */}
          <Link href="/" className="z-50 hover:opacity-80 transition-opacity duration-300">
            <Image
              src="/natlaupa-symbol-black.svg"
              alt="Natlaupa"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                  pathname === link.path ? 'text-gold' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Special Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/for-hotels"
              className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                pathname === '/for-hotels' ? 'text-gold' : 'text-white/70 hover:text-white'
              }`}
            >
              For Hotels
            </Link>
            <Link
              href="/become-angel"
              className="text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-deepBlue transition-all duration-300"
            >
              Become an Angel
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gold transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deepBlue z-40 flex flex-col justify-center items-center overflow-y-auto"
          >
            <div className="flex flex-col space-y-8 text-center py-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="font-serif text-4xl text-white/90 hover:text-gold italic transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="w-16 h-px bg-gold/30 mx-auto my-4" />

              {/* Special Links */}
              <Link
                href="/for-hotels"
                onClick={() => setIsOpen(false)}
                className="font-serif text-2xl text-white/70 hover:text-gold transition-colors"
              >
                For Hotels
              </Link>
              <Link
                href="/become-angel"
                onClick={() => setIsOpen(false)}
                className="font-serif text-2xl text-gold hover:text-white transition-colors"
              >
                Become an Angel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;