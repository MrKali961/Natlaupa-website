import { test, expect } from '@playwright/test';

/**
 * AUDIT LIFECYCLE (real UI, keyless) — the operator cockpit end-to-end.
 *
 * Unlike e2e/website/journey.spec.ts (which drives the same pipeline entirely
 * via raw API calls), this spec CLICKS the admin dashboard: create → Run →
 * watch progress → reach Complete → open the Report tab → Verify & Publish →
 * confirm the gated client link. It is the admin project's first use of the
 * "keyless trigger → poll → COMPLETE against the real worker" pattern that
 * journey.spec already proves works.
 *
 * PRECONDITIONS (full stack — see e2e/admin/qa/RUN.md):
 *   - natlaupa-server API on :5000
 *   - the audit worker running (`npm run worker:audit`)  ← this spec fails fast
 *     with a "worker did not start" message if it is not
 *   - natlaupa-admin on :3002 (E2E_ADMIN_URL=http://localhost:3002)
 *   - website on :3001 (E2E_WEBSITE_URL) — the audit target must be a REACHABLE
 *     url so the degraded worker COMPLETEs (an unreachable domain FAILS at Band).
 *
 * DETERMINISM — why the fallback banner/badges are guaranteed here:
 *   With NO LLM provider keys configured, every dimension's narration falls to
 *   `fallbackNarrative()` server-side, so the gap-2 "AI-narration fallback"
 *   banner + per-card "AI fallback" badges fire on EVERY run. This is asserted
 *   hard below.
 *
 *   The gap-1 "data sources unavailable" (degradedTools) line is NOT asserted
 *   here: it additionally requires the data-gathering tool keys (PAGESPEED_API_KEY,
 *   SERP_API_KEY, …) to be unset. A local box with those set (but LLM keys unset)
 *   would not show that line, so asserting it would flake. Run with NO keys of any
 *   kind (LLM or data-API) to exercise it manually; it is left unasserted here.
 */

const WEBSITE_URL = process.env.E2E_WEBSITE_URL || 'http://localhost:3001';
// Target a REACHABLE site so the homepage fetch succeeds and the run COMPLETEs.
const AUDIT_TARGET_URL = `${WEBSITE_URL}/`;

/** Create an audit through the New Audit form and land on its cockpit. */
async function createAuditViaUi(
  page: import('@playwright/test').Page,
  clientName: string,
  url: string
): Promise<void> {
  await page.goto('/audits');
  await page.getByRole('button', { name: 'New Audit' }).click();
  await expect(page).toHaveURL(/\/audits\/new$/);
  await page.getByLabel('Client name').fill(clientName);
  await page.getByLabel('Website URL').fill(url);
  // businessType is a headless Select (combobox); default is Boutique Hotel but
  // set it explicitly, matching audits.spec.ts.
  await page.getByRole('combobox', { name: /business type/i }).click();
  await page.getByRole('option', { name: 'Boutique Hotel' }).click();
  await page.getByRole('button', { name: 'Create Audit' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: clientName }),
    'after submit, the cockpit should render (h1 = client name)'
  ).toBeVisible({ timeout: 20_000 });
}

