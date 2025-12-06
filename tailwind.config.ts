import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#121212',
        deepBlue: '#000000',
        gold: '#D4AF37',
        softGold: '#F3E5AB',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('hover-capable', '@media (hover: hover) and (pointer: fine)')
    })
  ],
}
export default config
