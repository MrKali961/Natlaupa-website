'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import ExperienceSelector from '@/components/ExperienceSelector';
import ValueProps from '@/components/ValueProps';
import ConciergeRecommendations from '@/components/ConciergeRecommendations';
import MoodMatcher from '@/components/MoodMatcher';
import Footer from '@/components/Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Home() {
  // Gatekeeper state: false initially, restricting scroll past the selector
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSelection = () => {
    setIsUnlocked(true);
    // Refresh ScrollTrigger after a slight delay to allow DOM to update
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <main className="bg-deepBlue min-h-screen">
      <Hero />
      <ExperienceSelector onSelection={handleSelection} />

      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <MoodMatcher />
          <ValueProps />
          <ConciergeRecommendations />
          <Footer />
        </motion.div>
      )}

      {/* SEO: crawlable text + navigation links when content is gated */}
      {!isUnlocked && (
        <div
          className="absolute w-px h-px overflow-hidden"
          style={{ clip: 'rect(0,0,0,0)', clipPath: 'inset(50%)' }}
          aria-hidden="true"
        >
          <p>Natlaupa est un service de conseil, de conciergerie hôtelière et d&apos;assistance à la réservation. Nous accompagnons nos clients dans la recherche, la sélection et la réservation d&apos;hébergements hôteliers et d&apos;expériences associées auprès d&apos;hôtels partenaires ou tiers. Selon la demande, Natlaupa peut intervenir comme intermédiaire de réservation, service d&apos;assistance personnalisée ou apporteur d&apos;opportunités hôtelières. Les prestations d&apos;hébergement sont fournies par les établissements sélectionnés. Les tarifs, disponibilités, avantages, conditions d&apos;annulation et conditions de séjour sont communiqués au client avant confirmation de la réservation. Le service Natlaupa peut être rémunéré par des frais de service, une marge intégrée au prix communiqué au client ou une commission partenaire. Les modalités applicables sont précisées avant validation et paiement.</p>
          <p>Natlaupa is a hotel advisory, concierge and booking-assistance service. We help clients search, select and book hotel stays and related experiences with partner or third-party hotels. Depending on the request, Natlaupa may act as a booking intermediary, personalized concierge service or hotel opportunity provider. Accommodation services are supplied by the selected hotels. Prices, availability, privileges, cancellation terms and stay conditions are communicated before booking confirmation. Natlaupa may be remunerated through service fees, a margin included in the price communicated to the client or partner commissions. Applicable terms are disclosed before confirmation and payment.</p>
          <nav>
            <a href="/destinations">Destinations</a>
            <a href="/styles">Hotel Styles</a>
            <a href="/countries">Countries</a>
            <a href="/offers">Offers</a>
            <a href="/blog">Blog</a>
            <a href="/about">About Natlaupa</a>
            <a href="/contact">Contact</a>
            <a href="/hospitality">Hospitality</a>
            <a href="/join-the-private-club">Join the Private Club</a>
          </nav>
        </div>
      )}
    </main>
  );
}
