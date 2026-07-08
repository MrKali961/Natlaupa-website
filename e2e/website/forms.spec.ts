import { test, expect } from '@playwright/test';

/**
 * HOSPITALITY AUDIT-REQUEST FORM (project: website, baseURL :3001).
 *
 * The form (HotelPartnerLeadForm) is a client island that POSTs the lead
 * directly to the server's PUBLIC create endpoint (NEXT_PUBLIC_API_URL +
 * /audit-requests). For this suite the website must be pointed at the LOCAL
 * seeded server (http://localhost:5000/api/v1) — see e2e note in .env.local.
 * If it is still pointed at production, submitting would create a REAL lead and
 * the local-persistence assertion below would (correctly) fail.
 *
 * Tests:
 *  (1) Honeypot `website2` exists in the DOM and is not visible to a human.
 *  (2) BLANK OPTIONAL PHONE IS ACCEPTED (regression for the blank-phone fix):
 *      the task's exact field list (name/hotel/email/url + consent, NO phone) is
 *      the real optional-phone user path. The form was fixed to OMIT the phone
 *      field entirely when it is blank (HotelPartnerLeadForm.tsx payload():
 *      `...(form.phone.trim() ? { phone } : {})`) instead of sending phone:"",
 *      which the server's phone regex used to reject. So a blank-phone submit now
 *      SUCCEEDS (201) → success state renders → the lead persists with no phone.
 *      We verify persistence via the super-admin API and assert the stored phone
 *      is null/absent. (If the form regresses to sending phone:"", the create
 *      400/422s and this test goes red.)
 *  (3) HAPPY PATH: same fields + a valid phone → success state appears AND the
 *      lead is persisted (verified via the admin API with a super-admin token).
 */

const API = process.env.E2E_API_URL || 'http://localhost:5000/api/v1';

