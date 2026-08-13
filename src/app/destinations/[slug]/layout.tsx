import { Metadata } from 'next';
import { isValidSlug } from '@/lib/slugify';

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
      title: 'Destination Not Found | Natlaupa',
      description: 'The requested destination could not be found.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/hotel-destinations/slug/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Destination Not Found | Natlaupa',
        description: 'The requested destination could not be found.',
      };
    }

    const data = await response.json();
    const destination = data.data;

    if (!destination) {
      return {
        title: 'Destination Not Found | Natlaupa',
        description: 'The requested destination could not be found.',
      };
    }

    const title = `Luxury Hotels in ${destination.name} | Natlaupa`;
    const description = destination.description || `Discover luxury hotels and exclusive accommodations in ${destination.name}. Curated collection of premium stays for discerning travelers.`;
    const imageUrl = destination.imageUrl;
    const canonicalUrl = `https://www.natlaupa.com/destinations/${destination.slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `Hotels in ${destination.name}` }] : [],
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
    console.error('Error fetching destination for metadata:', error);
    return {
      title: 'Destination Not Found | Natlaupa',
      description: 'The requested destination could not be found.',
    };
  }
}

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
