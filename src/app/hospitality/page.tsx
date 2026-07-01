// SERVER component — all copy, the FAQ text and the JSON-LD ship in the initial
// HTML (this is the primary outbound-prospecting landing page, so it must be
// fully indexable). Interactivity is isolated to three client islands:
// HotelPartnerLeadForm (#apply), StickyHotelCTA, HospitalityAnalytics.
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  ChevronDown,
  CalendarClock,
  ChevronRight,
  Layout,
  Search,
  MousePointerClick,
  Star,
  ClipboardCheck,
  ShieldCheck,
  Map,
  Bot,
  CreditCard,
  Mail,
  MessageSquare,
} from "lucide-react";
import { JsonLd, breadcrumbList, faqPage, type FaqItem } from "@/components/JsonLd";
import Footer from "@/components/Footer";
import HotelPartnerLeadForm from "@/components/hospitality/HotelPartnerLeadForm";
import StickyHotelCTA from "@/components/hospitality/StickyHotelCTA";
import HospitalityAnalytics from "@/components/hospitality/HospitalityAnalytics";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";
const bookHref = CALENDLY_URL || "#apply";
const bookExternal = Boolean(CALENDLY_URL);
const bookProps = bookExternal
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

const HERO_BULLETS = [
  "Where guests drop off, discovery → booking",
  "How visible you are in search & on AI assistants",
  "How much margin OTAs are taking",
  "A ranked, sourced plan to recover it",
];

// What the audit surfaces — leaks, not "challenges of the industry".
const LEAKS = [
  "A dated or slow site that bounces arrivals before they book",
  "Invisible in Google Maps and in local search",
  "Never recommended when guests ask an AI assistant",
  "Most bookings — and 15–25% commission — going to OTAs",
  "A clunky booking flow that sends guests off-site",
  "Great reviews the site never puts in front of the guest",
];

// The 4 pillars (from AI-DP-Audit/methodology/02-DIMENSIONS.md).
const PILLARS = [
  {
    icon: Layout,
    label: "Foundation",
    question: "Can guests find you and trust what they land on?",
    dimensions: ["Website & UX", "Technical health & performance", "Brand & trust"],
  },
  {
    icon: Search,
    label: "Visibility",
    question: "Can guests discover you in the first place?",
    dimensions: ["Search / SEO & multilingual", "Local & Maps", "AI / LLM discoverability"],
  },
  {
    icon: MousePointerClick,
    label: "Conversion",
    question: "Do visitors become booked guests — profitably?",
    dimensions: [
      "Direct booking & conversion",
      "Distribution & rate strategy",
      "F&B reservation",
      "Owned audience: email / CRM",
    ],
  },
  {
    icon: Star,
    label: "Authority",
    question: "Do people trust you and talk about you?",
    dimensions: ["Reviews & reputation", "Social & content", "Analytics & measurement"],
  },
];

// The 7-phase pipeline (AI-DP-Audit/methodology/00-AUDIT-PATH.md), ending on the
// mandatory human verification gate — the credibility selling point.
const PIPELINE = [
  { phase: "01", title: "Intake", desc: "We confirm your site, markets and property type, with your authorization." },
  { phase: "02", title: "Gather", desc: "Public-first evidence: crawl, search, Maps, reviews and social — no account access needed." },
  { phase: "03", title: "Score", desc: "Every dimension is banded against observable criteria; scores are computed, never hand-typed." },
  { phase: "04", title: "Map flows", desc: "We trace the guest journey and booking funnel stage by stage to find where you leak." },
  { phase: "05", title: "Findings", desc: "Per dimension: current state, strengths, weaknesses and impact — each backed by sourced evidence." },
  { phase: "06", title: "Recommend", desc: "Every gap gets a fix, prioritized by effort and impact, rolled into a ranked next-steps plan." },
  { phase: "07", title: "Render", desc: "A cinematic, on-brand report assembled from the verified findings." },
];

