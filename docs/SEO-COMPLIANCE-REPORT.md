# Natlaupa — Google SEO Compliance Report

*Audited against a local production build (`next build` exit 0, `next start`) under Googlebot UA, cross-referenced with source. Site: Next.js App Router + TypeScript + Tailwind, prod `https://www.natlaupa.com`. Method: 22 routes analyzed against rendered HTML + a 5-dimension, adversarially-verified compliance workflow (technical, on-page+schema, content/E-E-A-T, spam, AI-search).*

---

## 1. Executive summary

Natlaupa is a mature, well-built Next.js site: titles and meta descriptions are unique and descriptive, robots/`index,follow` and snippet directives are correct site-wide, the sitemap is wired, security headers and Consent Mode v2 are in place, and the high-value commerce surfaces (hotel and offer detail pages) are properly server-rendered with crawlable slug URLs and complete image alt text. The site needs **no separate "AEO/GEO" work** — its AI-Overview eligibility rides entirely on standard SEO. There are only **three real, mechanically-confirmed defects**: (1) six French legal pages canonicalize to the homepage, telling Google they are duplicates of it; (2) three category hub pages (`/destinations`, `/styles`, `/countries`) ship a loading spinner instead of their content/links in the initial HTML; and (3) the only published blog article is off-brand AI-template content that injects unrelated B2B copy. Everything else is either a low-risk enhancement (page-specific schema, breadcrumbs), a latent config risk (the sitemap's localhost env fallback), or a deliberate owner policy choice (blocking AI crawlers).

---

## 2. Findings by severity

> Deduped across dimensions: the CSR-rendering defect was reported five times (technical, on-page, AI-search, E-E-A-T); the non-functional SearchAction three times; the localhost env fallback twice. Each appears once below.

### CRITICAL

None. *(The bundled `scripts/seo_audit.py` flagged a CRITICAL "not served over HTTPS" on every URL — a false positive from auditing `http://localhost`; production is HTTPS. See "Ruled out.")*

---

### HIGH

#### H1 — Six FR legal pages canonicalize to the homepage *(tech-03)*
**What's wrong:** `cgu`, `mentions-legales`, `politique-de-confidentialite`, `politique-cookies`, `conditions-generales-service`, and `mediation-consommation` export `metadata` with title/description/robots but **no `alternates.canonical`**, and have no co-located `layout.tsx`. They therefore inherit the root layout's `alternates: { canonical: BASE_URL }` (the absolute homepage URL). Rendered HTML confirms `<link rel="canonical" href="https://www.natlaupa.com">` on all six. Google will treat six distinct legal pages as duplicates of the homepage and may drop them from the index.
**Rule:** [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization) — one `rel=canonical` per page; keep all canonical signals pointing the same way.
**Fix:** Add `alternates: { canonical: '/<route>' }` to each page's exported `metadata` (relative paths resolve against `metadataBase` set at `src/app/layout.tsx:30`).
**Status: FIXED in this pass.**

#### H2 — Category hub pages render only a spinner in initial HTML *(tech-01 + head-01 + ai-07; blog-detail variant deferred — see §3)*
**What's wrong:** `/destinations`, `/styles`, `/countries` are `'use client'` pages that initialize `const [isLoading, setIsLoading] = useState(true)` and hit an early `if (isLoading) return <full-screen loader/>` **before** the static hero (H1 + intro) and the entire `<Link href="/destinations/[slug]">` card grid. Server HTML contains only the spinner: **H1 = 0, ~107–113 visible chars** on all three. So neither the main heading/content nor the internal links to detail pages exist in the initial response — Google sees them only after a deferred, non-guaranteed second render, and these three hubs look thin in the first indexing pass. This same structural gap is also why these pages cannot serve as AI-Overview grounding sources.
**Rule:** [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
**Fix (applied — minimum):** Lift the static hero (`<h1>` + intro `<p>`) out of the `isLoading` early-return so it always ships in initial HTML; confine the spinner to the grid region.
**Status: FIXED in this pass (hero + intro now server-rendered; grid skeleton confined).** *RSC conversion remains the stronger follow-up.*

#### H3 — Published blog article is off-brand AI-template content *(eeat-01; OWNER DECISION — see §4)*
**What's wrong:** The published article *"Top Luxury Hotels in France for 2025"* is demonstrably AI/template-generated and mis-targeted. The body (confirmed verbatim against the live API, `STATUS=PUBLISHED`) contains a section titled **"Practical Takeaways for HR Leaders"**, promotes unrelated B2B services (*"Consulting firms specializing in AI and workflow automation, including Canadian experts"*, *"automation tools such as n8n"*), and closes with *"Ready to enhance your hospitality operations with AI consulting and automation? Contact us today."* It names famous hotels (Ritz, Crillon, Negresco) with no first-hand experience. This is the textbook "mass-produced / heavy-automation, made mainly for search clicks" pattern and harms whole-site trust.
**Rule:** [Creating helpful, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
**Fix (editorial, not code):** Until rewritten, **unpublish** (set `status != PUBLISHED` in the CMS) or replace the body with genuinely Natlaupa-authored, first-hand luxury-travel content. Remove every AI-consulting / workflow-automation / n8n / HR-leaders reference.

---

### MEDIUM

#### M1 — `WebSite` `SearchAction` points at a search the site doesn't perform *(tech-05 + sd-04 + spam-01)*
**What's wrong:** The site-wide `WebSite` JSON-LD declares a `SearchAction` with target `https://www.natlaupa.com/destinations?q={search_term_string}`, but `/destinations` never reads `searchParams` and the API route only handles `page`/`limit`. The real on-site search (Navbar typeahead) resolves directly to hotel slugs. The markup advertises a search endpoint that doesn't exist.
**Rule:** [Structured-data general policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). *(The sitelinks searchbox rich result is deprecated, so this is a correctness issue, not a lost rich result.)*
**Fix:** Remove the `potentialAction`/`SearchAction` block (lowest-effort correct action), or make `/destinations` consume `q`.
**Status: FIXED in this pass (SearchAction removed).**

#### M2 — Hotel detail pages emit no `Hotel`/`LodgingBusiness` schema *(sd-01)*
**What's wrong:** Hotel detail pages are fully server-rendered and display name, rating, geo, amenities, reviews — yet emit only the global `TravelAgency`/`Organization`/`WebSite` JSON-LD. Highest-value rich-result *opportunity*; all data already available server-side as the `hotel` prop.
**Rule:** [Structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — most specific applicable type; markup must match the visible page.
**Fix:** Server-render a `Hotel` JSON-LD block. Only add `aggregateRating`/`review` when exactly the displayed reviews are marked up; do not synthesize a rating from the fallback `hotel.rating`.
**Status: FIXED in this pass (Hotel + geo/amenities; reviews/aggregateRating only when present).**

#### M3 — No `BreadcrumbList` schema anywhere *(sd-03)*
**What's wrong:** No breadcrumb structured data despite a clear hierarchy (Home → Destinations/Styles/Countries/Hotel/Blog/Offer → detail).
**Rule:** [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).
**Fix:** Server-side `BreadcrumbList` JSON-LD on detail/category routes; each `ListItem` with 1-based `position`, `name`, absolute `item` URL.
**Status: FIXED in this pass (shared `JsonLd`/breadcrumb helper added to hotel/offer/destination/style/country detail routes).**

#### M4 — Blog byline is "Admin User" with no bio *(eeat-02)* — folds into blog redesign (§3).
#### M5 — Blog body injects off-brand WordPress styling *(eeat-03)* — folds into blog redesign (§3).

#### M6 — `TravelAgency` and `Organization` duplicate the same entity *(sd-05)*
**What's wrong:** Two top-level entities describe the same company with identical fields and no `@id` linkage; `TravelAgency` is a subtype of `Organization`, making the standalone `Organization` redundant.
**Fix:** Single `TravelAgency` node with a stable `@id` (`https://www.natlaupa.com/#organization`).
**Status: FIXED in this pass (collapsed to one `@id`-linked node).**

---

### LOW

#### L1 — Sitemap can silently collapse to static pages via localhost env fallback *(tech-02 + ai-08)*
**What's wrong:** `src/app/sitemap.ts:5` derives `API_URL` from `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'`. `NEXT_PUBLIC_` vars are inlined at build time. If the Vercel production build lacks the var, the localhost fallback is baked in, every `fetchData()` fails → `[]`, and the sitemap collapses to ~10 static pages — every dynamic detail URL silently disappears from discovery. Latent: the audited build had the var set.
**Rule:** [Sitemaps overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
**Fix:** Change the fallback away from localhost to the real production API base; verify `NEXT_PUBLIC_API_URL` on Vercel Production; validate live `/sitemap.xml`.
**Status: FIXED in this pass (fallback → production API base, in `sitemap.ts` + `llms.txt`). Vercel env check remains owner action (§4).**

#### L2 — `<html lang="en">` on all-French legal pages *(tech-06; OWNER DECISION — see §4)*
Minor a11y/i18n mismatch; App Router can't set per-route `<html lang>` below root. Pragmatic minimum: `lang="fr"` on each FR page's top-level element.

#### L3 — Country page reuses one hotel's description as its intro *(spam-03; content review, not a violation)*
`CountryPageClient.tsx` renders `hotels[0].description` as the country-page hero blurb. Optional polish: give country pages their own intro field.

#### L4 — Inconsistent AI-crawler posture (robots.ts vs llms.txt) *(ai-04; OWNER DECISION — see §4)*
`robots.ts` blocks GPTBot/CCBot while `llms.txt` publishes an AI content index. **Zero impact on Google Search or AI Overviews** (Googlebot/Google-Extended not blocked) — purely a third-party-LLM visibility choice.

#### L5 — Google Business Profile / Merchant feeds *(ai-09; owner action)*
A verified GBP (and Merchant Center where applicable) helps business info surface in AI/local responses. Off-code owner action.

---

## 3. Blog — deferred to the planned premium redesign

These blog-surface items share one root cause (CSR-only body) and are being fixed together in the redesign, **not** patched piecemeal:

- **Blog detail body is CSR-blank** *(tech-04 / eeat-09)* — `blog/[slug]/page.tsx` passes only `slug` to `<BlogDetailClient>`, which fetches the body via `useBlog` in `useEffect`. Server HTML is H1 = 0, ~109 chars. **Fix:** server-fetch with `fetchBlogBySlug` (extended to return `content`), `notFound()` on null, pass `content` as a prop so the H1 + article ship in initial HTML — mirroring the hotel pattern.
- **No `BlogPosting`/`Article` JSON-LD** *(sd-02)* — once the body is server-rendered, emit `BlogPosting` (`headline`, `image`, `datePublished`, `dateModified`, `author` Person, `publisher` Organization, `mainEntityOfPage`). Must not precede the rendering fix.
- **Duplicate `generateMetadata`** — both `page.tsx` and `layout.tsx` fetch + emit metadata (they merge; layout supplies canonical + robots). Consolidate during the redesign and **preserve the canonical**.
- **Byline/bio (M4)** and **HTML sanitization (M5)** also land with this redesign.

---

## 4. Owner-decision items (a choice, not a directive)

| Item | The decision | If yes | If no |
|---|---|---|---|
| **AI-crawler policy** *(L4)* | Visibility in ChatGPT / Common-Crawl-derived AI surfaces? **No effect on Google Search either way.** | Remove the GPTBot/CCBot `disallow` blocks in `robots.ts` and keep `llms.txt`. | Keep the blocks; consider dropping `llms.txt`. **Not auto-flipped.** |
| **Vercel env verification** *(L1)* | Confirm `NEXT_PUBLIC_API_URL` is set for **Production** on Vercel. | Sitemap + llms.txt populate. | Localhost fallback empties the dynamic sitemap — code fallback fixed regardless. |
| **Blog article** *(H3)* | Keep or rewrite the off-brand AI-template article? | Rewrite as people-first Natlaupa content. | Unpublish until rewritten — it currently harms site trust. |
| **About-page pricing placeholder** *(eeat-04)* | Visible yellow TODO banner + `[TODO …]` spans in `src/app/about/page.tsx` (≈ lines 337-339, 353, 368). | Replace with finalized customer-facing pricing/commission copy; remove the dev warning. | **YMYL/transactional trust copy — must be resolved before launch.** |
| **AI-concierge claim** *(eeat-05)* | Is there a genuine AI concierge product? | Surface the AI feature so the claim is substantiated. | Change `StructuredData.tsx` description to the real human-expert offering. |
| **FR-page `lang`** *(L2)* | Apply the `lang="fr"` a11y fix on legal pages? | Add `lang="fr"` to each FR page's top element. | Low-impact; safe to defer. |
| **Google Business Profile** *(L5)* | Create/verify a GBP for AI/local visibility. | — | — |

---

## 5. What's already compliant (PASS)

- **Titles** — descriptive, front-loaded, unique, `%s | Natlaupa` template, brand-led home title; no boilerplate/stuffing.
- **Meta descriptions** — unique and accurate per route, sensible lengths (122–219 chars), with dynamic fallbacks.
- **Canonicals on all money/marketing pages** — about, contact, hospitality, blog, offers, destinations, styles, countries, and every detail route self-canonicalize via co-located layouts (the 6 legal pages were the only exception — now fixed, H1).
- **Crawl eligibility** — `robots.ts` allows `/` for `*`, blocks only `/api`/`/admin`/`/_next`, doesn't block Googlebot/Google-Extended, declares the sitemap; every sampled route returns HTTP 200 with `index,follow`; no accidental `noindex`; `metadataBase` + `google-site-verification` present.
- **Snippet / AI-Overview eligibility** — `max-snippet:-1`, `max-image-preview:'large'`, `max-video-preview:-1` site-wide; Google's AI access intact. AI SEO *is* SEO — no separate AEO/GEO work needed.
- **Server-rendered detail pages** — hotel (1871 chars) and offer (3254 chars) detail pages server-fetch and prop their content; valid global JSON-LD ships in initial HTML; genuine browseable taxonomy with `notFound()` guards.
- **Images** — every `<img>`/`<Image>` has meaningful, entity-specific alt.
- **Links & URLs** — `next/link` real `<a href>` navigation, readable slug URLs, legacy-ID → slug 301/308s, outbound links use `rel="noopener noreferrer"`.
- **Redirects** — 8 legacy-slug → FR-route redirects, all single-hop permanent, no chains/loops.
- **Page experience** — `maximumScale:5` permits 500% zoom; GA loaded `afterInteractive`, fonts via `next/font` with `display:'swap'`, no render-blocking head scripts. *(Confirm CWV with PSI/CrUX field data once live.)*
- **Trust / E-E-A-T basics** — footer discloses legal entity, share capital, RCS number, registered address; real contact page; named team with bios on `/about`.
- **Spam** — no keyword stuffing, no cloaking/hidden text, no link schemes; `llms.txt` is an honest content mirror.
- **Consent & security** — Consent Mode v2 (default denied), security headers applied site-wide.

**Ruled out (false positive):** The bundled `scripts/seo_audit.py` reported a CRITICAL *"not served over HTTPS"* on every URL — an artifact of auditing `http://localhost`. Production is HTTPS; ignore.

---

## 6. Fix plan — execution status

| # | Item | Severity | Status |
|---|------|----------|--------|
| 1 | Per-page canonicals on 6 FR legal pages | HIGH | ✅ Fixed |
| 2 | De-gate 3 category hubs (hero+intro server-rendered) | HIGH | ✅ Fixed |
| 3 | Sitemap localhost fallback → prod API base | LOW (cheap) | ✅ Fixed |
| 4 | Remove non-functional `SearchAction` | MED | ✅ Fixed |
| 5 | De-duplicate org schema (single `@id`) | MED | ✅ Fixed |
| 6 | Add `Hotel`/`LodgingBusiness` JSON-LD | MED | ✅ Fixed |
| 7 | Add `BreadcrumbList` JSON-LD (detail/category) | MED | ✅ Fixed |
| — | Blog: server-render body, `BlogPosting`, byline, sanitize, metadata consolidation | HIGH/MED | ⏳ With redesign (§3) |
| — | Owner decisions (AI-crawler, Vercel env, article rewrite, About pricing, AI claim, `lang`, GBP) | — | 🔲 Owner (§4) |

---

*Key files:* `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/StructuredData.tsx`, `src/components/JsonLd.tsx` (new), `src/app/{cgu,mentions-legales,politique-de-confidentialite,politique-cookies,conditions-generales-service,mediation-consommation}/page.tsx`, `src/app/{destinations,styles,countries}/page.tsx`, `src/app/hotel/[id]/page.tsx`, `src/app/offer/[id]/page.tsx`, `src/app/destinations/[slug]/page.tsx`, `src/app/blog/[slug]/{page.tsx,layout.tsx,BlogDetailClient.tsx}`, `src/lib/server-api.ts`, `next.config.js`.
