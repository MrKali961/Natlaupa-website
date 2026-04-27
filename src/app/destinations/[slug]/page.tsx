import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchDestinations, fetchHotelsByDestination } from '@/lib/server-api';
import DestinationPageClient from './DestinationPageClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destinations = await fetchDestinations();
  const destination = destinations.find(d => d.slug === slug);

  if (!destination) return { title: 'Destination Not Found' };

  const title = `${destination.name} Hotels & Luxury Stays`;
  const description =
    destination.description ||
    `Discover handpicked luxury hotels in ${destination.name}${destination.country ? `, ${destination.country}` : ''}. Curated stays for discerning travellers.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/destinations/${slug}`,
      ...(destination.imageUrl && {
        images: [{ url: destination.imageUrl, width: 1200, height: 630, alt: destination.name }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(destination.imageUrl && { images: [destination.imageUrl] }),
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const destinations = await fetchDestinations();
  const destination = destinations.find(d => d.slug === slug);
  if (!destination) notFound();

  const hotels = await fetchHotelsByDestination(destination.id);

  return <DestinationPageClient destination={destination} hotels={hotels} />;
}
