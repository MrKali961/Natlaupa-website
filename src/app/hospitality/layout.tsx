import { Metadata } from 'next';

const DESCRIPTION =
  'See exactly where your hotel loses guests across discovery, search and booking. Natlaupa\'s AI Digital Presence Audit grades your online presence against 13 dimensions, surfaces the bookings you\'re leaking, and hands you a ranked plan to recover them. Every audit is human-verified.';

export const metadata: Metadata = {
  title: 'AI Digital Presence Audit for Hotels',
  description: DESCRIPTION,
  openGraph: {
    title: 'AI Digital Presence Audit for Hotels | Natlaupa',
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
        alt: 'Natlaupa AI Digital Presence Audit for Hotels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Digital Presence Audit for Hotels | Natlaupa',
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
