import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Natlaupa - our story of curating exceptional luxury accommodations worldwide. Discover how we handpick properties that offer more than just a stay.',
  openGraph: {
    title: 'About Natlaupa | Our Story',
    description: 'Learn about Natlaupa - our story of curating exceptional luxury accommodations worldwide.',
    url: 'https://www.natlaupa.com/about',
  },
  alternates: {
    canonical: 'https://www.natlaupa.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
