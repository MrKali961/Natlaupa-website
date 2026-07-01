import { test, expect, type Page } from '@playwright/test';

/**
 * Data-driven SMOKE over EVERY admin dashboard route.
 *
 * For each route we prove three things at once:
 *   1. It does NOT bounce to /login (auth wiring works with the seeded
 *      super-admin storageState).
 *   2. It renders MEANINGFUL content — the page's real <h1> (sourced from the
 *      live code: PageHeader title / hardcoded h1). The login page never shows
 *      these headings, so this also doubles as a robust anti-bounce guard
 *      (the URL check alone races against client-side redirects).
 *   3. The page's own backend calls behave: NO API response from the API
 *      server (localhost:5000) returns >= 500, and none of its data calls are
 *      4xx. This proves the frontend↔backend wiring per page.
 *
 * One test() per route (not a single loop) so a failure on one page does not
 * mask the others, each gets a fresh page + isolated response listener, and
 * Playwright captures a per-failure screenshot/trace (configured globally).
 *
 * There are no custom error.tsx / not-found.tsx boundaries in natlaupa-admin
 * (verified), so a present, correct <h1> is a sufficient "not an error page"
 * signal.
 */

const API_HOST = 'localhost:5000';
// Base for direct API probes (the gap tracker hits the server, not the admin UI).
const API = process.env.E2E_API_URL || 'http://localhost:5000/api/v1';

// The three analytics endpoints the admin /analytics page calls (via
// use-analytics.ts: useUserGrowth / useBookingStats / useHotelPerformance) that
// the SERVER does not implement → 404. The server's analytics router only has
// dashboard, hotels/:id, revenue, occupancy, conversion, customers/clv, angels
// (see natlaupa-server/src/routes/v1/analytics.routes.ts).
const MISSING_ANALYTICS_PATHS = [
  '/analytics/user-growth',
  '/analytics/bookings',
  '/analytics/hotel-performance',
];

/**
 * Log in as the seeded super admin and return a bearer access token. Mirrors
 * e2e/admin/auth.setup.ts. Retries the known 409 unique-token race on rapid
 * repeat logins for the same user.
 */
async function superAdminToken(request: import('@playwright/test').APIRequestContext): Promise<string> {
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
  expect(token, `admin login (last status ${lastStatus})`).toBeTruthy();
  return token;
}

interface RouteCase {
  /** Path under the admin baseURL (:3000). */
  path: string;
  /** Exact text of the page's real <h1> (from the live source). */
  heading: string;
}

// Every dashboard route the task enumerates, reconciled against the real
// (dashboard) route group + the live page <h1> text. The sidebar comments
// several of these out (customers, bookings, angels, reviews, analytics,
// users) — we still goto() them directly, which proves those un-navigable
// pages load and wire to the backend.
const ROUTES: RouteCase[] = [
  { path: '/', heading: 'Dashboard' },
  // NOTE: /analytics is NOT in this generic loop. It renders fine (heading +
  // mock-data fallback) but its data hooks call 3 endpoints the server does not
  // implement (user-growth / bookings / hotel-performance → 404), so the generic
  // "no 4xx" assertion would fail on a KNOWN, tracked gap. /analytics has its own
  // dedicated render test (tolerating ONLY those 3 paths) + a test.fail() gap
  // tracker below. /finance stays here — its Stripe calls now degrade to 200.
  { path: '/finance', heading: 'Finance Dashboard' },
  { path: '/hotels', heading: 'Hotels' },
  { path: '/rooms', heading: 'Rooms' },
  { path: '/destinations', heading: 'Destinations' },
  { path: '/styles', heading: 'Hotel Styles' },
  { path: '/bookings', heading: 'Bookings' },
  { path: '/payments', heading: 'Payments' },
  { path: '/customers', heading: 'Customers' },
  { path: '/angels', heading: 'Angels' },
  { path: '/applications/angel', heading: 'Angel Applications' },
  { path: '/applications/partnership', heading: 'Partnership Applications' },
  { path: '/blog', heading: 'Blog Posts' },
  { path: '/offers', heading: 'Experience Offers' },
  { path: '/inquiries', heading: 'Hotel Inquiries' },
  { path: '/messages', heading: 'Contact Messages' },
  { path: '/reviews', heading: 'Hotel Reviews' },
  { path: '/testimonials', heading: 'Testimonials' },
  { path: '/newsletter', heading: 'Newsletter' },
  { path: '/newsletter-campaigns', heading: 'Newsletter Campaigns' },
  { path: '/email-templates', heading: 'Email Templates' },
  { path: '/users', heading: 'Admin Users' },
  { path: '/settings', heading: 'Settings' },
  { path: '/audits', heading: 'Audits' },
  { path: '/audit-requests', heading: 'Audit Requests' },
];

