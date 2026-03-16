import { Metadata } from 'next';

type Props = {
  params: Promise<{ style: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style } = await params;

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

    const title = `${styleData.name} Hotels & Resorts | Natlaupa`;
    const description = styleData.description || `Explore our curated collection of ${styleData.name} hotels. Luxury accommodations for discerning travelers.`;
    const imageUrl = styleData.imageUrl;
    const canonicalUrl = `https://www.natlaupa.com/styles/${styleData.slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `${styleData.name} Hotels` }] : [],
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
