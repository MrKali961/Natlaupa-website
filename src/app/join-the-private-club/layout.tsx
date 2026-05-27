import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Private Club',
  description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
  openGraph: {
    title: 'Join the Natlaupa Private Club | Ambassador Program',
    description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
    url: 'https://www.natlaupa.com/join-the-private-club',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Join the Natlaupa Private Club - Ambassador Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Natlaupa Private Club | Ambassador Program',
    description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.natlaupa.com/join-the-private-club',
  },
};

export default function JoinThePrivateClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
