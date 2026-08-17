"use client";

// Client island: the audit-request form (anchor target #apply). POSTs the lead
// directly to the server's public `audit-requests` create endpoint, which feeds
// the AI Digital Presence Audit pipeline. message is defaulted when blank so the
// API never 400s on a short quick-enquiry. WhatsApp is an alternate submit path.
// A `generate_lead` GA event fires on success.
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { track } from "@/lib/analytics";

const API_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://natlaupa.theelitessolutions.cloud/api/v1";

const DEFAULT_MESSAGE =
  "AI Digital Presence Audit — request for an audit.";

interface ValidationError {
  field: string;
  message: string;
}
interface ErrorResponse {
  code: string;
  message: string;
  details?: ValidationError[];
}

export default function HotelPartnerLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    hotelName: "",
    email: "",
    phone: "",
    url: "",
    message: "",
    // Honeypot: hidden from humans, must stay empty. The server silently drops
    // any submission where this is filled (see audit-requests controller).
    website2: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const payload = () => ({
    contactName: form.contactName,
    hotelName: form.hotelName,
    email: form.email,
    // Phone is optional; the server's phone regex rejects an empty string, so
    // omit the field entirely when blank rather than sending "".
    ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    url: form.url,
    message: form.message.trim() || DEFAULT_MESSAGE,
    website2: form.website2,
    consent,
  });

  const post = async () => {
    const response = await fetch(`${API_URL}/audit-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload()),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw (
        data?.error ?? {
          code: "APP",
          message: "Something went wrong. Please try again or use WhatsApp.",
        }
      );
    }
  };

  // Backend may return {code,message,details}, a bare string, or fetch may reject
  // with a TypeError (network/CORS). Always surface a non-empty, sane message.
  const normalizeError = (err: unknown): ErrorResponse => {
    if (err instanceof Error) {
      return { code: "NETWORK", message: "Something went wrong. Please try again or use WhatsApp." };
    }
    if (
      err &&
      typeof err === "object" &&
      typeof (err as ErrorResponse).message === "string" &&
      (err as ErrorResponse).message
    ) {
      return err as ErrorResponse;
    }
    if (typeof err === "string" && err.trim()) {
      return { code: "APP", message: err };
    }
    return { code: "APP", message: "Something went wrong. Please try again or use WhatsApp." };
  };

  const reset = () =>
    setForm({ contactName: "", hotelName: "", email: "", phone: "", url: "", message: "", website2: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError({ code: "CONSENT", message: "Veuillez accepter le traitement de vos données pour continuer." });
      return;
    }
    setIsSubmitting(true);
    try {
      await post();
      track("generate_lead", { form: "hotel_partner", method: "form" });
      setSubmitted(true);
      reset();
      setConsent(false);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp is the resilient fallback: open it regardless of the backend POST
  // (the wa.me message carries the full lead), so an API/CORS outage — the very
  // case this fallback exists for — never blocks it. Backend capture is
  // fire-and-forget. window.open stays in the click tick (no await before it)
  // so popup blockers don't trip.
  const handleWhatsApp = () => {
    setError(null);
    if (!consent) {
      setError({ code: "CONSENT", message: "Veuillez accepter le traitement de vos données pour continuer." });
      return;
    }
    if (!form.contactName || !form.hotelName || !form.email || !form.url) {
      setError({ code: "VALIDATION", message: "Please add your name, hotel, email and website first." });
      return;
    }
    const message = `🏨 *AI DIGITAL PRESENCE AUDIT — REQUEST*

*Contact:* ${form.contactName}
*Hotel:* ${form.hotelName}
*Email:* ${form.email}
*Phone:* ${form.phone || "Not provided"}
*Website:* ${form.url}

*Message:*
${form.message.trim() || DEFAULT_MESSAGE}

---
Submitted via Natlaupa Website`;
    post().catch(() => {});
    track("generate_lead", { form: "hotel_partner", method: "whatsapp" });
    window.open(
      `https://wa.me/33775743875?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setSubmitted(true);
    reset();
    setConsent(false);
  };

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="border border-gold/30 bg-white/[0.03] p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/15 flex items-center justify-center">
          <ShieldCheck className="text-gold" size={30} />
        </div>
        <h2 className="font-serif text-2xl text-white mb-3">Audit request received</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Thank you. Our team will be in touch within 48 hours to confirm scope
          and begin your AI Digital Presence Audit.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-gold text-xs uppercase tracking-[0.2em] hover:text-softGold transition-colors"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-white mb-1">Request Your Audit</h2>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        Tell us about your property and we&apos;ll prepare your AI Digital
        Presence Audit. Response within 48 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot: off-screen, not tabbable, not autofilled. Real users never
            see or fill it; bots that fill every field trip the server's silent drop. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
          <label htmlFor="hp-website2">Do not fill this field</label>
          <input
            id="hp-website2"
            type="text"
            name="website2"
            value={form.website2}
            onChange={onChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {error && (
          <div role="alert" className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm space-y-1">
            <p className="font-medium">{error.message}</p>
            {error.details && error.details.length > 0 && (
              <ul className="space-y-1 pl-4 list-disc">
                {error.details.map((d, i) => (
                  <li key={i} className="text-xs">
                    <span className="capitalize font-medium">{d.field}:</span> {d.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hp-name" className="block text-[11px] uppercase tracking-widest text-gold mb-2">
              Your name
            </label>
            <input
              id="hp-name"
              name="contactName"
              value={form.contactName}
              onChange={onChange}
              required
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="hp-hotel" className="block text-[11px] uppercase tracking-widest text-gold mb-2">
              Hotel
            </label>
            <input
              id="hp-hotel"
              name="hotelName"
              value={form.hotelName}
              onChange={onChange}
              required
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50"
              placeholder="Hôtel des Jardins"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hp-email" className="block text-[11px] uppercase tracking-widest text-gold mb-2">
              Email
            </label>
            <input
              id="hp-email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50"
              placeholder="jane@hotel.com"
            />
          </div>
          <div>
            <label htmlFor="hp-phone" className="block text-[11px] uppercase tracking-widest text-gold mb-2">
              Phone <span className="text-slate-400 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="hp-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50"
              placeholder="+33 ..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="hp-url" className="block text-[11px] uppercase tracking-widest text-gold mb-2">
            Your website URL
          </label>
          <input
            id="hp-url"
            type="url"
            name="url"
            value={form.url}
            onChange={onChange}
            required
            disabled={isSubmitting}
            className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50"
            placeholder="https://your-hotel.com"
          />
        </div>

        <div>
          <label htmlFor="hp-message" className="block text-[11px] uppercase tracking-widest text-gold mb-2">
            Message <span className="text-slate-400 normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="hp-message"
            name="message"
            value={form.message}
            onChange={onChange}
            rows={3}
            disabled={isSubmitting}
            className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:border-gold focus:outline-none transition-colors disabled:opacity-50"
            placeholder="Tell us about your hotel and what you'd like to improve…"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 w-4 h-4 flex-shrink-0 accent-gold disabled:opacity-50"
          />
          <span lang="fr" className="text-slate-400 text-xs leading-relaxed">
            J&apos;accepte que mes données soient traitées par Natlaupa pour traiter ma demande, conformément à la{" "}
            <Link href="/politique-de-confidentialite" className="text-gold hover:text-white transition-colors underline">
              Politique de Confidentialité
            </Link>
            .
          </span>
        </label>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-noir px-6 py-4 font-bold uppercase tracking-widest text-sm hover:bg-softGold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Sending…
              </>
            ) : (
              <>
                Request details <ArrowRight size={18} />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            disabled={isSubmitting}
            title="Send via WhatsApp"
            aria-label="Send via WhatsApp"
            className="w-14 h-14 flex-shrink-0 border-2 border-[#25D366] text-[#25D366] rounded-full hover:bg-[#128C7E] hover:border-[#128C7E] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
