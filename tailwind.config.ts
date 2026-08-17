import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        midnight: '#121212',
        noir: '#000000',
        gold: '#D4AF37',
        softGold: '#F3E5AB',
      },
      fontFamily: {
        // --font-body is face-agnostic on purpose: swapping the body typeface is a one-line change
        // in layout.tsx and does not need a matching edit here.
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function({ addVariant }) {
      addVariant('hover-capable', '@media (hover: hover) and (pointer: fine)')
      addVariant('portrait', '@media (orientation: portrait)')
    })
  ],
}
export default config
