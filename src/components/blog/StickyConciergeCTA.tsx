'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';

/**
 * Persistent concierge CTA for the reading view (the long article).
 * HANDOFF, not duplication: appears only after the header scrolls past, and
 * recedes near the bottom so it never collides with the end-of-article CTA or
 * covers the footer. The site-wide WhatsApp float is suppressed on /blog routes
 * so this is the only persistent prompt (ethics floor: no double-nagging).
 */
export default function StickyConciergeCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const nearBottom = y + window.innerHeight > docH - 760; // cede to the end CTA + footer
      setShow(y > 520 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed z-40 inset-x-0 bottom-0 sm:inset-x-auto sm:right-8 sm:bottom-8 transition-all duration-500 ${
        show
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-full sm:translate-y-4 pointer-events-none'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.25,1,0.5,1)' }}
    >
      <Link
        href="/contact"
        className="group flex items-center justify-center gap-3 bg-gold text-deepBlue px-6 py-4 sm:rounded-full sm:px-7 sm:shadow-2xl hover:bg-softGold transition-colors duration-300"
      >
        <MessageCircle size={18} strokeWidth={2} />
        <span className="text-sm font-semibold uppercase tracking-[0.15em]">Speak to a concierge</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
