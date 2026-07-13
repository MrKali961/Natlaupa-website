import { test, expect, type Page } from '@playwright/test';

/**
 * VISUAL BASELINES (council Step 8) — full-page screenshot regression over the
 * archetypal admin surfaces, in BOTH themes (light/dark).
 *
 * ⚠ BASELINES ARE LOCAL-ONLY. The generated `*-snapshots/` folders are
 *   .gitignore'd (see website/.gitignore) and NEVER committed — pixel output
 *   differs across OS/GPU/font stacks, so a shared baseline would be noise.
 *   THE FIRST RUN ON A MACHINE IS NON-GATING: generate baselines with
 *       npx playwright test e2e/admin/visual-baselines.spec.ts --update-snapshots
 *   then subsequent normal runs diff against those local baselines and MUST
 *   pass deterministically (maxDiffPixelRatio 0.02).
 *
 * Surfaces: / (dashboard cockpit), /reservations (list), a reservation detail
 * (reached through the first list row — data-driven, deterministic within a
 * seeded session), /reservations/new (form), /hotels, /clients, /harness
 * (dev-only component playground).
 *
 * Determinism strategy:
 *   - THEME is forced via next-themes' localStorage key ('theme') in an
 *     addInitScript (runs before hydration → no flash / no "system"
 *     ambiguity), plus a matching colorScheme so native UI (scrollbars,
 *     form controls) agrees with the app theme. Each test then ASSERTS the
 *     <html> class actually matches before capturing.
 *   - prefers-reduced-motion: 'reduce' is emulated context-wide (test.use
 *     below); globals.css gates all animation (incl. the skeleton shimmer)
 *     behind it, and toHaveScreenshot additionally disables CSS animations.
 *   - Every capture waits for: network idle (best effort — some pages poll),
 *     zero [data-slot="skeleton"] loaders, settled <img> elements, and
 *     document.fonts.ready.
 *   - MASKED dynamic regions (dashboard only — verified as the only "now"-
 *     relative renderers in these surfaces):
 *       · the "Updated HH:mm" freshness stamp in the PageHeader
 *       · queue deadline / recent-activity relative-time spans
 *         (`li > span.whitespace-nowrap`: "received 3d ago", "in 36h",
 *         "about 2 hours ago") — these tick with wall-clock hours, so an
 *         unmasked capture would flake across an hour boundary.
 *     List/detail/form surfaces render only absolute dates (verified: no
 *     formatDistanceToNow/Date.now() in those pages) so they need no masks.
 */

const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

// Reduced motion for the whole spec — pairs with the app's global
// prefers-reduced-motion gate to freeze shimmer/transition animation.
test.use({ reducedMotion: 'reduce' });

const SCREENSHOT_OPTS = {
  fullPage: true as const,
  maxDiffPixelRatio: 0.02,
  // Full-page capture of the non-scrolling admin shell (html/body
  // overflow:hidden) equals the viewport — stable by construction.
};

/**
 * Wait until the page is visually settled: data landed (no skeletons),
 * images decoded, webfonts active. networkidle is best-effort only —
 * some pages (e.g. /audits-style pollers) never reach true idle.
 */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await expect(
    page.locator('[data-slot="skeleton"]'),
    'all skeleton loaders must resolve before capture'
  ).toHaveCount(0, { timeout: 20_000 });
  await page
    .waitForFunction(
      () => Array.from(document.images).every((img) => img.complete),
      undefined,
      { timeout: 15_000 }
    )
    .catch(() => {
      // A hung remote thumbnail should not abort the capture — it renders
      // as the (deterministic) avatar fallback / broken frame either way.
    });
  await page.evaluate(() => document.fonts.ready);
}

/** Assert the forced theme actually reached the DOM before capturing. */
async function assertTheme(page: Page, theme: Theme) {
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          document.documentElement.classList.contains('dark')
        ),
      { message: `next-themes must apply the '${theme}' theme to <html>` }
    )
    .toBe(theme === 'dark');
}

for (const theme of THEMES) {
  test.describe(`visual baselines [${theme}]`, () => {
    // Native UI (scrollbars/controls) must agree with the app theme.
    test.use({ colorScheme: theme });

    test.beforeEach(async ({ page }) => {
      // next-themes (attribute="class", default storageKey 'theme') reads
      // this before first paint — deterministic theme, no FOUC.
      await page.addInitScript((t) => {
        window.localStorage.setItem('theme', t);
      }, theme);
    });

    // Dashboard-only masks — the wall-clock-relative renderers (see header).
    const dashboardMasks = (page: Page) => [
      page.getByText(/^Updated \d{2}:\d{2}$/),
      page.locator('li > span.whitespace-nowrap'),
    ];

    test(`dashboard (/) — ${theme}`, async ({ page }) => {
      await page.goto('/');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Dashboard' })
      ).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(`dashboard-${theme}.png`, {
        ...SCREENSHOT_OPTS,
        mask: dashboardMasks(page),
      });
    });

    test(`reservations list (/reservations) — ${theme}`, async ({ page }) => {
      await page.goto('/reservations');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Reservations' })
      ).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(
        `reservations-list-${theme}.png`,
        SCREENSHOT_OPTS
      );
    });

    test(`reservation detail (first row) — ${theme}`, async ({ page }) => {
      await page.goto('/reservations');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Reservations' })
      ).toBeVisible();
      await settle(page);

      // Data-driven navigation: the list-shell makes each row the open
      // target (onRowClick → /reservations/:id). Deterministic within the
      // seeded session — the sort order does not change between the
      // baseline run and the verify run.
      const firstRow = page.locator('tbody tr').first();
      await expect(
        firstRow,
        'seeded DB must contain at least one reservation (run the QA seed)'
      ).toBeVisible();
      await firstRow.click();
      await expect(page).toHaveURL(/\/reservations\/[^/]+$/);
      // The detail page's loading state titles itself "Reservation" with this
      // description — wait for the REAL record (h1 = reference) to replace it.
      await expect(
        page.getByText('Loading reservation details...')
      ).toBeHidden();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(
        `reservation-detail-${theme}.png`,
        SCREENSHOT_OPTS
      );
    });

    test(`new reservation form (/reservations/new) — ${theme}`, async ({
      page,
    }) => {
      await page.goto('/reservations/new');
      await expect(
        page.getByRole('heading', { level: 1, name: 'New Reservation' })
      ).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(
        `reservation-new-${theme}.png`,
        SCREENSHOT_OPTS
      );
    });

    test(`hotels list (/hotels) — ${theme}`, async ({ page }) => {
      await page.goto('/hotels');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Hotels' })
      ).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(
        `hotels-list-${theme}.png`,
        SCREENSHOT_OPTS
      );
    });

    test(`clients list (/clients) — ${theme}`, async ({ page }) => {
      await page.goto('/clients');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Clients' })
      ).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(
        `clients-list-${theme}.png`,
        SCREENSHOT_OPTS
      );
    });

    test(`component harness (/harness) — ${theme}`, async ({ page }) => {
      await page.goto('/harness');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Component harness' })
      ).toBeVisible();
      await assertTheme(page, theme);
      await settle(page);
      await expect(page).toHaveScreenshot(
        `harness-${theme}.png`,
        SCREENSHOT_OPTS
      );
    });
  });
}
