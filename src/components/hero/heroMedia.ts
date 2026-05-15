/**
 * Hero background media interface.
 *
 * The hero is built to accept a drop-in ambient loop. Until Natlaupa supplies
 * branded footage, `HERO_VIDEO` stays `null` and HeroBackground renders the
 * graded still placeholder. Swapping in video is a one-object change here —
 * no component edits required.
 *
 * ── Client footage hand-off spec ──────────────────────────────────────────
 *  • Length      : 12–20s, seamless loop (no hard cut at the wrap point)
 *  • Master      : 4K (3840×2160) or 1080p minimum
 *  • Delivery    : AV1 or VP9 WebM ≤ 3 MB  +  H.264 MP4 fallback ≤ 5 MB
 *  • Framing     : 21:9-safe — keep subject central; top/bottom may be cropped
 *  • Grade       : dark, low-key, desaturated luxury; warm gold highlights
 *                  (match the current still: grayscale-ish, contrast +25%,
 *                  brightness -25%). No on-screen text or logos.
 *  • Audio       : none (plays muted)
 *  • Poster      : one graded keyframe exported as AVIF/WebP, same crop
 *  Place files in /public/videos/ and /public/videos/ posters, then fill the
 *  HERO_VIDEO object below.
 * ──────────────────────────────────────────────────────────────────────────
 */

export interface HeroVideo {
  /** AV1/VP9 WebM source (preferred). */
  webm: string;
  /** H.264 MP4 fallback (Safari/older). */
  mp4: string;
  /** Graded keyframe shown before play / under reduced-motion. */
  poster: string;
}

/** Set to a HeroVideo object once footage lands. `null` → still placeholder. */
export const HERO_VIDEO: HeroVideo | null = null;

/** Graded still placeholder, used until HERO_VIDEO is supplied. */
export const HERO_PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop';
