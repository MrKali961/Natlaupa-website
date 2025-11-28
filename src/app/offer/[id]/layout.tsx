import { Metadata } from 'next';
import { TRENDING_HOTELS } from '@/lib/constants';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hotel = TRENDING_HOTELS.find(h => h.id === id);

  if (!hotel) {
    return {
      title: 'Offer Not Found',
      description: 'The requested offer could not be found.',
    };
  }

  return {
    title: hotel.name,
    description: hotel.description || `Experience luxury at ${hotel.name} in ${hotel.location}. Book your exclusive stay with Natlaupa.`,
    openGraph: {
      title: `${hotel.name} | Natlaupa`,
      description: hotel.description || `Experience luxury at ${hotel.name} in ${hotel.location}.`,
      url: `https://www.natlaupa.com/offer/${id}`,
      images: hotel.imageUrl ? [{ url: hotel.imageUrl, alt: hotel.name }] : [],
    },
    alternates: {
      canonical: `https://www.natlaupa.com/offer/${id}`,
    },
  };
}

export default function OfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
