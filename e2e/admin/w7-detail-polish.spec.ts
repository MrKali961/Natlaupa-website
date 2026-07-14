import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * W7 — DETAIL POLISH + PATTERN DEBT exit gate (P2).
 *
 * Verifies the three P2 contracts against the live admin:
 *
 *  1. MISSING-INFO CHIPS (reservation detail → Overview): the server returns
 *     RAW camelCase field names (travelStartDate…); the UI must render
 *     hand-written human labels — never a raw DB field name — and each chip
 *     must be a real link into `/edit?focus=<field>` that lands with the
 *     matching form control FOCUSED (covers both a native input and the
 *     DatePicker trigger button, i.e. the RHF field.ref wiring on the
 *     headless primitives).
 *
 *  2. THE MONEY RULE: a money slot renders either a real amount WITH its
 *     currency or "—" — a freshly created reservation has null cost/selling/
 *     margin, so the Margin card must show three em-dashes, not "null"/"NaN".
 *
 *  3. UNDO PATTERN (DESIGN-FOUNDATION forgiveness mechanism): hiding a
 *     testimonial is reversible → no confirm modal, an outcome toast with a
 *     REAL Undo button (8s), and clicking Undo restores visibility.
 *
 * Data strategy mirrors concierge.spec.ts: create what we assert on with a
 * unique stamp (client + bare reservation; testimonial is deleted again at
 * the end). Post-mutation gates wait on durable DOM; the ONLY toast this
 * suite ever waits on is the Undo toast itself — it IS the feature under
 * test, and its 8s duration is deliberate (a11y floor), so the default 10s
 * expect timeout with an immediate click is safe.
 */

test.setTimeout(120_000);

/** Open a headless Select trigger and click a portal-rendered option. */
async function pickSelectOption(
  page: Page,
  trigger: Locator,
  optionName: string
) {
  await trigger.click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}

test('missing-info chips are human-labelled deep-links that land focused; money is currency or "—"', async ({
  page,
}) => {
  const stamp = Date.now();
  const clientName = `E2E W7 Client ${stamp}`;

  // --- Create a client (only required field) -------------------------------
  await page.goto('/clients');
  await page.getByRole('button', { name: 'Add Client' }).click();
  await expect(page).toHaveURL(/\/clients\/new$/);
  await page.getByLabel(/full name/i).fill(clientName);
  await page.getByRole('button', { name: 'Create Client' }).click();
  await page.waitForURL(/\/clients\/(?!new$)[^/]+$/, { timeout: 30_000 });

  // --- Create a reservation with ONLY the client → every required concierge
  //     field is missing → all six chips render ------------------------------
  await page.goto('/reservations');
  await page.getByRole('button', { name: 'New Reservation' }).click();
  await expect(page).toHaveURL(/\/reservations\/new$/);
  await pickSelectOption(
    page,
    page.getByRole('combobox', { name: /client/i }),
    clientName
  );
  await page.getByRole('button', { name: 'Create Reservation' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: /^RES-\d{4}-\d+$/ })
  ).toBeVisible({ timeout: 30_000 });
  const detailUrl = page.url();

  // --- 1) Human labels, no raw DB field names ------------------------------
  const missingCard = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Missing Information', { exact: true }) });
  await expect(missingCard).toBeVisible({ timeout: 20_000 });

  const chips = missingCard.getByRole('link');
  await expect(chips).toHaveCount(6, { timeout: 20_000 });
  const chipTexts = await chips.allInnerTexts();
  expect(chipTexts.sort()).toEqual(
    [
      'Estimated budget',
      'Number of guests',
      'Number of rooms',
      'Responsible team member',
      'Travel end date',
      'Travel start date',
    ].sort()
  );
  // Belt & braces: nothing camelCase / id-suffixed ever leaks through.
  for (const text of chipTexts) {
    expect(text).not.toMatch(/[a-z][A-Z]/);
    expect(text.toLowerCase()).not.toContain('userid');
  }

  // --- 2) The money rule: null cost/selling/margin → three "—", never null -
  const marginCard = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Cost vs. selling price', { exact: true }) });
  await expect(marginCard.getByText('—', { exact: true })).toHaveCount(3);

  // --- 3a) Chip → edit form focused on a native number input ----------------
  await missingCard
    .getByRole('link', { name: /add number of guests/i })
    .click();
  await page.waitForURL(/\/edit\?focus=numberOfGuests$/, { timeout: 20_000 });
  await expect(page.getByLabel('Number of Guests')).toBeFocused({
    timeout: 15_000,
  });

  // --- 3b) Chip → edit form focused on the DatePicker TRIGGER BUTTON
  //     (proves field.ref reaches the headless primitives, not just <Input>) -
  await page.goto(detailUrl);
  await expect(
    missingCard.getByRole('link', { name: /add travel start date/i })
  ).toBeVisible({ timeout: 20_000 });
  await missingCard
    .getByRole('link', { name: /add travel start date/i })
    .click();
  await page.waitForURL(/\/edit\?focus=travelStartDate$/, { timeout: 20_000 });
  await expect(page.getByLabel('Travel Start')).toBeFocused({
    timeout: 15_000,
  });
});

test('undo pattern: hiding a testimonial offers a working Undo toast (no confirm modal)', async ({
  page,
}) => {
  const stamp = Date.now();
  const author = `E2E W7 Voice ${stamp}`;

  // --- Create a testimonial to operate on ----------------------------------
  await page.goto('/testimonials');
  await page.getByRole('button', { name: 'Add Testimonial' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Author Name').fill(author);
  await dialog.getByLabel('Quote').fill('W7 undo-pattern verification quote.');
  await dialog.getByRole('button', { name: 'Create', exact: true }).click();

  const card = page
    .locator('[data-slot="card-grid"] > li')
    .filter({ hasText: author });
  await expect(card).toBeVisible({ timeout: 20_000 });
  await expect(card.getByText('Active', { exact: true })).toBeVisible();

  // --- Hide it: reversible → applies immediately, NO confirm dialog --------
  await card
    .getByRole('button', { name: `Actions for testimonial by ${author}` })
    .click();
  await page.getByRole('menuitem', { name: 'Deactivate' }).click();

  // The Undo toast is the feature under test: a real focusable button.
  const undoButton = page.getByRole('button', { name: 'Undo', exact: true });
  await expect(undoButton).toBeVisible();
  // Durable proof the hide applied before we revert it.
  await expect(card.getByText('Inactive', { exact: true })).toBeVisible({
    timeout: 15_000,
  });

  // --- Undo restores visibility --------------------------------------------
  await undoButton.click();
  await expect(card.getByText('Active', { exact: true })).toBeVisible({
    timeout: 15_000,
  });

  // --- Cleanup: delete (the one irreversible verb → the one confirm) -------
  await card
    .getByRole('button', { name: `Actions for testimonial by ${author}` })
    .click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  const confirm = page.getByRole('alertdialog');
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(card).toHaveCount(0, { timeout: 15_000 });
});
