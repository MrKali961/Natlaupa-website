import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/offers/slug/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Offer Not Found | Natlaupa',
        description: 'The requested offer could not be found.',
      };
    }

    const data = await response.json();
    const offer = data.data;

    if (!offer) {
      return {
        title: 'Offer Not Found | Natlaupa',
        description: 'The requested offer could not be found.',
      };
    }

    const title = offer.metaTitle || `${offer.title} | Natlaupa Experiences`;
    const description = offer.metaDescription || offer.tagline || offer.description || `Experience ${offer.title} - an exclusive offer curated by Natlaupa.`;
    const imageUrl = offer.imageUrl || offer.coverImage;
    const canonicalUrl = `https://www.natlaupa.com/offer/${offer.slug || offer.id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: offer.title }] : [],
        type: 'website',
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
    console.error('Error fetching offer for metadata:', error);
    return {
      title: 'Offer Not Found | Natlaupa',
      description: 'The requested offer could not be found.',
    };
  }
}

export default function OfferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
