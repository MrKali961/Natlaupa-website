import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'A curated collection of luxury hotel destinations worldwide, from Maldives overwater villas to European castles.',
  alternates: {
    canonical: 'https://www.natlaupa.com/destinations',
  },
  openGraph: {
    title: 'Destinations | Natlaupa',
    description: 'A curated collection of luxury hotel destinations worldwide, from Maldives overwater villas to European castles.',
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
    description: 'A curated collection of luxury hotel destinations worldwide, from Maldives overwater villas to European castles.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
