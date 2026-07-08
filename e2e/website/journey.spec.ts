import { test, expect, type APIRequestContext } from '@playwright/test';

/**
 * END-TO-END AUDIT JOURNEY (cross-app), runs in the `website` project so it can
 * also open a real browser. Orchestrated mostly via API, with a UI check on the
 * gated report-app.
 *
 * Flow:
 *   1) submit a lead  → POST /audit-requests (public; phone omitted — the API
 *      accepts an absent phone, only an empty-string phone 400s).
 *   2) admin converts → POST /audit-requests/:id/convert → audit id.
 *   3) PATCH the audit → set url + businessType.
 *   4) trigger         → POST /audits/:id/trigger.
 *   5) poll            → GET /audits/:id until top-level status COMPLETE (≤60s).
 *   6) publish         → POST /audits/:id/publish → shareSlug + shareToken.
 *   7) open report-app → http://localhost:3005/r?slug&token and assert the
 *      report renders (client name heading). Falls back to asserting the public
 *      API returns the report if :3005 is unreachable / mis-pointed.
 *   8) bad token       → /r shows "Report unavailable"; public API returns 401.
 *
 * KEY LEARNINGS baked in:
 *  - The degraded worker only COMPLETEs when the target URL is FETCHABLE. An
 *    unreachable domain FAILS at the Band phase ("homepage could not be
 *    fetched"). So we audit a REACHABLE url — the local website root (:3001).
 *  - Poll the TOP-LEVEL `data.status` via JSON (a naive string scan hits a
 *    nested `"status":"partial"` inside the report scoring and lies).
 */

const API = process.env.E2E_API_URL || 'http://localhost:5000/api/v1';
const WEBSITE = process.env.E2E_WEBSITE_URL || 'http://localhost:3001';
const REPORT_APP = process.env.E2E_REPORT_APP_URL || 'http://localhost:3005';
// Target the audit at a reachable site so the homepage fetch succeeds.
const AUDIT_TARGET_URL = `${WEBSITE}/`;

test.describe.configure({ mode: 'serial' });

/**
 * Log in as super admin. FINDING: the login endpoint 409s with
 * DUPLICATE_ERROR ("Duplicate value for token") on rapid repeat logins for the
 * same user — a unique-constraint collision on the session/refresh token row
 * instead of rotating it. Tests log in several times, so we retry past the 409.
 */
async function adminToken(request: APIRequestContext): Promise<string> {
  let last = 0;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'super.admin@test.com', password: 'TestPassword123!' },
    });
    last = res.status();
    if (res.ok()) return (await res.json()).data.accessToken as string;
    if (last !== 409) break; // only the duplicate-token race is retryable
    await new Promise((r) => setTimeout(r, 1200));
  }
  throw new Error(`admin login failed: ${last}`);
}

