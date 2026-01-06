import Lenis from 'lenis';

declare global {
  interface Window {
    lenis?: Lenis;
    gtag?: (
      command: 'consent' | 'config' | 'event' | 'js' | 'set',
      targetOrAction: string | Date | object,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export {};
