import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Destinations | Natlaupa',
  description: 'Browse luxury hotels and accommodations by destination. Find your perfect getaway.',
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
