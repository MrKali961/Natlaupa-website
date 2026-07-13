import { test, expect } from '@playwright/test';

/**
 * W3a PILOT GATE — reservations + hotels rebuilt on the shared shells
 * (ListShell / DetailShell / FormShell / RelatedRecords, DESIGN-FOUNDATION §2/§3).
 *
 * Verifies, through the real admin UI with role/label selectors only:
 *   1. Reservations LIST: rows render; a sortable column exposes th[aria-sort]
 *      and toggles on header click (server sort — SORT-SUPPORT whitelist);
 *      selecting 2 rows swaps the filter bar in place for the bulk bar with a
 *      live count; "Clear selection" deselects (progressive disclosure).
 *   2. Reservations FORM (/reservations/new): sticky save bar renders and a
 *      create submits successfully (unique client pick → detail cockpit).
 *   3. Whole-row click on the list opens the detail; the detail's Related
 *      Records rail contains a working client RecordLink → /clients/:id.
 *   4. Hotels DETAIL: no "Coming Soon" tab and no zeroed stat-card band —
 *      the tab set is exactly Overview / Details / Media / Amenities.
 *   5. Hotels FORM (/hotels/new): sticky save bar renders and a create
 *      submits successfully; the created hotel is deleted via the UI.
 *
 * Non-obvious contract facts this spec depends on:
 *   - ListShell injects a leftmost checkbox column (aria-label "Select row" /
 *     "Select all rows on this page") when `selection` is configured, so the
 *     reservations columns are: [select] reference client status arrival
 *     budget responsible created [actions].
 *   - DataTable stamps aria-sort on every SORTABLE th ("none" when inactive);
 *     the reservations default view is createdAt DESC (mirrors the server
 *     default), so the "Created" header starts at aria-sort="descending" and
 *     one click flips it to "ascending" (toggleSorting(isAsc)).
 *   - Whole-row click ignores interactive elements (buttons, links,
 *     checkboxes) — the reference cell is a plain <span>, so clicking it is
 *     the row-open gesture, NOT the client cell (a RecordLink <a>).
 *   - DetailShell's related rail renders in an <aside> → role "complementary".
 *   - ConfirmDialog is a Radix AlertDialog → role "alertdialog".
 *   - FormShell's sticky bar carries data-slot="form-save-bar"; the ONLY
 *     structural (non-role) selector here, used to assert the bar itself.
 *
 * Serial: later tests consume the reservation created in the form test
 * (newest record → first row under the default createdAt DESC sort).
 */

test.describe.configure({ mode: 'serial' });

// One stamp → unique, collision-proof names across reruns.
const stamp = Date.now();
const hotelName = `E2E Pilot Hotel ${stamp}`;

// Captured in the create test, consumed by the detail test.
let reservationRef = '';
let clientName = '';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('reservations list: rows render, sort caret toggles aria-sort, selection shows bulk bar', async ({
  page,
}) => {
  await page.goto('/reservations');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Reservations' })
  ).toBeVisible();

  // Rows render (seeded DB has reservations; skeleton rows are aria-hidden and
  // carry no RES- reference text, so this waits out the loading state too).
  const rows = page.locator('tbody tr');
  await expect(rows.first()).toContainText(/RES-\d{4}-\d+/, {
    timeout: 20_000,
  });
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThanOrEqual(2);

  // --- Server sort: the "Created" column ships sorted DESC by default ------
  const createdHeader = page.getByRole('columnheader', { name: 'Created' });
  await expect(createdHeader).toHaveAttribute('aria-sort', 'descending');

  const firstRefBefore = await rows.first().innerText();
  await createdHeader.getByRole('button', { name: 'Created' }).click();
  await expect(createdHeader).toHaveAttribute('aria-sort', 'ascending');

  // Rows must still render after the server refetch. If the dataset has ≥2
  // distinct creation instants the first row flips; with thin/uniform data it
  // may legitimately stay — aria-sort above is the binding assertion.
  await expect(rows.first()).toContainText(/RES-\d{4}-\d+/, {
    timeout: 20_000,
  });
  const firstRefAfter = await rows.first().innerText();
  if (firstRefBefore === firstRefAfter) {
    // Consistency check: an unchanged first row is only legal because the
    // header still reports the flipped order (server owns the row order).
    await expect(createdHeader).toHaveAttribute('aria-sort', 'ascending');
  }

  // --- Selection → in-place bulk bar with live count -----------------------
  await page.getByRole('checkbox', { name: 'Select row' }).nth(0).click();
  await page.getByRole('checkbox', { name: 'Select row' }).nth(1).click();

  await expect(page.getByText('2 selected')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Change status…' })
  ).toBeVisible();

  // Clear selection → bulk bar yields back to the filter bar (zero footprint).
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(page.getByText('2 selected')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Change status…' })
  ).not.toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Search reservations' })
  ).toBeVisible();
  await expect(
    page.getByRole('checkbox', { name: 'Select row' }).nth(0)
  ).not.toBeChecked();
});

