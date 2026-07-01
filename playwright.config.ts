import { defineConfig, devices } from '@playwright/test';

/**
 * Natlaupa Track-B E2E (UI) config. Drives BOTH frontends against the LOCAL
 * stack (server on :5000, admin on :3000, website on :3001) seeded into
 * natlaupa_qa. Specs live in ./e2e: e2e/website/* hit the public site,
 * e2e/admin/* hit the dashboard (authenticated via a storageState produced by
 * e2e/admin/auth.setup.ts). NEVER point this at production.
 *
 * Run: npx playwright test   (servers must be up — see qa/RUN.md)
 */
const ADMIN_URL = process.env.E2E_ADMIN_URL || 'http://localhost:3000';
const WEBSITE_URL = process.env.E2E_WEBSITE_URL || 'http://localhost:3001';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'e2e/report', open: 'never' }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    // 1) Admin login → persist storageState for the authenticated admin specs.
    {
      name: 'admin-setup',
      testMatch: /admin\/auth\.setup\.ts$/,
      use: { ...devices['Desktop Chrome'], baseURL: ADMIN_URL },
    },
    // 2) Authenticated admin dashboard specs.
    {
      name: 'admin',
      testMatch: /admin\/.*\.spec\.ts$/,
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ADMIN_URL,
        storageState: 'e2e/.auth/admin.json',
      },
    },
    // 3) Public website specs (no auth).
    // NOTE: anchored on `e2e/website/` (not just `website/`) — the PROJECT FOLDER
    // itself is named "website", so the absolute test path contains "website/"
    // and a bare /website\// matched EVERY spec (incl. e2e/admin/*). Anchoring on
    // the e2e/<area>/ segment disambiguates admin vs website specs.
    {
      name: 'website',
      testMatch: /e2e[\\/]website[\\/].*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], baseURL: WEBSITE_URL },
    },
    // 4) Mobile smoke of the public site (responsive check).
    {
      name: 'website-mobile',
      testMatch: /e2e[\\/]website[\\/].*\.mobile\.spec\.ts$/,
      use: { ...devices['Pixel 7'], baseURL: WEBSITE_URL },
    },
  ],
});
