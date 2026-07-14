import { test, expect, type Page } from '@playwright/test';

/**
 * P1 EXIT-GATE — cockpit + navigation trust (improvement-plan P1).
 *
 * Contract under test:
 *   1. KPI DEEP LINKS: every dashboard KPI tile is a real <Link> into the
 *      PRE-FILTERED list behind its count, and the list page actually applies
 *      `?status=` on mount (useStatusParamFilter). A count you cannot act on
 *      is a dead end.
 *   2. TRIAGE QUEUE: the cockpit renders the lead-inbox triage block
 *      (messages / inquiries / applications) whose rows deep-link into the
 *      pre-filtered list pages.
 *   3. PALETTE EXPANSION: ⌘K covers the legacy pages AND four more record
 *      entities — "customer" must surface the Customers PAGE plus customer
 *      RECORDS (the seeded "Test Customer").
 *   4. BREADCRUMB RECORD TITLE: a reservation detail's id crumb is replaced
 *      by the record's human reference (RES-…) once DetailShell publishes it.
 *   5. NO OVERLAP AT 1440px (both themes): no text layer of the cockpit's
 *      queue / triage / recent-activity rows may spill outside its row box —
 *      the regression this gate pins down was the mono reference wrapping out
 *      of the fixed-height RecentActivity rows and overlapping neighbours.
 */

const THEMES = ['light', 'dark'] as const;

// ---------------------------------------------------------------------------
// 1. KPI tiles → pre-filtered lists
// ---------------------------------------------------------------------------
test.describe('KPI deep links', () => {
  test('every KPI tile navigates to its pre-filtered list', async ({
    page,
  }) => {
    // New audit leads → /audit-requests?status=NEW, filter applied on mount.
    await page.goto('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Dashboard' })
    ).toBeVisible();
    await page.getByRole('link', { name: /new audit leads/i }).click();
    await expect(page).toHaveURL(/\/audit-requests\?status=NEW/);
    await expect(
      page.getByRole('combobox', { name: 'Filter by status' })
    ).toContainText('New');

    // Payments pending → /reservations?status=PAYMENT_PENDING.
    await page.goto('/');
    await page.getByRole('link', { name: /payments pending/i }).click();
    await expect(page).toHaveURL(/\/reservations\?status=PAYMENT_PENDING/);
    await expect(
      page.getByRole('combobox', { name: 'Filter by status' })
    ).toContainText('Payment Pending');

    // Waiting on client → /reservations?status=WAITING_CLIENT_INFO.
    await page.goto('/');
    await page.getByRole('link', { name: /waiting on client/i }).click();
    await expect(page).toHaveURL(/\/reservations\?status=WAITING_CLIENT_INFO/);
    await expect(
      page.getByRole('combobox', { name: 'Filter by status' })
    ).toContainText('Waiting Client Info');

    // Arrivals · next 48h → CONFIRMED (no arrival-date list filter exists —
    // the confirmed list is the honest superset the window is computed from).
    await page.goto('/');
    await page.getByRole('link', { name: /arrivals/i }).click();
    await expect(page).toHaveURL(/\/reservations\?status=CONFIRMED/);
    await expect(
      page.getByRole('combobox', { name: 'Filter by status' })
    ).toContainText('Confirmed');

    // Segmented "Reservations by status" tile: the New segment deep-links too.
    await page.goto('/');
    await page
      .getByRole('link', { name: /new$/i })
      .filter({ hasText: 'New' })
      .first()
      .click();
    await expect(page).toHaveURL(/\/reservations\?status=NEW_REQUEST/);
    await expect(
      page.getByRole('combobox', { name: 'Filter by status' })
    ).toContainText('New Request');
  });
});

// ---------------------------------------------------------------------------
// 2. Triage queue — lead inboxes with pre-filtered links
// ---------------------------------------------------------------------------
test('triage queue renders the message / inquiry / application buckets with pre-filtered links', async ({
  page,
}) => {
  await page.goto('/');
  const triage = page.getByTestId('triage-queue');
  await expect(triage).toBeVisible();
  await expect(
    triage.getByRole('heading', { name: 'Triage' })
  ).toBeVisible();

  const expected: Array<[RegExp, string]> = [
    [/unread messages/i, '/messages?status=UNREAD'],
    [/pending hotel inquiries/i, '/inquiries/hotel?status=PENDING'],
    [/pending offer inquiries/i, '/inquiries/offer?status=PENDING'],
    [/pending angel applications/i, '/applications/angel?status=PENDING'],
    [
      /pending partnership applications/i,
      '/applications/partnership?status=PENDING',
    ],
  ];
  for (const [label, href] of expected) {
    await expect(triage.getByRole('link', { name: label })).toHaveAttribute(
      'href',
      href
    );
  }

  // The deep link itself works end-to-end: messages lands pre-filtered.
  await triage.getByRole('link', { name: /unread messages/i }).click();
  await expect(page).toHaveURL(/\/messages\?status=UNREAD/);
  await expect(
    page.getByRole('combobox', { name: 'Filter by status' })
  ).toContainText('Unread');
});

