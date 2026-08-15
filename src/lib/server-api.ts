/**
 * Server-side data fetching for SSR pages.
 * No 'use client' — safe to import in server components.
 * Mirrors the transform logic from useHotels.ts / useOffers.ts.
 */

import type { Hotel, Offer } from '@/lib/types';
import { BLOG_PAGE_SIZE } from '@/lib/constants';
import { isValidSlug } from '@/lib/slugify';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const REVALIDATE = 300; // 5 minutes, matches generateMetadata caching

// ---------------------------------------------------------------------------
// Raw fetcher
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Hotel transform (mirrors useHotels.ts → transformServerHotel)
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function transformHotel(s: Record<string, any>): Hotel {
  const style = s.style as { id?: string; name?: string; slug?: string } | null;
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
    imageUrl:
      s.thumbnailImage ||
      images.find((i) => i.isPrimary)?.url ||
      images[0]?.url ||
      '',
    category: style?.name || 'Luxury',
    categorySlug: style?.slug,
    isTrending: s.isFeatured || false,
    lat: s.latitude,
    lng: s.longitude,
    amenities: amenities.map((a) => a.name),
    description: s.description || s.shortDescription || '',
    ctaPhrase: s.ctaPhrase,
    galleryImages: images.map((i) => i.url),
    reviews: s.reviews || [],
    // Preserved so the detail route can refuse to render retired inventory.
    // `/hotels/slug/:slug` returns deactivated hotels with isActive: false, and
    // dropping the field here is what let those pages render at 200 / index,follow.
    isActive: s.isActive,
    deletedAt: s.deletedAt ?? null,
  };
}

// ---------------------------------------------------------------------------
// Offer transform (mirrors useOffers.ts → transformServerOffer)
// ---------------------------------------------------------------------------

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
      imageUrl:
        hotel.thumbnailImage ||
        hImages.find((i: any) => i.isPrimary)?.url ||
        hImages[0]?.url ||
        '',
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
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Hotel fetchers
// ---------------------------------------------------------------------------

export async function fetchHotelBySlug(slug: string): Promise<Hotel | null> {
  if (!isValidSlug(slug)) return null;
  const raw = await apiFetch<Record<string, any>>(`/hotels/slug/${slug}`);
  return raw ? transformHotel(raw) : null;
}

// No isValidSlug guard here on purpose: the only caller reaches this behind isCuid(id),
// and 'null'/'undefined' are not CUIDs, so the junk value cannot arrive.
export async function fetchHotelById(id: string): Promise<Hotel | null> {
  const raw = await apiFetch<Record<string, any>>(`/hotels/${id}`);
  return raw ? transformHotel(raw) : null;
}

export async function fetchHotelsByCountry(country: string): Promise<Hotel[]> {
  const raw = await apiFetch<{ items: Record<string, any>[]; total: number }>(
    `/hotels?country=${encodeURIComponent(country)}&limit=100`,
  );
  return (raw?.items || []).map(transformHotel);
}

export async function fetchHotelsByDestination(destinationId: string): Promise<Hotel[]> {
  const raw = await apiFetch<{ items: Record<string, any>[]; total: number }>(
    `/hotels?destinationId=${destinationId}&limit=100`,
  );
  return (raw?.items || []).map(transformHotel);
}

export async function fetchHotelsByStyle(styleId: string): Promise<Hotel[]> {
  const raw = await apiFetch<{ items: Record<string, any>[]; total: number }>(
    `/hotels?styleId=${styleId}&limit=100`,
  );
  return (raw?.items || []).map(transformHotel);
}

// ---------------------------------------------------------------------------
// Country fetchers
// ---------------------------------------------------------------------------

export async function fetchCountries(): Promise<{ country: string; count: number }[]> {
  const raw = await apiFetch<{ country: string; count: number }[]>('/hotels/countries');
  return Array.isArray(raw) ? raw : [];
}

// ---------------------------------------------------------------------------
// Destination fetchers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Style fetchers
// ---------------------------------------------------------------------------

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
  if (!isValidSlug(slug)) return null;
  const raw = await apiFetch<ServerStyle>(`/hotel-styles/slug/${slug}`);
  return raw || null;
}

// ---------------------------------------------------------------------------
// Offer fetchers
// ---------------------------------------------------------------------------

export async function fetchOfferBySlug(slug: string): Promise<Offer | null> {
  if (!isValidSlug(slug)) return null;
  const raw = await apiFetch<Record<string, any>>(`/offers/slug/${slug}`);
  return raw ? transformOffer(raw) : null;
}

// ---------------------------------------------------------------------------
// Blog fetchers (for generateMetadata only — UI uses /api/blogs/* route)
// ---------------------------------------------------------------------------

export interface ServerBlog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  coverImage?: string | null;
  featuredImage?: string | null;
  author: { firstName: string; lastName: string };
  publishedAt?: string | null;
}

export async function fetchBlogBySlug(slug: string): Promise<ServerBlog | null> {
  if (!isValidSlug(slug)) return null;
  return apiFetch<ServerBlog>(`/blogs/slug/${slug}`);
}

// Full blog (incl. content) for SERVER-RENDERING the article body + JSON-LD.
// The article body MUST ship in the initial HTML for SEO, so the detail page
// fetches this server-side and passes it as a prop (no client-only fetch).
export interface ServerBlogTag {
  id?: string;
  name: string;
}

export interface ServerBlogFull {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  featuredImage?: string | null;
  author?: { id?: string; firstName?: string; lastName?: string; email?: string } | null;
  status?: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  viewCount?: number;
  tags?: (ServerBlogTag | string)[];
}

export async function fetchBlogFull(slug: string): Promise<ServerBlogFull | null> {
  if (!isValidSlug(slug)) return null;
  return apiFetch<ServerBlogFull>(`/blogs/slug/${slug}`);
}

export async function fetchBlogsList(): Promise<ServerBlogFull[]> {
  const raw = await apiFetch<ServerBlogFull[] | { items?: ServerBlogFull[]; blogs?: ServerBlogFull[] }>(
    `/blogs/public?limit=${BLOG_PAGE_SIZE}`,
  );
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    return (raw as { items?: ServerBlogFull[]; blogs?: ServerBlogFull[] }).items
      || (raw as { items?: ServerBlogFull[]; blogs?: ServerBlogFull[] }).blogs
      || [];
  }
  return [];
}
