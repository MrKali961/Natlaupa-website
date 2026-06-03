import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { fetchHotelBySlug, fetchHotelById } from '@/lib/server-api';
import HotelPageClient from './HotelPageClient';
import { JsonLd, hotelSchema, hotelBreadcrumb } from '@/components/JsonLd';

function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // CUID routes redirect to slug — skip generating metadata for them
  if (isCuid(id)) return {};

  const hotel = await fetchHotelBySlug(id);
  if (!hotel) return { title: 'Hotel Not Found' };

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
    if (hotel.slug) redirect(`/hotel/${hotel.slug}`);
  } else {
    hotel = await fetchHotelBySlug(id);
    if (!hotel) notFound();
  }

  return (
    <>
      <JsonLd data={[hotelSchema(hotel, id), hotelBreadcrumb(hotel, id)]} />
      <HotelPageClient hotel={hotel} />
    </>
  );
}
