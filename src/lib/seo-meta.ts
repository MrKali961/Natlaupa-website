/**
 * Length-bounded construction of the two SERP-facing metadata fields.
 *
 * Why this exists
 * ---------------
 * Measured against production 2026-08-17: **every hub description on this site overflows
 * Google's display limit.** Not one or two — all of them:
 *
 *   /countries     209    /about   203    /styles  194
 *   /destinations  193    /        177    /blog    159
 *
 * Only /mentions-legales (124) fits. There was no length-bounding anywhere in the codebase, so
 * nothing could have caught it. The sister TRD property has had this module since 2026-07-28 and
 * measures 154 max; this is the port.
 *
 * Titles have a second, separate defect this module also fixes. `layout.tsx` sets
 * `template: '%s | Natlaupa'`, and several route files ALSO hardcode a title ending
 * `| Natlaupa` — so those pages render `"Destination Not Found | Natlaupa | Natlaupa"`.
 * `stripBrandSuffix` removes a suffix the value already carries so the template cannot
 * double-append it.
 *
 * Scope: SERP fields only. `openGraph.title` / `twitter.title` are deliberately NOT routed
 * through here — social cards have no 60-character limit and clamping them is pure loss.
 *
 * ⚠️ This module cannot fix a hardcoded literal on its own. Six hub descriptions were rewritten
 * by hand to fit, because clamping a good 209-character sentence produces
 * "…each country offering its own signature blend of culture and" — worse than rewriting. Use
 * this helper for anything data-derived; author the literals to fit.
 */

/** Google truncates displayed titles at roughly 60 characters. */
export const TITLE_MAX = 60;

/**
 * Google truncates displayed descriptions at roughly 160 characters. 155 leaves headroom,
 * since the real cut is pixel width rather than a character count.
 */
export const DESCRIPTION_MAX = 155;

/**
 * Brand suffix, kept in sync with `layout.tsx`'s `template: '%s | Natlaupa'` by intent.
 * Verified against the live site: every page ends ` | Natlaupa`.
 */
const BRAND = 'Natlaupa';
const BRAND_SEPARATOR = ' | ';

/** ` | Natlaupa` — derived, never hardcoded as a magic length. */
const BRAND_SUFFIX = `${BRAND_SEPARATOR}${BRAND}`;

/**
 * Collapse whitespace and strip a trailing separator.
 *
 * The trailing-separator strip matters when the body half of a composed string is empty or gets
 * clamped away: the joiner is otherwise left dangling at the end of the sentence.
 */
function tidy(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-–—:|,;]+$/, '')
    .trim();
}

/**
 * Truncate to `max` characters at a word boundary — never mid-word.
 * The returned string is always `<= max`, including `ellipsis`.
 */
function clamp(text: string, max: number, ellipsis = ''): string {
  if (text.length <= max) return text;

  const budget = max - ellipsis.length;
  // One character beyond the budget, so we can tell whether the cut landed mid-word.
  const cut = text.slice(0, budget + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const kept = lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, budget);

  return tidy(kept) + ellipsis;
}

/**
 * Remove a brand suffix the value may already carry, so the layout template cannot duplicate it.
 *
 * This is the fix for the live `"Destination Not Found | Natlaupa | Natlaupa"` titles: those route
 * files hardcode the suffix while `layout.tsx` appends it too.
 *
 * Exported because a social-card title wants the full-length stripped string, not the 60-char clamp.
 */
export function stripBrandSuffix(rawTitle: string): string {
  const pattern = new RegExp(`\\s*\\|\\s*${BRAND}\\s*$`, 'i');
  return tidy(rawTitle.replace(pattern, ''));
}

/**
 * Words that must never be the LAST word of a title.
 *
 * Why this exists — measured, not guessed. Every one of the 84 hotel records carries an authored
 * `metaTitle` shaped `<Hotel Name> | <Descriptor>`, and 47 of them are too long to also carry the
 * brand. A plain word-boundary clamp therefore cuts inside the descriptor, and on 15 of the 84 it
 * stopped on a word that cannot end a phrase:
 *
 *   "Hôtel Byblos Saint-Tropez | 5-Star Palace Hotel in"          <- dangling preposition
 *   "The Peninsula Istanbul | Luxury 5-Star Hotel on the"         <- dangling article
 *   "Radisson Collection Residences Riyadh | Luxury Serviced"     <- modifier, noun missing
 *   "7Pines Resort Ibiza, Destination by Hyatt | 5-Star Luxury"   <- modifier, noun missing
 *
 * A truncated string that LOOKS truncated is tolerable; one that looks like broken markup is not,
 * and these are the commercial pages. So after clamping we drop trailing words that cannot
 * terminate a phrase, repeatedly, until the title ends on something that can.
 *
 * ⚠️ Deliberately NOT solved by dropping the whole trailing `|` segment. That was the obvious
 * alternative and it is measurably worse on this data: because the titles are two-segment
 * (`Name | Descriptor`), dropping a segment discards the ENTIRE keyword descriptor. Measured
 * across all 84 — segment-dropping removes 62% of all descriptor text sitewide, including from
 * the 37 titles that already fit perfectly. Cascading word-strip removes 5%.
 *
 * ⚠️ MODIFIER is domain-tuned to a luxury-hotel inventory and is a heuristic, not a grammar. A
 * modifier not listed here simply survives as the last word — the failure mode is an unimproved
 * title, never a corrupted one. The cascade also self-limits: when a descriptor collapses to
 * nothing, `tidy` removes the now-trailing separator and the title degrades to `Name | Brand`,
 * which is exactly right for the cases where no part of the descriptor could survive intact.
 */
