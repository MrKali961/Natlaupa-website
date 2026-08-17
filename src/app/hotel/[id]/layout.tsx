import { Metadata } from 'next';
import { isPubliclyListable } from '@/lib/fetch-all';
import { isCuid, isValidSlug } from '@/lib/slugify';
import { buildTitle, buildDescription, stripBrandSuffix } from '@/lib/seo-meta';

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
  // No ' | Natlaupa' suffix here — the root layout's title template appends it. The other
  // not-found returns in this file DID carry the literal suffix and rendered
  // "Hotel Not Found | Natlaupa | Natlaupa"; all three are now de-duplicated to match this one.
  // 12 such page-level titles were fixed across the four dynamic layouts. The hub layouts'
  // '| Natlaupa' literals were deliberately LEFT ALONE — those are openGraph/twitter titles,
  // which the template does not touch, so their brand suffix is correct.
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
        title: 'Hotel Not Found',
        description: 'The requested hotel could not be found.',
      };
    }

    const data = await response.json();
    const hotel = data.data;

    if (!hotel) {
      return {
        title: 'Hotel Not Found',
        description: 'The requested hotel could not be found.',
      };
    }

    // Retired inventory: page.tsx returns 404 for these, so the metadata must not
    // advertise them as indexable. Same predicate as the sitemap, llms.txt and the
    // page component, so no surface can disagree about what is public.
    if (!isPubliclyListable(hotel)) return RETIRED_METADATA;

    // 🔴 Both SERP fields overflowed here, measured across ALL 84 live hotel pages 2026-08-17:
    //   titles      36 of 84 (42%) over 60 chars — range 44-93, median 59
    //   descriptions 84 of 84 (100%) over 155     — range 229-658, MEDIAN 391
    // 33 descriptions ran past 450 characters, so Google was discarding up to ~75% of the text
    // on the pages that carry the entire bookable inventory. Nothing in the codebase bounded
    // either field; `src/lib/seo-meta.ts` now does.
    const rawTitle = hotel.metaTitle || `${hotel.name} - ${hotel.city}, ${hotel.country}`;

    // The fallback CHAIN is unchanged on purpose — metaDescription, then shortDescription, then
    // the generated line. buildDescription only bounds whichever one wins, so this is a pure
    // length fix and not a change to which copy gets shown.
    const rawDescription =
      hotel.metaDescription ||
      hotel.shortDescription ||
      `Experience luxury at ${hotel.name} in ${hotel.city}. ${hotel.starRating ? `${hotel.starRating}-star` : 'Premium'} accommodation with world-class amenities.`;

    const description = buildDescription(rawDescription);

    // Social cards have NO 60-character limit, so they get the full text with only a duplicate
    // brand suffix removed. Clamping them would be pure loss — same rule as the TRD property.
    const socialTitle = stripBrandSuffix(rawTitle);
    const imageUrl = hotel.bannerImage || hotel.thumbnailImage;
    const canonicalUrl = `https://www.natlaupa.com/hotel/${hotel.slug || hotel.id}`;

    return {
      // `absolute` so the root layout's `template: '%s | Natlaupa'` cannot re-append the brand.
      // buildTitle already adds it when it fits, and strips one the CMS value may carry — the
      // live values are formatted "{name} | {city} | Luxury Hotel | Natlaupa", so without the
      // strip this would have rendered the brand twice.
      title: { absolute: buildTitle(rawTitle) },
      description,
      openGraph: {
        title: socialTitle,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: hotel.name }] : [],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: socialTitle,
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
      title: 'Hotel Not Found',
      description: 'The requested hotel could not be found.',
    };
  }
}

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