// SOLUTION CARDS — one per proposal id B1, B4, C1, C3, C6, D1, D3
// (titles + one-line benefits synthesized from AI-DP-Audit/report-app/data/proposal.ts).
const SOLUTIONS = [
  {
    id: "B1",
    icon: Map,
    title: "Own Google Maps & local search",
    benefit: "Claim and optimize the highest-intent discovery surface in hospitality — before a competitor takes those guests for free.",
  },
  {
    id: "B4",
    icon: Bot,
    title: "Get recommended by AI assistants",
    benefit: "Make your property discoverable when guests ask ChatGPT or Gemini for a hotel like yours — our AI-first edge few competitors even audit.",
  },
  {
    id: "C1",
    icon: CreditCard,
    title: "Shift bookings direct, recover margin",
    benefit: "A direct-booking engine and best-rate-direct incentive claw back the 15–25% commission OTAs take on every stay.",
  },
  {
    id: "C3",
    icon: MousePointerClick,
    title: "A frictionless booking flow",
    benefit: "An embedded booking engine, payments and concierge fallback turn more lookers into booked guests instead of off-site drop-offs.",
  },
  {
    id: "C6",
    icon: MessageSquare,
    title: "An always-on AI concierge",
    benefit: "Answer guest questions 24/7 in any language and route ready-to-book guests straight to direct — instead of losing them after hours.",
  },
  {
    id: "D1",
    icon: Star,
    title: "Rebuild reviews & reputation",
    benefit: "A structured response and post-stay capture program recovers your rating and your Maps/OTA ranking.",
  },
  {
    id: "D3",
    icon: Mail,
    title: "Put your proof where guests book",
    benefit: "Surface the trust you've already earned next to a frictionless CTA — the fastest-ROI fix in the audit.",
  },
];

const OUTCOMES = [
  "A clear, graded picture of where you stand",
  "The exact points where you lose bookings",
  "Recovered margin from direct bookings",
  "Stronger visibility in search and on Maps",
  "Discoverability on AI assistants",
  "Sourced evidence behind every finding",
  "A ranked, do-this-first action plan",
  "A human-verified report you can trust",
];

const COMPARE = {
  agency: ["Advertising focused", "Campaign-driven", "Opinion, not evidence", "No human verification"],
  natlaupa: [
    "Evidence-backed assessment",
    "Revenue-oriented recommendations",
    "13 dimensions across 4 pillars",
    "Hospitality-specific scoring",
    "Human-verified before you see it",
  ],
};

const FAQ: FaqItem[] = [
  {
    question: "What does the audit assess?",
    answer:
      "Your full digital presence across 4 pillars and 13 dimensions — foundation (website, performance, trust), visibility (SEO, local/Maps, AI discoverability), conversion (direct booking, distribution & rate, owned audience) and authority (reviews, social, measurement).",
  },
  {
    question: "Do you need access to our analytics or accounts?",
    answer:
      "No. The standard audit is public-first — crawl, search, Maps, reviews and social signals — so we can produce it without any account access. Granted analytics access is an optional deep-dive upgrade.",
  },
  {
    question: "How long does it take?",
    answer:
      "Typical turnaround is 48 to 72 hours from intake to a verified report link.",
  },
  {
    question: "Is the report human-verified?",
    answer:
      "Yes. Before any link is shared, a human fact-checks every critical finding against your live site, enforces evidence recency and drops false positives. The audit is never auto-published.",
  },
  {
    question: "Are we obligated to anything?",
    answer:
      "No. The audit is a standalone assessment. You decide what, if anything, to act on once you have the findings.",
  },
  {
    question: "Is this just a generic website checkup?",
    answer:
      "No. Hospitality-revenue dimensions — distribution & rate strategy, F&B reservation, multilingual correctness and photography quality — plus business-type weighting are what separate it from a generic site audit.",
  },
];

