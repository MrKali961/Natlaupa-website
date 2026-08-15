import { Metadata } from 'next';
import { isPubliclyListable } from '@/lib/fetch-all';
import { isCuid, isValidSlug } from '@/lib/slugify';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Metadata for retired (deactivated) hotels.
 *
 * This layout is the authoritative metadata source for /hotel/[id] — it takes
 * precedence over page.tsx for `title` and `robots`. It previously hardcoded
 * `robots: { index: true, follow: true }` for every hotel the API returned, and
 * `/hotels/slug/:slug` returns deactivated hotels just like live ones. So the 19
 * retired hotels were served with an explicit indexing invitation even after
 * page.tsx started returning 404 for them.
 */
const RETIRED_METADATA: Metadata = {
  // No ' | Natlaupa' suffix here — the root layout's title template appends it. The
  // other not-found returns in this file predate that template and render
  // "Hotel Not Found | Natlaupa | Natlaupa"; not fixed here to keep this change scoped.
  title: 'Hotel Not Found',
  description: 'This hotel is no longer available.',
  robots: { index: false, follow: false },
};

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // The page below already 404s on an unknown id, but generateMetadata runs
  // regardless — without this it still issues /hotels/slug/null.
  if (!isValidSlug(id)) {
    return {
      title: 'Hotel Not Found',
      description: 'The requested hotel could not be found.',
    };
  }

  try {
    // Determine if it's an ID or slug and use the appropriate endpoint
    const isId = isCuid(id);
    const endpoint = isId
      ? `${API_URL}/hotels/${id}`
      : `${API_URL}/hotels/slug/${id}`;

    const response = await fetch(endpoint, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Hotel Not Found | Natlaupa',
        description: 'The requested hotel could not be found.',
      };
    }

    const data = await response.json();
    const hotel = data.data;

    if (!hotel) {
      return {
        title: 'Hotel Not Found | Natlaupa',
        description: 'The requested hotel could not be found.',
      };
    }

    // Retired inventory: page.tsx returns 404 for these, so the metadata must not
    // advertise them as indexable. Same predicate as the sitemap, llms.txt and the
    // page component, so no surface can disagree about what is public.
    if (!isPubliclyListable(hotel)) return RETIRED_METADATA;

    const title = hotel.metaTitle || `${hotel.name} - ${hotel.city}, ${hotel.country} | Natlaupa`;
    const description = hotel.metaDescription || hotel.shortDescription || `Experience luxury at ${hotel.name} in ${hotel.city}. ${hotel.starRating ? `${hotel.starRating}-star` : 'Premium'} accommodation with world-class amenities.`;
    const imageUrl = hotel.bannerImage || hotel.thumbnailImage;
    const canonicalUrl = `https://www.natlaupa.com/hotel/${hotel.slug || hotel.id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: hotel.name }] : [],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error fetching hotel for metadata:', error);
    return {
      title: 'Hotel Not Found | Natlaupa',
      description: 'The requested hotel could not be found.',
    };
  }
}

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
