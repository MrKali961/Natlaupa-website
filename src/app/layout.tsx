import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import LatestOfferStrip from '@/components/LatestOfferStrip';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomScrollbar from '@/components/CustomScrollbar';
import StructuredData from '@/components/StructuredData';

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
        url: 'https://www.natlaupa.com/opengraph-image',
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
    images: ['https://www.natlaupa.com/opengraph-image'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: '31c5c05c91e4aa2c',
  },
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
      <head>
        {/* Google Consent Mode v2 - Must be set BEFORE any Google tags load */}
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Set default consent to denied
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });

            // Check for existing consent and update if granted
            try {
              var stored = localStorage.getItem('natlaupa_cookie_consent');
              if (stored) {
                var consent = JSON.parse(stored);
                gtag('consent', 'update', {
                  'analytics_storage': consent.analytics ? 'granted' : 'denied',
                  'ad_storage': consent.personalization ? 'granted' : 'denied',
                  'ad_user_data': consent.personalization ? 'granted' : 'denied',
                  'ad_personalization': consent.personalization ? 'granted' : 'denied'
                });
              }
            } catch (e) {}
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ESC050HLP4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ESC050HLP4');
          `}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen bg-deepBlue text-slate-100 font-sans selection:bg-gold selection:text-deepBlue overflow-x-hidden">
        <StructuredData />
        <SmoothScrollProvider>
          <LatestOfferStrip />
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <CookieConsentBanner />
          <WhatsAppButton />
          <CustomScrollbar />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
