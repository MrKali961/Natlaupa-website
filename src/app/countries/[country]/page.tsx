import { notFound } from 'next/navigation';
import { fetchCountries, fetchHotelsByCountry } from '@/lib/server-api';
import CountryPageClient from './CountryPageClient';
import { JsonLd, breadcrumbList } from '@/components/JsonLd';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const decodedCountry = decodeURIComponent(country).replace(/-/g, ' ');

  const countriesData = await fetchCountries();
  const allCountries = countriesData.map(c => c.country);
  const matchedCountry = allCountries.find(
    c => c.toLowerCase() === decodedCountry.toLowerCase()
  );

  if (!matchedCountry) notFound();

  const hotels = await fetchHotelsByCountry(matchedCountry);

  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Countries', path: '/countries' },
          { name: matchedCountry, path: `/countries/${country}` },
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
