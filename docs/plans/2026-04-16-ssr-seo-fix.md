# SSR/SEO Fix — Convert Dynamic Pages from CSR to SSR

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix Google crawlability by converting all dynamic pages from client-side rendering to server-side rendering, so the full HTML content is present in the initial response.

**Architecture:** Each page currently uses `'use client'` + `useEffect` to fetch data, meaning Google sees loading spinners instead of content. The fix: make each `page.tsx` an `async` server component that fetches data from the external API at request time, then passes the data as props to a new client component that holds all the interactive UI (modals, animations, forms). Layouts already have `generateMetadata` for `<head>` tags — this change fills in the `<body>`.

**Tech Stack:** Next.js App Router, TypeScript, Framer Motion, external REST API at `NEXT_PUBLIC_API_URL`

---

## Key Architecture Decisions

- **Server pages fetch from the external API directly** using `process.env.NEXT_PUBLIC_API_URL` (same as `generateMetadata` already does), NOT from `/api/*` Next.js routes (those are for browser-side use).
- **Data transformation** happens server-side in each page, replicating what `useHotels.ts`/`useOffers.ts` hooks do with `transformServerHotel`/`transformServerOffer`.
- **ID-to-slug redirects** use `redirect()` from `next/navigation` (server-side 307) instead of `router.replace()`.
- **404s** use `notFound()` from `next/navigation` instead of rendering inline "not found" components.
- **Revalidation**: `next: { revalidate: 300 }` (5 min) on all fetches, matching existing `generateMetadata` pattern.
- **Client components** receive fully-resolved data as props — no fetching hooks needed.

## API Endpoints Reference

| Data | External API Endpoint | Response shape |
|------|----------------------|----------------|
| Hotel by slug | `GET ${API_URL}/hotels/slug/${slug}` | `{ data: ServerHotel }` |
| Hotel by ID | `GET ${API_URL}/hotels/${id}` | `{ data: ServerHotel }` |
| Hotels filtered | `GET ${API_URL}/hotels?country=X&styleId=Y&destinationId=Z&limit=N` | `{ data: { items: ServerHotel[], total } }` |
| Countries list | `GET ${API_URL}/hotels/countries` | `{ data: [{ country, count }] }` |
| Destinations list | `GET ${API_URL}/hotel-destinations/public` | `{ data: { items: Destination[] } }` |
| Styles list | `GET ${API_URL}/hotel-styles/public` | `{ data: { items: Style[] } }` |
| Style by slug | `GET ${API_URL}/hotel-styles/slug/${slug}` | `{ data: Style }` |
| Offer by slug | `GET ${API_URL}/offers/slug/${slug}` | `{ data: ServerOffer }` |

---

### Task 1: Create shared server-side data fetching module

**Files:**
- Create: `src/lib/server-api.ts`

This module provides typed fetch functions for server components. No `'use client'` directive. Includes data transformation from server API shape to client types.

**Step 1: Create `src/lib/server-api.ts`**

