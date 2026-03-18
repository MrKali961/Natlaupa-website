# Website Update Changes — Consolidated from Screenshots

## 1. Homepage — Experience Selector (`src/components/ExperienceSelector.tsx`)

### Mobile Version (lines ~540-750):
- Line 613: `pick your` → `Explore by` (destination label)
- Line 701: `pick your` → `Explore by` (mood/experience label)
- Line 710: `Mood` → `Experience`
- Line 721: `how to feel` → `what to experience`

### Desktop Version (lines ~780-960):
- Line 791: Keep "Pick Your Experience" as subheading
- Line 820: `pick your` → `Explore by` (destination)
- Line 897: `pick your` → `Explore by` (mood/experience)
- Line 923: `MOOD` → `EXPERIENCE`
- Line 940: `How` → `What`

### Destinations Section (line ~1001):
- `"Discover Your Next Chapter"` → `"Discover Your Next Destination"`

## 2. Homepage — MoodMatcher (`src/components/MoodMatcher.tsx`)

### Heading (line 313-314):
- Change: `What's Your <span>Mood</span>?` → `How Do You Want To <span>Feel</span>?`

### Body text (line 317):
- `Tell us how you want to feel, and we'll curate the perfect escape.` → `Tell us the experience you're looking for, and we'll curate the perfect escape.`

### Add short description (left side annotation):
- Add a brief intro paragraph above or beside the heading

## 3. Homepage — ValueProps Intro (`src/components/ValueProps.tsx`)

### Intro Section (lines 103-108) — "Change The Whole Thing":
- Current heading: `Natlaupa: Luxury one step closer`
- Current body: `YOU ARE UNIQUE. SO WILL YOUR EXPERIENCE...`
- BOTH need complete rewrite — the annotation says "Change The Whole Thing"

### Card 01 "Curated Quality" (line 15):
- Current: `We accept less than 1% of applicants. Every property in our collection is handpicked selected for its architectural significance, design pedigree, and service excellence.`
- New: `Each hotel is carefully selected for its uncompromising standards in architecture, interior design, and outstanding service.`

### Card 02 "Best Price Guarantee" (line 22):
- Current: `True luxury is transparent. We negotiate directly with properties to ensure you receive the most competitive rates available — without hidden premiums.`
- New: `True luxury is transparent. We work directly with properties, so you always receive the best available rates — without compromise.`

## 4. Become Angel Page (`src/app/become-angel/page.tsx`)

### Section heading (line 331):
- `Your Gateway to Luxury's Future` → `What Awaits Inside the Club`

### "Inside the Natlaupa Club" section (lines 431-451):
- Already exists and has correct content ✓

### "Your Journey Starts Now" section:
- Already removed ✓
