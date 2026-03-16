import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        title: 'Blog Post Not Found | Natlaupa',
        description: 'The requested blog post could not be found.',
      };
    }

    const data = await response.json();
    const blog = data.data;

    if (!blog) {
      return {
        title: 'Blog Post Not Found | Natlaupa',
        description: 'The requested blog post could not be found.',
      };
    }

    const title = blog.metaTitle || `${blog.title} | Natlaupa Blog`;
    const description = blog.metaDescription || blog.excerpt || `Read ${blog.title} on the Natlaupa blog.`;
    const imageUrl = blog.coverImage || blog.featuredImage;
    const canonicalUrl = `https://www.natlaupa.com/blog/${blog.slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Natlaupa',
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }] : [],
        type: 'article',
        locale: 'en_US',
        publishedTime: blog.publishedAt,
        modifiedTime: blog.updatedAt,
        authors: blog.author ? [blog.author] : [],
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
    console.error('Error fetching blog for metadata:', error);
    return {
      title: 'Blog Post Not Found | Natlaupa',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
