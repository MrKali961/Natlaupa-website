import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Offers',
  description: 'Discover exclusive luxury hotel deals and limited-time offers curated by Natlaupa. Save on world-class accommodations with handpicked packages, upgrades, and seasonal promotions.',
  alternates: {
    canonical: 'https://www.natlaupa.com/offers',
  },
  openGraph: {
    title: 'Exclusive Offers | Natlaupa',
    description: 'Discover exclusive luxury hotel deals and limited-time offers curated by Natlaupa. Save on world-class accommodations with handpicked packages, upgrades, and seasonal promotions.',
    url: 'https://www.natlaupa.com/offers',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Natlaupa Exclusive Hotel Offers & Deals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exclusive Offers | Natlaupa',
    description: 'Discover exclusive luxury hotel deals and limited-time offers curated by Natlaupa. Save on world-class accommodations with handpicked packages, upgrades, and seasonal promotions.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