/**
 * Attach a response listener scoped to the API server (:5000). Returns two
 * arrays that get populated as the page makes its data calls:
 *   - serverErrors: any :5000 response with status >= 500 (always a failure)
 *   - clientErrors: any :5000 response with status >= 400 < 500 (a finding)
 * We deliberately ignore :3000 / _next / favicon traffic.
 */
function watchApi(page: Page) {
  const serverErrors: string[] = [];
  const clientErrors: string[] = [];
  page.on('response', (res) => {
    const url = res.url();
    if (!url.includes(API_HOST)) return;
    const status = res.status();
    if (status >= 500) {
      serverErrors.push(`${status} ${res.request().method()} ${url}`);
    } else if (status >= 400) {
      clientErrors.push(`${status} ${res.request().method()} ${url}`);
    }
  });
  return { serverErrors, clientErrors };
}

for (const route of ROUTES) {
  test(`dashboard smoke: ${route.path} (${route.heading})`, async ({ page }) => {
    const { serverErrors, clientErrors } = watchApi(page);

    await page.goto(route.path);

    // Meaningful content: the page's real h1. Absent on /login, so this is
    // simultaneously our anti-bounce + anti-error-page guard. This is the
    // primary gate — NOT networkidle (the /audits list polls on a timer).
    await expect(
      page.getByRole('heading', { level: 1, name: route.heading }),
      `route ${route.path} should render its <h1> "${route.heading}" (not bounce to /login or render an error page)`
    ).toBeVisible();

    // Secondary: confirm the URL did not get rewritten to /login by a
    // client-side redirect (checked AFTER the page settled, not right after goto).
    await expect(page, `route ${route.path} must not redirect to /login`).not.toHaveURL(
      /\/login/
    );

    // Best-effort: let late-firing data calls land so the listener captures
    // them. Polling pages may never reach true idle, so this is non-fatal.
    await page.waitForLoadState('networkidle').catch(() => {});

    // Backend wiring assertions. Kept STRONG on purpose — a real broken
    // connection is a FINDING, not something to weaken away.
    expect(
      serverErrors,
      `route ${route.path}: API server returned 5xx — backend error:\n${serverErrors.join(
        '\n'
      )}`
    ).toEqual([]);
    expect(
      clientErrors,
      `route ${route.path}: page's own data calls returned 4xx — broken frontend↔backend wiring:\n${clientErrors.join(
        '\n'
      )}`
    ).toEqual([]);
  });
}

