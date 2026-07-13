import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * W3b — axe-core accessibility SMOKE over five representative redesigned
 * dashboard routes (dashboard home, clients, messages, payments, customers)
 * in BOTH themes. Complements the exhaustive /harness component-level scans
 * (harness-axe.spec.ts) with real-page compositions: PageHeader + stat tiles +
 * data tables + filters, on live seeded data.
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
  { path: '/', heading: 'Dashboard' },
  { path: '/clients', heading: 'Clients' },
  { path: '/messages', heading: 'Contact Messages' },
  { path: '/payments', heading: 'Payments' },
  { path: '/customers', heading: 'Customers' },
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
  test.describe(`W3b axe smoke (${theme} theme)`, () => {
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
