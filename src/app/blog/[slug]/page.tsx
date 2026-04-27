import type { Metadata } from 'next';
import { fetchBlogBySlug } from '@/lib/server-api';
import BlogDetailClient from './BlogDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) return { title: 'Article Not Found' };

  const title = blog.metaTitle || blog.title;
  const description =
    blog.metaDescription ||
    blog.excerpt ||
    `Read "${blog.title}" by ${blog.author.firstName} ${blog.author.lastName} on the Natlaupa travel blog.`;
  const image = blog.featuredImage || blog.coverImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/blog/${slug}`,
      ...(blog.publishedAt && { publishedTime: blog.publishedAt }),
      authors: [`${blog.author.firstName} ${blog.author.lastName}`],
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
