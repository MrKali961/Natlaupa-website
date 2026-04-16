import { notFound, redirect } from 'next/navigation';
import { fetchOfferBySlug } from '@/lib/server-api';
import OfferPageClient from './OfferPageClient';

function isCuid(str: string): boolean {
  return /^c[a-z0-9]{24}$/.test(str) || /^h\d+$/.test(str);
}

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
