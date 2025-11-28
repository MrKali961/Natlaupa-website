
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import OfferDetails from './pages/OfferDetails';
import AllOffers from './pages/AllOffers';
import AllDestinations from './pages/AllDestinations';
import AllStyles from './pages/AllStyles';
import DestinationDetail from './pages/DestinationDetail';
import StyleDetail from './pages/StyleDetail';
import ForHotels from './pages/ForHotels';
import BecomeAngel from './pages/BecomeAngel';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    (window as any).lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const resizeObserver = new ResizeObserver(() => {
      // Wrap in requestAnimationFrame to prevent "ResizeObserver loop completed with undelivered notifications" error
      requestAnimationFrame(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
    });
    resizeObserver.observe(document.body);

    if (isLoading) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = 'auto';
    }

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      (window as any).lenis = null;
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-deepBlue text-slate-100 font-sans selection:bg-gold selection:text-deepBlue">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/offers" element={<AllOffers />} />
              <Route path="/destinations" element={<AllDestinations />} />
              <Route path="/styles" element={<AllStyles />} />
              <Route path="/destination/:id" element={<DestinationDetail />} />
              <Route path="/style/:id" element={<StyleDetail />} />
              <Route path="/for-hotels" element={<ForHotels />} />
              <Route path="/become-angel" element={<BecomeAngel />} />
              <Route path="/offer/:id" element={<OfferDetails />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