test('reservations form: sticky save bar renders and create submits', async ({
  page,
}) => {
  await page.goto('/reservations/new');
  await expect(
    page.getByRole('heading', { level: 1, name: 'New Reservation' })
  ).toBeVisible();

  // Sticky save bar (form-view sticky-action-bar): primary submit + demoted
  // Cancel live inside the pinned bar.
  const saveBar = page.locator('[data-slot="form-save-bar"]');
  await expect(saveBar).toBeVisible();
  await expect(
    saveBar.getByRole('button', { name: 'Create Reservation' })
  ).toBeVisible();
  await expect(saveBar.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // Client is the only required field — pick the first available profile and
  // remember its name for the Related-rail assertion later.
  await page.getByRole('combobox', { name: /client/i }).click();
  const firstOption = page.getByRole('option').first();
  await expect(firstOption).toBeVisible({ timeout: 15_000 });
  clientName = (await firstOption.innerText()).trim();
  await firstOption.click();

  await saveBar.getByRole('button', { name: 'Create Reservation' }).click();

  // Durable gate: the detail cockpit renders the new reference as its <h1>.
  const referenceHeading = page.getByRole('heading', {
    level: 1,
    name: /^RES-\d{4}-\d+$/,
  });
  await expect(referenceHeading).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(/\/reservations\/(?!new$)[^/]+$/);
  reservationRef = (await referenceHeading.innerText()).trim();
  expect(reservationRef).toMatch(/^RES-\d{4}-\d+$/);
});

test('whole-row click opens detail; Related rail client RecordLink navigates; cleanup', async ({
  page,
}) => {
  expect(reservationRef, 'create test must have run first').toBeTruthy();

  await page.goto('/reservations');
  const firstRow = page.locator('tbody tr').first();
  // Default sort createdAt DESC → the reservation just created is row 1.
  await expect(firstRow).toContainText(reservationRef, { timeout: 20_000 });

  // Row-open gesture: click the REFERENCE cell (plain text — the client cell
  // is a RecordLink and the leading cell is the selection checkbox).
  await firstRow.getByText(reservationRef, { exact: true }).click();
  await page.waitForURL(/\/reservations\/(?!new$)[^/]+$/, { timeout: 20_000 });
  await expect(
    page.getByRole('heading', { level: 1, name: reservationRef })
  ).toBeVisible();

  // Related Records rail (DetailShell aside → complementary landmark).
  const rail = page.getByRole('complementary');
  await expect(rail.getByText('Related', { exact: true })).toBeVisible();

  // The client entry is a whole-row RecordLink; its accessible name includes
  // the entity label ("Client") + the human name.
  const clientLink = rail.getByRole('link', {
    name: new RegExp(escapeRegex(clientName)),
  });
  await expect(clientLink).toBeVisible();
  await clientLink.click();
  await page.waitForURL(/\/clients\/[^/]+$/, { timeout: 20_000 });

  // ---- Cleanup: delete the created reservation via the UI -----------------
  await page.goto('/reservations');
  await expect(page.locator('tbody tr').first()).toContainText(
    reservationRef,
    { timeout: 20_000 }
  );
  await page
    .getByRole('button', { name: `Actions for ${reservationRef}` })
    .click();
  await page.getByRole('menuitem', { name: 'Delete', exact: true }).click();

  const confirm = page.getByRole('alertdialog');
  await expect(confirm.getByText('Delete Reservation')).toBeVisible();
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alertdialog')).not.toBeVisible();
  await expect(page.getByText(reservationRef)).not.toBeVisible({
    timeout: 20_000,
  });
});

test('hotels detail: no Coming Soon tab, no zeroed stat cards', async ({
  page,
}) => {
  await page.goto('/hotels');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Hotels' })
  ).toBeVisible();

  // Open the first hotel via its name RecordLink (keyboard-accessible target).
  const firstRowLink = page.locator('tbody tr').first().getByRole('link').first();
  await expect(firstRowLink).toBeVisible({ timeout: 20_000 });
  await firstRowLink.click();
  await page.waitForURL(/\/hotels\/(?!new$)[^/]+$/, { timeout: 20_000 });

  // Flat tab bar — exactly the four honest tabs, nothing speculative.
  const tabs = page.getByRole('tab');
  await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Details' })).toBeVisible();
  await expect(page.getByRole('tab', { name: /Media/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /Amenities/ })).toBeVisible();
  await expect(tabs).toHaveCount(4);

  // honesty-guard: the placeholder tab and the fabricated zeroed stat band
  // (Total Bookings / Total Revenue / Occupancy…) must be gone.
  await expect(page.getByText(/coming soon/i)).toHaveCount(0);
  await expect(page.getByText(/total bookings/i)).toHaveCount(0);
  await expect(page.getByText(/total revenue/i)).toHaveCount(0);
  await expect(page.getByText(/occupancy/i)).toHaveCount(0);

  // The Related rail is present on the rebuilt detail as well.
  await expect(
    page.getByRole('complementary').getByText('Related', { exact: true })
  ).toBeVisible();
});

