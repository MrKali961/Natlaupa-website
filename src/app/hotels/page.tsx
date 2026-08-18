import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HotelCard from '@/components/HotelCard';
import Footer from '@/components/Footer';
import { fetchListableHotels } from '@/lib/server-api';
import { JsonLd, breadcrumbList } from '@/components/JsonLd';

/**
 * `/hotels` — the bookable-inventory index.
 *
 * Why this route exists
 * ---------------------
 * 58 active hotels were reachable ONLY from the sitemap. There was no `/hotels` route at all, no
 * internal link path to any hotel from the homepage, and the homepage itself gated its content, so
 * the entire inventory was orphaned. A crawler could enumerate the hotels but no user journey
 * reached them and no page passed authority to them.
 *
 * Three decisions worth not re-litigating
 * ---------------------------------------
 * 1. SERVER-RENDERED with numbered `?page=N` links. Every other listing on this site (`/offers`,
 *    `/destinations`, `/styles`) is `'use client'` and paginates in React state, which produces one
 *    crawlable URL no matter how much inventory sits behind it. Copying that pattern here would
 *    leave the hotels sitemap-only — the exact defect this route fixes. Load-more and infinite
 *    scroll fail the same way. The divergence from the house pattern is the point.
 *
 * 2. `animate={false}` on every card. HotelCard's framer-motion default serialises
 *    `style="opacity:0;transform:translateY(30px)"` into the server HTML. Google runs JS and would
 *    cope; the AI retrieval agents robots.ts explicitly invites (OAI-SearchBot, ChatGPT-User,
 *    PerplexityBot) largely do not. Shipping a crawl target invisible defeats the route.
 *
 * 3. Out-of-range and malformed `?page` values 404 rather than clamping to page 1. Clamping invents
 *    unlimited duplicate URLs that all serve page 1's content, which is a crawl trap.
 */

const PER_PAGE = 24;
const SITE_URL = 'https://www.natlaupa.com';

/** `null` means "not a usable page number" — the caller 404s rather than guessing. */
function parsePageParam(raw: string | string[] | undefined): number | null {
  if (raw === undefined) return 1;
  if (Array.isArray(raw)) return null; // ?page=1&page=2 is ambiguous, not page 1
  if (!/^\d+$/.test(raw)) return null; // rejects "abc", "1.5", "-2", "" and " 1"
  const n = Number(raw);
  return n >= 1 ? n : null;
}

function canonicalFor(page: number): string {
  return page === 1 ? `${SITE_URL}/hotels` : `${SITE_URL}/hotels?page=${page}`;
}

type Props = { searchParams: Promise<{ page?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page);

  // Malformed page params get noindex metadata to match the 404 the page returns.
  if (page === null) {
    return { title: 'Hotels Not Found', robots: { index: false, follow: false } };
  }

  const suffix = page > 1 ? ` — Page ${page}` : '';

  return {
    // Page 2+ carries a SELF-referencing canonical, not one pointing back at page 1. Canonicalising
    // deep pages to page 1 tells Google the hotels listed there are duplicates of page 1's, which
    // is how paginated inventory gets dropped from the index.
    title: `Luxury Hotels${suffix}`,
    description:
      'Browse every hotel in the Natlaupa collection — curated luxury stays, boutique retreats and ' +
      'design-led properties, bookable through our concierge.',
    alternates: { canonical: canonicalFor(page) },
    robots: { index: true, follow: true },
  };
}

