import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/hotels/${id}`, {
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
