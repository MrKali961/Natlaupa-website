import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become an Angel',
  description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
  openGraph: {
    title: 'Become a Natlaupa Angel | Ambassador Program',
    description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
    url: 'https://www.natlaupa.com/become-angel',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Become a Natlaupa Angel - Ambassador Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Natlaupa Angel | Ambassador Program',
    description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.natlaupa.com/become-angel',
  },
};

export default function BecomeAngelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