export default async function HotelsPage({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page);
  if (page === null) notFound();

  const hotels = await fetchListableHotels();

  // ---------------------------------------------------------------------------
  // UNAVAILABLE state.
  //
  // `fetchAll` deliberately swallows transport errors and returns whatever it collected, so that one
  // failing collection cannot empty an entire sitemap. The consequence here is that [] is genuinely
  // ambiguous between "the API is down" and "there are no hotels" — and this codebase cannot tell
  // them apart from the return value alone. Rather than fake a distinction, both render one honest
  // state that never dead-ends: it says what happened and offers a real route onward.
  //
  // Emphatically NOT "No hotels found." on a luxury travel brand.
  // ---------------------------------------------------------------------------
  if (hotels.length === 0) {
    return (
      <main className="bg-noir min-h-screen">
        <section className="mx-auto max-w-3xl px-6 py-32 text-center md:py-40">
          <h1 className="font-serif text-4xl text-white md:text-5xl">Our collection is loading</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
            We could not reach the collection just now. It is worth a second look in a moment — in
            the meantime, the collection is also browsable by where you want to go.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/destinations"
              className="border border-gold px-8 py-4 text-xs uppercase tracking-widest text-gold transition-colors hover-capable:hover:bg-gold hover-capable:hover:text-noir"
            >
              Browse by destination
            </Link>
            <Link
              href="/contact"
              className="text-xs uppercase tracking-widest text-white/60 underline underline-offset-4 transition-colors hover-capable:hover:text-white"
            >
              Ask our concierge
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(hotels.length / PER_PAGE));

  // Out of range 404s. A ?page=999 that renders page 1 would mint unlimited duplicate URLs.
  if (page > totalPages) notFound();

  const start = (page - 1) * PER_PAGE;
  const pageHotels = hotels.slice(start, start + PER_PAGE);

  return (
    <main className="bg-noir min-h-screen">
      <JsonLd
        data={[
          // breadcrumbList takes relative paths and absolutises them itself.
          breadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Hotels', path: '/hotels' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Luxury Hotels',
            url: canonicalFor(page),
            // Describes THIS page's slice, not all 58 — an ItemList claiming items that are not on
            // the page is a mismatch between markup and content.
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: pageHotels.length,
              itemListElement: pageHotels.map((hotel, i) => ({
                '@type': 'ListItem',
                position: start + i + 1,
                url: `${SITE_URL}/hotel/${hotel.slug || hotel.id}`,
                name: hotel.name,
              })),
            },
          },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-12 md:pt-36">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-white/40">
          <Link href="/" className="transition-colors hover-capable:hover:text-gold">
            Home
          </Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Hotels</span>
        </nav>

        <h1 className="font-serif text-4xl text-white md:text-6xl">The Collection</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
          Every hotel we work with, in one place. {hotels.length} properties across the collection —
          each one visited, vetted and bookable through our concierge.
        </p>

        {totalPages > 1 && (
          <p className="mt-4 text-xs uppercase tracking-widest text-white/40">
            Page {page} of {totalPages}
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pageHotels.map((hotel) => (
            // animate={false} — see the file header. Cards must be visible in server HTML.
            <HotelCard key={hotel.id} hotel={hotel} animate={false} />
          ))}
        </div>
      </section>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}

      <Footer />
    </main>
  );
}

/**
 * Numbered, crawlable pagination.
 *
 * Real <Link> elements to real URLs — not buttons mutating state. Google discovers page 2 and 3 by
 * following these; there is no other path to them. `aria-current="page"` marks the active page for
 * assistive tech, and every target is at least 44px so the control is usable on a phone.
 */
function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hrefFor = (n: number) => (n === 1 ? '/hotels' : `/hotels?page=${n}`);

  return (
    <nav
      aria-label="Hotel collection pages"
      className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 pb-24 md:px-12"
    >
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 px-5 text-xs uppercase tracking-widest text-white/70 transition-colors hover-capable:hover:border-gold hover-capable:hover:text-gold"
        >
          Previous
        </Link>
      )}

      {pages.map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-gold bg-gold px-5 text-xs font-bold uppercase tracking-widest text-noir"
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={hrefFor(n)}
            aria-label={`Page ${n}`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 px-5 text-xs uppercase tracking-widest text-white/70 transition-colors hover-capable:hover:border-gold hover-capable:hover:text-gold"
          >
            {n}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 px-5 text-xs uppercase tracking-widest text-white/70 transition-colors hover-capable:hover:border-gold hover-capable:hover:text-gold"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