const DANGLING_FUNCTION_WORDS = new Set([
  'in', 'on', 'at', 'the', 'a', 'an', 'of', 'and', 'or', 'by', 'to', 'for', 'with', 'from',
  'near', 'over', 'under', 'into', 'onto', '&',
  // French articles — 12 hotel names and all six legal routes are French.
  'de', 'du', 'des', 'la', 'le', 'les',
]);

/** Modifiers that require a following noun. See the caveat above: heuristic, fails safe. */
const DANGLING_MODIFIERS = new Set([
  'luxury', 'serviced', 'beach', 'beachfront', 'seafront', 'oceanfront', 'clifftop', 'hillside',
  'french', 'italian', 'spanish', 'north', 'south', 'east', 'west', 'best', 'boutique', 'design',
  'grand', 'new', 'royal', 'private', 'all-suite', '5-star', 'historic', 'modern', 'iconic',
  'premier', 'exclusive', 'secluded', 'downtown', 'urban', 'alpine',
]);

/**
 * Drop trailing words that cannot end a phrase, and orphaned possessives
 * ("… on Marbella’s" once "Golden Mile" has been clamped away).
 *
 * Stops at the first word that CAN end a phrase, so a descriptor ending in a real noun
 * ("5-Star Luxury Hotel") is left completely alone.
 */
function stripDanglingTail(text: string): string {
  let current = tidy(text);

  for (;;) {
    const tokens = current.split(' ');
    if (tokens.length < 2) return current;

    const last = tokens[tokens.length - 1];
    const bare = last.toLowerCase().replace(/[.,;:]+$/, '');
    const isDangling =
      DANGLING_FUNCTION_WORDS.has(bare) ||
      DANGLING_MODIFIERS.has(bare) ||
      /['’]s$/.test(last);

    if (!isDangling) return current;

    // tidy() also strips a separator left exposed when a segment empties out.
    const next = tidy(tokens.slice(0, -1).join(' '));
    if (!next) return current;
    current = next;
  }
}

/**
 * Build a `<title>` that fits Google's display limit.
 *
 * The brand suffix is appended only when the page-specific text leaves room. When it doesn't, the
 * descriptive text wins — it is what distinguishes the result, and the brand is already carried by
 * the URL, the breadcrumb and the description.
 *
 * Callers must pass the result as `title: { absolute }` so `layout.tsx`'s `template: '%s | …'`
 * does not re-append the suffix and blow the budget again.
 */
export function buildTitle(rawTitle: string): string {
  const base = stripBrandSuffix(rawTitle);

  // Nothing page-specific to say. Return the brand alone — concatenating would emit a leading
  // separator: " | Natlaupa".
  if (!base) return BRAND;

  if (base.length + BRAND_SUFFIX.length <= TITLE_MAX) {
    return base + BRAND_SUFFIX;
  }

  // Too long for the brand, so it must be clamped. Repair a cut that landed on a word which
  // cannot end a phrase (see stripDanglingTail) before deciding whether the brand now fits.
  const trimmed = stripDanglingTail(clamp(base, TITLE_MAX));

  // Never return less than the plain clamp would have: if the repair consumed everything,
  // a truncated-but-present title beats an empty one.
  if (!trimmed) return clamp(base, TITLE_MAX);

  // Repairing often frees enough room to re-attach the brand — measured, 37 titles kept the
  // suffix before this change and 46 keep it after.
  return trimmed.length + BRAND_SUFFIX.length <= TITLE_MAX ? trimmed + BRAND_SUFFIX : trimmed;
}

/**
 * Build a meta description that fits Google's display limit.
 *
 * Prefers an authored value. Falls back to composing `lead — body`, sizing the body to whatever
 * budget the lead leaves rather than taking a fixed-length slice (the fixed-slice formula is what
 * guaranteed overflow on the TRD property: 61 + 3 + 120 + 3 = 187 every time).
 *
 * @param authored an authored description, if the record has one
 * @param lead     short summary line
 * @param body     longer prose to fill the remaining budget
 */
export function buildDescription(
  authored?: string | null,
  lead?: string | null,
  body?: string | null
): string {
  const primary = tidy(authored ?? '');
  if (primary) return clamp(primary, DESCRIPTION_MAX, '…');

  const leadText = tidy(lead ?? '');
  const bodyText = tidy(body ?? '');

  if (!bodyText) return clamp(leadText, DESCRIPTION_MAX, '…');
  if (!leadText) return clamp(bodyText, DESCRIPTION_MAX, '…');

  const joiner = ' — ';
  const remaining = DESCRIPTION_MAX - leadText.length - joiner.length;

  // Too little room left for the body to say anything useful — ship the lead alone rather than
  // appending a two-word stub behind a joiner.
  const MIN_USEFUL_BODY = 25;
  if (remaining < MIN_USEFUL_BODY) return clamp(leadText, DESCRIPTION_MAX, '…');

  return leadText + joiner + clamp(bodyText, remaining, '…');
}
