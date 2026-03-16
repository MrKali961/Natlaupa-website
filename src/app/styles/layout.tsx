import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotel Styles',
  description: 'Browse Natlaupa\'s luxury hotel categories by accommodation style. Whether you seek eco-lodges, urban suites, historic castles, or overwater villas — find the perfect style for your next journey.',
  alternates: {
    canonical: 'https://www.natlaupa.com/styles',
  },
  openGraph: {
    title: 'Hotel Styles | Natlaupa',
    description: 'Browse Natlaupa\'s luxury hotel categories by accommodation style. Whether you seek eco-lodges, urban suites, historic castles, or overwater villas — find the perfect style for your next journey.',
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
    description: 'Browse Natlaupa\'s luxury hotel categories by accommodation style. Whether you seek eco-lodges, urban suites, historic castles, or overwater villas — find the perfect style for your next journey.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function StylesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
