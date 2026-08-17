import { Metadata } from 'next';
import { isValidSlug } from '@/lib/slugify';
import { buildTitle, buildDescription, stripBrandSuffix } from '@/lib/seo-meta';

type Props = {
  params: Promise<{ style: string }>;
};

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style } = await params;

  // Without this the un-slugify fallback below would happily title the page
  // "Null Hotels", after issuing /hotel-styles/slug/null upstream.
  if (!isValidSlug(style)) {
    return {
      title: 'Style Not Found',
      description: 'The requested hotel style could not be found.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/hotel-styles/slug/${style}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      // Fallback to URL-based metadata
      const styleName = decodeURIComponent(style).replace(/-/g, ' ');
      const capitalizedStyle = styleName.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      return {
        title: `${capitalizedStyle} Hotels | Natlaupa`,
        description: `Explore our collection of ${capitalizedStyle} hotels. Luxury accommodations curated for discerning travelers.`,
      };
    }

    const data = await response.json();
    const styleData = data.data;

    if (!styleData) {
      const styleName = decodeURIComponent(style).replace(/-/g, ' ');
      const capitalizedStyle = styleName.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      return {
        title: `${capitalizedStyle} Hotels | Natlaupa`,
        description: `Explore our collection of ${capitalizedStyle} hotels. Luxury accommodations curated for discerning travelers.`,
      };
    }

    // 🔴 Both SERP fields were unbounded here. Measured on production 2026-08-17:
    // destination descriptions reached 355 chars, offers 160, styles 158 — all past Google's
    // ~155 limit, and the page `title` carried a literal '| Natlaupa' that the root layout's
    // `template: '%s | Natlaupa'` then appended a SECOND time. seo-meta.ts bounds both.
    const rawTitle = `${styleData.name} Hotels & Resorts`;
    const rawDescription = styleData.description || `Explore our curated collection of ${styleData.name} hotels. Luxury accommodations for discerning travelers.`;
    // Bounds only — the fallback CHAIN above is deliberately unchanged, so this does
    // not alter which copy is shown, just how much of it survives truncation.
    const description = buildDescription(rawDescription);
    // Social cards have no 60-char limit; give them the full text.
    const socialTitle = stripBrandSuffix(rawTitle);
    const imageUrl = styleData.imageUrl;
    const canonicalUrl = `https://www.natlaupa.com/styles/${styleData.slug}`;

    return {
      title: { absolute: buildTitle(rawTitle) },
      description,
      openGraph: {
        title: socialTitle,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `${styleData.name} Hotels` }] : [],
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
    console.error('Error fetching style for metadata:', error);
    const styleName = decodeURIComponent(style).replace(/-/g, ' ');
    const capitalizedStyle = styleName.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return {
      title: `${capitalizedStyle} Hotels | Natlaupa`,
      description: `Explore our collection of ${capitalizedStyle} hotels. Luxury accommodations curated for discerning travelers.`,
    };
  }
}

export default function StyleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
