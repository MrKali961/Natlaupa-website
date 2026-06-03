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
  Search,
  BarChart3,
  LineChart,
  CalendarCheck,
  Sparkles,
  Network,
  Eye,
  ClipboardList,
  ChevronRight,
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

// Honest, static scarcity — the program caps at 5 founding partners. We do NOT
// render a fake decreasing "X remaining" counter (spec: "only if accurate").
const FOUNDING_PLACES = 5;

const HERO_BULLETS = [
  "Digital Presence Audit",
  "Competitive Benchmark Analysis",
  "Pricing & Revenue Review",
  "Monthly Strategic Recommendations",
  "Access to Natlaupa Business Network",
  "Featured Partner Visibility",
];

const CHALLENGES = [
  "Dependence on OTAs",
  "Limited direct booking growth",
  "Increasing pricing pressure",
  "Strong local competition",
  "Lack of premium customer acquisition channels",
  "Limited business networking opportunities",
];

const APPROACH = [
  "Commercial strategy",
  "Revenue optimization",
  "Market positioning analysis",
  "Business networking",
  "Premium audience exposure",
];

const INCLUDED = [
  { icon: Search, title: "Digital Presence Audit", desc: "Complete review of online visibility and positioning." },
  { icon: BarChart3, title: "Competitive Analysis", desc: "Benchmarking against direct competitors." },
  { icon: LineChart, title: "Pricing & Revenue Review", desc: "Identification of optimization opportunities." },
  { icon: LineChart, title: "Revenue Management Recommendations", desc: "Actionable revenue improvement suggestions." },
  { icon: CalendarCheck, title: "Monthly Strategic Session", desc: "Dedicated advisory meeting." },
  { icon: Eye, title: "Natlaupa Community Visibility", desc: "Exposure to members and partners." },
  { icon: Network, title: "Angels Club Access", desc: "Relevant introductions and networking opportunities." },
  { icon: ClipboardList, title: "Priority Action Reporting", desc: "Simple and actionable recommendations." },
];

const OUTCOMES = [
  "Increased qualified visibility",
  "More direct bookings",
  "Improved pricing strategy",
  "Better occupancy management",
  "Revenue optimization opportunities",
  "Competitive differentiation",
  "Premium business exposure",
  "Access to strategic relationships",
];

const FOUNDING_BENEFITS = [
  "Official Founding Hotel Partner status",
  "Preferential founding pricing",
  "Featured visibility during the first 6 months",
  "Dedicated partner interview",
  "Priority access to future Natlaupa initiatives",
  "Early access to events and collaborations",
];

const PRICING = [
  { name: "First Month Trial", price: "99€", unit: "", note: "No commitment", featured: true },
  { name: "Founding Partners 1–3", price: "290€", unit: "/month", note: "Ongoing founding rate", featured: false },
  { name: "Founding Partners 4–5", price: "490€", unit: "/month", note: "Ongoing founding rate", featured: false },
];

const COMPARE = {
  agency: ["Advertising focused", "Campaign-driven", "Limited network access"],
  natlaupa: [
    "Strategic partnership",
    "Revenue-oriented recommendations",
    "Premium business network",
    "Hospitality-focused advisory",
    "Long-term visibility opportunities",
  ],
};

const FAQ: FaqItem[] = [
  { question: "Is Natlaupa a hotel marketing agency?", answer: "No. Natlaupa operates as a strategic growth and business development partner." },
  { question: "Is there a long-term contract?", answer: "No. Hotels may discontinue after the first month." },
  { question: "What happens during the trial month?", answer: "Audit, analysis, recommendations and strategic review." },
  { question: "What types of hotels are eligible?", answer: "Independent hotels, boutique hotels and premium establishments." },
  { question: "How many founding partners are available?", answer: "Only 5." },
  { question: "Is this suitable for hotel groups?", answer: "Yes, subject to review and availability." },
];

