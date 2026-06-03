// SERVER component — the article list is fetched server-side and the featured
// article + grid (the crawlable internal links) ship in the initial HTML.
// Metadata for /blog lives in ./layout.tsx.
import { fetchBlogsList } from '@/lib/server-api';
import BlogIndex from '@/components/blog/BlogIndex';

export const revalidate = 300;

export default async function BlogPage() {
  const blogs = await fetchBlogsList();
  return <BlogIndex blogs={blogs} />;
}
