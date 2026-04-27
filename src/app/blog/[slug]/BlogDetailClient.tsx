"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Loader2,
  User,
  Tag,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useBlog, useRelatedBlogs } from "@/hooks/useBlogs";
import BlogCard from "@/components/BlogCard";
import parse from "html-react-parser";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const { blog, isLoading, error } = useBlog(slug);
  const { blogs: relatedBlogs } = useRelatedBlogs(blog?.id || "", 3);

  // Scroll to top when blog loads
  useEffect(() => {
    if (blog) {
      window.scrollTo(0, 0);
    }
  }, [blog]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: window.location.href,
        });
      } catch (err) {
        // Silently fail - user probably cancelled
      }
    } else if (blog) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  if (!blog || error) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-white mb-4">
            Article Not Found
          </h1>
          <p className="text-slate-400 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Back Button */}
        <div className="fixed top-8 left-8 z-50">
          <Link
            href="/blog"
            className="flex items-center gap-2 bg-deepBlue/80 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 hover:border-gold transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm uppercase tracking-wider">
              All Articles
            </span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 bg-gold/20 text-gold px-3 py-1 text-xs font-bold uppercase tracking-widest"
                    >
                      <Tag size={10} />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl text-slate-300 font-light mb-8 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm pb-8 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gold" />
                  <span>
                    By{" "}
                    <span className="text-white font-medium">
                      {blog.author.firstName} {blog.author.lastName}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gold" />
                  <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  <span>{calculateReadTime(blog.content)} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gold" />
                  <span>{blog.viewCount} views</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 ml-auto text-gold hover:text-white transition-colors"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.coverImage && (
          <section className="px-4 sm:px-6 lg:px-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative overflow-hidden rounded-sm border border-white/10">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </section>
        )}

        {/* Content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-slate-300 leading-relaxed space-y-6">
                {typeof blog.content === "string" ? (
                  <div className="whitespace-pre-wrap">
                    {parse(blog.content)}
                  </div>
                ) : (
                  blog.content
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Related Articles */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <span className="text-gold text-sm uppercase tracking-[0.3em] mb-4 block">
                  Continue Reading
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-white">
                  Related Articles
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog, index) => (
                  <BlogCard
                    key={relatedBlog.id}
                    blog={relatedBlog}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
