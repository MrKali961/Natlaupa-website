import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Natlaupa concierge team. Available 24/7 to assist with luxury travel inquiries, honeymoons, corporate retreats, and personalized bookings.',
  openGraph: {
    title: 'Contact Natlaupa | Get in Touch',
    description: 'Get in touch with Natlaupa concierge team. Available 24/7 to assist with luxury travel inquiries, honeymoons, corporate retreats, and personalized bookings.',
    url: 'https://www.natlaupa.com/contact',
    siteName: 'Natlaupa',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.natlaupa.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Contact Natlaupa Concierge Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Natlaupa | Get in Touch',
    description: 'Get in touch with Natlaupa concierge team. Available 24/7 to assist with luxury travel inquiries, honeymoons, corporate retreats, and personalized bookings.',
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.natlaupa.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