// ---------------------------------------------------------------------------
// /analytics — pulled OUT of the generic loop. The page itself RENDERS fine
// (heading + mock-data fallback when its data calls fail), but three of its
// data hooks hit endpoints the server never implemented (→ 404). We assert the
// page renders + wires to a non-5xx backend, and tolerate ONLY those three
// known-missing 404 paths — any OTHER 4xx (e.g. a regression in the Stripe-backed
// usePaymentStatistics call) still fails this test. The 404s themselves are
// tracked by the explicit test.fail() gap tracker below, so they stay visible.
// ---------------------------------------------------------------------------
test('dashboard smoke: /analytics (Analytics) — renders; tolerates only the 3 known 404s', async ({
  page,
}) => {
  const serverErrors: string[] = [];
  const unexpectedClientErrors: string[] = [];
  const knownMissing: string[] = [];
  page.on('response', (res) => {
    const url = res.url();
    if (!url.includes(API_HOST)) return;
    const status = res.status();
    if (status >= 500) {
      serverErrors.push(`${status} ${res.request().method()} ${url}`);
    } else if (status >= 400) {
      if (status === 404 && MISSING_ANALYTICS_PATHS.some((p) => url.includes(p))) {
        knownMissing.push(`${status} ${url}`);
      } else {
        unexpectedClientErrors.push(`${status} ${res.request().method()} ${url}`);
      }
    }
  });

  await page.goto('/analytics');

  // The page renders its real <h1> (proves it did not bounce to /login or crash).
  await expect(
    page.getByRole('heading', { level: 1, name: 'Analytics' }),
    'route /analytics should render its <h1> "Analytics" (not bounce to /login or error)'
  ).toBeVisible();
  await expect(page, 'route /analytics must not redirect to /login').not.toHaveURL(/\/login/);

  await page.waitForLoadState('networkidle').catch(() => {});

  // No 5xx — the backend is up; the page must not crash its server-side calls.
  expect(
    serverErrors,
    `route /analytics: API server returned 5xx — backend error:\n${serverErrors.join('\n')}`
  ).toEqual([]);
  // No UNEXPECTED 4xx — only the three documented missing analytics endpoints
  // (tracked separately) are tolerated. Anything else is a real wiring break.
  expect(
    unexpectedClientErrors,
    `route /analytics: unexpected 4xx (beyond the 3 known-missing analytics endpoints) — broken wiring:\n${unexpectedClientErrors.join(
      '\n'
    )}`
  ).toEqual([]);
});

// ---------------------------------------------------------------------------
// KNOWN GAP TRACKER (expected-to-fail). The admin /analytics page calls three
// endpoints the server does NOT implement, so three charts are broken:
//   /analytics/user-growth, /analytics/bookings, /analytics/hotel-performance
// This is a REAL gap, not hidden: test.fail() means "this SHOULD pass but
// currently can't". We assert the DESIRED state (each endpoint returns a
// non-404, i.e. is implemented). Today all three 404 → the test fails as
// EXPECTED (Playwright reports it as expected-failed, NOT a suite failure).
//
// FIX: implement these three routes in natlaupa-server's analytics router
// (+ controllers), OR remap the admin's use-analytics.ts hooks to existing
// endpoints. When the gap is closed, this test PASSES → Playwright flags an
// UNEXPECTED PASS (suite goes red) → prompting removal of this test.fail()
// annotation. The probe is AUTHED (super admin) so the flip happens the moment
// the routes exist even if they sit behind auth (an unauthed probe would 401 and
// never flip).
// ---------------------------------------------------------------------------
test('KNOWN GAP: admin /analytics calls 3 unimplemented endpoints (user-growth/bookings/hotel-performance) → 404', async ({
  request,
}) => {
  test.fail(); // expected-to-fail until the server implements these routes
  const token = await superAdminToken(request);
  const statuses: Record<string, number> = {};
  for (const path of MISSING_ANALYTICS_PATHS) {
    const res = await request.get(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    statuses[path] = res.status();
  }
  // DESIRED state: every endpoint is implemented (any non-404 status). Today they
  // all 404, so this assertion fails — exactly as test.fail() expects.
  for (const path of MISSING_ANALYTICS_PATHS) {
    expect(
      statuses[path],
      `${path} should be implemented (non-404). Observed statuses: ${JSON.stringify(statuses)}`
    ).not.toBe(404);
  }
});