// ---------------------------------------------------------------------------
// 3. Palette expansion — "customer" returns the page AND records
// ---------------------------------------------------------------------------
test('palette: "customer" surfaces the Customers page and customer records', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' })
  ).toBeVisible();

  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.getByTestId('cmdk-dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.type('customer');

  // Pages group: the Customers page entry (exact item text = page label).
  await expect(
    dialog
      .locator('[cmdk-item]')
      .filter({ hasText: /^Customers$/ })
      .first(),
    'Pages group must surface the Customers page for "customer"'
  ).toBeVisible();

  // Records: the seeded customer surfaces under the Customers record group
  // (the QA seed guarantees "Test Customer" — card-grid.spec.ts relies on the
  // same row).
  await expect(
    dialog.getByText('Test Customer', { exact: false }).first(),
    'record search must return the seeded customer'
  ).toBeVisible({ timeout: 10_000 });

  // Let the remaining record groups land before clicking: the 7 record
  // fetches resolve staggered and each landing re-renders the cmdk list — a
  // click racing that re-render can hit a node that is swapped between
  // pointerdown and pointerup, so cmdk never fires onSelect (observed flake).
  await page.waitForLoadState('networkidle').catch(() => {});

  // Selecting the record deep-links to the customer's edit surface (the only
  // customer detail view that exists).
  await dialog
    .locator('[cmdk-item]')
    .filter({ hasText: 'Test Customer' })
    .first()
    .click();
  await expect(page).toHaveURL(/\/customers\/[^/]+\/edit$/);
});

// ---------------------------------------------------------------------------
// 4. Breadcrumb record title on detail pages
// ---------------------------------------------------------------------------
test('reservation detail crumb shows the human reference (RES-…), not a mono id', async ({
  page,
}) => {
  await page.goto('/reservations');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Reservations' })
  ).toBeVisible();

  const firstCardLink = page
    .getByTestId('card-grid-item')
    .first()
    .getByTestId('card-link');
  await expect(
    firstCardLink,
    'seeded DB must contain at least one reservation (run the QA seed)'
  ).toBeVisible();
  await firstCardLink.click();
  await expect(page).toHaveURL(/\/reservations\/[^/]+$/);

  // Once the record loads, DetailShell publishes its title (= the reference)
  // and the crumb bar swaps the shortened mono id for it.
  const leaf = page.getByTestId('crumb-bar').locator('[aria-current="page"]');
  await expect(leaf).toHaveText(/^RES-/, { timeout: 15_000 });
});

// ---------------------------------------------------------------------------
// 5. No overlapping cockpit text at 1440px, both themes
// ---------------------------------------------------------------------------
test.describe('cockpit geometry @1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const theme of THEMES) {
    test(`no row text spills outside its cockpit row — ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript((t) => {
        window.localStorage.setItem('theme', t);
      }, theme);
      await page.goto('/');
      await expect(
        page.getByRole('heading', { level: 1, name: 'Dashboard' })
      ).toBeVisible();
      await page.waitForLoadState('networkidle').catch(() => {});
      // Data settled: no skeletons left in the cockpit.
      await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0, {
        timeout: 20_000,
      });

      const spills = await page.evaluate(() => {
        const out: string[] = [];
        const sections = [
          'section[aria-labelledby="needs-action-heading"]',
          'section[aria-labelledby="triage-queue-heading"]',
          'section[aria-labelledby="recent-activity-heading"]',
        ];
        for (const sel of sections) {
          const section = document.querySelector(sel);
          if (!section) {
            out.push(`MISSING SECTION ${sel}`);
            continue;
          }
          for (const li of Array.from(section.querySelectorAll('li'))) {
            const liRect = li.getBoundingClientRect();
            for (const el of Array.from(li.querySelectorAll('*'))) {
              const r = el.getBoundingClientRect();
              if (r.width === 0 && r.height === 0) continue; // hidden
              if (
                r.bottom > liRect.bottom + 2 ||
                r.top < liRect.top - 2 ||
                r.right > liRect.right + 2 ||
                r.left < liRect.left - 2
              ) {
                out.push(
                  `${sel}: "${(el.textContent ?? '').slice(0, 40)}" spills ` +
                    `v=${(r.bottom - liRect.bottom).toFixed(1)} h=${(r.right - liRect.right).toFixed(1)}`
                );
              }
            }
          }
        }
        return out;
      });

      expect(
        spills,
        `cockpit rows must not overlap/overflow at 1440px (${theme})`
      ).toEqual([]);
    });
  }
});
