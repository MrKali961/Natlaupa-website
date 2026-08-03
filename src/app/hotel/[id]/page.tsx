import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { fetchHotelBySlug, fetchHotelById } from '@/lib/server-api';
import { isPubliclyListable } from '@/lib/fetch-all';
import HotelPageClient from './HotelPageClient';
import { JsonLd, hotelSchema, hotelBreadcrumb } from '@/components/JsonLd';

function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
}

/**
 * Retired hotels must not be served as live pages.
 *
 * The `/hotels` listing endpoint filters out `isActive: false` records, but
 * `/hotels/slug/:slug` does not — it returns deactivated hotels exactly like live
 * ones. Because this route only checked "did the API return anything", the 19
 * deactivated hotels kept rendering at HTTP 200 with `robots: index, follow` and a
 * full page of content, while being absent from both the sitemap and every internal
 * link. Verified live 2026-08-03: /hotel/wynn-las-vegas returned 200, `index, follow`,
 * 70,851 bytes, h1 "Wynn Las Vegas" — with `isActive: false` in the API response.
 *
 * Orphaned pages that still invite indexing are the worst possible retirement state:
 * Google keeps them, they compete with bookable inventory, and users land on hotels
 * they cannot book. A 404 removes them and generalises to any future deactivation.
 *
 * `isPubliclyListable` is the same predicate the sitemap and llms.txt use, so all
 * three discovery surfaces and this route cannot disagree about what is public.
 */
function isRetired(hotel: { isActive?: boolean; deletedAt?: string | null }): boolean {
  return !isPubliclyListable(hotel);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // CUID routes redirect to slug — skip generating metadata for them
  if (isCuid(id)) return {};

  const hotel = await fetchHotelBySlug(id);
  if (!hotel) return { title: 'Hotel Not Found' };

  // Retired hotels 404 in the page component below. `robots` is deliberately NOT set
  // here: layout.tsx is the authoritative metadata source for this route and already
  // emits noindex for retired hotels (see RETIRED_METADATA there). Setting it in both
  // places emitted two <meta name="robots"> tags — harmless, since they agreed, but
  // untidy. The 404 status is the primary signal regardless.
  if (isRetired(hotel)) return { title: 'Hotel Not Found' };

  const title = `${hotel.name}${hotel.city ? ` | ${hotel.city}` : ''} | Luxury Hotel`;
  const description =
    hotel.description ||
    `Experience ${hotel.name}, a ${hotel.rating}-star luxury hotel${hotel.city ? ` in ${hotel.city}` : ''}${hotel.country ? `, ${hotel.country}` : ''}. Book your exclusive stay with Natlaupa.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/hotel/${hotel.slug || id}`,
      ...(hotel.imageUrl && {
        images: [{ url: hotel.imageUrl, width: 1200, height: 630, alt: hotel.name }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(hotel.imageUrl && { images: [hotel.imageUrl] }),
    },
  };
}

export default async function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let hotel;

  if (isCuid(id)) {
    hotel = await fetchHotelById(id);
    if (!hotel) notFound();
    // Check before redirecting, so a retired hotel 404s here rather than bouncing to
    // its slug URL and 404ing there — one hop, and no redirect chain into a dead end.
    if (isRetired(hotel)) notFound();
    if (hotel.slug) redirect(`/hotel/${hotel.slug}`);
  } else {
    hotel = await fetchHotelBySlug(id);
    if (!hotel) notFound();
    if (isRetired(hotel)) notFound();
  }

  return (
    <>
      <JsonLd data={[hotelSchema(hotel, id), hotelBreadcrumb(hotel, id)]} />
      <HotelPageClient hotel={hotel} />
    </>
  );
}
