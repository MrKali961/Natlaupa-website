import { Metadata } from 'next';

const DESCRIPTION =
  'Increase your hotel\'s visibility, direct bookings and commercial performance. Join Natlaupa\'s Founding Hotel Partner Program — strategic advisory, revenue optimization and premium networking. Test for 30 days for 99€, no commitment.';

export const metadata: Metadata = {
  title: 'Founding Hotel Partner Program',
  description: DESCRIPTION,
  openGraph: {
    title: 'Founding Hotel Partner Program | Natlaupa',
    description: DESCRIPTION,
    url: 'https://www.natlaupa.com/hospitality',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Natlaupa Founding Hotel Partner Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Founding Hotel Partner Program | Natlaupa',
    description: DESCRIPTION,
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.natlaupa.com/hospitality',
  },
};

export default function HospitalityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
