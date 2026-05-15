'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const HEADLINE = 'You travel, We handle everything';

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * The hero's LCP element. Text is in the DOM from first paint; only
 * opacity / blur / y are animated, so there is no CLS and no text reflow.
 * Words reveal with a staggered gold-blur lift. Under reduced motion the
 * headline simply appears.
 */
const HeroHeadline: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const words = HEADLINE.split(' ');

  return (
    <h1 className="font-serif text-[2.4rem] sm:text-[3rem] md:text-[4.8rem] lg:text-[6.4rem] text-white mb-6 tracking-tight leading-tight max-w-[18ch] md:max-w-none">
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <motion.span
            className="inline-block"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, filter: 'blur(12px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: 'blur(0px)' }
            }
            transition={{
              duration: reduceMotion ? 0.6 : 0.9,
              delay: 0.15 + i * 0.07,
              ease: EASE,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </h1>
  );
};

export default HeroHeadline;
