'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [useDarkLogo, setUseDarkLogo] = useState(false);
  const pathname = usePathname();

  // Detect if background behind navbar is light or dark
  const detectBackgroundBrightness = useCallback(() => {
    if (typeof window === 'undefined') return;

    // When scrolled, navbar has dark background, so always use white logo
    if (scrolled) {
      setUseDarkLogo(false);
      return;
    }

    // Sample point behind the navbar (center of navbar area)
    const sampleX = window.innerWidth / 2;
    const sampleY = 40; // Middle of navbar height

    // Temporarily hide navbar to sample background
    const navbar = document.querySelector('nav');
    if (!navbar) return;

    const originalPointerEvents = navbar.style.pointerEvents;
    navbar.style.pointerEvents = 'none';

    // Get element at that point
    const elementBehind = document.elementFromPoint(sampleX, sampleY);
    navbar.style.pointerEvents = originalPointerEvents;

    if (!elementBehind) {
      setUseDarkLogo(false);
      return;
    }

    // Get computed background color
    const computedStyle = window.getComputedStyle(elementBehind);
    const bgColor = computedStyle.backgroundColor;

    // Parse RGB values
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      // Calculate perceived brightness (using luminance formula)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // If brightness > 128, background is light, use dark logo
      setUseDarkLogo(brightness > 128);
    } else {
      // Default to white logo for dark theme
      setUseDarkLogo(false);
    }
  }, [scrolled]);

  // Handle scroll effect for background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect background brightness on scroll and route change
  useEffect(() => {
    detectBackgroundBrightness();

    // Re-detect on scroll with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          detectBackgroundBrightness();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Re-detect after a short delay to ensure page is rendered
    const timeoutId = setTimeout(detectBackgroundBrightness, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname, scrolled, detectBackgroundBrightness]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Navbar style based on scroll
  const navbarClasses = scrolled
    ? 'bg-black/80 backdrop-blur-md py-4 shadow-lg shadow-black/50'
    : 'bg-transparent py-6';

  return (
    <>
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarClasses}`}>
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">
          
          {/* Left: Logo */}
          <Link href="/" className="z-50 hover:opacity-80 transition-opacity duration-300">
            <Image
              src={useDarkLogo ? "/natlaupa-symbol-black.svg" : "/natlaupa-symbol-white.svg"}
              alt="Natlaupa"
              width={85}
              height={85}
              className="object-contain transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-8 xl:space-x-12">
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
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
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
          <div className="lg:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gold transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

    </nav>

    {/* Mobile Nav Overlay - Outside nav for proper stacking */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-screen h-screen min-h-[100dvh] bg-black z-[100] flex flex-col justify-center items-center"
          style={{ height: '100dvh' }}
        >
          {/* Close button at top right */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors z-[101]"
          >
            <X size={28} />
          </button>

          {/* Logo at top left */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 left-6 z-[101]"
          >
            <Image
              src="/natlaupa-symbol-white.svg"
              alt="Natlaupa"
              width={70}
              height={70}
              className="object-contain"
            />
          </Link>

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
    </>
  );
};

export default Navbar;