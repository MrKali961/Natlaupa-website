import { test, expect, type APIRequestContext } from '@playwright/test';

/**
 * AUDIT REQUESTS — lead triage → convert, driven through the admin UI.
 *
 * Two real paths off the kebab's "Convert to audit":
 *   1. A lead WITH a url converts successfully and lands on the new audit's
 *      cockpit, whose Source correctly reads "Lead (public request)" (an
 *      existing, never-UI-exercised render branch — createFromRequest sets
 *      source = PUBLIC_REQUEST).
 *   2. A URL-less lead's "Convert to audit" click shows the explanatory toast
 *      and does NOT navigate. (The item stays enabled + clickable rather than
 *      disabled — a disabled menu item's `title` never fires because
 *      data-[disabled]:pointer-events-none kills hover, so the guard lives in
 *      the click handler, verified here.)
 *
 * Leads are created via the UNAUTHENTICATED public POST /audit-requests (the
 * same clean path journey.spec uses) — the admin storageState carries cookies,
 * not the Bearer token the authed API expects, so authed `request` calls would
 * need a separate login. The public create needs none.
 */

const API = process.env.E2E_API_URL || 'http://localhost:5000/api/v1';

/** Create a public lead exactly as the website form does (honeypot empty). */
async function createLead(
  request: APIRequestContext,
  data: { hotelName: string; email: string; url?: string }
): Promise<void> {
  const res = await request.post(`${API}/audit-requests`, {
    data: {
      contactName: 'E2E Convert Lead',
      hotelName: data.hotelName,
      email: data.email,
      ...(data.url ? { url: data.url } : {}),
      message: 'e2e convert path',
      website2: '',
      consent: true,
    },
  });
  expect(res.status(), 'public lead create').toBe(201);
}

test('convert: a URL-having lead becomes an audit whose Source is "Lead (public request)"', async ({
  page,
  request,
}) => {
  const stamp = Date.now();
  const hotel = `Convert OK Hotel ${stamp}`;
  await createLead(request, {
    hotelName: hotel,
    email: `convert-ok-${stamp}@example.com`,
    url: 'https://convert-ok.example.com',
  });

  // Find the lead by its unique name and open the kebab → Convert to audit.
  await page.goto('/audit-requests');
  await page.getByLabel('Search audit requests').fill(hotel);
  const kebab = page.getByRole('button', { name: `Actions for ${hotel}` });
  await expect(kebab).toBeVisible({ timeout: 15_000 });
  await kebab.click();
  await page.getByRole('menuitem', { name: 'Convert to audit' }).click();

  // Lands on the new audit's cockpit (clientName = hotelName).
  await expect(page).toHaveURL(/\/audits\/(?!new$)[^/]+$/, { timeout: 20_000 });
  await expect(
    page.getByRole('heading', { level: 1, name: hotel })
  ).toBeVisible({ timeout: 20_000 });

  // Source renders the lead branch on the Pipeline tab.
  await page.getByRole('tab', { name: 'Pipeline' }).click();
  await expect(page.getByText('Lead (public request)')).toBeVisible();
});

test('convert: a URL-less lead shows an explanatory toast and does not navigate', async ({
  page,
  request,
}) => {
  const stamp = Date.now();
  const hotel = `Convert NoURL Hotel ${stamp}`;
  await createLead(request, {
    hotelName: hotel,
    email: `convert-nourl-${stamp}@example.com`,
    // url intentionally omitted
  });

  await page.goto('/audit-requests');
  await page.getByLabel('Search audit requests').fill(hotel);
  const kebab = page.getByRole('button', { name: `Actions for ${hotel}` });
  await expect(kebab).toBeVisible({ timeout: 15_000 });
  await kebab.click();
  await page.getByRole('menuitem', { name: 'Convert to audit' }).click();

  // The guard fires: explanatory toast, and we stay on the list (no navigation).
  await expect(page.getByText(/no website URL/i)).toBeVisible();
  await expect(page).toHaveURL(/\/audit-requests/);
});