test('hotels form: sticky save bar renders, create submits, delete via UI cleans up', async ({
  page,
}) => {
  await page.goto('/hotels/new');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Add New Hotel' })
  ).toBeVisible();

  const saveBar = page.locator('[data-slot="form-save-bar"]');
  await expect(saveBar).toBeVisible();
  await expect(saveBar.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(saveBar.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // Required fields only (name/city/country) — unique name via the stamp.
  await page.getByLabel(/hotel name/i).fill(hotelName);
  await page.getByLabel(/^city/i).fill('E2E City');
  await page.getByLabel(/^country/i).fill('E2E Country');

  await saveBar.getByRole('button', { name: 'Save' }).click();

  // Create redirects back to the hotels list.
  await page.waitForURL(/\/hotels$/, { timeout: 30_000 });

  // Find the new hotel (server-side search keeps this deterministic).
  await page.getByRole('textbox', { name: 'Search hotels' }).fill(hotelName);
  await expect(
    page.getByRole('link', { name: hotelName })
  ).toBeVisible({ timeout: 20_000 });

  // ---- Cleanup: delete through the row actions menu ------------------------
  await page.getByRole('button', { name: `Actions for ${hotelName}` }).click();
  await page.getByRole('menuitem', { name: 'Delete', exact: true }).click();

  const confirm = page.getByRole('alertdialog');
  await expect(confirm.getByText('Delete Hotel')).toBeVisible();
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alertdialog')).not.toBeVisible();
  await expect(page.getByRole('link', { name: hotelName })).not.toBeVisible({
    timeout: 20_000,
  });
});
