import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * CONCIERGE end-to-end workflow.
 *
 * Drives the full "reservation & concierge follow-up" pipeline the back-office
 * team actually runs, through the real admin UI (routes live under /clients and
 * /reservations, not a /concierge page):
 *
 *   create client → create reservation → add destination (WITH a date) →
 *   add hotel offer (flagged "Selected for proposal") → build a proposal option
 *   + a line item → generate & validate the proposal message → record the
 *   client's selected option → set payment (cost/selling → margin) →
 *   confirm (status → Confirmed) → assert the Timeline shows every step.
 *
 * The 'admin' Playwright project injects the seeded super-admin storageState
 * (see e2e/admin/auth.setup.ts), so there is NO login code here.
 *
 * Non-obvious contract facts this test depends on (verified against the live
 * source), each of which would silently break the run if ignored:
 *   - Validation (GET .../messages/validate) only returns { valid: true } when a
 *     destination carries a travel date AND every proposal option has a computed
 *     total. Step 3's "Next" stays disabled until valid — hence the destination
 *     MUST get a calendar date and the option MUST get a priced item.
 *   - A hotel offer only appears in wizard step 1 when its status is
 *     SELECTED_FOR_PROPOSAL, so it is set at creation time.
 *   - The server records one ReservationEvent per milestone (REQUEST_RECEIVED,
 *     DESTINATION_ADDED, HOTEL_ADDED, OPTION_SELECTED, STATUS_CHANGED); the
 *     Timeline humanizes the type into its title, which is what we assert.
 *
 * Gating: every post-mutation step waits on DURABLE DOM (row text, dialog
 * close, a computed value, a persisted badge/event) — never a Sonner toast,
 * which auto-dismisses and would flake under full-suite load. Slow
 * create+navigate + server-derived (validation) steps get generous timeouts.
 */

// This is a long, strictly-linear workflow; the global 45s cap is not enough.
test.setTimeout(180_000);

/** Open a Radix Select trigger and click a portal-rendered option (exact match). */
async function pickSelectOption(page: Page, trigger: Locator, optionName: string) {
  await trigger.click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}

