import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Countries',
  description: 'Discover Natlaupa\'s luxury hotel portfolio by country. Explore handpicked properties across the world\'s most sought-after destinations — each country offering its own signature blend of culture and indulgence.',
  alternates: {
    canonical: 'https://www.natlaupa.com/countries',
  },
  openGraph: {
    title: 'Countries | Natlaupa',
    description: 'Discover Natlaupa\'s luxury hotel portfolio by country. Explore handpicked properties across the world\'s most sought-after destinations — each country offering its own signature blend of culture and indulgence.',
    url: 'https://www.natlaupa.com/countries',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Natlaupa Hotels by Country',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Countries | Natlaupa',
    description: 'Discover Natlaupa\'s luxury hotel portfolio by country. Explore handpicked properties across the world\'s most sought-after destinations — each country offering its own signature blend of culture and indulgence.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function CountriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
