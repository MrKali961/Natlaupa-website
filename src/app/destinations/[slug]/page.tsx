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
