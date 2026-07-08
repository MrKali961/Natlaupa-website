import { test, expect } from '@playwright/test';

/**
 * AUDIT COCKPIT spec.
 *
 * Journey: /audits → "New Audit" → fill the create form (clientName, url,
 * businessType — a Radix Select) → "Create Audit" → land on the detail page
 * (the verification cockpit) → assert the cockpit renders (h1 = clientName,
 * status badge, meta) → open the "Edit details" dialog to confirm the
 * affordance works.
 *
 * We do NOT drive a real audit trigger here (no provider keys locally; the
 * journey agent covers the run path). We only exercise create → cockpit → edit.
 */

test('audit cockpit: create an audit and open its verification cockpit', async ({
  page,
}) => {
  // Unique client name so the detail-page h1 (={clientName}) is unambiguous
  // and reruns never collide on it.
  const clientName = `E2E Smoke ${Date.now()}`;
  const url = 'https://e2e-smoke.example.com';

  // 1) List page loads.
  await page.goto('/audits');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Audits' })
  ).toBeVisible();

  // 2) "New Audit" → create form.
  await page.getByRole('button', { name: 'New Audit' }).click();
  await expect(page).toHaveURL(/\/audits\/new$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'New Audit' })
  ).toBeVisible();

  // 3) Fill the form.
  // clientName + url are plain inputs.
  await page.getByLabel('Client name').fill(clientName);
  await page.getByLabel('Website URL').fill(url);

  // businessType is a Radix Select (combobox), NOT a text input. It already
  // defaults to "Boutique Hotel", but the task asks us to set it explicitly:
  // open the combobox, pick the portal-rendered option.
  await page.getByRole('combobox', { name: /business type/i }).click();
  await page.getByRole('option', { name: 'Boutique Hotel' }).click();

  // 4) Submit → land on the detail cockpit (/audits/:id).
  await page.getByRole('button', { name: 'Create Audit' }).click();

  // The create mutation + navigation is the slow step under full-suite load,
  // so the detail h1 (= clientName) is the PRIMARY post-submit gate, with a
  // generous timeout, asserted BEFORE the URL checks.
  await expect(
    page.getByRole('heading', { level: 1, name: clientName }),
    'after submit, the cockpit should render the new audit (h1 = client name)'
  ).toBeVisible({ timeout: 20_000 });

  // URL is now on the detail route. Note: [^/]+ would also match /audits/new,
  // so the regex explicitly excludes "new".
  await expect(page).toHaveURL(/\/audits\/(?!new$)[^/]+$/);

  // 5) Cockpit renders: the cockpit description, a status badge (a new
  // admin-created audit is "Pending"), and the URL we entered.
  await expect(page.getByText('Audit verification cockpit')).toBeVisible();
  await expect(page.getByText('Pending', { exact: true })).toBeVisible();
  await expect(page.getByText(url)).toBeVisible();

  // 6) "Edit details" affordance opens the edit dialog.
  await page.getByRole('button', { name: 'Edit details' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText('Edit audit details')
  ).toBeVisible();
});
