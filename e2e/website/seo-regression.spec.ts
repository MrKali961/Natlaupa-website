/**
 * SEO regression guards — plan item 6.1
 *
 * Locks in the discovery fixes this site has shipped (robots.txt unblocked, sitemap filtered
 * and paginated, retired hotels de-indexed) and pins the defects that are still open so the
 * moment one is fixed, the suite says so.
 *
 * ---------------------------------------------------------------------------
 * FOUR DESIGN DECISIONS, so they don't get "simplified" away:
 *
 * 1. EVERY ASSERTION READS RAW SERVER HTML via the `request` fixture, never `page.content()`.
 *    `page.content()` returns the post-hydration DOM. This site's central defect was content
 *    that existed only after hydration — testing the hydrated DOM would test the wrong
 *    artifact and report a pass a crawler never sees.
 *
 * 2. ROUTES ARE DISCOVERED FROM /sitemap.xml, not hardcoded. The sitemap IS the surface under
 *    test, and a hand-listed array is the thing that forgets the route that broke.
 *
 * 3. SAFE TO POINT AT A DEPLOY — unlike the rest of this harness.
 *    playwright.config.ts warns "NEVER point this at production". That warning is aimed at the
 *    `admin` project, which authenticates and mutates records. This spec is strictly read-only:
 *    GET requests only, no auth, no writes, no form submissions. So it is the one suite that
 *    can safely verify a real deploy, which is where SEO defects actually live:
 *      E2E_WEBSITE_URL=https://www.natlaupa.com npx playwright test seo-regression --project=website
 *    Do not extend this file with anything that mutates state, or that property is lost.
 *
 * 4. KNOWN-OPEN DEFECTS USE test.fail(), NOT a weakened assertion.
 *    `test.fail()` asserts the test DOES fail. So a known defect reports green while broken and
 *    turns RED the moment it is fixed — prompting you to delete the `test.fail()` line. That
 *    keeps the suite usable as a gate while staying an honest ledger. Every one names its owner.
 *    The alternative — loosening the assertion to match today's broken output — permanently
 *    hides the defect, which is how a suite quietly stops being worth running.
 * ---------------------------------------------------------------------------
 */

import { test, expect, type APIRequestContext } from '@playwright/test';
import { buildTitle } from '@/lib/seo-meta';

/**
 * Imported from the runtime module, never re-hardcoded, so the test and the shipped code cannot
 * disagree about what the bound is. Raise TITLE_MAX in the helper and these move with it.
 */
import { TITLE_MAX, DESCRIPTION_MAX } from '@/lib/seo-meta';

/**
 * Per-collection sitemap floors.
 *
 * ⚠️ Set BELOW the live counts on purpose, and the reasoning differs from the TRD property.
 * TRD's floors are exact live counts (9 services, 12 projects) because those are small curated
 * sets that do not churn. Hotel inventory here grows and shrinks with contracts — it went
 * 58 → 84 between 2026-08-03 and 2026-08-17, partly by REACTIVATING previously retired hotels.
 * Pinning the floor to 84 would turn one legitimate deactivation into a failing build.
 *
 * So these catch the CATASTROPHE, not the churn. The original defect published 10 hotels, all
 * of them deactivated — 0 bookable. Anything near these floors means the isActive filter or the
 * pagination broke again, not that a contract lapsed.
 */
const SITEMAP_FLOORS = {
  '/hotel/': 50, // live: 84
  '/destinations/': 20, // live: 33
  '/countries/': 10, // live: 17
  '/styles/': 5, // live: 8
  '/blog/': 5, // live: 8
} as const;

