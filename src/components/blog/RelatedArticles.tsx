'use client';

import React from 'react';
import { useRelatedBlogs } from '@/hooks/useBlogs';
import BlogCard from '@/components/BlogCard';

/**
 * Related articles, placed AFTER the end concierge CTA so it never siphons the
 * engaged reader before the primary action. Renders nothing if there are no
 * genuinely related posts (no padding, no lone/empty card).
 */
export default function RelatedArticles({ blogId }: { blogId: string }) {
  const { blogs } = useRelatedBlogs(blogId, 3);

  if (!blogs || blogs.length < 1) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-gold text-xs uppercase tracking-[0.35em] mb-4 block">Continue Reading</span>
          <h2 className="font-serif text-3xl md:text-4xl text-white">From the Journal</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
