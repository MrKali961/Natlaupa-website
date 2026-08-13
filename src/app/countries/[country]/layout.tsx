import { Metadata } from 'next';
import { slugify } from '@/lib/slugify';

type Props = {
  params: Promise<{ country: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  // Normalise through slugify so legacy spellings (e.g. '/countries/morocco-',
  // emitted by the old inline rule) self-canonicalize to the sitemap URL.
  const countrySlug = slugify(decodeURIComponent(country));
  const countryName = countrySlug.replace(/-/g, ' ');
  const capitalizedCountry = countryName.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const title = `Luxury Hotels in ${capitalizedCountry} | Natlaupa`;
  const description = `Discover luxury hotels and exclusive accommodations in ${capitalizedCountry}. Curated collection of premium stays for discerning travelers.`;
  const canonicalUrl = `https://www.natlaupa.com/countries/${countrySlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Natlaupa',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
