import { test, expect, type Page } from '@playwright/test';

/**
 * CARD-GRID WAVE gate (P0) — grid is the DEFAULT list presentation on the
 * ListShell pages; the table stays available behind a persisted per-list
 * view toggle. This spec proves the grid contract end-to-end on live seeded
 * data:
 *
 *   1. /reservations boots into GRID (mounted gate: the shell root only
 *      stamps data-view once the persisted view is resolved), the toggle
 *      switches to TABLE, and the choice PERSISTS across a reload
 *      (localStorage['natlaupa-view:<pathname>']).
 *   2. Stretched-link: clicking anywhere on the card body (a meta row — not
 *      an interactive child) opens the record via the card's real <a>; the
 *      kebab is a z-layered SIBLING of the link, so opening it never
 *      navigates.
 *   3. Selection parity: card checkboxes drive the SAME in-place bulk bar as
 *      the table ("N selected" + bulk verbs), and Clear selection restores
 *      the filter bar.
 *   4. Tab order per card is checkbox → stretched link → kebab (DOM order =
 *      tab order; overlay never wraps the interactive children).
 *   5. /customers (the page the use-users.ts mapping fix un-broke) renders
 *      the SEEDED customer as a card, and its closed sort list (Joined /
 *      Name→lastName / Email / Loyalty points) round-trips against the
 *      free-form users endpoint without a 500.
 *   6. 390px smoke: the grid collapses to one column and the content pane
 *      never scrolls horizontally.
 *   7. Hydration + degraded-analytics gate: /customers, /reservations and
 *      /analytics render with ZERO React hydration warnings and zero
 *      uncaught page errors; /analytics degrades honestly ("Data source not
 *      connected yet") instead of crashing on the 3 known-missing endpoints.
 *
 * Non-obvious contract facts:
 *   - Fresh context per test = fresh localStorage (the auth storageState
 *     carries no natlaupa-view keys), so within-test reloads prove
 *     persistence and tests never leak view state into each other.
 *   - CardGrid testids: card-grid / card-grid-item / card-link / card-select;
 *     ListShell testids: view-toggle-grid / view-toggle-table /
 *     grid-sort-select / grid-select-all.
 *   - The reservations kebab carries aria-label "Actions for RES-…" (same
 *     renderer as the table view — accessible-name parity across views).
 */

const RES_REF = /RES-\d{4}-\d+/;

/** First fully-rendered reservation card (skeleton cards are aria-hidden). */
function firstCard(page: Page) {
  return page.getByTestId('card-grid-item').first();
}

async function waitForGrid(page: Page) {
  await expect(page.locator('[data-view="grid"]')).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByTestId('card-grid')).toBeVisible();
}

test('grid is the default view and the toggle persists per list across reloads', async ({
  page,
}) => {
  await page.goto('/reservations');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Reservations' })
  ).toBeVisible();

  // Mounted gate resolves to the grid default; seeded cards render.
  await waitForGrid(page);
  await expect(firstCard(page)).toContainText(RES_REF, { timeout: 20_000 });
  await expect(page.locator('tbody tr')).toHaveCount(0);

  // Toggle → table: the SAME data renders as rows; grid unmounts.
  await page.getByTestId('view-toggle-table').click();
  await expect(page.locator('[data-view="table"]')).toBeVisible();
  await expect(page.locator('tbody tr').first()).toContainText(RES_REF, {
    timeout: 20_000,
  });
  await expect(page.getByTestId('card-grid')).toHaveCount(0);

  // Reload → the persisted choice wins (no silent flip back to grid).
  await page.reload();
  await expect(page.locator('[data-view="table"]')).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator('tbody tr').first()).toContainText(RES_REF, {
    timeout: 20_000,
  });

  // Toggle back → grid, and THAT persists too.
  await page.getByTestId('view-toggle-grid').click();
  await waitForGrid(page);
  await page.reload();
  await waitForGrid(page);
  await expect(firstCard(page)).toContainText(RES_REF, { timeout: 20_000 });
});

test('stretched link opens the record from the card body; the kebab never navigates', async ({
  page,
}) => {
  await page.goto('/reservations');
  await waitForGrid(page);
  const card = firstCard(page);
  await expect(card).toContainText(RES_REF, { timeout: 20_000 });

  const href = await card.getByTestId('card-link').getAttribute('href');
  expect(href, 'card link must target the record route').toMatch(
    /^\/reservations\/[^/]+$/
  );

  // Kebab first: it sits ABOVE the stretched overlay (z-10 sibling), so
  // opening it must not trigger the card navigation.
  await card.getByRole('button', { name: /^Actions for RES-/ }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page).toHaveURL(/\/reservations$/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();

  // Whole-card open target: click the card itself (its center falls on the
  // meta body, where the link's ::after overlay — a descendant of the card —
  // receives the hit; clicking the <dl> directly would fail Playwright's
  // hit-target check for the SAME reason the pattern works: the overlay
  // intercepts every non-interactive region).
  await card.click();
  await page.waitForURL(/\/reservations\/(?!new$)[^/]+$/, { timeout: 20_000 });
  expect(new URL(page.url()).pathname).toBe(href);
});

test('card selection drives the in-place bulk bar; Clear selection restores the filter bar', async ({
  page,
}) => {
  await page.goto('/reservations');
  await waitForGrid(page);
  await expect(firstCard(page)).toContainText(RES_REF, { timeout: 20_000 });

  const checkboxes = page.getByTestId('card-select');
  await checkboxes.nth(0).click();
  await checkboxes.nth(1).click();

  // In-place bulk bar with live count + the reservations bulk verb; selected
  // cards read on the tint channel (data-selected).
  await expect(page.getByText('2 selected')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Change status…' })
  ).toBeVisible();
  await expect(page.locator('[data-testid="card-grid-item"][data-selected]')).toHaveCount(2);

  // The persistent controls cluster (select-all, toggle) survives the swap.
  await expect(page.getByTestId('grid-select-all')).toBeVisible();

  // Clear → zero footprint again: filter bar back, nothing selected.
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(page.getByText('2 selected')).not.toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Search reservations' })
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="card-grid-item"][data-selected]')
  ).toHaveCount(0);
});