export default function Hospitality() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Founding Hotel Partner Program", path: "/hospitality" },
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
            <li className="text-slate-400" aria-current="page">Founding Hotel Partner Program</li>
          </ol>
        </nav>

        {/* SECTION 1 — HERO (two columns; #apply lead form lives here, above the fold on desktop) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-14 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-6">
                Founding Hotel Partner Program
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] text-white mb-6">
                Increase Your Hotel’s Visibility, Direct Bookings and Commercial Performance
              </h1>
              <p className="text-lg text-slate-300 font-light leading-relaxed mb-8 max-w-xl">
                Join the Founding Hotel Partner Program and discover Natlaupa’s unique approach
                combining strategic advisory, revenue optimization and premium business networking.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {HERO_BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-slate-200 text-sm">
                    <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-serif text-4xl text-white">99€</span>
                <span className="text-slate-300 text-sm">for the first month</span>
                <span className="text-gold/80 text-xs uppercase tracking-[0.2em] border-l border-white/15 pl-3">
                  No commitment
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={bookHref}
                  {...bookProps}
                  data-cta="hero_book_call"
                  className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-softGold transition-colors"
                >
                  <CalendarClock size={18} />
                  Book a 15-Minute Discovery Call
                </a>
                <a
                  href="#apply"
                  data-cta="hero_request_details"
                  className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-deepBlue transition-colors"
                >
                  Request Program Details
                </a>
              </div>
            </div>

            {/* Lead form — anchor target; scroll-margin clears the fixed navbar */}
            <div id="apply" className="scroll-mt-28 lg:scroll-mt-32">
              <HotelPartnerLeadForm />
            </div>
          </div>
        </section>

        {/* SECTION 2 — Hospitality Challenges */}
        <section className="border-t border-white/10 bg-midnight/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 text-center">
              Challenges Facing Independent Hotels Today
            </h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
              Independent hotels often face:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHALLENGES.map((c) => (
                <div key={c} className="flex items-start gap-3 p-5 border border-white/10 bg-white/[0.02]">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold/70 flex-shrink-0" />
                  <span className="text-slate-300">{c}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-300 text-center max-w-2xl mx-auto mt-12 leading-relaxed">
              Natlaupa helps address these challenges through strategic analysis and
              network-driven opportunities.
            </p>
          </div>
        </section>

        {/* SECTION 3 — Our Approach */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
            <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">Our Approach</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">More Than Marketing</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-12">Natlaupa combines:</p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {APPROACH.map((a) => (
                <span
                  key={a}
                  className="px-5 py-2.5 border border-gold/30 text-slate-200 text-sm rounded-full bg-gold/[0.04]"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="font-serif text-xl md:text-2xl text-white max-w-2xl mx-auto leading-snug">
              Our objective is simple: help hotels become more visible, more attractive and more
              commercially effective.
            </p>
          </div>
        </section>

        {/* SECTION 4 — What Is Included */}
        <section className="border-t border-white/10 bg-midnight/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">What Is Included</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white">
                What You Receive During the Program
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {INCLUDED.map((item) => (
                <div
                  key={item.title}
                  className="p-6 border border-white/10 bg-white/[0.02] hover:border-gold/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                    <item.icon className="text-gold" size={20} />
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — Expected Outcomes */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">Expected Outcomes</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white">
                Designed to Help Hotels Achieve
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

        {/* TESTIMONIALS — intentionally omitted until real founding-partner results exist.
            Do NOT fabricate quotes; add this section once the first partner outcomes are in. */}

        {/* SECTION 6 — Founding Hotel Partner Benefits */}
        <section className="border-t border-white/10 bg-gradient-to-b from-midnight/40 to-deepBlue">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/40 rounded-full text-gold text-[11px] uppercase tracking-[0.25em] mb-6">
                <Sparkles size={13} /> Limited to {FOUNDING_PLACES} founding partners
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                Limited Founding Partner Opportunity
              </h2>
              <p className="text-slate-400">Only {FOUNDING_PLACES} hotels will be selected.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {FOUNDING_BENEFITS.map((b) => (
                <div key={b} className="flex items-start gap-3 p-5 border border-gold/15 bg-gold/[0.03]">
                  <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7 — Pricing */}
        <section className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-4">
              <span className="text-gold text-xs uppercase tracking-[0.3em] block mb-4">Launch Pricing</span>
              <h2 className="font-serif text-3xl md:text-4xl text-white">Test Natlaupa for 30 days — 99€</h2>
            </div>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
              Start with a 30-day trial at 99€. Continue at your founding monthly rate — or simply stop.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING.map((p) => (
                <div
                  key={p.name}
                  className={`relative p-8 border flex flex-col ${
                    p.featured ? "border-gold bg-gold/[0.05]" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-8 bg-gold text-deepBlue text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1">
                      Start here
                    </span>
                  )}
                  <h3 className="text-slate-300 text-sm uppercase tracking-widest mb-4">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-serif text-5xl text-white">{p.price}</span>
                    {p.unit && <span className="text-slate-400 text-sm">{p.unit}</span>}
                  </div>
                  <p className="text-gold/80 text-sm mb-8">{p.note}</p>
                  {p.featured && (
                    <a
                      href={bookHref}
                      {...bookProps}
                      data-cta="pricing_trial"
                      className="mt-auto inline-flex items-center justify-center gap-2 bg-gold text-deepBlue px-6 py-3.5 font-bold uppercase tracking-widest text-xs hover:bg-softGold transition-colors"
                    >
                      Start the trial <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm text-center mt-10 max-w-xl mx-auto leading-relaxed">
              Participation can be stopped at any time after the first month. No long-term
              commitment required.
            </p>
          </div>
        </section>

        {/* SECTION 8 — Why Hotels Join Natlaupa (comparison) */}
        <section className="border-t border-white/10 bg-midnight/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <h2 className="font-serif text-3xl md:text-4xl text-white text-center mb-14">
              Why Hotels Join Natlaupa
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

        {/* SECTION 9 — FAQ (native <details>; answers always in the HTML) */}
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

        {/* SECTION 10 — Final CTA */}
        <section className="border-t border-white/10 bg-gradient-to-b from-midnight/40 to-deepBlue">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <span className="text-gold text-xs uppercase tracking-[0.35em] block mb-6">The Founding Program</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6">
              Let’s Explore Whether Natlaupa Can Support Your Hotel
            </h2>
            <p className="text-slate-300 font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Book a short discovery call and learn how the Founding Hotel Partner Program can help
              improve visibility, commercial performance and business opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={bookHref}
                {...bookProps}
                data-cta="final_book_call"
                className="inline-flex items-center justify-center gap-3 bg-gold text-deepBlue px-10 py-5 font-bold uppercase tracking-[0.15em] text-sm hover:bg-softGold transition-colors"
              >
                <CalendarClock size={18} />
                Book a 15-Minute Call
              </a>
              <a
                href="#apply"
                data-cta="final_request_details"
                className="inline-flex items-center justify-center gap-3 border border-gold text-gold px-10 py-5 font-bold uppercase tracking-[0.15em] text-sm hover:bg-gold hover:text-deepBlue transition-colors"
              >
                Request Program Details
              </a>
            </div>
            <p className="text-slate-400 text-xs mt-8 max-w-md mx-auto leading-relaxed">
              Test Natlaupa for 30 days for only 99€. No commitment.
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
