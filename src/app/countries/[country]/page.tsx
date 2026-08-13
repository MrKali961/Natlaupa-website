import { notFound } from 'next/navigation';
import { fetchCountries, fetchHotelsByCountry } from '@/lib/server-api';
import { slugify } from '@/lib/slugify';
import CountryPageClient from './CountryPageClient';
import { JsonLd, breadcrumbList } from '@/components/JsonLd';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  // Match slug-to-slug, the same rule the sitemap publishes with. Un-slugifying the
  // param and comparing names cannot match the trailing-space rows in hotels.country
  // ('Morocco ', 'United States '), which is what made those sitemap URLs hard 404s.
  const countrySlug = slugify(decodeURIComponent(country));

  const countriesData = await fetchCountries();
  // hotels.country stores one country under several spellings ('France' and 'France ',
  // 11 hotels behind the latter). Group every row by its slug so a single URL owns all
  // of them, clean name first — that name is what the page displays, and its hotels
  // lead the grid instead of the API's arbitrary row order deciding the hero image.
  const countryGroups = new Map<string, string[]>();
  for (const { country: name } of countriesData) {
    const slug = slugify(name);
    const group = countryGroups.get(slug) || [];
    if (name === name.trim()) group.unshift(name);
    else group.push(name);
    countryGroups.set(slug, group);
  }
  // Deduped, so the "Explore Other Countries" strip stops rendering 'France'/'France '
  // as two chips that now point at the same page.
  const allCountries = [...countryGroups.values()].map(group => group[0]);

  const variants = countryGroups.get(countrySlug);
  if (!variants) notFound();

  const matchedCountry = variants[0];

  // Every variant is fetched untrimmed: the API filters on the exact stored value, so
  // `?country=Morocco` returns nothing while `?country=Morocco%20` returns the hotel.
  // Merging them is what keeps the 'France ' hotels reachable from /countries/france —
  // matching on the clean row alone would have orphaned them.
  const hotels = (await Promise.all(variants.map(c => fetchHotelsByCountry(c)))).flat();

  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Countries', path: '/countries' },
          { name: matchedCountry, path: `/countries/${countrySlug}` },
        ])}
      />
      <CountryPageClient
        hotels={hotels}
        matchedCountry={matchedCountry}
        allCountries={allCountries}
      />
    </>
  );
}