```typescript
import { Hotel, Offer } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const REVALIDATE = 300; // 5 minutes, matches generateMetadata

// ---- raw fetcher ----

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

// ---- Hotel transforms (mirrors useHotels.ts transformServerHotel) ----

function transformHotel(s: Record<string, any>): Hotel {
  const style = s.style as { id?: string; name?: string } | null;
  const dest = s.destination as { name?: string; country?: string } | null;
  const images = (s.images as { url: string; isPrimary?: boolean }[]) || [];
  const amenities = (s.amenities as { name: string }[]) || [];

  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    city: s.city || '',
    location: s.city || s.address || '',
    country: s.country || dest?.country || '',
    rating: s.starRating || 5,
    imageUrl: s.thumbnailImage || images.find(i => i.isPrimary)?.url || images[0]?.url || '',
    category: style?.name || 'Luxury',
    isTrending: s.isFeatured || false,
    lat: s.latitude,
    lng: s.longitude,
    amenities: amenities.map(a => a.name),
    description: s.description || s.shortDescription || '',
    ctaPhrase: s.ctaPhrase,
    galleryImages: images.map(i => i.url),
    reviews: s.reviews || [],
  };
}

// ---- Offer transforms (mirrors useOffers.ts transformServerOffer) ----

function transformOffer(s: Record<string, any>): Offer {
  const hotel = s.hotel || {};
  const hImages = (hotel.images as { url: string; isPrimary?: boolean }[]) || [];
  const hAmenities = (hotel.amenities as { name: string }[]) || [];

  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    description: s.description,
    duration: s.duration,
    imageUrl: s.imageUrl || '',
    galleryImages: s.galleryImages || [],
    hotel: {
      id: hotel.id,
      name: hotel.name,
      slug: hotel.slug,
      city: hotel.city || '',
      location: hotel.city || hotel.location || '',
      country: hotel.country || '',
      rating: hotel.starRating || hotel.rating || 5,
      imageUrl: hotel.thumbnailImage || hImages.find((i: any) => i.isPrimary)?.url || hImages[0]?.url || '',
      category: hotel.category || hotel.style?.name || 'Luxury',
      isTrending: hotel.isTrending || false,
      description: hotel.description || hotel.shortDescription || '',
      amenities: hAmenities.map((a: any) => a.name),
      galleryImages: hImages.map((i: any) => i.url),
    },
    hotelId: s.hotelId,
    activities: s.activities || [],
    experienceType: s.experienceType,
    isTrending: s.isTrending || false,
    isFeatured: s.isFeatured || false,
    reviews: s.reviews || [],
  };
}

// ---- Public API ----

export async function fetchHotelBySlug(slug: string): Promise<Hotel | null> {
  const raw = await apiFetch<Record<string, any>>(`/hotels/slug/${slug}`);
  return raw ? transformHotel(raw) : null;
}

export async function fetchHotelById(id: string): Promise<Hotel | null> {
  const raw = await apiFetch<Record<string, any>>(`/hotels/${id}`);
  return raw ? transformHotel(raw) : null;
}

export async function fetchHotelsByCountry(country: string): Promise<Hotel[]> {
  const raw = await apiFetch<{ items: Record<string, any>[]; total: number }>(
    `/hotels?country=${encodeURIComponent(country)}&limit=100`
  );
  return (raw?.items || []).map(transformHotel);
}

export async function fetchHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const raw = await apiFetch<{ items: Record<string, any>[]; total: number }>(
    `/hotels?destinationId=${destinationId}&limit=100`
  );
  return (raw?.items || []).map(transformHotel);
}

export async function fetchHotelsByStyle(styleId: string): Promise<Hotel[]> {
  const raw = await apiFetch<{ items: Record<string, any>[]; total: number }>(
    `/hotels?styleId=${styleId}&limit=100`
  );
  return (raw?.items || []).map(transformHotel);
}

export async function fetchCountries(): Promise<{ country: string; count: number }[]> {
  const raw = await apiFetch<{ country: string; count: number }[]>('/hotels/countries');
  return Array.isArray(raw) ? raw : [];
}

export interface ServerDestination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  address?: string | null;
  country?: string | null;
}

export async function fetchDestinations(): Promise<ServerDestination[]> {
  const raw = await apiFetch<{ items: ServerDestination[] }>('/hotel-destinations/public');
  return raw?.items || [];
}

export interface ServerStyle {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  hotelCount: number;
}

export async function fetchStyles(): Promise<ServerStyle[]> {
  const raw = await apiFetch<{ items: ServerStyle[] }>('/hotel-styles/public');
  return raw?.items || [];
}

export async function fetchStyleBySlug(slug: string): Promise<ServerStyle | null> {
  const raw = await apiFetch<ServerStyle>(`/hotel-styles/slug/${slug}`);
  return raw || null;
}

export async function fetchOfferBySlug(slug: string): Promise<Offer | null> {
  const raw = await apiFetch<Record<string, any>>(`/offers/slug/${slug}`);
  return raw ? transformOffer(raw) : null;
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/lib/server-api.ts` (or just `npm run build` later)

---

### Task 2: Convert Hotel Page (`/hotel/[id]`) to SSR

**Files:**
- Create: `src/app/hotel/[id]/HotelPageClient.tsx`
- Modify: `src/app/hotel/[id]/page.tsx`

This is the highest-impact page. The approach:
1. Move ALL existing page.tsx content into `HotelPageClient.tsx` as a client component that receives `hotel: Hotel` as a prop (instead of fetching it).
2. Rewrite `page.tsx` as an async server component that fetches hotel data and handles redirects/404s.

**Step 1: Create `HotelPageClient.tsx`**

