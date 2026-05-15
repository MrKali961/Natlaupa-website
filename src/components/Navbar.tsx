'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [useDarkLogo, setUseDarkLogo] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detect if background behind navbar is light or dark
  const detectBackgroundBrightness = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (scrolled) {
      setUseDarkLogo(false);
      return;
    }

    const sampleX = window.innerWidth / 2;
    const sampleY = 40;

    const navbar = document.querySelector('nav');
    if (!navbar) return;

    const originalPointerEvents = navbar.style.pointerEvents;
    navbar.style.pointerEvents = 'none';
    const elementBehind = document.elementFromPoint(sampleX, sampleY);
    navbar.style.pointerEvents = originalPointerEvents;

    if (!elementBehind) {
      setUseDarkLogo(false);
      return;
    }

    const bgColor = window.getComputedStyle(elementBehind).backgroundColor;
    const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      setUseDarkLogo((r * 299 + g * 587 + b * 114) / 1000 > 128);
    } else {
      setUseDarkLogo(false);
    }
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    detectBackgroundBrightness();
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
    const timeoutId = setTimeout(detectBackgroundBrightness, 100);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname, scrolled, detectBackgroundBrightness]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
      setSearchResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hotels?search=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        if (res.ok) {
          const items: Record<string, unknown>[] =
            data.data?.items || data.data?.hotels || [];
          setSearchResults(
            items.map(h => ({
              id: h.id as string,
              name: h.name as string,
              slug: h.slug as string,
              city: (h.city as string) || '',
              country: (h.country as string) || '',
            }))
          );
        }
      } catch {}
      setIsSearching(false);
    }, 300);
    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchQuery]);

  // Close desktop search on click outside
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Escape key closes search
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleResultClick = (slug: string) => {
    router.push(`/hotel/${slug}`);
    setIsSearchOpen(false);
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

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
              style={{ height: 'auto' }}
              priority
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-8 xl:space-x-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-4 inline-flex items-center ${
                  pathname === link.path ? 'text-gold' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Special Links + Search (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">

            {/* Search */}
            <div ref={searchRef} className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    key="search-input"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search hotels..."
                      className="w-[220px] bg-transparent border-b border-white/30 focus:border-white/60 text-white text-xs tracking-wide placeholder-white/30 outline-none pb-1 transition-colors duration-200"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  setIsSearchOpen(v => !v);
                  if (isSearchOpen) {
                    setSearchQuery('');
                    setSearchResults([]);
                  }
                }}
                className="text-white/70 hover:text-white transition-colors py-4 flex items-center"
                aria-label={isSearchOpen ? 'Close search' : 'Search hotels'}
              >
                {isSearchOpen ? <X size={15} /> : <Search size={15} />}
              </button>

              {/* Desktop dropdown */}
              <AnimatePresence>
                {isSearchOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-[280px] bg-black/95 backdrop-blur-md border border-white/10 z-[60] overflow-hidden"
                  >
                    {searchResults.map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.slug)}
                        className="w-full text-left px-4 py-3 hover:bg-gold/10 transition-colors duration-150 border-b border-white/[0.06] last:border-0 group"
                      >
                        <div className="text-white text-xs font-semibold group-hover:text-gold transition-colors duration-150">
                          {result.name}
                        </div>
                        <div className="text-white/40 text-[10px] mt-0.5 tracking-wide">
                          {[result.city, result.country].filter(Boolean).join(', ')}
                        </div>
                      </button>
                    ))}
                    {isSearching && (
                      <div className="px-4 py-3 text-white/30 text-[10px] tracking-widest uppercase">
                        Searching…
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/for-hotels"
              className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-4 inline-flex items-center ${
                pathname === '/for-hotels' ? 'text-gold' : 'text-white/70 hover:text-white'
              }`}
            >
              For Hotels
            </Link>
            <Link
              href="/become-angel"
              className="text-xs font-bold uppercase tracking-[0.15em] px-4 py-4 bg-gold text-deepBlue hover:bg-gold/90 transition-all duration-300"
            >
              Join The Club
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

    {/* Mobile Nav Overlay */}
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
          {/* Close button */}
          <button
            onClick={closeMobileMenu}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors z-[101]"
          >
            <X size={28} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
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

          <div className="flex flex-col space-y-6 text-center py-8 w-full px-8 max-w-sm">

            {/* Mobile Search */}
            <div className="relative w-full mb-2">
              <div className="flex items-center border-b border-white/20 pb-2">
                <Search size={13} className="text-white/30 flex-shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search hotels…"
                  className="flex-1 bg-transparent text-white font-serif italic text-base placeholder-white/25 outline-none"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-white/30 hover:text-white/60 ml-2">
                    <X size={12} />
                  </button>
                )}
              </div>
              {/* Mobile search results */}
              {searchResults.length > 0 && (
                <div className="mt-3 flex flex-col gap-0.5">
                  {searchResults.map(result => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.slug)}
                      className="text-left py-2 border-b border-white/[0.06] last:border-0 group"
                    >
                      <span className="font-serif italic text-lg text-white/80 group-hover:text-gold transition-colors duration-150 block">
                        {result.name}
                      </span>
                      <span className="text-white/30 text-[10px] font-sans tracking-wide block">
                        {[result.city, result.country].filter(Boolean).join(', ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {isSearching && (
                <div className="mt-2 text-white/20 text-[10px] tracking-widest uppercase text-center">
                  Searching…
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={closeMobileMenu}
                className="font-serif text-4xl text-white/90 hover:text-gold italic transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="w-16 h-px bg-gold/30 mx-auto my-4" />

            <Link
              href="/for-hotels"
              onClick={closeMobileMenu}
              className="font-serif text-2xl text-white/70 hover:text-gold transition-colors"
            >
              For Hotels
            </Link>
            <Link
              href="/become-angel"
              onClick={closeMobileMenu}
              className="font-serif text-2xl text-gold hover:text-white transition-colors"
            >
              Join The Club
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
