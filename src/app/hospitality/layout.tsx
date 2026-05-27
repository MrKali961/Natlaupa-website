import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner With Us',
  description: 'Join Natlaupa\'s exclusive network of exceptional hotels and resorts. Connect extraordinary properties with travelers who seek nothing but the best.',
  openGraph: {
    title: 'Hospitality | Partner With Natlaupa',
    description: 'Join Natlaupa\'s exclusive network of exceptional hotels and resorts. Connect extraordinary properties with travelers who seek nothing but the best.',
    url: 'https://www.natlaupa.com/hospitality',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Partner With Natlaupa - Hotel Partnership Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hospitality | Partner With Natlaupa',
    description: 'Join Natlaupa\'s exclusive network of exceptional hotels and resorts. Connect extraordinary properties with travelers who seek nothing but the best.',
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
