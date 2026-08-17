import { Metadata } from 'next';
import { slugify } from '@/lib/slugify';
import { fetchCountries } from '@/lib/server-api';

type Props = {
  params: Promise<{ country: string }>;
};

/**
 * Should this country page invite indexing?
 *
 * There are 19 country pages generated from a free-text `country` column, and an empty one is
 * programmatic thin content: a title, a boilerplate description and no inventory. Those compete with
 * the pages that do have hotels and give a searcher nothing.
 *
 * Counts come from `/hotels/countries`, which returns an authoritative `{ country, count }` per
 * country. Deliberately NOT derived by reconstructing a country name from the slug and querying by
 * it -- the column contains trailing-whitespace variants ('France' and 'France '), so a
 * reconstructed name can fail to match a country that genuinely has hotels, and a false "thin"
 * verdict would noindex a good page. Matching on slugify() collapses those variants the same way the
 * sitemap does.
 *
 * FAILS OPEN. If the count cannot be determined -- API unreachable, country absent from the
 * response -- the page stays indexable. Same philosophy as isPubliclyListable's `!== false`: never
 * let an infrastructure hiccup silently deindex live pages.
 */
async function shouldIndexCountry(countrySlug: string): Promise<boolean> {
  try {
    const countries = await fetchCountries();
    if (!countries.length) return true; // could not determine -> stay indexed
    const match = countries.find((c) => slugify(c.country) === countrySlug);
    if (!match) return true; // unknown to the API -> stay indexed
    return match.count > 0;
  } catch {
    return true;
  }
}

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
      // An empty country page is thin content. `follow` stays true either way so the links out of
      // the page keep working even when it is not itself indexed.
      index: await shouldIndexCountry(countrySlug),
      follow: true,
    },
  };
}

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
