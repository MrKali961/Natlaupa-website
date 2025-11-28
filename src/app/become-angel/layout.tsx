import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become an Angel',
  description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards, get VIP access, and help others discover extraordinary luxury stays.',
  openGraph: {
    title: 'Become a Natlaupa Angel | Ambassador Program',
    description: 'Join Natlaupa\'s exclusive ambassador program. Earn rewards and VIP access.',
    url: 'https://www.natlaupa.com/become-angel',
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
