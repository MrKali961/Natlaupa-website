/**
 * Server-side JSON-LD helpers. No 'use client' — render these from server
 * components (page.tsx) so the markup ships in the initial HTML.
 *
 * Policy note: only mark up what the page actually shows. The Hotel builder
 * emits aggregateRating/review ONLY when real reviews exist (matching the
 * visible reviews block); it never synthesizes a rating from the star
 * classification fallback.
 */
import { slugify } from '@/lib/slugify';
import type { Hotel } from '@/lib/types';
import type { ServerBlogFull } from '@/lib/server-api';
import { authorDisplayName } from '@/lib/blog';

const BASE_URL = 'https://www.natlaupa.com';

const abs = (path: string) => (path.startsWith('http') ? path : `${BASE_URL}${path}`);

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** BlogPosting for a single article. Only fields that match the visible page are emitted
 *  (headline=H1, author=byline, dates=meta, image only when a real cover exists). Render this
 *  ONLY when the article body is server-rendered into the HTML. */
export function blogPostingSchema(blog: ServerBlogFull) {
  const url = `${BASE_URL}/blog/${blog.slug}`;
  const image = blog.coverImage || blog.featuredImage || undefined;
  const description = blog.metaDescription || blog.excerpt || undefined;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: authorDisplayName(blog.author) },
    publisher: {
      '@type': 'Organization',
      name: 'Natlaupa',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/natlaupa-logo.svg` },
    },
  };
  if (image) schema.image = image;
  if (description) schema.description = description;
  if (blog.publishedAt) schema.datePublished = blog.publishedAt;
  if (blog.updatedAt) schema.dateModified = blog.updatedAt;
  return schema;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage for a page whose Q&A text is server-rendered into the HTML
 *  (here, native <details> blocks). Mark up only questions the page shows. */
export function faqPage(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

/** Convenience: Home → optional Country → Hotel name. */
export function hotelBreadcrumb(hotel: Hotel, idOrSlug: string) {
  const crumbs: Crumb[] = [{ name: 'Home', path: '/' }];
  if (hotel.country) {
    crumbs.push({ name: hotel.country, path: `/countries/${slugify(hotel.country)}` });
  }
  crumbs.push({ name: hotel.name, path: `/hotel/${hotel.slug || idOrSlug}` });
  return breadcrumbList(crumbs);
}

export function hotelSchema(hotel: Hotel, idOrSlug: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    url: abs(`/hotel/${hotel.slug || idOrSlug}`),
  };
  if (hotel.imageUrl) schema.image = hotel.imageUrl;
  if (hotel.description) schema.description = hotel.description;

  const address: Record<string, unknown> = { '@type': 'PostalAddress' };
  if (hotel.city) address.addressLocality = hotel.city;
  if (hotel.country) address.addressCountry = hotel.country;
  if (hotel.city || hotel.country) schema.address = address;

  if (typeof hotel.lat === 'number' && typeof hotel.lng === 'number') {
    schema.geo = { '@type': 'GeoCoordinates', latitude: hotel.lat, longitude: hotel.lng };
  }
  if (hotel.amenities && hotel.amenities.length > 0) {
    schema.amenityFeature = hotel.amenities.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    }));
  }
  // Star classification (a hotel rating is shown on the page).
  if (hotel.rating) {
    schema.starRating = { '@type': 'Rating', ratingValue: hotel.rating };
  }
  // Only mark up reviews/aggregateRating when real reviews are displayed.
  if (hotel.reviews && hotel.reviews.length > 0) {
    const avg = hotel.reviews.reduce((s, r) => s + r.rating, 0) / hotel.reviews.length;
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(avg.toFixed(1)),
      reviewCount: hotel.reviews.length,
      bestRating: 5,
    };
    schema.review = hotel.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.user },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.comment,
      ...(r.date ? { datePublished: r.date } : {}),
    }));
  }
  return schema;
}