test('cross-app audit journey: lead → convert → run → publish → gated report', async ({
  request,
  page,
}) => {
  test.setTimeout(120_000);
  const email = `journey-${Date.now()}@example.com`;
  const hotel = `Journey Hotel ${Date.now()}`;

  // (1) Submit a lead via the PUBLIC create endpoint (phone omitted on purpose).
  const create = await request.post(`${API}/audit-requests`, {
    data: {
      contactName: 'Journey Lead',
      hotelName: hotel,
      email,
      url: 'https://journey-lead.example.com',
      message: 'cross-app journey',
      website2: '',
      consent: true,
    },
  });
  expect(create.status(), 'public lead create').toBe(201);

  const token = await adminToken(request);
  const auth = { Authorization: `Bearer ${token}` };

  // Find the request id we just created (create returns data:null by design).
  const listReq = await request.get(`${API}/audit-requests?limit=50`, { headers: auth });
  expect(listReq.ok()).toBeTruthy();
  const requests = (await listReq.json()).data.items as Array<{ id: string; email: string }>;
  const lead = requests.find((r) => r.email === email);
  expect(lead, 'created lead is listed').toBeTruthy();

  // (2) Convert → audit id.
  const conv = await request.post(`${API}/audit-requests/${lead!.id}/convert`, {
    headers: auth,
    data: {},
  });
  expect(conv.ok(), `convert: ${conv.status()}`).toBeTruthy();
  const auditId = (await conv.json()).data.id as string;
  expect(auditId, 'audit id from convert').toBeTruthy();

  // (3) PATCH url + businessType (point at a REACHABLE url so the run completes).
  const patch = await request.patch(`${API}/audits/${auditId}`, {
    headers: auth,
    data: { url: AUDIT_TARGET_URL, businessType: 'boutique-hotel' },
  });
  expect(patch.ok(), `patch: ${patch.status()}`).toBeTruthy();

  // (4) Trigger the run.
  const trig = await request.post(`${API}/audits/${auditId}/trigger`, {
    headers: auth,
    data: {},
  });
  expect(trig.ok(), `trigger: ${trig.status()}`).toBeTruthy();

  // (5) Poll top-level status until COMPLETE (≤60s). FAILED is a hard stop.
  let status = '';
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const g = await request.get(`${API}/audits/${auditId}`, { headers: auth });
    expect(g.ok()).toBeTruthy();
    status = (await g.json()).data.status as string;
    if (status === 'COMPLETE' || status === 'FAILED') break;
    await new Promise((r) => setTimeout(r, 2_000));
  }
  expect(
    status,
    `audit must COMPLETE (got ${status}). FAILED => the degraded worker could not fetch ${AUDIT_TARGET_URL}`,
  ).toBe('COMPLETE');

  // (6) Publish → shareSlug + shareToken.
  const pub = await request.post(`${API}/audits/${auditId}/publish`, {
    headers: auth,
    data: {},
  });
  expect(pub.ok(), `publish: ${pub.status()}`).toBeTruthy();
  const published = (await pub.json()).data as { shareSlug: string; shareToken: string };
  expect(published.shareSlug, 'shareSlug').toBeTruthy();
  expect(published.shareToken, 'shareToken').toBeTruthy();

  const slug = published.shareSlug;
  const goodToken = published.shareToken;

  // (7) Open the gated report-app and assert it renders. The report-app fetches
  // the report client-side from the public API, so we wait for that fetch and
  // then assert a STABLE element (the client-name heading), not a score number.
  let reportAppReachable = true;
  try {
    const resp = await page.goto(`${REPORT_APP}/r?slug=${slug}&token=${goodToken}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    expect(resp, 'report-app responded').toBeTruthy();
  } catch {
    reportAppReachable = false;
    test.info().annotations.push({
      type: 'report-app-unreachable',
      description: `${REPORT_APP} not reachable; falling back to public-API assertion only.`,
    });
  }

  if (reportAppReachable) {
    // It must NOT be the error state, and it must show the report.
    await expect(
      page.getByRole('heading', { name: 'Report unavailable' }),
      'gated report should render, not the unavailable state',
    ).toHaveCount(0, { timeout: 20_000 });
    // The client name (= hotel) is rendered somewhere in the report view.
    await expect(page.getByText(hotel, { exact: false }).first()).toBeVisible({
      timeout: 20_000,
    });
  }

  // Always assert the public API itself returns the report with the good token.
  const pubGood = await request.get(
    `${API}/audits/public/${slug}?token=${encodeURIComponent(goodToken)}`,
  );
  expect(pubGood.status(), 'public report w/ good token').toBe(200);

  // (8) Wrong token → public API 401; report-app shows "Report unavailable".
  const pubBad = await request.get(
    `${API}/audits/public/${slug}?token=WRONG-${goodToken}`,
  );
  expect(pubBad.status(), 'public report w/ bad token').toBe(401);

  if (reportAppReachable) {
    await page.goto(`${REPORT_APP}/r?slug=${slug}&token=WRONG-${goodToken}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(
      page.getByRole('heading', { name: 'Report unavailable' }),
    ).toBeVisible({ timeout: 20_000 });
  }
});
