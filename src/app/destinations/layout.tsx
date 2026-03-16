import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore Natlaupa\'s curated collection of luxury hotel destinations worldwide. From Maldives overwater villas to European castles — discover extraordinary stays across every corner of the globe.',
  alternates: {
    canonical: 'https://www.natlaupa.com/destinations',
  },
  openGraph: {
    title: 'Destinations | Natlaupa',
    description: 'Explore Natlaupa\'s curated collection of luxury hotel destinations worldwide. From Maldives overwater villas to European castles — discover extraordinary stays across every corner of the globe.',
    url: 'https://www.natlaupa.com/destinations',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Natlaupa Luxury Hotel Destinations Worldwide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Destinations | Natlaupa',
    description: 'Explore Natlaupa\'s curated collection of luxury hotel destinations worldwide. From Maldives overwater villas to European castles — discover extraordinary stays across every corner of the globe.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
