"use client";

// Renders nothing. Adds two GA signals the spec asks for without wrapping every
// server-rendered CTA in a client component:
//  1. delegated click tracking on any [data-cta] anchor → `cta_click`
//  2. scroll-depth milestones 25/50/75/100 → `scroll_depth` (GA4 enhanced
//     measurement only fires a single 90% event; this fills the curve)
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function HospitalityAnalytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cta]");
      if (el) track("cta_click", { cta: el.dataset.cta });
    };
    document.addEventListener("click", onClick);

    const milestones = [25, 50, 75, 100];
    const fired = new Set<number>();
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / docH) * 100));
      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track("scroll_depth", { percent: m, page: "hospitality" });
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
