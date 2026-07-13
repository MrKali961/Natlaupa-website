import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * W4 — EXTENDED axe-core accessibility sweep. One representative route per
 * remaining admin area NOT already covered by the W3b smoke
 * (w3b-axe-smoke.spec.ts covers /, /clients, /messages, /payments,
 * /customers) nor by the component-level harness scans
 * (harness-axe.spec.ts). Both themes, on live seeded data.
 *
 * Theme is set BEFORE navigation via localStorage 'theme' (next-themes with
 * attribute="class" reads it on hydration and stamps <html class="dark">),
 * so color-contrast checks run against fully themed colors.
 *
 * Filter policy (same as harness-axe.spec.ts): 'region' is excluded as the
 * verified-false-positive best-practice rule for portaled popups / app-shell
 * compositions; no other rule filters are permitted without a justifying
 * comment.
 */

const ROUTES: { path: string; heading: string }[] = [
  { path: '/offers', heading: 'Experience Offers' },
  { path: '/destinations', heading: 'Destinations' },
  { path: '/inquiries/hotel', heading: 'Hotel Inquiries' },
  { path: '/applications/angel', heading: 'Angel Applications' },
  { path: '/newsletter-campaigns', heading: 'Newsletter Campaigns' },
  { path: '/email-templates', heading: 'Email Templates' },
  { path: '/audits', heading: 'Audits' },
  { path: '/blog', heading: 'Blog Posts' },
  { path: '/testimonials', heading: 'Testimonials' },
  { path: '/finance', heading: 'Finance Dashboard' },
  { path: '/settings', heading: 'Settings' },
  { path: '/users', heading: 'Admin Users' },
  { path: '/bookings', heading: 'Bookings' },
  { path: '/angels', heading: 'Angels' },
  { path: '/reviews', heading: 'Hotel Reviews' },
];

async function expectNoAxeViolations(page: Page, state: string) {
  const results = await new AxeBuilder({ page }).analyze();
  // Filter 1 of max 2 — 'region': same verified false positive documented in
  // harness-axe.spec.ts (portaled/landmark-exempt surfaces).
  const filtered = results.violations.filter((v) => v.id !== 'region');
  const violations = filtered.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }));
  expect(violations, `axe violations in state: ${state}`).toEqual([]);
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`W4 axe full sweep (${theme} theme)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => {
        window.localStorage.setItem('theme', t);
      }, theme);
    });

    for (const route of ROUTES) {
      test(`axe: ${route.path} (${route.heading})`, async ({ page }) => {
        await page.goto(route.path);
        // Theme really applied — a dark scan must never silently run light.
        if (theme === 'dark') {
          await expect(page.locator('html')).toHaveClass(/dark/);
        } else {
          await expect(page.locator('html')).not.toHaveClass(/dark/);
        }
        // Page fully rendered (real h1 present, data settled enough to scan).
        await expect(
          page.getByRole('heading', { level: 1, name: route.heading })
        ).toBeVisible();
        await page.waitForLoadState('networkidle').catch(() => {});
        await expectNoAxeViolations(page, `${route.path} [${theme}]`);
      });
    }
  });
}
