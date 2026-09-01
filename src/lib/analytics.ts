/**
 * Thin wrapper over the GA4 gtag already loaded in app/layout.tsx (G-8M912MLKPN).
 * Calls are no-ops until gtag exists, and GA4 Consent Mode v2 gates whether the
 * event is actually stored/sent — so this is safe to call without extra checks.
 *
 * Honesty note: for a Calendly *link-out* this captures the click only
 * (`cta_click`), NOT a completed booking. Booking-completion tracking would
 * require the inline Calendly embed + its `event_scheduled` postMessage.
 */
export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params || {});
  }
}