async function fillCore(page: import('@playwright/test').Page, lead: {
  name: string; hotel: string; email: string; url: string; phone?: string;
}) {
  await page.locator('input[name="contactName"]').fill(lead.name);
  await page.locator('input[name="hotelName"]').fill(lead.hotel);
  await page.locator('input[name="email"]').fill(lead.email);
  await page.locator('input[name="url"]').fill(lead.url);
  if (lead.phone) await page.locator('input[name="phone"]').fill(lead.phone);
  // Consent checkbox — scope to the AUDIT form's consent specifically. The page
  // also carries a Footer newsletter checkbox ("J'accepte de recevoir la …"), so
  // a bare getByRole('checkbox') is ambiguous. Match the audit-consent label
  // ("J'accepte que mes données …").
  await page.getByRole('checkbox', { name: /j'accepte que mes données/i }).check();
}

test.describe('hospitality audit-request form', () => {
  test('honeypot field `website2` exists and is hidden from humans', async ({ page }) => {
    await page.goto('/hospitality', { waitUntil: 'domcontentloaded' });
    const honeypot = page.locator('input[name="website2"]');
    await expect(honeypot, 'honeypot input present in DOM').toHaveCount(1);
    // Not keyboard-reachable.
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    // It lives in an off-screen aria-hidden wrapper. Playwright's toBeHidden only
    // counts display:none / visibility:hidden / zero-size, so for an OFF-SCREEN
    // honeypot we assert it is pushed out of the viewport instead (left:-9999px)
    // and sits inside an aria-hidden container — i.e. invisible to real users/AT.
    const box = await honeypot.boundingBox();
    expect(box, 'honeypot has a layout box').toBeTruthy();
    expect(box!.x + box!.width, 'honeypot is positioned off-screen (left)').toBeLessThan(0);
    const ariaHiddenAncestor = honeypot.locator(
      'xpath=ancestor::*[@aria-hidden="true"]',
    );
    await expect(ariaHiddenAncestor.first(), 'honeypot wrapped in aria-hidden').toHaveCount(1);
  });

  test('blank optional phone is accepted → success + persisted with no phone', async ({
    page,
    request,
  }) => {
    await page.goto('/hospitality', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const stamp = Date.now();
    const email = `e2e-nophone-${stamp}@example.com`;
    const hotel = `E2E NoPhone Hotel ${stamp}`;
    await fillCore(page, {
      name: 'E2E NoPhone',
      hotel,
      email,
      url: 'https://e2e-nophone.example.com',
      // phone intentionally omitted — the optional path. The fixed form OMITS the
      // phone field from the payload when blank, so the create must SUCCEED.
    });

    // Capture the create POST so we can confirm it hit the LOCAL stack + 2xx'd.
    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/audit-requests') && r.request().method() === 'POST',
        { timeout: 15_000 },
      ),
      page.getByRole('button', { name: /request details/i }).click(),
    ]);
    expect(
      resp.url(),
      'form must POST to the LOCAL stack (E2E .env.local repoint), not production',
    ).toContain('localhost:5000');
    expect(
      resp.status(),
      'blank optional phone must be ACCEPTED (form omits phone when blank — blank-phone fix)',
    ).toBe(201);

    // Success state renders (does NOT surface the form's inline error alert).
    await expect(page.getByText('Audit request received')).toBeVisible();
    const formAlert = page
      .locator('form')
      .filter({ has: page.locator('input[name="contactName"]') })
      .getByRole('alert');
    await expect(formAlert).toHaveCount(0);

    // Persisted to the local DB with NO phone. Log in as super admin (retry the
    // known 409 unique-token race) and look the lead up by its unique email.
    let token = '';
    let lastStatus = 0;
    for (let attempt = 0; attempt < 6; attempt++) {
      const login = await request.post(`${API}/auth/login`, {
        data: { email: 'super.admin@test.com', password: 'TestPassword123!' },
      });
      lastStatus = login.status();
      if (login.ok()) {
        token = (await login.json()).data.accessToken as string;
        break;
      }
      if (lastStatus !== 409) break;
      await new Promise((r) => setTimeout(r, 1200));
    }
    expect(token, `admin login for verification (last status ${lastStatus})`).toBeTruthy();

    const list = await request.get(`${API}/audit-requests?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.ok(), 'list audit-requests').toBeTruthy();
    const items = (await list.json()).data.items as Array<{
      email: string;
      hotelName: string;
      phone?: string | null;
    }>;
    const found = items.find((i) => i.email === email);
    expect(found, `lead with email ${email} persisted to local DB`).toBeTruthy();
    expect(found!.hotelName).toBe(hotel);
    // The blank optional phone must have been stored as null/absent, not "".
    expect(found!.phone ?? null, 'blank optional phone stored as null/absent').toBeFalsy();
  });

  test('HAPPY PATH: submit with valid phone → success state + persisted in local API', async ({
    page,
    request,
  }) => {
    await page.goto('/hospitality', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {});

    const stamp = Date.now();
    const email = `e2e-form-${stamp}@example.com`;
    const hotel = `E2E Form Hotel ${stamp}`;

    await fillCore(page, {
      name: 'E2E Form Lead',
      hotel,
      email,
      url: 'https://e2e-form.example.com',
      phone: '+33775743875',
    });

    // Confirm the POST goes to the LOCAL server (not production) and succeeds.
    const [resp] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/audit-requests') && r.request().method() === 'POST',
        { timeout: 15_000 },
      ),
      page.getByRole('button', { name: /request details/i }).click(),
    ]);
    expect(
      resp.url(),
      'form must POST to the LOCAL stack (E2E .env.local repoint), not production',
    ).toContain('localhost:5000');
    expect(resp.status(), 'create should succeed').toBe(201);

    // Success state renders.
    await expect(page.getByText('Audit request received')).toBeVisible();

    // Persisted: log in as super admin and find the lead by its unique email.
    // NOTE: login 409s (DUPLICATE_ERROR "Duplicate value for token") on rapid
    // repeat logins for the same user — a server-side unique-token race. Retry.
    let token = '';
    let lastStatus = 0;
    for (let attempt = 0; attempt < 6; attempt++) {
      const login = await request.post(`${API}/auth/login`, {
        data: { email: 'super.admin@test.com', password: 'TestPassword123!' },
      });
      lastStatus = login.status();
      if (login.ok()) {
        token = (await login.json()).data.accessToken as string;
        break;
      }
      if (lastStatus !== 409) break;
      await new Promise((r) => setTimeout(r, 1200));
    }
    expect(token, `admin login for verification (last status ${lastStatus})`).toBeTruthy();

    const list = await request.get(`${API}/audit-requests?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.ok(), 'list audit-requests').toBeTruthy();
    const items = (await list.json()).data.items as Array<{ email: string; hotelName: string }>;
    const found = items.find((i) => i.email === email);
    expect(found, `lead with email ${email} persisted to local DB`).toBeTruthy();
    expect(found!.hotelName).toBe(hotel);
  });
});
