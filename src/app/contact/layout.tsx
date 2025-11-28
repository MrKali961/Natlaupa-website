import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Natlaupa concierge team. Available 24/7 to assist with luxury travel inquiries, honeymoons, corporate retreats, and personalized bookings.',
  openGraph: {
    title: 'Contact Natlaupa | Get in Touch',
    description: 'Get in touch with Natlaupa concierge team. Available 24/7 to assist with luxury travel inquiries.',
    url: 'https://www.natlaupa.com/contact',
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
