import { notFound, redirect } from 'next/navigation';
import { fetchHotelBySlug, fetchHotelById } from '@/lib/server-api';
import HotelPageClient from './HotelPageClient';

function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
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

  return <HotelPageClient hotel={hotel} />;
}
