import { MetadataRoute } from 'next';
import { slugify } from '@/lib/slugify';

const BASE_URL = 'https://www.natlaupa.com';
// NEXT_PUBLIC_* is inlined at build time; if it is unset on the deploy target the
// dynamic sitemap would silently collapse to static pages. Fall back to the real
// production API base (never localhost) so discovery keeps working.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://natlaupa.theelitessolutions.cloud/api/v1';

// Force dynamic rendering - sitemap will be generated on request, not at build time
export const dynamic = 'force-dynamic';

interface Hotel {
  id: string;
  slug?: string;
  updatedAt?: string;
}

interface Blog {
  id: string;
  slug: string;
  updatedAt?: string;
}

interface Offer {
  id: string;
  slug?: string;
  updatedAt?: string;
}

interface Destination {
  id: string;
  slug: string;
  updatedAt?: string;
}

interface Style {
  id: string;
  slug: string;
  updatedAt?: string;
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

    // Handle different response formats
    const data = json.data;

    // If data is an array, return it
    if (Array.isArray(data)) {
      return data;
    }

    // If data is an object with a nested array (paginated response)
    if (data && typeof data === 'object') {
      // Check common pagination patterns
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.hotels)) return data.hotels;
      if (Array.isArray(data.blogs)) return data.blogs;
      if (Array.isArray(data.offers)) return data.offers;
      if (Array.isArray(data.destinations)) return data.destinations;
      if (Array.isArray(data.styles)) return data.styles;
      if (Array.isArray(data.countries)) return data.countries;
    }

    return [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hospitality`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/join-the-private-club`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/offers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/styles`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/countries`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Fetch all dynamic content from API
  const [hotels, blogs, offers, destinations, styles, countries] = await Promise.all([
    fetchData<Hotel>('/hotels'),
    fetchData<Blog>('/blogs/public'),
    fetchData<Offer>('/offers/public'),
    fetchData<Destination>('/hotel-destinations/public'),
    fetchData<Style>('/hotel-styles/public'),
    fetchData<Country>('/hotels/countries'),
  ]);

  // Dynamic hotel pages
  const hotelPages: MetadataRoute.Sitemap = hotels.map((hotel) => ({
    url: `${BASE_URL}/hotel/${hotel.slug || hotel.id}`,
    lastModified: hotel.updatedAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic offer pages
  const offerPages: MetadataRoute.Sitemap = offers.map((offer) => ({
    url: `${BASE_URL}/offer/${offer.slug || offer.id}`,
    lastModified: offer.updatedAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic destination pages
  const destinationPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${BASE_URL}/destinations/${dest.slug}`,
    lastModified: dest.updatedAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic style pages
  const stylePages: MetadataRoute.Sitemap = styles.map((style) => ({
    url: `${BASE_URL}/styles/${style.slug}`,
    lastModified: style.updatedAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic country pages
  const countryPages: MetadataRoute.Sitemap = countries.map(({ country }) => ({
    url: `${BASE_URL}/countries/${slugify(country)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...hotelPages,
    ...blogPages,
    ...offerPages,
    ...destinationPages,
    ...stylePages,
    ...countryPages,
  ];
}