test('audit lifecycle: create → run → progress → complete → publish (real UI clicks)', async ({
  page,
  context,
}) => {
  // The suite-global timeout is 45s (playwright.config); a real keyless run needs
  // longer, so raise it here explicitly (mirrors journey.spec.ts:61).
  test.setTimeout(120_000);
  // The Copy button writes to the clipboard; grant it so the success path runs.
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  const clientName = `E2E Lifecycle ${Date.now()}`;
  await createAuditViaUi(page, clientName, AUDIT_TARGET_URL);

  // --- 1) Trigger: "Run" is enabled (URL is set), then disables while in-flight.
  const runButton = page.getByRole('button', { name: 'Run', exact: true });
  await expect(runButton).toBeEnabled();
  await runButton.click();
  await expect(
    runButton,
    'the Run button should disable once the run is enqueued/in-flight'
  ).toBeDisabled();

  // --- 2) Pipeline tab: in-flight card + progress. FAIL FAST if the worker
  //        never picks the job up (it would sit in QUEUED forever otherwise).
  await page.getByRole('tab', { name: 'Pipeline' }).click();
  await expect(
    page.getByText(/^Running:/),
    'worker did not start PROCESSING within 15s — is `npm run worker:audit` running?'
  ).toBeVisible({ timeout: 15_000 });

  // --- 2b) A5: the elapsed ticker renders during PROCESSING and advances. It is
  //         client-side (1s interval), so it ticks independent of server polling.
  const ticker = page.getByText(/\d+s elapsed/);
  await expect(
    ticker,
    'the elapsed-time ticker should render once startedAt is set'
  ).toBeVisible({ timeout: 5_000 });
  const firstElapsed = await ticker.innerText();
  await new Promise((r) => setTimeout(r, 2100));
  // Guard the second sample: a fast run may COMPLETE (card gone) before we resample.
  if (await ticker.isVisible().catch(() => false)) {
    expect(
      await ticker.innerText(),
      'the elapsed ticker should advance while the run is in-flight'
    ).not.toEqual(firstElapsed);
  }

  // --- 3) Poll to COMPLETE. FAILED is a hard, fast stop (the "Audit failed"
  //        card is unambiguous on the Pipeline tab). Manual loop so FAILED does
  //        not silently wait out the full timeout (mirrors journey.spec.ts:113).
  const failedCard = page.getByText('Audit failed', { exact: true });
  const completeBadge = page.getByText('Complete', { exact: true }).first();
  const deadline = Date.now() + 90_000;
  let reached = '';
  while (Date.now() < deadline) {
    if (await failedCard.isVisible().catch(() => false)) {
      reached = 'FAILED';
      break;
    }
    if (await completeBadge.isVisible().catch(() => false)) {
      reached = 'COMPLETE';
      break;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  expect(
    reached,
    `audit must reach COMPLETE (got "${reached}"). FAILED => the degraded worker could not fetch ${AUDIT_TARGET_URL} (or no worker is running)`
  ).toBe('COMPLETE');

  // --- 4) Report tab: triage + evidence + the gap-2 fallback surfacing.
  await page.getByRole('tab', { name: 'Report' }).click();
  await expect(
    page.getByRole('heading', { name: 'Report triage' })
  ).toBeVisible();
  // A dimension card renders (grouped by pillar) with an evidence confidence
  // badge ("high/medium/low confidence" — lower-cased, from the evidence list).
  await expect(page.getByText('Website & UX').first()).toBeVisible();
  await expect(page.getByText(/\b(high|medium|low) confidence\b/).first()).toBeVisible();

  // gap-2 (keyless-deterministic): the run-quality banner names the fallback
  // dimensions, and each fallback-narrated card carries an "AI fallback" badge.
  await expect(
    page.getByText(/show AI-narration fallback text/)
  ).toBeVisible();
  await expect(page.getByText('AI fallback').first()).toBeVisible();

  // --- 4b) Negative assertion for isReducedConfidence's subjective exclusion:
  //         the two subjective dimensions carry 'low' evidence confidence BY
  //         CONSTRUCTION, so they must NOT get the "Low confidence" badge (they
  //         will correctly show "AI fallback"). Scope to each card so a badge on
  //         a different card cannot leak in.
  for (const subjective of ['Owned Audience', 'Social & Content']) {
    const card = page
      .locator('[data-slot="card"]')
      .filter({ has: page.getByText(subjective, { exact: true }) });
    await expect(card.first()).toBeVisible();
    await expect(
      card.getByText('Low confidence', { exact: true }),
      `${subjective} is subjective (low by construction) and must not be flagged Low confidence`
    ).toHaveCount(0);
  }

  // --- 5) Verify & Publish → header flips to Re-publish, status → Published.
  await page.getByRole('button', { name: 'Verify & Publish' }).click();
  const confirm = page.getByRole('alertdialog');
  await expect(confirm).toBeVisible();
  await confirm.getByRole('button', { name: 'Publish', exact: true }).click();

  await expect(
    page.getByRole('button', { name: 'Re-publish' })
  ).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Published', { exact: true }).first()).toBeVisible();

  // --- 6) Gated client link on the Pipeline tab. Assert the /r?slug=&token=
  //        PATH+QUERY shape only — NEXT_PUBLIC_REPORT_APP_URL host is not local.
  await page.getByRole('tab', { name: 'Pipeline' }).click();
  await expect(page.getByText('Gated client link')).toBeVisible();
  const reportLink = page.getByRole('link', { name: /View client report/i });
  const href = await reportLink.getAttribute('href');
  expect(href, 'gated link href').toMatch(/\/r\?slug=[^&]+&token=[^&]+$/);

  // --- 7) Copy → success toast with the exact copy.
  await page.getByRole('button', { name: /Copy gated link/i }).click();
  await expect(page.getByText('Gated client link copied')).toBeVisible();
});

/**
 * A4 — toast error reliability (verification only, no product change).
 *
 * The app's mutation error UX is toast-only (an intentional, app-wide choice).
 * This proves it renders readable ERROR copy in a real browser: force one
 * mutation (PATCH /audits/:id, via the Edit-details dialog) to 500 with
 * Playwright's page.route(), and assert the toast shows the SERVER message
 * (getErrorMessage → response.data.message), not merely "a toast appeared".
 *
 * The route glob targets the API origin path (`/api/v1/audits/*` on :5000, where
 * the client component fetches), NOT the admin origin the page is served from —
 * matching the wrong origin would let the real PATCH through and silently skip
 * the 500 path. Only PATCH is faked; GET polls and the earlier create continue.
 */
test('mutation errors surface a readable error toast (forced 500)', async ({
  page,
}) => {
  const clientName = `E2E ToastErr ${Date.now()}`;
  await createAuditViaUi(page, clientName, 'https://e2e-toast.example.com');

  const ERROR_COPY = 'Simulated audit update failure';
  await page.route('**/api/v1/audits/*', async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: ERROR_COPY }),
      });
      return;
    }
    await route.continue();
  });

  await page.getByRole('button', { name: 'Edit details' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Edit audit details')).toBeVisible();
  // Change a field so the PATCH body is non-empty (the server rejects empty ones).
  await dialog.getByLabel('Client name').fill(`${clientName} edited`);
  await dialog.getByRole('button', { name: 'Save changes' }).click();

  await expect(
    page.getByText(ERROR_COPY),
    'the sonner toast must show the server error copy, not a generic message'
  ).toBeVisible();
});
