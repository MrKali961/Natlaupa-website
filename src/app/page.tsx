'use client';

import React from 'react';
import Hero from '@/components/Hero';
import ExperienceSelector from '@/components/ExperienceSelector';
import ValueProps from '@/components/ValueProps';
import ConciergeRecommendations from '@/components/ConciergeRecommendations';
import MoodMatcher from '@/components/MoodMatcher';
import Footer from '@/components/Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Homepage — ungated.
 *
 * This page used to hold every section below the fold behind `isUnlocked`, a useState(false)
 * gate flipped only by picking an option in ExperienceSelector. Consequences, all measured:
 *
 *   - Served HTML was 34,026 bytes with one h1 and NO footer — zero occurrences of
 *     `mentions-legales`. The site's entire navigation was absent from its own homepage.
 *   - In its place sat a 1x1px div with `clip: rect(0,0,0,0)`, `clipPath: inset(50%)` AND
 *     `aria-hidden="true"`, holding ~1600 chars of service disclosure plus a 9-link nav. That is
 *     crawler-only text by construction — a hidden-text policy risk, and invisible to screen
 *     readers, which is strictly worse than not having it.
 *
 * Three deliberate decisions are encoded below.
 *
 * 1. ExperienceSelector STAYS as section 1 and stays a conversion device. It is no longer a gate,
 *    just scroll-past. It needs no layout change of its own: it is `position: relative` and never
 *    locked scroll — the gate was purely the `{isUnlocked && ...}` conditional here.
 *
 * 2. The hidden 9-link nav is REMOVED rather than promoted, because Footer now renders
 *    unconditionally and FOOTER_LINKS already carries all nine of those routes (plus the six FR
 *    legal pages) as real next/link elements inside a <footer> landmark. Its purpose is served, not
 *    lost. The service disclosure it also held IS promoted — see the <section> at the bottom —
 *    because nothing else on the page states what Natlaupa actually is.
 *
 * 3. There is NO framer-motion wrapper any more. The old one used `initial={{ opacity: 0 }}`, which
 *    framer serialises as `style="opacity:0"` into the server-rendered HTML. Keeping it while
 *    ungating would have shipped the content invisible on first paint and left it dependent on
 *    hydration — replacing one hidden-content defect with another. Do not reintroduce an entrance
 *    animation on this wrapper; animate individual sections on scroll instead.
 */
export default function Home() {
  // ExperienceSelector still changes its own height when an option is chosen, so ScrollTrigger
  // needs to remeasure. This no longer reveals anything — every section below is already mounted.
  const handleSelection = () => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <main className="bg-noir min-h-screen">
      <Hero />
      <ExperienceSelector onSelection={handleSelection} />
      <MoodMatcher />
      <ValueProps />
      <ConciergeRecommendations />

      {/*
        Promoted from the old aria-hidden 1x1px block. Visible, in the accessibility tree, and
        readable — the four things it previously was not. Kept restrained and placed immediately
        above the footer, which is where a service disclosure belongs on a travel site rather than
        interrupting the browse flow.

        Each paragraph carries an explicit `lang` so assistive tech switches pronunciation
        correctly. That is needed regardless of the root <html lang>, which is currently hardcoded
        to "en" (see plan item 6.8).
      */}
      <section
        className="bg-deepBlue border-t border-white/10 px-6 py-12 md:px-12"
        aria-labelledby="service-disclosure-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="service-disclosure-heading"
            className="font-serif text-lg text-softGold md:text-xl"
          >
            Notre service
          </h2>
          <p lang="fr" className="mt-4 text-sm leading-relaxed text-white/70">
            Natlaupa est un service de conseil, de conciergerie hôtelière et d&apos;assistance à la
            réservation. Nous accompagnons nos clients dans la recherche, la sélection et la
            réservation d&apos;hébergements hôteliers et d&apos;expériences associées auprès
            d&apos;hôtels partenaires ou tiers. Selon la demande, Natlaupa peut intervenir comme
            intermédiaire de réservation, service d&apos;assistance personnalisée ou apporteur
            d&apos;opportunités hôtelières. Les prestations d&apos;hébergement sont fournies par les
            établissements sélectionnés. Les tarifs, disponibilités, avantages, conditions
            d&apos;annulation et conditions de séjour sont communiqués au client avant confirmation
            de la réservation. Le service Natlaupa peut être rémunéré par des frais de service, une
            marge intégrée au prix communiqué au client ou une commission partenaire. Les modalités
            applicables sont précisées avant validation et paiement.
          </p>
          <p lang="en" className="mt-4 text-sm leading-relaxed text-white/70">
            Natlaupa is a hotel advisory, concierge and booking-assistance service. We help clients
            search, select and book hotel stays and related experiences with partner or third-party
            hotels. Depending on the request, Natlaupa may act as a booking intermediary,
            personalized concierge service or hotel opportunity provider. Accommodation services are
            supplied by the selected hotels. Prices, availability, privileges, cancellation terms and
            stay conditions are communicated before booking confirmation. Natlaupa may be remunerated
            through service fees, a margin included in the price communicated to the client or partner
            commissions. Applicable terms are disclosed before confirmation and payment.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
