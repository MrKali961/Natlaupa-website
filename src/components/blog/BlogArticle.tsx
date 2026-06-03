// SERVER component — the article body + H1 are rendered into the initial HTML (SEO).
// Interactive pieces are isolated client islands (BlogShare, StickyConciergeCTA, RelatedArticles).
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Clock, ArrowRight, MessageCircle, User } from 'lucide-react';
import type { ServerBlogFull } from '@/lib/server-api';
import {
  authorDisplayName,
  authorInitials,
  readingTimeMinutes,
  formatBlogDate,
  normalizeTags,
  parseBlogContent,
} from '@/lib/blog';
import Footer from '@/components/Footer';
import BlogShare from '@/components/blog/BlogShare';
import StickyConciergeCTA from '@/components/blog/StickyConciergeCTA';
import RelatedArticles from '@/components/blog/RelatedArticles';

export default function BlogArticle({ blog }: { blog: ServerBlogFull }) {
  const author = authorDisplayName(blog.author);
  const initials = authorInitials(author);
  const date = formatBlogDate(blog.publishedAt ?? blog.createdAt ?? null);
  const mins = readingTimeMinutes(blog.content);
  const tags = normalizeTags(blog.tags);
  const dek = blog.excerpt || blog.metaDescription || null;
  const hasCover = Boolean(blog.coverImage);

  // Server-render the sanitized body; splice an in-flow concierge aside near the midpoint.
  const nodes = parseBlogContent(blog.content);
  const mid = nodes.length > 3 ? Math.floor(nodes.length / 2) : nodes.length;
  const beforeMid = nodes.slice(0, mid);
  const afterMid = nodes.slice(mid);

  const MidCTA = (
    // In-flow editorial aside — weighted by isolation/whitespace, NOT a colored banner
    // (escapes banner-blindness while staying at the reading measure).
    <aside className="my-12 border-l-2 border-gold/60 pl-6 md:pl-8">
      <p className="font-serif text-2xl md:text-3xl text-white leading-snug mb-4">
        Planning a stay like this?
      </p>
      <p className="text-slate-300 font-light leading-relaxed mb-5 not-prose">
        Our concierge has stayed in these places. Tell us what you&rsquo;re imagining and we&rsquo;ll check
        availability and rates for you — no obligation.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-gold hover:text-softGold transition-colors text-sm uppercase tracking-[0.2em] not-prose"
      >
        Speak to a concierge
        <ArrowRight size={16} />
      </Link>
    </aside>
  );

  return (
    <>
      <main className="bg-deepBlue min-h-screen">
        {/* Breadcrumb — matches the BreadcrumbList JSON-LD, server-rendered */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32"
        >
          <ol className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-[0.15em]">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight size={12} className="text-slate-700" />
            <li>
              <Link href="/blog" className="hover:text-gold transition-colors">
                Journal
              </Link>
            </li>
            <ChevronRight size={12} className="text-slate-700" />
            <li className="text-slate-400 truncate max-w-[16rem]" aria-current="page">
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Header — H1 is the dominant element + LCP; no CTA competes for first fixation */}
        <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-gold text-[11px] font-medium uppercase tracking-[0.25em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] mb-6">
            {blog.title}
          </h1>
          {dek && (
            <p className="text-xl text-slate-300 font-light leading-relaxed mb-8 max-w-2xl">{dek}</p>
          )}
          {/* Meta line — author, date, reading-time. viewCount deliberately omitted. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 border-t border-white/10 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center text-[11px] font-semibold tracking-wide">
                {initials}
              </span>
              <span className="text-slate-200">{author}</span>
            </span>
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-gold" />
                {date}
              </span>
            )}
            {mins >= 3 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} className="text-gold" />
                {mins} min read
              </span>
            )}
            <span className="ml-auto">
              <BlogShare title={blog.title} excerpt={blog.excerpt} />
            </span>
          </div>
        </header>

        {/* Cover — reserved 16/9 box; typographic fallback when no image (zero CLS, never a gray box) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="relative w-full aspect-[16/9] overflow-hidden border border-white/10">
            {hasCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blog.coverImage as string}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-midnight to-black">
                <div className="absolute -inset-[20%] bg-[radial-gradient(circle_at_28%_22%,rgba(212,175,55,0.14),transparent_55%)]" />
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <span className="block w-10 h-px bg-gold/60" />
                  <span className="text-gold/70 text-[10px] uppercase tracking-[0.35em]">Natlaupa Journal</span>
                </div>
                {/* Brand mark — NOT the article title (the H1 already states it; decision detail-cover-fallback) */}
                <div className="absolute inset-0 flex items-center justify-center select-none">
                  <span className="font-serif italic text-7xl md:text-9xl text-gold/10 leading-none">N</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body — server-rendered prose, optimal measure, AA contrast, sanitized HTML */}
        <article className="max-w-[42rem] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-slate-300 prose-blockquote:border-gold prose-blockquote:text-slate-200">
            {beforeMid.map((node, i) => (
              <React.Fragment key={`b-${i}`}>{node}</React.Fragment>
            ))}
            {afterMid.length > 0 && MidCTA}
            {afterMid.map((node, i) => (
              <React.Fragment key={`a-${i}`}>{node}</React.Fragment>
            ))}
          </div>
        </article>

        {/* Author bio — low mass, before the end CTA; credible + ready for real authors */}
        <section className="max-w-[42rem] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-start gap-4 p-6 border border-white/10 bg-white/[0.02]">
            <span className="w-12 h-12 flex-shrink-0 rounded-full bg-gold/15 text-gold flex items-center justify-center text-sm font-semibold">
              {initials}
            </span>
            <div>
              <p className="text-white font-medium">{author}</p>
              <p className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Natlaupa Editorial</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">
                Field notes from the Natlaupa editorial desk — the properties, places and stays our
                concierge team has experienced first-hand.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-gold transition-colors text-xs uppercase tracking-[0.2em]"
              >
                <User size={13} />
                Meet the team
              </Link>
            </div>
          </div>
        </section>

        {/* End CTA — the page's peak/end: heaviest, isolated, the one hard ask */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-28 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold text-xs uppercase tracking-[0.35em] mb-6 block">The Concierge</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6">
              We handle the logistics, so you can handle the moment.
            </h2>
            <p className="text-slate-300 font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Tell us what you&rsquo;re planning and our concierge will take it from there.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-gold text-deepBlue px-10 py-5 font-semibold uppercase tracking-[0.15em] text-sm hover:bg-softGold transition-colors"
            >
              <MessageCircle size={18} />
              Plan your stay
            </Link>
            <p className="text-slate-500 text-xs mt-6 leading-relaxed max-w-md mx-auto">
              Human concierge, 24/7 · reply on WhatsApp or email · no account or payment to ask a question.
            </p>
            <p className="text-slate-600 text-[11px] uppercase tracking-[0.2em] mt-4">
              Natlaupa — a registered French travel house, RCS Nanterre
            </p>
          </div>
        </section>

        {/* Related — AFTER the end CTA so it doesn't siphon the reader before the primary action */}
        <RelatedArticles blogId={blog.id} />
      </main>

      <StickyConciergeCTA />
      <Footer />
    </>
  );
}