Copy the entire current `page.tsx` content into `HotelPageClient.tsx` with these changes:
- Keep `'use client'` directive
- Change the component to accept `{ hotel }: { hotel: Hotel }` as props instead of `{ params }`
- **Remove**: the `useEffect` that fetches hotel data (lines 32-52)
- **Remove**: the `isLoading` state and loading spinner (lines 18, 197-203)
- **Remove**: the `hotel` state variable (`useState<Hotel | null>(null)`) — use prop directly
- **Remove**: `isCuid` import and `getHotelById` import
- **Remove**: `useRouter` and `router.replace` redirect logic
- Keep: all other state (contact modal, form), all event handlers, all JSX
- Change: the `if (!hotel)` block (lines 205-214) can be removed — server component handles 404
- Change: the "Back" button `onClick={() => router.back()}` needs to use a client-side back — keep `useRouter` for this one usage only

**Step 2: Rewrite `page.tsx` as server component**

```typescript
import { notFound, redirect } from 'next/navigation';
import { fetchHotelBySlug, fetchHotelById } from '@/lib/server-api';
import HotelPageClient from './HotelPageClient';

// Check if a string is a CUID (database ID)
function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
}

export default async function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // If it's a database ID, fetch and redirect to slug URL
  if (isCuid(id)) {
    const hotel = await fetchHotelById(id);
    if (!hotel) notFound();
    if (hotel.slug) redirect(`/hotel/${hotel.slug}`);
    // If no slug, render with ID (fallback)
  }

  // Fetch hotel by slug
  const hotel = isCuid(id) ? await fetchHotelById(id) : await fetchHotelBySlug(id);
  if (!hotel) notFound();

  return <HotelPageClient hotel={hotel} />;
}
```

**Step 3: Verify by running dev server and checking view-source**

Run: `npm run dev`
Visit: `http://localhost:3000/hotel/<any-hotel-slug>`
Check: View Page Source — the hotel name, description, and amenities should be visible in the raw HTML.

---

### Task 3: Convert Country Page (`/countries/[country]`) to SSR

**Files:**
- Create: `src/app/countries/[country]/CountryPageClient.tsx`
- Modify: `src/app/countries/[country]/page.tsx`

**Step 1: Create `CountryPageClient.tsx`**

Copy existing `page.tsx` content with these changes:
- Keep `'use client'` directive
- Accept props: `{ hotels: Hotel[]; matchedCountry: string; allCountries: string[] }`
- **Remove**: `useHotels` hook calls and all loading/error states related to data fetching
- **Remove**: `useEffect` for country matching (lines 21-28)
- **Remove**: all loading/error/not-found conditionals (lines 37-95) — server handles these
- Keep: `isDescriptionExpanded` state, all JSX for hero + hotel grid + other countries section
- Keep: framer-motion animations

**Step 2: Rewrite `page.tsx` as server component**

```typescript
import { notFound } from 'next/navigation';
import { fetchCountries, fetchHotelsByCountry } from '@/lib/server-api';
import CountryPageClient from './CountryPageClient';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country).replace(/-/g, ' ');

  // Fetch countries list to find exact match
  const countriesData = await fetchCountries();
  const allCountries = countriesData.map(c => c.country);
  const matchedCountry = allCountries.find(
    c => c.toLowerCase() === decodedCountry.toLowerCase()
  );

  if (!matchedCountry) notFound();

  // Fetch hotels for this country
  const hotels = await fetchHotelsByCountry(matchedCountry);

  return (
    <CountryPageClient
      hotels={hotels}
      matchedCountry={matchedCountry}
      allCountries={allCountries}
    />
  );
}
```

---

### Task 4: Convert Destination Page (`/destinations/[slug]`) to SSR

**Files:**
- Create: `src/app/destinations/[slug]/DestinationPageClient.tsx`
- Modify: `src/app/destinations/[slug]/page.tsx`

**Step 1: Create `DestinationPageClient.tsx`**

Copy existing page with these changes:
- Accept props: `{ destination: ServerDestination; hotels: Hotel[] }`
- **Remove**: all `useEffect` fetching, `useHotels` hook, loading/error states
- Keep: `isDescriptionExpanded` state, all JSX

**Step 2: Rewrite `page.tsx` as server component**

```typescript
import { notFound } from 'next/navigation';
import { fetchDestinations, fetchHotelsByDestination } from '@/lib/server-api';
import DestinationPageClient from './DestinationPageClient';

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const destinations = await fetchDestinations();
  const destination = destinations.find(d => d.slug === slug);
  if (!destination) notFound();

  const hotels = await fetchHotelsByDestination(destination.id);

  return <DestinationPageClient destination={destination} hotels={hotels} />;
}
```

---

### Task 5: Convert Style Page (`/styles/[style]`) to SSR

