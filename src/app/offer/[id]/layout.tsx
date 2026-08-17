import { Metadata } from 'next';
import { isValidSlug } from '@/lib/slugify';
import { buildTitle, buildDescription, stripBrandSuffix } from '@/lib/seo-meta';

type Props = {
  params: Promise<{ id: string }>;
};

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // The page below already 404s on an unknown id, but generateMetadata runs
  // regardless — without this it still issues /offers/slug/null.
  if (!isValidSlug(id)) {
    return {
      title: 'Offer Not Found',
      description: 'The requested offer could not be found.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/offers/slug/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Offer Not Found',
        description: 'The requested offer could not be found.',
      };
    }

    const data = await response.json();
    const offer = data.data;

    if (!offer) {
      return {
        title: 'Offer Not Found',
        description: 'The requested offer could not be found.',
      };
    }

    // 🔴 Both SERP fields were unbounded here. Measured on production 2026-08-17:
    // destination descriptions reached 355 chars, offers 160, styles 158 — all past Google's
    // ~155 limit, and the page `title` carried a literal '| Natlaupa' that the root layout's
    // `template: '%s | Natlaupa'` then appended a SECOND time. seo-meta.ts bounds both.
    const rawTitle = offer.metaTitle || `${offer.title} | Natlaupa Experiences`;
    const rawDescription = offer.metaDescription || offer.tagline || offer.description || `Experience ${offer.title} - an exclusive offer curated by Natlaupa.`;
    // Bounds only — the fallback CHAIN above is deliberately unchanged, so this does
    // not alter which copy is shown, just how much of it survives truncation.
    const description = buildDescription(rawDescription);
    // Social cards have no 60-char limit; give them the full text.
    const socialTitle = stripBrandSuffix(rawTitle);
    const imageUrl = offer.imageUrl || offer.coverImage;
    const canonicalUrl = `https://www.natlaupa.com/offer/${offer.slug || offer.id}`;

    return {
      title: { absolute: buildTitle(rawTitle) },
      description,
      openGraph: {
        title: socialTitle,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: offer.title }] : [],
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
    console.error('Error fetching offer for metadata:', error);
    return {
      title: 'Offer Not Found',
      description: 'The requested offer could not be found.',
    };
  }
}

export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
