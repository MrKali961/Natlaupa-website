import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.natlaupa.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const dynamic = 'force-dynamic';

interface Hotel {
  id: string;
  name: string;
  slug?: string;
  city: string;
  country: string;
  category: string;
  description?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

interface Offer {
  id: string;
  title: string;
  slug?: string;
  tagline?: string;
  description: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
}

interface Style {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Country {
  country: string;
  count: number;
}

async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const json = await response.json();
    const data = json.data;

    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.hotels)) return data.hotels;
      if (Array.isArray(data.blogs)) return data.blogs;
      if (Array.isArray(data.offers)) return data.offers;
      if (Array.isArray(data.destinations)) return data.destinations;
      if (Array.isArray(data.styles)) return data.styles;
      if (Array.isArray(data.countries)) return data.countries;
    }
    return [];
  } catch {
    return [];
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '...';
}

export async function GET() {
  const [hotels, blogs, offers, destinations, styles, countries] = await Promise.all([
    fetchData<Hotel>('/hotels'),
    fetchData<Blog>('/blogs/public'),
    fetchData<Offer>('/offers/public'),
    fetchData<Destination>('/hotel-destinations/public'),
    fetchData<Style>('/hotel-styles/public'),
    fetchData<Country>('/hotels/countries'),
  ]);

  const lines: string[] = [];

  lines.push('# Natlaupa');
  lines.push('');
  lines.push('> Redefining the Art of Stay — a luxury travel platform connecting discerning travelers with handpicked hotels, resorts, and unique accommodations worldwide. Natlaupa offers personalized AI-powered concierge services, curated experiences, and exclusive offers.');
  lines.push('');

  // About
  lines.push('## About Natlaupa');
  lines.push('');
  lines.push('Natlaupa is a network of hotel experts specializing in personalized luxury travel. We partner with the world\'s finest destinations to deliver advantageous rates, 24/7 support, and unforgettable journeys. Our platform uses AI-powered recommendations to match travelers with their ideal stays based on mood, style, and preferences.');
  lines.push('');

  // Core pages
  lines.push('## Main Pages');
  lines.push('');
  lines.push(`- [Home](${BASE_URL}): Landing page with AI-powered mood matcher, experience selector, and curated hotel recommendations`);
  lines.push(`- [About](${BASE_URL}/about): Our story, mission, and the team behind Natlaupa`);
  lines.push(`- [Contact](${BASE_URL}/contact): Reach our concierge team — available 24/7 for luxury travel inquiries`);
  lines.push(`- [For Hotels](${BASE_URL}/for-hotels): Partnership program for hotels and resorts to join the Natlaupa network`);
  lines.push(`- [Become an Angel](${BASE_URL}/become-angel): Ambassador program — earn rewards and VIP access by referring travelers`);
  lines.push(`- [Blog](${BASE_URL}/blog): Travel guides, hotel reviews, and luxury lifestyle articles`);
  lines.push(`- [Offers](${BASE_URL}/offers): Curated travel experiences and exclusive hotel packages`);
  lines.push(`- [Destinations](${BASE_URL}/destinations): Browse luxury hotels by destination`);
  lines.push(`- [Styles](${BASE_URL}/styles): Browse hotels by style — boutique, resort, villa, palace, and more`);
  lines.push(`- [Countries](${BASE_URL}/countries): Browse luxury hotels by country`);
  lines.push('');

  // Destinations
  if (destinations.length > 0) {
    lines.push('## Destinations');
    lines.push('');
    for (const dest of destinations) {
      const desc = dest.description ? `: ${truncate(dest.description, 120)}` : '';
      lines.push(`- [${dest.name}, ${dest.country}](${BASE_URL}/destinations/${dest.slug})${desc}`);
    }
    lines.push('');
  }

  // Hotel styles
  if (styles.length > 0) {
    lines.push('## Hotel Styles');
    lines.push('');
    for (const style of styles) {
      const desc = style.description ? `: ${truncate(style.description, 120)}` : '';
      lines.push(`- [${style.name}](${BASE_URL}/styles/${style.slug})${desc}`);
    }
    lines.push('');
  }

  // Countries
  if (countries.length > 0) {
    lines.push('## Countries');
    lines.push('');
    for (const { country, count } of countries) {
      const slug = country.toLowerCase().replace(/\s+/g, '-');
      lines.push(`- [${country}](${BASE_URL}/countries/${slug}): ${count} luxury hotel${count !== 1 ? 's' : ''}`);
    }
    lines.push('');
  }

  // Hotels
  if (hotels.length > 0) {
    lines.push('## Hotels');
    lines.push('');
    for (const hotel of hotels) {
      const loc = [hotel.city, hotel.country].filter(Boolean).join(', ');
      const slug = hotel.slug || hotel.id;
      const desc = hotel.description ? ` — ${truncate(hotel.description, 100)}` : '';
      lines.push(`- [${hotel.name}](${BASE_URL}/hotel/${slug}): ${loc}${desc}`);
    }
    lines.push('');
  }

  // Offers
  if (offers.length > 0) {
    lines.push('## Experiences & Offers');
    lines.push('');
    for (const offer of offers) {
      const slug = offer.slug || offer.id;
      const desc = offer.tagline || truncate(offer.description, 120);
      lines.push(`- [${offer.title}](${BASE_URL}/offer/${slug}): ${desc}`);
    }
    lines.push('');
  }

  // Blog posts
  if (blogs.length > 0) {
    lines.push('## Blog');
    lines.push('');
    for (const blog of blogs) {
      const desc = blog.excerpt ? `: ${truncate(blog.excerpt, 120)}` : '';
      lines.push(`- [${blog.title}](${BASE_URL}/blog/${blog.slug})${desc}`);
    }
    lines.push('');
  }

  const body = lines.join('\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
