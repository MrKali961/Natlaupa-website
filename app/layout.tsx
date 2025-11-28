import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Natlaupa | Redefining the Art of Stay',
  description: 'Experience luxury accommodations worldwide with personalized AI-powered travel concierge.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-deepBlue text-slate-100 font-sans selection:bg-gold selection:text-deepBlue">
        <SmoothScrollProvider>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
