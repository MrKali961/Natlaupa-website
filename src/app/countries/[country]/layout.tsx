import { Metadata } from 'next';

type Props = {
  params: Promise<{ country: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const countryName = decodeURIComponent(country).replace(/-/g, ' ');
  const capitalizedCountry = countryName.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const title = `Luxury Hotels in ${capitalizedCountry} | Natlaupa`;
  const description = `Discover luxury hotels and exclusive accommodations in ${capitalizedCountry}. Curated collection of premium stays for discerning travelers.`;
  const canonicalUrl = `https://www.natlaupa.com/countries/${country}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Natlaupa',
      type: 'website',
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
