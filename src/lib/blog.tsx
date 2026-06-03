/**
 * Isomorphic blog helpers (safe in server AND client components — no 'use client').
 * The article body is parsed + sanitized here so it can be SERVER-RENDERED into
 * the initial HTML (SEO), with off-brand pasted styling stripped (audit M5).
 */
import parse, { Element, type HTMLReactParserOptions } from 'html-react-parser';
import type { ReactNode } from 'react';

const GENERIC_AUTHORS = new Set(['', 'admin', 'admin user', 'administrator', 'user', 'natlaupa']);

/** Credible byline that degrades the placeholder "Admin User" to a branded editorial name. */
export function authorDisplayName(author?: { firstName?: string | null; lastName?: string | null } | null): string {
  const name = `${author?.firstName ?? ''} ${author?.lastName ?? ''}`.trim();
  if (!name || GENERIC_AUTHORS.has(name.toLowerCase())) return 'Natlaupa Editorial';
  return name;
}

export function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function readingTimeMinutes(html: string): number {
  const text = (html ?? '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatBlogDate(date?: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Normalize tags that arrive as objects {name} or bare strings. */
export function normalizeTags(tags?: (string | { name: string })[] | null): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean) as string[];
}

const parserOptions: HTMLReactParserOptions = {
  replace: (node) => {
    if (node instanceof Element) {
      // Drop injected <style>/<script>/<link> — pasted CMS markup forces off-brand
      // colors/fonts that fight the site's prose typography (audit M5).
      if (node.name === 'style' || node.name === 'script' || node.name === 'link') {
        return <></>;
      }
      // Strip inline style attributes so `prose prose-invert` owns all styling.
      if (node.attribs?.style) {
        delete node.attribs.style;
      }
    }
    return undefined;
  },
};

/** Parse blog HTML into sanitized top-level React nodes (array so a CTA can be spliced mid-article). */
export function parseBlogContent(html: string): ReactNode[] {
  const parsed = parse(html ?? '', parserOptions);
  return Array.isArray(parsed) ? parsed : [parsed];
}
