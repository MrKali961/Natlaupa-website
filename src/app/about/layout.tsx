import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'A network of hotel experts in personalised luxury travel, delivering advantageous rates and 24/7 support at the world\'s finest destinations.',
  alternates: {
    canonical: 'https://www.natlaupa.com/about',
  },
  openGraph: {
    title: 'About Us | Natlaupa',
    description: 'A network of hotel experts in personalised luxury travel, delivering advantageous rates and 24/7 support at the world\'s finest destinations.',
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
    description: 'A network of hotel experts in personalised luxury travel, delivering advantageous rates and 24/7 support at the world\'s finest destinations.',
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
