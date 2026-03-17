# Website Update Task List — bCX PDF

Generated: 2026-03-17
Source: `website/updates/Website Update bCX .pdf` (6 pages)

---

## SECTION A: WEBSITE CODE CHANGES

### A1. Hero Section (`src/components/Hero.tsx`)

| # | Type | Description | Line | Current | New |
|---|------|-------------|------|---------|-----|
| A1.1 | TEXT | Hero subtitle wording | ~50 | "...24/7 personalized **advice**, we bridge the gap between **you and** the world's..." | "...24/7 personalized **service**, we bridge the gap between **your desires and** the world's..." |
| A1.2 | NEW | Add supporting tagline below CTA button | after ~65 | *(does not exist)* | "Exclusive hotel rates, privileged upgrades, curated amenities, and 24/7 concierge support." |

---

### A2. Navigation (`src/components/Navbar.tsx` + `src/lib/constants.ts`)

| # | Type | Description | File/Line | Current | New |
|---|------|-------------|-----------|---------|-----|
| A2.1 | NEW | Add "Natlaupa Private" or "Membership" nav link | `constants.ts:16-20` | 3 nav links (Home, About Us, Contact) | Add new link — **NEEDS CLARIFICATION on exact label and target route** |
| A2.2 | STYLE | "Become an Angel" button fill | `Navbar.tsx:167` | Outlined: `border border-gold text-gold` | Filled: `bg-gold text-deepBlue` |

---

### A3. Experience Selector (`src/components/ExperienceSelector.tsx`)

| # | Type | Description | Line | Current | New |
|---|------|-------------|------|---------|-----|
| A3.1 | NEW | Add "Start your Journey" heading | ~762 (desktop), ~548 (mobile) | No heading between label and buttons | Insert `<h2>Start your Journey</h2>` between label and choice buttons |
| A3.2 | NEW | Add second subtitle line | ~765 | Only: "Choose how you'd like to explore our collection" | Add: "Some journeys begin with a place, others with a feeling." |
| A3.3 | NEW | Add DESTINATION description text | ~830 | Only "Where" label on hover | Add: "Find luxury hotels in the world's most iconic cities." |
| A3.4 | NEW | Add MOOD description text | ~897 | Only "How" label on hover | Add: "Discover hotels based on the experience you're looking for — wellness, romance, adventure and more." |

---

### A4. Value Props (`src/components/ValueProps.tsx`)

| # | Type | Description | Line | Current | New |
|---|------|-------------|------|---------|-----|
| A4.1 | TEXT | Sub-heading punctuation | ~106 | "YOU ARE UNIQUE**,** SO WILL YOUR EXPERIENCE." | "YOU ARE UNIQUE**.** SO WILL YOUR EXPERIENCE." |
| A4.2 | TEXT | Sub-heading travel sentence | ~106 | "Travel **with purpose, earn as you go, and elevate** every journey." | "Travel **more, for less – at any pace, on any schedule and beyond any** journey." |
| A4.3 | TEXT | Section 01 description wording | ~15 | "...is **rigorously vetted for** architectural significance..." | "...is **handpicked selected for its** architectural significance..." |
| A4.4 | TEXT | Section 02 punctuation | ~22 | "...rates available**,** without hidden premiums." | "...rates available **—** without hidden premiums." |
| A4.5 | NEW | Gold highlight box for Section 01 | after ~15 | *(does not exist)* | Add highlight: "Only the most exceptional properties join our collection." + paragraph: "Each hotel is carefully selected for its architectural character, design pedigree, and commitment to outstanding service." — **NEEDS CLARIFICATION: is this new visual content or just PDF annotation?** |
| A4.6 | NEW | Gold highlight box for Section 02 | after ~22 | *(does not exist)* | Add highlight: "Luxury should be transparent." + paragraph: "By working directly with our partner properties, we ensure you receive the most competitive rates available — without hidden premiums." — **NEEDS CLARIFICATION** |

---

### A5. Concierge Recommendations (`src/components/ConciergeRecommendations.tsx`)

| # | Type | Description | Line | Current | New |
|---|------|-------------|------|---------|-----|
| A5.1 | TEXT | "This Week's Insights" label 1 | ~416 | "Searches up" | "Destination of the week" |
| A5.2 | TEXT | "This Week's Insights" label 2 | ~419 | "Top search" | "Top review" |
| A5.3 | TEXT | "This Week's Insights" label 3 | ~422 | "Avg. stay" | "Avg. rate" |

> **Note:** These label changes may also require backend/API changes to the `insights` endpoint to return the correct data fields. See Section B.

---

### A6. Mood Matcher (`src/components/MoodMatcher.tsx`)

| # | Type | Description | Line | Current | New |
|---|------|-------------|------|---------|-----|
| A6.1 | TEXT | Fallback mood card names | ~48-122 | "Romantic Escape", "Adventure Seeker", "Cultural Immersion", "Pure Relaxation" | "Riviera Lifestyle", "Wellness & Rejuvenation", "Global Power Hub", "Timeless Elegance" |
| A6.2 | TEXT | Section subtitle wording | ~317 | "Tell us how you want to feel, and we'll curate the perfect escape." | "Tell us the experience you're looking for, and we'll curate the perfect escape." — **OR keep both lines. NEEDS CLARIFICATION** |

---

### A7. Become an Angel Page (`src/app/become-angel/page.tsx`)

