"use client";

// Persistent booking CTA. Mobile: full-width bottom bar. Desktop: bottom-right
// pill (the global WhatsApp float is suppressed on /hospitality so they don't
// collide). Appears after the hero scrolls past and recedes over the footer so
// it never covers the final CTA. Links to Calendly when configured, else to the
// inline #apply form. Click-tracked via GA (`cta_click`).
import React, { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { track } from "@/lib/analytics";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

export default function StickyHotelCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const past = y > 600;
      const nearBottom = y + window.innerHeight > docH - 720;
      setVisible(past && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const href = CALENDLY_URL || "#apply";
  const external = Boolean(CALENDLY_URL);
  const onClick = () => track("cta_click", { cta: "sticky_book_call" });

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-500 md:inset-x-auto md:bottom-6 md:right-6 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      {/* Mobile bar */}
      <div className="md:hidden flex items-center gap-3 border-t border-gold/30 bg-deepBlue/95 backdrop-blur-sm px-4 py-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))]">
        <div className="flex-1 leading-tight">
          <p className="text-white text-sm font-medium">30 days · 99€</p>
          <p className="text-slate-400 text-[11px]">No commitment</p>
        </div>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={onClick}
          className="inline-flex items-center gap-2 bg-gold text-deepBlue px-5 py-3.5 font-bold uppercase tracking-widest text-xs"
        >
          <CalendarClock size={16} />
          Book a call
        </a>
      </div>

      {/* Desktop pill */}
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={onClick}
        className="hidden md:inline-flex items-center gap-2.5 bg-gold text-deepBlue px-6 py-3.5 rounded-full shadow-2xl font-bold uppercase tracking-widest text-xs hover:bg-softGold transition-colors"
      >
        <CalendarClock size={17} />
        Book a 15-min call
      </a>
    </div>
  );
}
