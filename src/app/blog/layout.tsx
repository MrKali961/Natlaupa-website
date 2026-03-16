import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Blog | Stories, Tips & Insider Insights',
  description: 'Explore Natlaupa\'s travel blog for inspiring stories, luxury destination guides, insider tips, and curated insights from the world\'s most extraordinary places.',
  alternates: {
    canonical: 'https://www.natlaupa.com/blog',
  },
  openGraph: {
    title: 'Travel Blog | Natlaupa',
    description: 'Explore Natlaupa\'s travel blog for inspiring stories, luxury destination guides, insider tips, and curated insights from the world\'s most extraordinary places.',
    url: 'https://www.natlaupa.com/blog',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Natlaupa Travel Blog - Stories & Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Blog | Natlaupa',
    description: 'Explore Natlaupa\'s travel blog for inspiring stories, luxury destination guides, insider tips, and curated insights from the world\'s most extraordinary places.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
