import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotel Styles',
  description: 'Browse luxury hotels by style — eco-lodges, urban suites, historic castles, overwater villas — and find the one that fits your journey.',
  alternates: {
    canonical: 'https://www.natlaupa.com/styles',
  },
  openGraph: {
    title: 'Hotel Styles | Natlaupa',
    description: 'Browse luxury hotels by style — eco-lodges, urban suites, historic castles, overwater villas — and find the one that fits your journey.',
    url: 'https://www.natlaupa.com/styles',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Natlaupa Hotel Styles - Find Your Perfect Stay',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Styles | Natlaupa',
    description: 'Browse luxury hotels by style — eco-lodges, urban suites, historic castles, overwater villas — and find the one that fits your journey.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
