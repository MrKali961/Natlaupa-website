import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';

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

const BASE_URL = 'https://www.natlaupa.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Natlaupa | Redefining the Art of Stay',
    template: '%s | Natlaupa',
  },
  description: 'Experience luxury accommodations worldwide with personalized AI-powered travel concierge. Discover handpicked hotels, resorts, and unique stays curated for discerning travelers.',
  keywords: ['luxury hotels', 'travel', 'boutique hotels', 'luxury accommodations', 'travel concierge', 'premium stays', 'vacation', 'resorts'],
  authors: [{ name: 'Natlaupa' }],
  creator: 'Natlaupa',
  publisher: 'Natlaupa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Natlaupa',
    title: 'Natlaupa | Redefining the Art of Stay',
    description: 'Experience luxury accommodations worldwide with personalized AI-powered travel concierge.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Natlaupa - Luxury Travel & Accommodations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natlaupa | Redefining the Art of Stay',
    description: 'Experience luxury accommodations worldwide with personalized AI-powered travel concierge.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=630&fit=crop'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-deepBlue text-slate-100 font-sans selection:bg-gold selection:text-deepBlue overflow-x-hidden">
        <SmoothScrollProvider>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <CookieConsentBanner />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
