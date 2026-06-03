import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBlogFull } from '@/lib/server-api';
import { authorDisplayName } from '@/lib/blog';
import BlogArticle from '@/components/blog/BlogArticle';
import { JsonLd, blogPostingSchema, breadcrumbList } from '@/components/JsonLd';

const BASE_URL = 'https://www.natlaupa.com';

// Consolidated metadata (the old [slug]/layout.tsx duplicate is removed). Canonical
// + robots are preserved here so the article self-canonicalizes.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogFull(slug);

  if (!blog) {
    return { title: 'Article Not Found', robots: { index: false, follow: true } };
  }

  const title = blog.metaTitle || blog.title;
  const description =
    blog.metaDescription || blog.excerpt || `Read "${blog.title}" on the Natlaupa Journal.`;
  const image = blog.coverImage || blog.featuredImage || undefined;
  const url = `/blog/${blog.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'Natlaupa',
      locale: 'en_US',
      ...(blog.publishedAt && { publishedTime: blog.publishedAt }),
      ...(blog.updatedAt && { modifiedTime: blog.updatedAt }),
      authors: [authorDisplayName(blog.author)],
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
  const blog = await fetchBlogFull(slug);
  if (!blog) notFound();

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(blog),
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/blog' },
            { name: blog.title, path: `${BASE_URL}/blog/${blog.slug}` },
          ]),
        ]}
      />
      <BlogArticle blog={blog} />
    </>
  );
}
