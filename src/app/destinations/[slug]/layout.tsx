import { Metadata } from 'next';
import { isValidSlug } from '@/lib/slugify';
import { buildTitle, buildDescription, stripBrandSuffix } from '@/lib/seo-meta';

type Props = {
  params: Promise<{ slug: string }>;
};

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // The page below already 404s on an unknown slug, but generateMetadata runs
  // regardless — without this it still issues /hotel-destinations/slug/null.
  if (!isValidSlug(slug)) {
    return {
      title: 'Destination Not Found',
      description: 'The requested destination could not be found.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/hotel-destinations/slug/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Destination Not Found',
        description: 'The requested destination could not be found.',
      };
    }

    const data = await response.json();
    const destination = data.data;

    if (!destination) {
      return {
        title: 'Destination Not Found',
        description: 'The requested destination could not be found.',
      };
    }

    // 🔴 Both SERP fields were unbounded here. Measured on production 2026-08-17:
    // destination descriptions reached 355 chars, offers 160, styles 158 — all past Google's
    // ~155 limit, and the page `title` carried a literal '| Natlaupa' that the root layout's
    // `template: '%s | Natlaupa'` then appended a SECOND time. seo-meta.ts bounds both.
    const rawTitle = `Luxury Hotels in ${destination.name}`;
    const rawDescription = destination.description || `Discover luxury hotels and exclusive accommodations in ${destination.name}. Curated collection of premium stays for discerning travelers.`;
    // Bounds only — the fallback CHAIN above is deliberately unchanged, so this does
    // not alter which copy is shown, just how much of it survives truncation.
    const description = buildDescription(rawDescription);
    // Social cards have no 60-char limit; give them the full text.
    const socialTitle = stripBrandSuffix(rawTitle);
    const imageUrl = destination.imageUrl;
    const canonicalUrl = `https://www.natlaupa.com/destinations/${destination.slug}`;

    return {
      title: { absolute: buildTitle(rawTitle) },
      description,
      openGraph: {
        title: socialTitle,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `Hotels in ${destination.name}` }] : [],
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
    console.error('Error fetching destination for metadata:', error);
    return {
      title: 'Destination Not Found',
      description: 'The requested destination could not be found.',
    };
  }
}

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