**Files:**
- Create: `src/app/styles/[style]/StylePageClient.tsx`
- Modify: `src/app/styles/[style]/page.tsx`

**Step 1: Create `StylePageClient.tsx`**

Copy existing page with these changes:
- Accept props: `{ style: ServerStyle; hotels: Hotel[]; allStyles: ServerStyle[] }`
- **Remove**: all `useEffect` fetching, `useHotels` hook, loading/error states
- Keep: all JSX, category icons mapping

**Step 2: Rewrite `page.tsx` as server component**

```typescript
import { notFound } from 'next/navigation';
import { fetchStyleBySlug, fetchStyles, fetchHotelsByStyle } from '@/lib/server-api';
import StylePageClient from './StylePageClient';

export default async function StylePage({ params }: { params: Promise<{ style: string }> }) {
  const { style: styleSlug } = await params;

  const [style, allStyles] = await Promise.all([
    fetchStyleBySlug(styleSlug),
    fetchStyles(),
  ]);

  if (!style) notFound();

  const hotels = await fetchHotelsByStyle(style.id);

  return <StylePageClient style={style} hotels={hotels} allStyles={allStyles} />;
}
```

---

### Task 6: Convert Offer Page (`/offer/[id]`) to SSR

**Files:**
- Create: `src/app/offer/[id]/OfferPageClient.tsx`
- Modify: `src/app/offer/[id]/page.tsx`

**Step 1: Create `OfferPageClient.tsx`**

Copy existing page with these changes:
- Accept props: `{ offer: Offer }`
- **Remove**: `useOffer` hook, loading states, ID redirect logic
- Keep: all interactive state (expandedSection, contact modal, form), all JSX

**Step 2: Rewrite `page.tsx` as server component**

```typescript
import { notFound, redirect } from 'next/navigation';
import { fetchOfferBySlug } from '@/lib/server-api';
import OfferPageClient from './OfferPageClient';
import { isCuid } from '@/lib/slugify';

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const offer = await fetchOfferBySlug(id);
  if (!offer) notFound();

  // Redirect ID-based URLs to slug
  if (isCuid(id) && offer.slug) {
    redirect(`/offer/${offer.slug}`);
  }

  return <OfferPageClient offer={offer} />;
}
```

---

### Task 7: Sanitize sitemap slugs

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Add slug sanitization to country URL generation**

In `sitemap.ts`, the country slug generation on line 198 uses:
```typescript
country.toLowerCase().replace(/\s+/g, '-')
```

Replace with a robust sanitizer that:
- Trims whitespace
- Normalizes diacritics
- Removes non-alphanumeric characters (except hyphens)
- Collapses multiple hyphens
- Removes leading/trailing hyphens

```typescript
function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '');          // trim leading/trailing hyphens
}
```

Apply it to the country pages line:
```typescript
url: `${BASE_URL}/countries/${sanitizeSlug(country)}`,
```

Also apply the same sanitization in the country page's slug generation (links within the country page) to keep URLs consistent.

---

### Task 8: Build and verify

**Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Start production server and check HTML**

Run: `npm run start` (or `npm run dev` for quick check)

For each converted route, verify the **view-source** contains real content:

| Route | Check for in HTML |
|-------|-------------------|
| `/hotel/<slug>` | Hotel name, description, amenities |
| `/countries/<slug>` | Country name, hotel cards with names |
| `/destinations/<slug>` | Destination name, hotel cards |
| `/styles/<slug>` | Style name, hotel cards |
| `/offer/<slug>` | Offer title, hotel name, activities |

**Step 3: Verify redirects work**

- Visit `/hotel/<database-id>` → should 307 redirect to `/hotel/<slug>`
- Visit `/offer/<database-id>` → should 307 redirect to `/offer/<slug>`

**Step 4: Check sitemap**

Visit `/sitemap.xml` and verify:
- No trailing hyphens on country slugs
- No commas in URL paths
- No duplicate URLs

---

## Execution Notes

- **Do NOT modify layout.tsx files** — they already handle `generateMetadata` correctly.
- **Do NOT modify the `/api/*` route handlers** — they're still used by other client components (index pages, homepage).
- **Do NOT touch the hooks** (`useHotels.ts`, `useOffers.ts`) — they're still used by listing pages that remain CSR for now.
- **Each client component should be a near-exact copy** of the current page.tsx, just receiving data as props instead of fetching. Minimize changes to reduce regression risk.
- **Framer-motion `motion.*` components** must stay in client components — they use React hooks internally.
