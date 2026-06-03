'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { authorDisplayName, readingTimeMinutes, formatBlogDate, normalizeTags } from '@/lib/blog';

/** Minimal shape both the server list (ServerBlogFull) and the client Blog type satisfy. */
export interface BlogCardData {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  author?: { firstName?: string | null; lastName?: string | null } | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date | null;
  content?: string;
  tags?: (string | { name: string })[] | null;
}

interface BlogCardProps {
  blog: BlogCardData;
  index?: number;
  /** featured = full-width editorial treatment (the list view's single pop-out). */
  featured?: boolean;
}

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * Typographic cover fallback — a deterministic, brand-consistent title plate used
 * when an article has no coverImage. Never a gray box or broken-image icon.
 */
function TypographicCover({ title, featured }: { title: string; featured?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-midnight to-black">
      {/* faint gold wash for depth */}
      <div className="absolute -inset-[20%] bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.12),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <span
          className={`font-serif text-center text-gold/15 leading-[0.95] select-none ${
            featured ? 'text-6xl md:text-8xl' : 'text-4xl'
          }`}
        >
          {title}
        </span>
      </div>
      {/* gold hairline + monogram, the brand "seal" */}
      <div className="absolute top-5 left-5 flex items-center gap-3">
        <span className="block w-8 h-px bg-gold/60" />
        <span className="text-gold/70 text-[10px] uppercase tracking-[0.3em]">Natlaupa</span>
      </div>
    </div>
  );
}

export default function BlogCard({ blog, index = 0, featured = false }: BlogCardProps) {
  const author = authorDisplayName(blog.author);
  const date = formatBlogDate(blog.publishedAt ?? blog.createdAt ?? null);
  const mins = blog.content ? readingTimeMinutes(blog.content) : undefined;
  const tag = normalizeTags(blog.tags)[0];
  const hasCover = Boolean(blog.coverImage);

  // ── Featured: full-width editorial unit (single pop-out of the list view) ──
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Link
          href={`/blog/${blog.slug}`}
          className="group grid md:grid-cols-2 gap-px overflow-hidden border border-white/10 hover-capable:hover:border-gold/40 transition-colors duration-500 bg-white/[0.02]"
        >
          <div className="relative aspect-[16/11] md:aspect-auto md:min-h-[26rem] overflow-hidden">
            {hasCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.coverImage as string}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s]"
              />
            ) : (
              <TypographicCover title={blog.title} featured />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <span className="text-gold text-[11px] uppercase tracking-[0.35em] mb-6">
              {tag ?? "Editor's Selection"}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.08] mb-5 group-hover:text-gold/90 transition-colors duration-500">
              {blog.title}
            </h2>
            {blog.excerpt ? (
              <p className="text-slate-300 font-light leading-relaxed mb-8 max-w-prose line-clamp-3">
                {blog.excerpt}
              </p>
            ) : (
              <div className="mb-8" />
            )}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="text-slate-300">{author}</span>
              {date && <span className="text-slate-600">·</span>}
              {date && <span>{date}</span>}
              {mins && <span className="text-slate-600">·</span>}
              {mins && <span>{mins} min read</span>}
            </div>
            <span className="mt-8 inline-flex items-center gap-3 text-white text-sm uppercase tracking-[0.2em] group-hover:text-gold transition-colors">
              Read the story
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  // ── Standard grid card: ≤3 chunks, whole card is one tap target ──
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE, delay: (index % 3) * 0.08 }}
      className="h-full"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="group flex flex-col h-full overflow-hidden border border-white/10 hover-capable:hover:border-gold/40 transition-colors duration-500 bg-white/[0.02]"
      >
        <div className="relative aspect-[3/2] overflow-hidden">
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.coverImage as string}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s]"
            />
          ) : (
            <TypographicCover title={blog.title} />
          )}
          {tag && (
            <span className="absolute top-4 left-4 bg-deepBlue/70 backdrop-blur-sm text-gold px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]">
              {tag}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-grow p-6">
          <h3 className="font-serif text-xl md:text-2xl text-white leading-snug mb-3 line-clamp-2 group-hover:text-gold/90 transition-colors duration-500">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-5">{blog.excerpt}</p>
          )}
          <div className="mt-auto flex items-center gap-3 text-xs text-slate-500 pt-4 border-t border-white/5">
            <span className="text-slate-400">{author}</span>
            {(date || mins) && <span className="text-slate-700">·</span>}
            <span>{mins ? `${mins} min read` : date}</span>
            <ArrowRight
              size={14}
              className="ml-auto text-slate-500 group-hover:text-gold group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