/** French-language routes. Serving these under lang="en" misdeclares the content language. */
const FRENCH_ROUTES = [
  '/mentions-legales',
  '/cgu',
  '/politique-de-confidentialite',
  '/politique-cookies',
  '/conditions-generales-service',
  '/mediation-consommation',
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchText(request: APIRequestContext, path: string): Promise<string> {
  const res = await request.get(path);
  expect(res.status(), `${path} should return 200`).toBe(200);
  return res.text();
}

function decode(raw: string): string {
  return raw
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function attr(html: string, pattern: RegExp): string {
  const m = html.match(pattern);
  return m ? decode(m[1]).trim() : '';
}

const metaTitle = (h: string) => attr(h, /<title[^>]*>(.*?)<\/title>/is);
const metaDescription = (h: string) => attr(h, /<meta\s+name="description"\s+content="(.*?)"/is);
const canonicalOf = (h: string) => attr(h, /<link\s+rel="canonical"\s+href="(.*?)"/is);
const htmlLang = (h: string) => attr(h, /<html[^>]*\slang="(.*?)"/is);
const robotsMeta = (h: string) => attr(h, /<meta\s+name="robots"\s+content="(.*?)"/is);

/** Throws on a block that does not parse — that IS the "JSON-LD parses" assertion. */
function jsonLdNodes(html: string): Record<string, unknown>[] {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)];
  const nodes: Record<string, unknown>[] = [];
  for (const [, body] of blocks) {
    const parsed = JSON.parse(decode(body)) as unknown;
    for (const entry of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!entry || typeof entry !== 'object') continue;
      const node = entry as Record<string, unknown>;
      nodes.push(node);
      const graph = node['@graph'];
      if (Array.isArray(graph)) {
        for (const g of graph) if (g && typeof g === 'object') nodes.push(g as Record<string, unknown>);
      }
    }
  }
  return nodes;
}

function stripNonRendered(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

async function sitemapLocs(request: APIRequestContext): Promise<string[]> {
  const xml = await fetchText(request, '/sitemap.xml');
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((m) => decode(m[1]).trim());
}

async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const locs = await sitemapLocs(request);
  return [
    ...new Set(
      locs.map((u) => {
        try {
          return new URL(u).pathname;
        } catch {
          return u;
        }
      }),
    ),
  ];
}

/**
 * A representative sample rather than all 166 routes.
 *
 * Deliberate: every hub, every legal page, and a fixed stride through each collection. A stride
 * (not a random pick) keeps the suite deterministic — a flaky-by-design SEO gate gets ignored,
 * and `Math.random()` would mean a failure you cannot reproduce.
 */
