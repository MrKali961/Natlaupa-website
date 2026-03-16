import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Natlaupa is a network of hotel experts specializing in personalized luxury travel. We partner with the world\'s finest destinations to deliver advantageous rates, 24/7 support, and unforgettable journeys.',
  alternates: {
    canonical: 'https://www.natlaupa.com/about',
  },
  openGraph: {
    title: 'About Us | Natlaupa',
    description: 'Natlaupa is a network of hotel experts specializing in personalized luxury travel. We partner with the world\'s finest destinations to deliver advantageous rates, 24/7 support, and unforgettable journeys.',
    url: 'https://www.natlaupa.com/about',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'About Natlaupa - Luxury Travel Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Natlaupa',
    description: 'Natlaupa is a network of hotel experts specializing in personalized luxury travel. We partner with the world\'s finest destinations to deliver advantageous rates, 24/7 support, and unforgettable journeys.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
