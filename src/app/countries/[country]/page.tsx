import { notFound } from 'next/navigation';
import { fetchCountries, fetchHotelsByCountry } from '@/lib/server-api';
import CountryPageClient from './CountryPageClient';

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
    <CountryPageClient
      hotels={hotels}
      matchedCountry={matchedCountry}
      allCountries={allCountries}
    />
  );
}