function sampleRoutes(paths: string[], perCollection = 3): string[] {
  const hubs = paths.filter((p) => (p.match(/\//g) ?? []).length <= 1);
  const collections = new Map<string, string[]>();
  for (const p of paths) {
    if (hubs.includes(p)) continue;
    const prefix = `/${p.split('/')[1]}/`;
    if (!collections.has(prefix)) collections.set(prefix, []);
    collections.get(prefix)!.push(p);
  }
  const sampled: string[] = [];
  for (const [, members] of collections) {
    const sorted = [...members].sort();
    const stride = Math.max(1, Math.floor(sorted.length / perCollection));
    for (let i = 0; i < sorted.length && sampled.length < 1e4; i += stride) {
      sampled.push(sorted[i]);
      if (sampled.filter((s) => s.startsWith(`/${sorted[i].split('/')[1]}/`)).length >= perCollection) break;
    }
  }
  return [...new Set([...hubs, ...sampled])];
}

// ===========================================================================
// SHIPPED — these must stay green
// ===========================================================================

test.describe('SEO regression guards (shipped fixes)', () => {
  test('S01: sitemap meets every per-collection floor', async ({ request }) => {
    const locs = await sitemapLocs(request);
    const failures: string[] = [];

    for (const [prefix, floor] of Object.entries(SITEMAP_FLOORS)) {
      const count = locs.filter((u) => u.includes(prefix)).length;
      if (count < floor) failures.push(`${prefix}: ${count} URLs, floor ${floor}`);
    }

    // The defect this guards: sitemap.ts read page 1 of a limit=10 API that returned inactive
    // records first, publishing 10 hotels of which ALL 10 were deactivated — 0 of 58 bookable
    // hotels reachable. Pagination alone did not fix it; the isActive filter was the other half.
    expect(failures, `\n${failures.join('\n')}`).toEqual([]);
  });

  test('S02: sitemap has no duplicate URLs', async ({ request }) => {
    const locs = await sitemapLocs(request);
    const dupes = [...new Set(locs.filter((u, i) => locs.indexOf(u) !== i))];
    // Real cause, not hypothetical: the free-text `country` column holds trailing-whitespace
    // variants that slugify() collapses to the same slug. Three duplicates shipped that way.
    expect(dupes, `duplicated: ${dupes.join(', ')}`).toEqual([]);
  });

  test('S03: robots.txt blocks neither /_next/ nor any AI retrieval agent', async ({ request }) => {
    const robots = await fetchText(request, '/robots.txt');

    // 🔴 The single highest-impact defect this site had. /_next/ serves every stylesheet and
    // script, so disallowing it stopped Google rendering the site at all. Nothing else about
    // this property was measurable until it lifted. Never let it come back.
    expect(robots, 'robots.txt must not disallow /_next/').not.toMatch(/Disallow:\s*\/_next/i);

    const agents = [
      'GPTBot',
      'OAI-SearchBot',
      'ChatGPT-User',
      'PerplexityBot',
      'ClaudeBot',
      'Google-Extended',
      'Bingbot',
    ];
    // Split per agent group so `Disallow: /` under `User-Agent: *` is not misattributed to a
    // named agent that has its own group.
    const groups = robots.split(/(?=^User-[Aa]gent:)/m);
    for (const agent of agents) {
      const group = groups.find((g) => new RegExp(`^User-[Aa]gent:\\s*${agent}\\s*$`, 'im').test(g));
      if (!group) continue;
      expect(group, `${agent} has an explicit group disallowing everything`).not.toMatch(
        /Disallow:\s*\/\s*$/m,
      );
    }

    expect(robots, 'robots.txt must declare the sitemap').toMatch(/Sitemap:\s*https?:\/\/\S+/i);
  });

  test('S04: every sampled route has exactly one h1 in server HTML', async ({ request }) => {
    const routes = sampleRoutes(await sitemapPaths(request));
    const wrong: string[] = [];
    for (const path of routes) {
      const html = await fetchText(request, path);
      const count = (html.match(/<h1[\s>]/gi) ?? []).length;
      if (count !== 1) wrong.push(`${path}: ${count} h1 elements`);
    }
    expect(wrong, `\n${wrong.join('\n')}`).toEqual([]);
  });

  test('S05: every sampled route has a self-referencing canonical', async ({ request }) => {
    const routes = sampleRoutes(await sitemapPaths(request));
    const bad: string[] = [];
    for (const path of routes) {
      const html = await fetchText(request, path);
      const href = canonicalOf(html);
      if (!href) {
        bad.push(`${path}: no canonical`);
        continue;
      }
      let pathname: string;
      try {
        pathname = new URL(href).pathname;
      } catch {
        bad.push(`${path}: canonical not absolute — "${href}"`);
        continue;
      }
      if (pathname.replace(/\/$/, '') !== path.replace(/\/$/, '')) {
        bad.push(`${path}: canonical points at ${pathname}`);
      }
    }
    expect(bad, `\n${bad.join('\n')}`).toEqual([]);
  });

  test('S06: every JSON-LD block parses', async ({ request }) => {
    const routes = sampleRoutes(await sitemapPaths(request));
    const broken: string[] = [];
    for (const path of routes) {
      const html = await fetchText(request, path);
      try {
        if (jsonLdNodes(html).length === 0) broken.push(`${path}: no JSON-LD at all`);
      } catch (err) {
        broken.push(`${path}: ${String(err)}`);
      }
    }
    expect(broken, `\n${broken.join('\n')}`).toEqual([]);
  });

  test('S07: every hotel in the sitemap is reachable and indexable', async ({ request }) => {
    // ~84 sequential GETs (up to 168 with retries) exceeds the 45s config default.
    test.setTimeout(180_000);

    // The positive half of the retirement fix. A URL advertised in the sitemap that 404s, or
    // that serves noindex, is the sitemap and the page disagreeing about what is public — the
    // exact class of bug the shared isPubliclyListable predicate exists to prevent.
    const hotels = (await sitemapPaths(request)).filter((p) => p.startsWith('/hotel/'));
    expect(hotels.length, 'no hotel URLs in the sitemap at all').toBeGreaterThan(0);

    // ⚠️ CHECKS EVERY HOTEL, NOT A SAMPLE — and that is the whole point.
    //
    // An earlier version strode through and checked 5 of 84. It reported GREEN over a 404 that
    // had been measured by hand minutes earlier (/hotel/saifi-suites-hotel), because the stride
    // landed on indexes 0/28/56 and never reached an 's'-prefixed slug. Sampling hides exactly
    // the failure mode this test exists to catch. 84 GETs is cheap; a false green is not.
    //
    // Retry once before failing. That same saifi-suites 404 did NOT reproduce on re-probe — it
    // was a transient ISR/cold-start miss, not a defect. Without the retry this test flakes on
    // cold caches and gets deleted for being unreliable, which costs more than one extra request.
    const bad: string[] = [];
    for (const path of hotels) {
      let res = await request.get(path);
      if (res.status() !== 200) res = await request.get(path);

      if (res.status() !== 200) {
        bad.push(`${path}: sitemap advertises it, page returns ${res.status()} (twice)`);
        continue;
      }
      const robots = robotsMeta(await res.text());
      if (/noindex/i.test(robots)) bad.push(`${path}: sitemap advertises it, page says "${robots}"`);
    }
    expect(bad, `\n${bad.join('\n')}`).toEqual([]);
  });

  test('S08: an unknown hotel slug does not serve an indexable 200', async ({ request }) => {
    // The negative half. Verified live 2026-08-17: /hotel/hotel-hermitage-monte-carlo → 404.
    //
    // ⚠️ Method note, so this is not "fixed" by picking a real slug. An earlier draft used
    // `wynn-las-vegas` as the known-retired example because it was one of the 19 retired in
    // 2026-08-03. It now returns 200 — and that is CORRECT: it is back in the sitemap, i.e.
    // reactivated, not a regression. Retired-vs-reactivated is not observable from outside,
    // so this asserts the invariant that survives inventory churn: an unknown slug must never
    // serve an indexable 200.
    const res = await request.get('/hotel/definitely-not-a-real-hotel-slug-zzz');
    if (res.status() === 200) {
      expect(robotsMeta(await res.text()), 'unknown slug served 200 without noindex').toMatch(/noindex/i);
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400);
    }
  });
});

// ===========================================================================
// KNOWN-OPEN DEFECTS
//
// Each uses test.fail(), which asserts the test DOES fail. So each stays green while the
// defect is live and turns RED the moment it is fixed — at which point delete the
// `test.fail()` line and the test becomes a permanent guard. Every entry names its owner.
// ===========================================================================

test.describe('Defects with an owner (delete the test.fail when one deploys)', () => {
  // ⚠️ NO test.fail() — this defect is FIXED in this branch, so it is a permanent guard now.
  // It will still fail until the fix DEPLOYS; that is expected, and it is the cheapest proof the
  // deploy worked. Do not re-add a test.fail() to make it green.
  //
  // What it caught, measured on production 2026-08-17 BEFORE the fix:
  //   hubs:          /countries 209, /about 203, /styles 194, /destinations 193, / 177, /blog 159
  //                  — six of seven over; only /mentions-legales (124) fit
  //   hotel details: descriptions 84 of 84 (100%) over, range 229-658, MEDIAN 391 (33 past 450)
  //                  titles        36 of 84 (42%) over, range 44-93
  //   destinations 355 · offers 160 · styles 158
  //
  // ⚠️ Length is ALL this asserts, and length is not quality. Clamping cannot write copy — some
  // clamped titles now end on an incomplete phrase ("… | Trou d'Eau", "… | Luxury"). Authored
  // metaTitle / metaDescription values in the CMS remain the real fix for those; the helper only
  // guarantees Google stops discarding two thirds of the text.
  test('D01: no title over TITLE_MAX, no description over DESCRIPTION_MAX', async ({ request }) => {
    const routes = sampleRoutes(await sitemapPaths(request));
    const over: string[] = [];
    for (const path of routes) {
      const html = await fetchText(request, path);
      const title = metaTitle(html);
      const description = metaDescription(html);
      if (!title) over.push(`${path}: MISSING title`);
      if (!description) over.push(`${path}: MISSING description`);
      if (title.length > TITLE_MAX) over.push(`${path}: title ${title.length} > ${TITLE_MAX}`);
      if (description.length > DESCRIPTION_MAX) {
        over.push(`${path}: description ${description.length} > ${DESCRIPTION_MAX}`);
      }
    }
    expect(over, `\n${over.join('\n')}`).toEqual([]);
  });

  test('D02: no unresolved TODO placeholder is served to visitors', async ({ request }) => {
    test.fail(
      true,
      'OPEN — fixed on branch fix/natlaupa-discovery-hygiene (PR #5, plan item 2.7), not yet ' +
        'merged. Production still serves 2 occurrences on /about, the page that explains ' +
        'pricing, on a site that is selling. Delete this line once #5 deploys.',
    );

    // Matches the bracketed literal on purpose. A case-insensitive /todo/ search flakes against
    // the RSC flight payload and ordinary prose, which is how a check like this gets deleted
    // for being noisy rather than being trusted.
    const routes = sampleRoutes(await sitemapPaths(request));
    const found: string[] = [];
    for (const path of routes) {
      const html = await fetchText(request, path);
      if (html.includes('[TODO :') || html.includes('[TODO:')) found.push(path);
    }
    expect(found, `routes serving a TODO placeholder: ${found.join(', ')}`).toEqual([]);
  });

  test('D03: no crawler-only hidden text', async ({ request }) => {
    test.fail(
      true,
      'OPEN — fixed on branch fix/ungate-homepage-and-restore-scrollbars (PR #3, plan items ' +
        '5.1 / 10.5), not yet merged. Production still serves the 1x1px clipped, aria-hidden ' +
        'block on / holding ~1600 chars and a 9-link nav. Delete this line once #3 deploys.',
    );

    // ⚠️ Two things that are NOT this defect and must not be flagged:
    //   - SVG <clipPath> elements, which are legitimate graphics. A regex for the bare word
    //     `clipPath` matches those. (The sister TRD property serves 4 per page, in its logo.)
    //   - The `sr-only` class. Tailwind implements it WITH clip:rect(0,0,0,0), and sr-only
    //     content IS exposed to assistive tech — the opposite of hiding text from users only.
    // So this targets the actual signature: INLINE clipping, or aria-hidden over real text.
    const routes = sampleRoutes(await sitemapPaths(request));
    const offenders: string[] = [];

    for (const path of routes) {
      const html = await fetchText(request, path);
      for (const m of html.matchAll(/style="[^"]*"/gi)) {
        const style = m[0];
        if (/clip\s*:\s*rect\(\s*0[\s,]+0[\s,]+0[\s,]+0\s*\)/i.test(style)) {
          offenders.push(`${path}: inline clip:rect(0,0,0,0) — ${style.slice(0, 80)}`);
        }
        if (/clip-path\s*:\s*inset\(\s*50%\s*\)|clipPath\s*:/i.test(style)) {
          offenders.push(`${path}: inline clip-path inset(50%) — ${style.slice(0, 80)}`);
        }
      }
      for (const m of stripNonRendered(html).matchAll(/aria-hidden="true"[^>]*>([^<]{80,})/gi)) {
        offenders.push(`${path}: aria-hidden block holds ${m[1].length} chars of text`);
      }
    }
    expect(offenders, `\n${offenders.join('\n')}`).toEqual([]);
  });

  // ⚠️ NO test.fail() — fixed in this branch (plan 6.8b). Fails until it deploys, which is the
  // proof the deploy worked. All 6 routes previously rendered under the root layout's hardcoded
  // <html lang="en"> while containing French text ("Les présentes", "Conformément", "données
  // personnelles"). Measured 2026-08-17.
  //
  // ⚠️ ACCEPTS EITHER <html lang="fr"> OR a subtree lang="fr", and that is deliberate — the
  // assertion matches what is achievable, not an ideal that would force a worse change. In the
  // App Router only the ROOT layout can render <html>, and a server layout cannot read the
  // pathname, so per-route <html lang> means a SECOND root layout in a route group: duplicating
  // the html/body shell, fonts and providers for six static pages. A subtree `lang` on <main> is
  // valid HTML, scopes the declaration precisely to the French content, and is what screen
  // readers and translation tools actually read for pronunciation. That is the fix that shipped.
  test('D04: French routes declare their content as French', async ({ request }) => {
    const wrong: string[] = [];
    for (const path of FRENCH_ROUTES) {
      const res = await request.get(path);
      if (res.status() !== 200) continue;
      const html = await res.text();

      // Either the document declares French, or the element wrapping the content does.
      const documentIsFrench = /^fr/i.test(htmlLang(html));
      const subtreeIsFrench = /<(?:main|article|section|div)[^>]*\slang="fr[^"]*"/i.test(html);

      if (!documentIsFrench && !subtreeIsFrench) {
        wrong.push(`${path}: <html lang="${htmlLang(html)}"> and no lang="fr" wrapper`);
      }
    }
    expect(wrong, `\n${wrong.join('\n')}`).toEqual([]);
  });

  test('D05: /hotels index exists and is paginated', async ({ request }) => {
    test.fail(
      true,
      'OPEN — built on branch feat/hotels-index (PR #4, plan items 5.2 / T4), not yet merged. ' +
        'Production returns 404 for /hotels, so 84 hotels are reachable only via the sitemap. ' +
        'Delete this line once #4 deploys.',
    );

    const res = await request.get('/hotels');
    expect(res.status(), '/hotels should exist').toBe(200);
    const html = await res.text();

    // Numbered, server-rendered pagination is the whole point (plan 10.4). Infinite scroll or a
    // load-more button would leave the hotels sitemap-only again, which is the defect S01 fixed.
    expect(html, '/hotels must link page 2 with a real href').toMatch(/href="[^"]*\/hotels\?page=2/);
    expect(html, 'active page link must carry aria-current').toMatch(/aria-current="page"/);
  });
});

