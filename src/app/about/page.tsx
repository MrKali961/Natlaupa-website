'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import { Compass, MapPin, Shield, Heart, Sparkles, Quote, ChevronDown } from 'lucide-react';
import { MAP_DESTINATIONS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

// Dynamic import for InteractiveMap (Mapbox requires client-side rendering)
const InteractiveMap = dynamic(
  () => import('@/components/InteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[2/1] max-w-5xl mx-auto bg-midnight/50 rounded-lg flex items-center justify-center border border-gold/10">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span className="text-gold">Loading map...</span>
        </div>
      </div>
    ),
  }
);

const testimonials = [
  {
    quote: "Natlaupa didn't just book our honeymoon—they crafted a journey we'll treasure forever.",
    author: "Eleanor & James",
    location: "Maldives Experience",
    image: "https://picsum.photos/100/100?random=201"
  },
  {
    quote: "The attention to detail was extraordinary. Every moment felt personally curated.",
    author: "Marcus Chen",
    location: "Kyoto Retreat",
    image: "https://picsum.photos/100/100?random=202"
  },
  {
    quote: "They understood exactly what we needed before we even knew ourselves.",
    author: "Sofia Andersson",
    location: "Swiss Alps Escape",
    image: "https://picsum.photos/100/100?random=203"
  }
];

const curators = [
  {
    name: "SABINE FEREKH",
    role: "Business Development Manager",
    region: "Luxury Travel Expert",
    image: "/sabine-ferekh.jpg",
    bio: "Driving growth through strategic partnerships and innovative luxury hospitality solutions."
  },
  {
    name: "GAELLE KEHDI",
    role: "Project Manager",
    region: "Operations & Strategy",
    image: "/gaelle-kehdi.jpg",
    bio: "Orchestrating seamless experiences through meticulous planning and execution excellence."
  }
];

const promises = [
  {
    icon: MapPin,
    title: "Hospitality Experts",
    description: "Our team consists of seasoned professionals who understand the nuances of the luxury hospitality industry."
  },
  {
    icon: Sparkles,
    title: "Available 24/7 & Best price guaranteed",
    description: "Natlaupa offers availablility 24/7, with privileged access to the best rates, always refined, always guaranteed."
  },
  {
    icon: Shield,
    title: "Trust",
    description: "At Natlaupa, we ensure that every client is supported, listened to, and guided through a seamless, unforgettable experience."
  }
];

export default function About() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Compass rotation animation
    if (compassRef.current) {
      gsap.to(compassRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none"
      });
    }

    // Parallax effect on hero
    if (heroRef.current) {
      gsap.to(heroRef.current.querySelector('.hero-bg'), {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(interval);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <main className="bg-deepBlue min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="hero-bg absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(https://picsum.photos/1920/1080?random=100)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-deepBlue/80 via-deepBlue/60 to-deepBlue" />
          </div>

          {/* Animated Compass */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg
              ref={compassRef}
              viewBox="0 0 200 200"
              className="w-[600px] h-[600px]"
            >
              <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-gold" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-gold" />
              {/* Compass points */}
              <path d="M100 5 L103 20 L100 15 L97 20 Z" fill="currentColor" className="text-gold" />
              <path d="M100 195 L103 180 L100 185 L97 180 Z" fill="currentColor" className="text-gold" />
              <path d="M5 100 L20 97 L15 100 L20 103 Z" fill="currentColor" className="text-gold" />
              <path d="M195 100 L180 97 L185 100 L180 103 Z" fill="currentColor" className="text-gold" />
              {/* Decorative lines */}
              {[...Array(36)].map((_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2={i % 3 === 0 ? "25" : "18"}
                  stroke="currentColor"
                  strokeWidth={i % 3 === 0 ? "0.5" : "0.25"}
                  className="text-gold"
                  transform={`rotate(${i * 10} 100 100)`}
                />
              ))}
            </svg>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <Compass className="w-16 h-16 text-gold mx-auto mb-6" strokeWidth={1} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6"
            >
              Welcome to
              <span className="block text-gold">Natlaupa</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto mb-12"
            >
              A network of hotel experts specialized in travel and personalized advice, offering a unique experience. We partner with the most beautiful destinations around the world to offer our clients advantageous rates and the best conditions. Natlaupa is here to make every journey unforgettable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="animate-bounce flex justify-center"
            >
              <ChevronDown className="w-8 h-8 text-gold" />
            </motion.div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section ref={mapRef} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
                Our Global Collection
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Click on any destination to discover its story
              </p>
            </motion.div>

            {/* Interactive Mapbox Globe */}
            <InteractiveMap destinations={MAP_DESTINATIONS} />
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-32 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Quote className="w-12 h-12 text-gold mx-auto mb-8 opacity-50" />
              <h2 className="font-serif text-3xl md:text-5xl text-white leading-relaxed mb-12">
                We elevate luxury through <span className="text-gold">premium partnerships</span> and <span className="text-gold">expert curation</span>—empowering hotels to maximize visibility and profitability while delivering exceptional, personalized experiences to discerning travelers.
              </h2>
              <div className="w-24 h-px bg-gold mx-auto mb-8" />
              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Breaking from conventional models, we create a community where hotels grow and travelers discover truly tailored journeys. This is luxury, reimagined.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Three Promises */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl text-white text-center mb-16"
            >
              Our Promise to You
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {promises.map((promise, index) => (
                <motion.div
                  key={promise.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-midnight/50 border border-white/5 rounded-lg p-8 h-full hover:border-gold/30 transition-colors duration-500">
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                      <promise.icon className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="text-xl text-white font-serif mb-4">{promise.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{promise.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-4 bg-gradient-to-b from-deepBlue via-midnight/50 to-deepBlue">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl text-white text-center mb-16"
            >
              Stories from Our Travelers
            </motion.h2>

            <div className="relative h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="bg-midnight/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-12">
                    <Quote className="w-8 h-8 text-gold mb-6 opacity-50" />
                    <p className="text-xl md:text-2xl text-white font-light italic mb-8">
                      &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                      />
                      <div>
                        <p className="text-white font-medium">{testimonials[activeTestimonial].author}</p>
                        <p className="text-gold text-sm">{testimonials[activeTestimonial].location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Testimonial Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-gold w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Curators */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Meet the Curators
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                The passionate experts behind every unforgettable journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {curators.map((curator, index) => (
                <motion.div
                  key={curator.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img
                      src={curator.image}
                      alt={curator.name}
                      className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-gold text-sm mb-1">{curator.region}</p>
                    </div>
                  </div>
                  <h3 className="text-xl text-white font-serif mb-1">{curator.name}</h3>
                  <p className="text-gold text-sm mb-3">{curator.role}</p>
                  <p className="text-slate-400 text-sm">{curator.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: 'url(https://picsum.photos/1920/800?random=150)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepBlue via-deepBlue/80 to-deepBlue" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <Heart className="w-10 h-10 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Ready to Begin Your Story?
            </h2>
            <p className="text-slate-300 text-lg mb-10">
              Let us craft an experience as unique as you are.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gold text-deepBlue px-8 py-4 rounded-sm font-medium hover:bg-softGold transition-colors duration-300"
            >
              Start Your Journey
              <Compass className="w-5 h-5" />
            </a>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