test('tab order inside a card is checkbox → stretched link → kebab', async ({
  page,
}) => {
  await page.goto('/reservations');
  await waitForGrid(page);
  const card = firstCard(page);
  await expect(card).toContainText(RES_REF, { timeout: 20_000 });

  await card.getByTestId('card-select').focus();
  await expect(card.getByTestId('card-select')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(card.getByTestId('card-link')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(
    card.getByRole('button', { name: /^Actions for RES-/ })
  ).toBeFocused();
});

test('/customers renders the seeded customer as a card and its closed sort list round-trips', async ({
  page,
}) => {
  await page.goto('/customers');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Customers' })
  ).toBeVisible();
  await waitForGrid(page);

  // The use-users.ts mapping fix: the seeded customer actually renders.
  const seeded = page
    .getByTestId('card-link')
    .filter({ hasText: 'Test Customer' });
  await expect(seeded, 'seeded customer must render (run the QA seed)').toBeVisible(
    { timeout: 20_000 }
  );

  // Closed sort list — exactly the SORT-SUPPORT whitelist (lastName is
  // "Name"; loyaltyPoints added; firstName must NOT be offered).
  await page.getByTestId('grid-sort-select').click();
  const options = page.getByRole('option');
  await expect(options).toHaveText([
    'Default',
    'Joined',
    'Name',
    'Email',
    'Loyalty points',
  ]);

  // Server round-trip on the renamed field: sorting by Name (lastName) must
  // refetch without a 500 (free-form endpoint — the whitelist IS the guard).
  let serverError = '';
  page.on('response', (res) => {
    if (res.url().includes('localhost:5000') && res.status() >= 500) {
      serverError = `${res.status()} ${res.url()}`;
    }
  });
  await page.getByRole('option', { name: 'Name', exact: true }).click();
  await expect(seeded).toBeVisible({ timeout: 20_000 });
  expect(serverError, 'sortBy=lastName must not 500').toBe('');
});

test.describe('390px grid smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of ['/customers', '/reservations'] as const) {
    test(`mobile: ${route} renders a single-column grid with no horizontal scroll`, async ({
      page,
    }) => {
      await page.goto(route);
      await waitForGrid(page);
      await expect(firstCard(page)).toBeVisible({ timeout: 20_000 });

      // Single column at 390px (minmax card floor > half the pane width).
      const columns = await page
        .getByTestId('card-grid')
        .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      expect(columns, 'grid must collapse to one column at 390px').toBe(1);

      // The one scroll pane must not overflow horizontally.
      const overflow = await page
        .getByTestId('content-scroller')
        .evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(
        overflow,
        'content pane must not scroll horizontally at 390px'
      ).toBeLessThanOrEqual(2);
    });
  }
});

test('hydration gate: /customers, /reservations and degraded /analytics render with zero hydration warnings and zero page errors', async ({
  page,
}) => {
  const hydrationWarnings: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (msg) => {
    if (/hydrat/i.test(msg.text())) {
      hydrationWarnings.push(msg.text().slice(0, 300));
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(String(err).slice(0, 300));
  });

  await page.goto('/customers');
  await waitForGrid(page);
  await expect(firstCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto('/reservations');
  await waitForGrid(page);
  await expect(firstCard(page)).toContainText(RES_REF, { timeout: 20_000 });

  // /analytics: the null-guarded page must render DEGRADED, not crash — the
  // 3 known-missing endpoints (user-growth / bookings / hotel-performance)
  // surface as honest "not connected" panels once react-query exhausts its
  // retries (hence the generous timeout).
  await page.goto('/analytics');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Analytics' })
  ).toBeVisible();
  await expect(
    page.getByText('Data source not connected yet', { exact: false }).first()
  ).toBeVisible({ timeout: 40_000 });

  expect(
    hydrationWarnings,
    `React hydration warnings detected:\n${hydrationWarnings.join('\n')}`
  ).toEqual([]);
  expect(
    pageErrors,
    `uncaught page errors detected:\n${pageErrors.join('\n')}`
  ).toEqual([]);
});
