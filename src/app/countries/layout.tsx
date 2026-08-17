import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Countries',
  description: 'Explore our luxury hotel portfolio country by country, with handpicked properties across the world\'s most sought-after destinations.',
  alternates: {
    canonical: 'https://www.natlaupa.com/countries',
  },
  openGraph: {
    title: 'Countries | Natlaupa',
    description: 'Explore our luxury hotel portfolio country by country, with handpicked properties across the world\'s most sought-after destinations.',
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
    description: 'Explore our luxury hotel portfolio country by country, with handpicked properties across the world\'s most sought-after destinations.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function CountriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