// ---------------------------------------------------------------------------
// buildTitle — unit assertions. No fixtures, no network, runs against any origin.
//
// 🔴 Why these are unit tests and not production probes. `buildTitle` repairs a title that the
// 60-char clamp cut mid-phrase by dropping trailing words that cannot end a phrase. An earlier
// version applied that strip to the WHOLE title, so once the descriptor emptied out the cascade
// walked into the hotel name and ate words from it:
//
//   "Jumeirah Beach | Luxury Beachfront Design Boutique Grand Modern Iconic"
//      -> "Jumeirah | Natlaupa"      ('beach' is in the modifier list)
//   "The Royal | Luxury Beachfront Design Boutique Modern Iconic Premier Grand"
//      -> "The | Natlaupa"           ('royal' is too)
//
// NO CURRENT RECORD REACHES THAT PATH, which is exactly why a production sweep could not catch it —
// "all 84 titles clean" was true and the bug was still there. It needs a title whose descriptor is
// entirely strippable, and the inventory does not contain one YET. `grand`, `royal`, `new`,
// `private`, `beach` and the compass points are all plausible name-final tokens, so a future CMS
// entry would have shipped a corrupted brand name silently.
//
// These cases pin the invariant instead of the inventory: the text before the final `|` is never
// edited, because the clamp cannot have truncated it.
// ---------------------------------------------------------------------------
// Every guard below was proven able to go RED, against the mutation it owns. Measured 2026-08-18 by
// applying each mutation to src/lib/seo-meta.ts and re-running this describe block:
//
//   mutation                                          U01    U02   U02b   U03
//   A  drop the segment boundary (the original bug)    RED   green  green  green
//   B  stripDanglingWords -> identity (repair off)    green   RED    RED   green
//   C  remove the stripBrandSuffix call               green  green  green   RED
//   D  remove 'luxury' from DANGLING_MODIFIERS        green  green   RED   green
//
// Read it as a contract. U01 owns the segment boundary, U02 + U02b own the repair, U02b alone owns
// the word lists, U03 owns the brand. Every mutation has a red and no guard is decorative, so if you
// change buildTitle the pattern of reds tells you which invariant you touched.
//
// 🔴 Mutation D is the one that matters, because it is the edit this code actually invites: a hotel
// named "The Grand" arrives and someone takes `grand` out of DANGLING_MODIFIERS. A/B/C are mutations
// nobody would make by hand. U02's cases cannot catch D — their clamped tails end on "Hotel", so the
// cascade stops at the first word whatever the lists contain. U02b exists for exactly that gap.
//
// ⚠️ U02 previously asserted `not.toMatch(/\s(?:in|on|the|...)$/)` instead of the exact output. That
// regex was a subset of DANGLING_FUNCTION_WORDS and never looked at DANGLING_MODIFIERS, so it stayed
// green under B and D as well as A — it proved nothing. Keep the exact strings, and if you add a word
// to either list, add a case here whose clamped tail ends on it.
test.describe('buildTitle invariants', () => {
  const CORRUPTION_CASES = [
    'Jumeirah Beach | Luxury Beachfront Design Boutique Grand Modern Iconic',
    'Hotel Grand | Luxury Beachfront Design Boutique Modern Iconic Premier',
    "Claridge's | Luxury Iconic Historic Boutique Design Modern Premier Grand",
    'Resort North | Beachfront Luxury Design Boutique Grand Modern Iconic Premier',
    'The Royal | Luxury Beachfront Design Boutique Modern Iconic Premier Grand',
  ];

  test('U01: never edits the text before the final separator', () => {
    const mangled: string[] = [];
    for (const raw of CORRUPTION_CASES) {
      const out = buildTitle(raw);
      const nameIn = raw.split('|')[0].trim();
      const nameOut = out.split('|')[0].trim();
      if (nameIn !== nameOut) mangled.push(`"${nameIn}" became "${nameOut}"  (from: ${raw})`);
    }
    expect(mangled, `buildTitle corrupted the leading segment:\n${mangled.join('\n')}`).toEqual([]);
  });

  // 🔴 Pins the EXACT repaired output, not the absence of one symptom — see the mutation matrix
  // above for why the earlier regex form proved nothing. Do not weaken these back to a pattern.
  test('U02: repairs the clamped tail to exactly this text, and stays in budget', () => {
    // [input, input length, expected output]. Inputs are real live CMS values measured on
    // production 2026-08-17; outputs measured from the compiled helper 2026-08-18.
    const cases: Array<[string, number, string]> = [
      [
        'Hôtel Byblos Saint-Tropez | 5-Star Palace Hotel in Saint-Tropez',
        63,
        'Hôtel Byblos Saint-Tropez | 5-Star Palace Hotel | Natlaupa',
      ],
      [
        'The Peninsula Istanbul | Luxury 5-Star Hotel on the Bosphorus',
        61,
        'The Peninsula Istanbul | Luxury 5-Star Hotel | Natlaupa',
      ],
      [
        // Clamps mid-possessive ("on Marbella’s"), which the repair must also strip.
        'Alanda Marbella Hotel | 5-Star Luxury Hotel on Marbella’s Golden Mile',
        69,
        'Alanda Marbella Hotel | 5-Star Luxury Hotel | Natlaupa',
      ],
    ];

    for (const [raw, rawLength, expected] of cases) {
      expect(raw.length, 'test fixture drifted from the measured value').toBe(rawLength);
      const out = buildTitle(raw);
      expect(out, `repair changed for: ${raw}`).toBe(expected);
      // Redundant with toBe, kept because it is the contract the helper exists to hold.
      expect(out.length, `over the limit: "${out}"`).toBeLessThanOrEqual(TITLE_MAX);
    }
  });

  // 🔴 The cases above never exercise DANGLING_MODIFIERS: their clamped tails end on "Hotel",
  // so the cascade stops at the first word either way. Measured — removing `luxury` from
  // DANGLING_MODIFIERS leaves U01, U02 and U03 all green. That is the edit this code actually
  // invites (a hotel named "The Grand" arrives, someone takes `grand` out of the list), so a matrix
  // that only covers mutations nobody would make is not covering the real risk.
  //
  // These three ARE live values whose whole descriptor is strippable, so they run the cascade
  // through the modifier list and out the far side into repairClampedTail's drop-the-segment
  // branch — the branch the original bug used to walk into the hotel name.
  test('U02b: exercises the modifier list and the dropped-segment branch', () => {
    // [input, input length, expected output]. Live CMS values 2026-08-17; outputs from the
    // compiled helper 2026-08-18. Each descriptor strips to nothing, so the segment is dropped
    // and the name is returned verbatim with the brand re-attached.
    const cases: Array<[string, number, string]> = [
      [
        // clamp lands on 'serviced' -> 'Luxury Serviced' -> '' (both listed)
        'Radisson Collection Residences Riyadh | Luxury Serviced Residences',
        66,
        'Radisson Collection Residences Riyadh | Natlaupa',
      ],
      [
        // clamp lands on 'luxury' -> '5-Star Luxury' -> '' (both listed)
        '7Pines Resort Ibiza, Destination by Hyatt | 5-Star Luxury Resort',
        64,
        '7Pines Resort Ibiza, Destination by Hyatt | Natlaupa',
      ],
      [
        // clamp lands on 'beach' -> 'Luxury 5-Star Beach' -> '' (all three listed)
        'Shangri-La Le Touessrok Mauritius | Luxury 5-Star Beach Resort',
        62,
        'Shangri-La Le Touessrok Mauritius | Natlaupa',
      ],
    ];

    for (const [raw, rawLength, expected] of cases) {
      expect(raw.length, 'test fixture drifted from the measured value').toBe(rawLength);
      const out = buildTitle(raw);
      expect(out, `repair changed for: ${raw}`).toBe(expected);
      // The name must survive the dropped segment untouched — U01's invariant, on real data.
      expect(out.split('|')[0].trim(), `name mangled: "${out}"`).toBe(raw.split('|')[0].trim());
    }
  });

  test('U03: does not double the brand, and does not strip a brand-prefixed phrase', () => {
    // layout.tsx applies `template: '%s | Natlaupa'`, so a value already carrying the suffix
    // rendered "Hotel Not Found | Natlaupa | Natlaupa" live. Guard both directions.
    expect(buildTitle('Hotel Not Found | Natlaupa')).toBe('Hotel Not Found | Natlaupa');
    // 'Natlaupa Experiences' is NOT the brand suffix and must survive intact.
    expect(buildTitle('Natlaupa Experiences')).toBe('Natlaupa Experiences | Natlaupa');
    expect(buildTitle('')).toBe('Natlaupa');
  });
});
