'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setStableViewportHeight } from '@/lib/viewport';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Configure ScrollTrigger for iOS to prevent layout jumps when address bar appears/disappears
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
  });
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const rafId = useRef<number>(0);

  // Scroll to top on route change
  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Initialize Lenis smooth scrolling
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Set stable viewport height to prevent iOS Safari address bar jumps
    setStableViewportHeight();

    // Detect mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: isTouchDevice ? 0.8 : 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: isTouchDevice ? 1.2 : 1.5,
      infinite: false,
      syncTouch: false, // Let native touch scrolling handle momentum on touch devices
      syncTouchLerp: 0.1,
    });

    // Expose lenis to window for global access
    (window as any).lenis = lenis;

    // Use requestAnimationFrame for smoother updates
    const raf = (time: number) => {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);

    // Sync with ScrollTrigger less frequently
    let lastScrollTime = 0;
    lenis.on('scroll', () => {
      const now = performance.now();
      if (now - lastScrollTime > 16) { // ~60fps throttle
        ScrollTrigger.update();
        lastScrollTime = now;
      }
    });

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, isIOS ? 200 : 100);
    };

    // Use passive resize listener
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return <>{children}</>;
}