export default function Hospitality() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "AI Digital Presence Audit", path: "/hospitality" },
          ]),
          faqPage(FAQ),
        ]}
      />

      <main className="bg-deepBlue min-h-screen">
        {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD */}
        <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32">
          <ol className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-[0.15em]">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <ChevronRight size={12} className="text-slate-700" />
            <li className="text-slate-400" aria-current="page">AI Digital Presence Audit</li>
          </ol>
        </nav>

        {/* SECTION 1 — HERO (two columns; #apply lead form lives here, above the fold on desktop) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-14 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-6">
                AI Digital Presence Audit
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] text-white mb-6">
                Find Out Exactly Where Your Hotel Is Losing Guests
              </h1>
              <p className="text-lg text-slate-300 font-light leading-relaxed mb-8 max-w-xl">
                A dated or unoptimized presence bounces 40–60% of arrivals before they book.
                Our AI Digital Presence Audit grades your hotel across discovery, search and
                booking, exposes where the bookings leak, and hands you a ranked plan to
                recover them — every finding human-verified.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {HERO_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-slate-200 text-sm">
                    <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 mb-8 text-slate-300 text-sm">
                <ShieldCheck size={18} className="text-gold flex-shrink-0" />
                <span>Public-first &middot; human-verified &middot; no obligation</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#apply"
                  data-cta="hero_request_audit"
                  className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-softGold transition-colors"
                >
                  Request Your Audit
                  <ArrowRight size={18} />
                </a>
                <a
                  href={bookHref}
                  {...bookProps}
                  data-cta="hero_book_call"
                  className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
                >
                  <CalendarClock size={18} />
                  Book a 15-Minute Call
                </a>
              </div>
            </div>

            {/* Lead form — anchor target; scroll-margin clears the fixed navbar */}
            <div id="apply" className="scroll-mt-28 lg:scroll-mt-32">
              <HotelPartnerLeadForm />
            </div>
          </div>
        </section>

        {/* SECTION 2 — Where hotels lose guests */}
        <section className="border-t border-white/10 bg-midnight/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 text-center">
              The Leaks Most Hotels Can&rsquo;t See
            </h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
              Bookings rarely vanish at one obvious step. The audit makes the hidden ones visible:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LEAKS.map((c) => (
                <div key={c} className="flex items-start gap-3 p-5 border border-white/10 bg-white/[0.02]">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold/70 flex-shrink-0" />
                  <span className="text-slate-300">{c}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-300 text-center max-w-2xl mx-auto mt-12 leading-relaxed">
              The audit quantifies each one with sourced evidence — so you act on facts,
              not guesses.
            </p>
          </div>
        </section>

        {/* SECTION 3 — What we assess (4 pillars / 13 dimensions) */}
        <section className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">What We Assess</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                4 Pillars, 13 Dimensions
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Your entire digital presence, scored on the same engine a resort, a riad and a
                café run through — with the emphasis that fits your property type.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PILLARS.map((p) => (
                <div
                  key={p.label}
                  className="p-6 sm:p-8 border border-white/10 bg-white/[0.02] hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <p.icon className="text-gold" size={20} />
                    </div>
                    <h3 className="font-serif text-xl text-white">{p.label}</h3>
                  </div>
                  <p className="text-slate-400 text-sm italic mb-5">{p.question}</p>
                  <ul className="space-y-2.5">
                    {p.dimensions.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-slate-200 text-sm">
                        <Check size={16} className="text-gold/80 flex-shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — How it works (7-phase pipeline + human verification gate) */}
        <section className="border-t border-white/10 bg-midnight/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">How It Works</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                A Documented Path, Run the Same Way Every Time
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Not a freestyle opinion. An AI follows a seven-phase pipeline; a human verifies
                it before you ever see a link. Typical turnaround: 48–72 hours.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PIPELINE.map((step) => (
                <div key={step.phase} className="p-6 border border-white/10 bg-white/[0.02]">
                  <span className="font-serif text-2xl text-gold/80 block mb-3">{step.phase}</span>
                  <h3 className="font-serif text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* The human verification gate — the credibility selling point. */}
            <div className="mt-6 p-6 sm:p-8 border border-gold/30 bg-gold/[0.04] flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="text-gold" size={24} />
              </div>
              <div>
                <span className="text-gold/80 text-[11px] uppercase tracking-[0.25em] block mb-2">Human gate</span>
                <h3 className="font-serif text-xl text-white mb-2">
                  Verify &mdash; required before you see it
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                  A person fact-checks every critical finding against your live site, enforces
                  evidence recency and drops false positives, then signs off. No audit is ever
                  auto-published. Every audit is human-verified before you see it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — What we fix (solution cards: B1, B4, C1, C3, C6, D1, D3) */}
        <section className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">What We Fix</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Every Gap Maps to a Fix
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                The audit doesn&rsquo;t just diagnose. Each finding routes to a concrete fix,
                framed around the bookings and margin it recovers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SOLUTIONS.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border border-white/10 bg-white/[0.02] hover:border-gold/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                    <item.icon className="text-gold" size={20} />
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — What you walk away with */}
        <section className="border-t border-white/10 bg-midnight/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">What You Walk Away With</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white">
                A Clear Read and a Plan to Act On
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 max-w-3xl mx-auto">
              {OUTCOMES.map((o) => (
                <div key={o} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <Check size={18} className="text-gold flex-shrink-0" />
                  <span className="text-slate-200">{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — intentionally omitted until real client results exist.
            Do NOT fabricate quotes; add this section once the first audit outcomes are in. */}

        {/* SECTION 7 — Why hotels choose Natlaupa (comparison) */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-14">
              Why Hotels Choose Natlaupa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border border-white/10 bg-white/[0.01]">
                <h3 className="text-slate-400 text-sm uppercase tracking-[0.25em] mb-6">Traditional Agency</h3>
                <ul className="space-y-4">
                  {COMPARE.agency.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-slate-400">
                      <X size={18} className="text-slate-600 flex-shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 border border-gold/30 bg-gold/[0.04]">
                <h3 className="text-gold text-sm uppercase tracking-[0.25em] mb-6">Natlaupa</h3>
                <ul className="space-y-4">
                  {COMPARE.natlaupa.map((n) => (
                    <li key={n} className="flex items-start gap-3 text-slate-100">
                      <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — FAQ (native <details>; answers always in the HTML) */}
        <section className="border-t border-white/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div>
              {FAQ.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-white/10 py-5"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-white font-serif text-lg md:text-xl">
                    <span>{item.question}</span>
                    <ChevronDown
                      size={20}
                      className="text-gold flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="text-slate-400 leading-relaxed mt-3 pr-8">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9 — Final CTA */}
        <section className="border-t border-white/10 bg-gradient-to-b from-midnight/40 to-deepBlue">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <span className="text-gold text-xs uppercase tracking-[0.35em] block mb-6">The Audit</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6">
              See Where Your Hotel Is Losing Guests
            </h2>
            <p className="text-slate-300 font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Request your AI Digital Presence Audit and get a human-verified, evidence-backed
              report of exactly where the bookings leak — and the ranked plan to recover them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#apply"
                data-cta="final_request_audit"
                className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-10 py-5 font-bold uppercase tracking-[0.15em] text-sm hover:bg-softGold transition-colors"
              >
                Request Your Audit
                <ArrowRight size={18} />
              </a>
              <a
                href={bookHref}
                {...bookProps}
                data-cta="final_book_call"
                className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-10 py-5 font-bold uppercase tracking-[0.15em] text-sm hover:bg-gold hover:text-deepBlue transition-colors"
              >
                <CalendarClock size={18} />
                Book a 15-Minute Call
              </a>
            </div>
            <p className="text-slate-400 text-xs mt-8 max-w-md mx-auto leading-relaxed">
              Public-first and human-verified. No account access required, no obligation.
            </p>
          </div>
        </section>
      </main>

      <StickyHotelCTA />
      <HospitalityAnalytics />
      <Footer />
    </>
  );
}
