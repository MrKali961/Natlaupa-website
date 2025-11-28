# Natlaupa - Luxury Hotel & Travel Platform

## Project Overview
Natlaupa is a high-end hotel and travel booking platform featuring luxury accommodations worldwide. The platform emphasizes premium user experience with smooth scrolling and elegant animations.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS
- **Animations**:
  - GSAP (GreenSock Animation Platform) with ScrollTrigger
  - Framer Motion
  - Lenis (smooth scrolling)
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure
```
website/
├── .claude/              # Claude AI project documentation
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Home page
│   ├── about/           # About page
│   ├── contact/         # Contact page
│   └── offer/[id]/      # Dynamic offer details
├── components/          # Reusable React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ExperienceSelector.tsx
│   ├── TrendingSection.tsx
│   ├── ValueProps.tsx
│   └── Footer.tsx
├── lib/                 # Utilities and services
│   ├── constants.ts     # Static data (destinations, hotels, categories)
│   └── types.ts         # TypeScript type definitions
├── public/              # Static assets
└── styles/              # Global styles
```

## Key Features

### 1. Smooth Scrolling (Lenis + GSAP)
- Lenis provides momentum-based smooth scrolling
- Integrated with GSAP ScrollTrigger for scroll-based animations
- Configuration: duration 1.2s, exponential easing
- Global instance accessible via `window.lenis`

### 2. Routes
- `/` - Home (hero, trending hotels, categories)
- `/about` - About page
- `/contact` - Contact page
- `/offer/:id` - Individual hotel/offer details with gallery and reviews

### 3. Data Models

**Hotel**:
```typescript
{
  id: string
  name: string
  location: string
  price: number
  rating: number
  imageUrl: string
  category: string
  isTrending: boolean
  description: string
  ctaPhrase: string
  galleryImages: string[]
  reviews: Review[]
}
```

**Destination**:
```typescript
{
  id: string
  name: string
  country: string
  imageUrl: string
  temp: number
  lat: number
  lng: number
  description: string
}
```

## Development Guidelines

### Styling Conventions
- **Color Palette**:
  - `midnight`: #121212 (Rich Dark Gray)
  - `deepBlue`: #000000 (Pure Black)
  - `gold`: #D4AF37 (Metallic Gold)
  - `softGold`: #F3E5AB (Champagne)
- **Fonts**:
  - Sans: Inter (body text)
  - Serif: Playfair Display (headings, luxury copy)

### Animation Best Practices
- Use `useLayoutEffect` for GSAP initialization
- Register GSAP plugins (`ScrollTrigger`) at module level
- Clean up animations in component unmount
- Sync Lenis with ScrollTrigger using `lenis.on('scroll', ScrollTrigger.update)`
- Use ResizeObserver to refresh scroll calculations on DOM changes

### Component Patterns
- **Server Components**: Use by default for static content
- **Client Components**: Mark with `'use client'` when using:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs
  - Event handlers
  - Animation libraries (GSAP, Framer Motion)

### Next.js Specific
- Use Next.js `<Image>` component for optimized images
- Leverage route groups for layout organization
- Use Server Actions for form submissions
- Implement proper metadata for SEO

## Build & Deployment
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run start
```

## Code Quality
- All components must be TypeScript
- Use proper type imports from `lib/types.ts`
- Follow React best practices (keys, memoization when needed)
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks or utilities

## Future Enhancements
- Real backend API integration (currently using mock data)
- User authentication and booking system
- Payment processing integration
- Advanced search and filtering
- User reviews and ratings system
