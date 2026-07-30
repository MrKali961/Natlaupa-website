import { MetadataRoute } from 'next';
import { slugify } from '@/lib/slugify';
import { fetchAll, isPubliclyListable } from '@/lib/fetch-all';

const BASE_URL = 'https://www.natlaupa.com';
// NEXT_PUBLIC_* is inlined at build time; if it is unset on the deploy target the
// dynamic sitemap would silently collapse to static pages. Fall back to the real
// production API base (never localhost) so discovery keeps working.
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://natlaupa.theelitessolutions.cloud/api/v1';

// Force dynamic rendering - sitemap will be generated on request, not at build time
export const dynamic = 'force-dynamic';

interface Hotel {
  id: string;
  slug?: string;
  updatedAt?: string;
  isActive?: boolean;
  deletedAt?: string | null;
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

const fetchCollection = <T,>(endpoint: string) => fetchAll<T>(API_URL, endpoint);

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
    // French legal pages — index,follow and self-canonical, but were absent from
    // the sitemap entirely.
    ...(
      [
        'cgu',
        'mentions-legales',
        'politique-de-confidentialite',
        'politique-cookies',
        'conditions-generales-service',
        'mediation-consommation',
      ] as const
    ).map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];

  // Fetch all dynamic content from API (every page, not just the first)
  const [hotels, blogs, offers, destinations, styles, countries] = await Promise.all([
    fetchCollection<Hotel>('/hotels'),
    fetchCollection<Blog>('/blogs/public'),
    fetchCollection<Offer>('/offers/public'),
    fetchCollection<Destination>('/hotel-destinations/public'),
    fetchCollection<Style>('/hotel-styles/public'),
    fetchCollection<Country>('/hotels/countries'),
  ]);

  // Only advertise bookable hotels — 19 of the 77 are deactivated.
  const activeHotels = hotels.filter(isPubliclyListable);

  // Dynamic hotel pages
  const hotelPages: MetadataRoute.Sitemap = activeHotels.map((hotel) => ({
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

  const allPages = [
    ...staticPages,
    ...hotelPages,
    ...blogPages,
    ...offerPages,
    ...destinationPages,
    ...stylePages,
    ...countryPages,
  ];

  // De-duplicate by URL, keeping the first occurrence.
  //
  // The `country` column is free text and contains trailing-whitespace variants
  // ('France' and 'France ', 'Lebanon' and 'Lebanon ', 'United Kingdom' and
  // 'United Kingdom '). slugify() collapses each pair to one slug, which would
  // otherwise emit the same <loc> twice. The underlying data still needs cleaning
  // in the admin — this only stops a malformed sitemap being published meanwhile.
  const seen = new Set<string>();
  return allPages.filter((page) => {
    if (seen.has(page.url)) return false;
    seen.add(page.url);
    return true;
  });
}