test('concierge workflow: client → reservation → proposal → confirm → timeline', async ({
  page,
}) => {
  // One stamp → unique, collision-proof names across reruns and an unambiguous
  // detail-page heading / table-row / wizard-choice to anchor selectors on.
  const stamp = Date.now();
  const clientName = `E2E Concierge ${stamp}`;
  const destinationName = `E2E Destination ${stamp}`;
  const hotelName = `E2E Hotel ${stamp}`;
  const itemDescription = `E2E Suite package ${stamp}`;

  // ==========================================================================
  // 1) CREATE CLIENT
  // ==========================================================================
  await page.goto('/clients');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Clients' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Add Client' }).click();
  await expect(page).toHaveURL(/\/clients\/new$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Add New Client' })
  ).toBeVisible();

  // Only Full Name is required; the label text is "Full Name *", so match loose.
  await page.getByLabel(/full name/i).fill(clientName);
  await page.getByRole('button', { name: 'Create Client' }).click();

  // Durable gate: the create mutation redirects to /clients/:id. Assert the URL
  // left /new (client-side nav after the POST is the slow bit under load).
  await page.waitForURL(/\/clients\/(?!new$)[^/]+$/, { timeout: 30_000 });

  // ==========================================================================
  // 2) CREATE RESERVATION (for the client just created)
  // ==========================================================================
  // Full navigation → fresh app → the reservation form's client dropdown fetches
  // /client-profiles fresh (default sort createdAt desc), so our brand-new
  // client is at the top of the first page and is selectable by name.
  await page.goto('/reservations');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Reservations' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'New Reservation' }).click();
  await expect(page).toHaveURL(/\/reservations\/new$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'New Reservation' })
  ).toBeVisible();

  // Client is the only required field. It's a Radix Select whose accessible name
  // comes from the "Client *" FormLabel.
  await pickSelectOption(
    page,
    page.getByRole('combobox', { name: /client/i }),
    clientName
  );

  await page.getByRole('button', { name: 'Create Reservation' }).click();

  // Primary post-submit gate: the detail cockpit renders the new reservation's
  // reference as its <h1> (RES-YYYY-NNNNNN). Generous timeout for create + nav.
  const referenceHeading = page.getByRole('heading', {
    level: 1,
    name: /^RES-\d{4}-\d+$/,
  });
  await expect(
    referenceHeading,
    'after submit the reservation cockpit should render (h1 = RES- reference)'
  ).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(/\/reservations\/(?!new$)[^/]+$/);

  // ==========================================================================
  // 3) ADD A DESTINATION (with a travel date — required for later validation)
  // ==========================================================================
  await page.getByRole('tab', { name: 'Destinations' }).click();
  await page.getByRole('button', { name: 'Add Destination' }).click();

  const destinationDialog = page.getByRole('dialog');
  // Assert the dialog TITLE via the heading role — a same-named submit button
  // ("Add Destination") also lives in this dialog, so getByText would be ambiguous.
  await expect(
    destinationDialog.getByRole('heading', { name: 'Add Destination' })
  ).toBeVisible();
  await destinationDialog.getByLabel(/destination name/i).fill(destinationName);

  // Arrival date: open the DatePicker popover and click day 15. In
  // react-day-picker v9 the day <button> carries a full-date aria-label, so we
  // target it by its visible text inside the calendar slot instead of by role
  // name. Day 15 is always in-month and unique in a single-month view.
  //
  // Trigger accName: the redesigned DatePicker passes `id` through so the
  // FormLabel's htmlFor associates with the trigger — the accessible name is
  // therefore the stable field label ("Arrival Date"), NOT the visible
  // placeholder/value text ("Pick arrival"). That is the CORRECT a11y contract
  // (a label-derived name must not mutate as the value changes), so the spec
  // targets the label name and asserts the pick via the trigger's visible text.
  const arrivalTrigger = destinationDialog.getByRole('button', {
    name: 'Arrival Date',
  });
  await arrivalTrigger.click();
  const calendar = page.locator('[data-slot="calendar"]');
  await expect(calendar).toBeVisible();
  await calendar.locator('button', { hasText: /^15$/ }).click();

  // Fail fast if the pick did not register (the trigger's visible text flips
  // off "Pick arrival" to the formatted date the instant onChange fires).
  await expect(arrivalTrigger).not.toContainText('Pick arrival');

  // The redesigned DatePicker closes its own popover the instant a day is
  // selected (onSelect → setOpen(false) — the standard shadcn pattern), so DO
  // NOT press Escape here: with the popover already gone, Escape would land on
  // the Dialog (the then-topmost layer) and correctly dismiss it, detaching
  // the submit button. Just assert the popover self-closed before submitting.
  await expect(calendar).not.toBeVisible();
  await expect(destinationDialog).toBeVisible();

  await destinationDialog.getByRole('button', { name: 'Add Destination' }).click();

  // Durable gate: the dialog closes on success and the row shows in the table.
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText(destinationName)).toBeVisible();

  // ==========================================================================
  // 4) ADD A HOTEL OFFER, flagged "Selected for proposal"
  // ==========================================================================
  await page.getByRole('tab', { name: 'Back-office' }).click();
  await page.getByRole('button', { name: 'Add Hotel Offer' }).click();

  const hotelDialog = page.getByRole('dialog');
  // Title via heading role (a same-named "Add Hotel Offer" submit button coexists).
  await expect(
    hotelDialog.getByRole('heading', { name: 'Add Hotel Offer' })
  ).toBeVisible();
  await hotelDialog.getByLabel(/hotel name/i).fill(hotelName);

  // Status must be "Selected For Proposal" or the offer never surfaces in the
  // proposal wizard's step 1.
  await pickSelectOption(
    page,
    hotelDialog.getByRole('combobox', { name: /status/i }),
    'Selected For Proposal'
  );

  await hotelDialog.getByRole('button', { name: 'Add Hotel Offer' }).click();

  // Durable gate: dialog closes, offer row appears.
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByText(hotelName)).toBeVisible();

  // ==========================================================================
  // 5) BUILD THE PROPOSAL (wizard) → generate + validate message → select option
  // ==========================================================================
  await page.getByRole('tab', { name: 'Proposals' }).click();

  // --- Step 1: pick the offer marked for proposal ---------------------------
  // The proposable-offers query fetches on tab mount; wait for our offer's row.
  await expect(page.getByText(hotelName)).toBeVisible({ timeout: 20_000 });
  // Radix Checkbox is a role-annotated <button>, not a native input — click it
  // (starts unchecked, so a single click selects it).
  await page
    .locator('label', { hasText: hotelName })
    .getByRole('checkbox')
    .click();
  // exact:true on every wizard "Next": role-name matching is substring by
  // default, and in dev mode the Next.js Dev Tools overlay button ("Open
  // Next.js Dev Tools") also matches bare "Next" → strict-mode violation.
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // --- Step 2: create Option A + a priced line item -------------------------
  await page.getByRole('button', { name: 'Add option A' }).click();
  await expect(page.getByText('Option A', { exact: true })).toBeVisible();

  // The add-item form's inputs have no associated <label> (plain <Label>), so
  // anchor on their placeholders.
  await page.getByPlaceholder(/Deluxe Suite/).fill(itemDescription);
  await page.getByPlaceholder('0.00').fill('5000');
  await page.getByRole('button', { name: 'Add item' }).click();

  // Durable gate: the item renders in the option's list. This also proves the
  // options query refetched (so step-2's own validation sees itemCount > 0).
  await expect(page.getByText(itemDescription)).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // --- Step 3: preview the generated message + server-side validation -------
  // Validation is server-derived; wait for the pass state before continuing
  // (the footer "Next" is disabled until it is valid).
  await expect(page.getByText('Ready to send')).toBeVisible({ timeout: 20_000 });
  // Anchor the generated message on a static template phrase, not the client name.
  await expect(page.getByText(/Please find below the option/)).toBeVisible();
  await expect(page.getByText('Proposal message')).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // --- Step 4: record the client's selection --------------------------------
  // One option → one radio (Radix radio is a role-annotated <button>); click it.
  await page.getByRole('radio').click();
  await page.getByRole('button', { name: 'Mark selected option' }).click();

  // The confirm step is a shared ConfirmDialog built on Radix AlertDialog →
  // role is 'alertdialog', NOT 'dialog'.
  const selectDialog = page.getByRole('alertdialog');
  await expect(selectDialog.getByText('Record client selection?')).toBeVisible();
  await selectDialog.getByRole('button', { name: 'Confirm selection' }).click();

  // Durable gate: the confirm dialog closes and the chosen option is now flagged
  // as the client's selection (persisted "Currently selected" badge on step 4).
  await expect(page.getByRole('alertdialog')).not.toBeVisible();
  await expect(page.getByText('Currently selected')).toBeVisible({ timeout: 20_000 });

  // ==========================================================================
  // 6) SET PAYMENT (cost / selling → margin)
  // ==========================================================================
  await page.getByRole('tab', { name: 'Payment' }).click();
  // CardTitle renders as a styled div (not a heading element), so match by text.
  await expect(page.getByText('Payment & Pricing')).toBeVisible();

  await page.getByLabel('Cost Price').fill('4000');
  await page.getByLabel('Selling Price').fill('5000');
  await pickSelectOption(page, page.getByLabel('Currency'), 'USD');

  // Durable gate: the margin is computed live from local state (4000/5000 → 1000)
  // and renders before Save — this is the payment step's real assertion.
  await expect(page.getByText('USD 1,000')).toBeVisible();

  await pickSelectOption(page, page.getByLabel('Payment Status'), 'Deposit Received');
  await page.getByRole('button', { name: 'Save Payment' }).click();

  // ==========================================================================
  // 7) CONFIRM (Overview → change status → Confirmed → Update)
  // ==========================================================================
  // There is no dedicated "confirm" button; confirming == moving the reservation
  // status to CONFIRMED, which records the STATUS_CHANGED timeline event.
  await page.getByRole('tab', { name: 'Overview' }).click();

  const statusSelect = page
    .getByRole('combobox')
    .filter({ hasText: 'Select new status' });
  await pickSelectOption(page, statusSelect, 'Confirmed');
  await page.getByRole('button', { name: 'Update' }).click();

  // ==========================================================================
  // 8) TIMELINE shows every milestone
  // ==========================================================================
  await page.getByRole('tab', { name: 'Timeline' }).click();
  await expect(
    page.getByText('Follow-up history for this reservation')
  ).toBeVisible();

  // Each Timeline entry's TITLE is the humanized event type. exact:true avoids
  // colliding with the entry DESCRIPTION lines (e.g. "Status changed from ...").
  // All five events are guaranteed by the server for the steps we drove.
  await expect(
    page.getByText('Request Received', { exact: true }),
    'reservation creation → REQUEST_RECEIVED'
  ).toBeVisible({ timeout: 20_000 });
  await expect(
    page.getByText('Destination Added', { exact: true }),
    'destination add → DESTINATION_ADDED'
  ).toBeVisible();
  await expect(
    page.getByText('Hotel Added', { exact: true }),
    'hotel offer add → HOTEL_ADDED'
  ).toBeVisible();
  await expect(
    page.getByText('Option Selected', { exact: true }),
    'client selection → OPTION_SELECTED'
  ).toBeVisible();
  await expect(
    page.getByText('Status Changed', { exact: true }),
    'confirm (status change) → STATUS_CHANGED'
  ).toBeVisible();
});
