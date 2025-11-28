import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner With Us',
  description: 'Join Natlaupa\'s exclusive network of exceptional hotels and resorts. Connect extraordinary properties with travelers who seek nothing but the best.',
  openGraph: {
    title: 'For Hotels | Partner With Natlaupa',
    description: 'Join Natlaupa\'s exclusive network of exceptional hotels and resorts.',
    url: 'https://www.natlaupa.com/for-hotels',
  },
  alternates: {
    canonical: 'https://www.natlaupa.com/for-hotels',
  },
};

export default function ForHotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
