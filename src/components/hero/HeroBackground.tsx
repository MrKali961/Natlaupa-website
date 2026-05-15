'use client';

import React from 'react';
import {
  motion,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { HERO_VIDEO, HERO_PLACEHOLDER_IMG } from './heroMedia';

interface HeroBackgroundProps {
  /** 0 → 1 scroll progress of the hero section (start..leaving viewport). */
  progress: MotionValue<number>;
}

/**
 * Full-bleed ambient background. Renders a looped muted video when footage
 * has been supplied (see heroMedia.ts), otherwise a graded still placeholder.
 *
 * As the user scrolls toward the experience-selector gate the media settles
 * back (scale up + drift) and the scrim darkens — a slow, cinematic recede
 * rather than a scrub. Disabled entirely under prefers-reduced-motion.
 */
const HeroBackground: React.FC<HeroBackgroundProps> = ({ progress }) => {
  const reduceMotion = useReducedMotion();

  // Static values when reduced motion is requested; otherwise scroll-driven.
  const scale = useTransform(progress, [0, 1], reduceMotion ? [1, 1] : [1, 1.08]);
  const y = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, 40]);
  const scrimOpacity = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [0.55, 0.55] : [0.4, 0.85]
  );

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0 will-change-transform">
        {HERO_VIDEO ? (
          <video
            className="w-full h-full object-cover grayscale contrast-125 brightness-75"
            poster={HERO_VIDEO.poster}
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={HERO_VIDEO.webm} type="video/webm" />
            <source src={HERO_VIDEO.mp4} type="video/mp4" />
          </video>
        ) : (
          <img
            src={HERO_PLACEHOLDER_IMG}
            alt="Luxury landscape"
            className="w-full h-full object-cover grayscale contrast-125 brightness-75"
            draggable={false}
          />
        )}
      </motion.div>

      {/* Base cinematic gradient (kept from original) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Scroll-reactive dim — deepens as the user approaches the gate */}
      <motion.div
        style={{ opacity: scrimOpacity }}
        className="absolute inset-0 bg-black"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroBackground;