| # | Type | Description | Line | Current | New |
|---|------|-------------|------|---------|-----|
| A7.1 | TEXT | Growth perk description | ~37 | "...to elevate properties **into icons** and maximize..." | "...to elevate **properties/income** and maximize..." |
| A7.2 | TEXT | Legacy perk — name + wording | ~43 | "...Dr. Serge **Chamellan** to shape **enduring** impact..." | "...Dr. Serge **Osumanov** of a **single-earning** impact..." |
| A7.3 | TEXT | Section heading | ~350 | "Your Gateway to Luxury's Future" | "What Awaits Inside the club" — **NEEDS CLARIFICATION: PDF shows both titles** |
| A7.4 | TEXT | Annual Fee description | ~51 | "$60 per year" | "A symbolic annual contribution that supports the Circle and its initiatives." |
| A7.5 | TEXT | Annual Fee note | ~52 | "Open to verified mid-level hospitality professionals only" | "Open to individuals passionate about hospitality, luxury travel, and meaningful connections." |
| A7.6 | TEXT | Member Expectations wording | ~58 | "...professionalism, **maintain strict** confidentiality..." | "...professionalism, **respect** confidentiality..." |
| A7.7 | NEW+STYLE | Add "Natlaupa Private Club" gold sub-heading | between ~293-295 | *(does not exist)* | Insert gold-colored sub-heading "Natlaupa Private Club" between the h1 and the subtitle, styled with `text-gold` |
| A7.8 | NEW | Add "Inside the Natlaupa Club" section | after Membership Details | *(does not exist)* | New section with: title "Inside the Natlaupa Club", intro text, **Angels** role description, **Senior Angels** role description (see PDF page 6 for full text) |
| A7.9 | REMOVAL | Remove "Your Journey Starts Now" section | ~503-538 | Entire "How It Works" section with 3 steps (Connect, Collaborate, Elevate) | **DELETE entire section** + remove dead `steps` array (~62-81) |

---

## SECTION B: DATA / BACKEND CHANGES

These changes are NOT website code changes — they require updates to backend data, API responses, or the database.

| # | Type | Description | Affected Area |
|---|------|-------------|---------------|
| B1 | DATA | Mood category names need to match PDF | The PDF shows mood cards named "Riviera Lifestyle", "Wellness & Rejuvenation", "Global Power Hub", "Timeless Elegance" — these are fetched from the backend `/hotel-styles/mood-matcher` endpoint. The backend data needs to match. |
| B2 | DATA | New mood categories from sticky notes | The PDF annotations suggest adding new mood categories: "Team Retreat", "Love & Romance", "Art & Culture" (and possibly others). These need to be added as backend mood/style entries. |
| B3 | DATA | Insights API endpoint changes | The label changes in A5.1-A5.3 ("Destination of the week", "Top review", "Avg. rate") likely need matching data fields from the insights API. Currently returns `searchTrend`, `topSearch`, `avgStay` — may need new fields like `destinationOfWeek`, `topReview`, `avgRate`. |
| B4 | DATA | Seasonal tab content — crossed out annotation | PDF page 4 shows a red scribble crossing out content in the "This Season" tab area. The replacement content is NOT specified. **NEEDS CLARIFICATION from client on what replaces it.** |

---

## SECTION C: ITEMS NEEDING CLARIFICATION

Before implementation, the following items need client input:

| # | Question | Related Task |
|---|----------|-------------|
| C1 | What should the new nav link be labeled? ("Natlaupa Private" / "Membership" / other?) And what page should it link to? | A2.1 |
| C2 | Are the gold highlight boxes in Sections 01 and 02 of ValueProps meant to be added as new visual elements on the website, or are they just PDF annotation styling? | A4.5, A4.6 |
| C3 | Should the MoodMatcher subtitle be replaced entirely or should both lines appear? | A6.2 |
| C4 | Should "Your Gateway to Luxury's Future" heading be renamed to "What Awaits Inside the club", or are both titles shown for different sub-sections? | A7.3 |
| C5 | What content should replace the crossed-out seasonal tab text on the Concierge Recommendations section? | B4 |

---

## PRIORITY ORDER (suggested)

### Quick Wins (text swaps, < 5 min each)
1. A1.1 — Hero subtitle words
2. A4.1 — Punctuation fix (comma → period)
3. A4.2 — Travel sentence rewrite
4. A4.3 — "rigorously vetted" → "handpicked selected"
5. A4.4 — Comma → em dash
6. A7.4 — Annual Fee text
7. A7.5 — Annual Fee note
8. A7.6 — Member Expectations wording
9. A7.1 — Growth perk text
10. A7.2 — Legacy perk name + text

### Medium Effort (new content / style changes)
11. A7.9 — Remove "Your Journey Starts Now" section
12. A2.2 — Button style change
13. A1.2 — Hero supporting tagline
14. A7.7 — Gold "Natlaupa Private Club" sub-heading
15. A5.1-A5.3 — Insights sidebar labels
16. A6.1 — Fallback mood names
17. A6.2 — MoodMatcher subtitle

### Larger Changes (new sections / multi-location edits)
18. A3.1-A3.4 — ExperienceSelector headings + descriptions (both mobile + desktop)
19. A7.8 — New "Inside the Natlaupa Club" section
20. A2.1 — New nav link (after clarification)

### Backend/Data Changes
21. B1 — Backend mood category names
22. B2 — New mood categories
23. B3 — Insights API fields
24. B4 — Seasonal tab replacement (after clarification)
