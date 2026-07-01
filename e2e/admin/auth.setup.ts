import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Admin auth setup — logs in via the API and injects the admin's JWT cookies
 * (natlaupa_access_token / natlaupa_refresh_token, read by src/lib/api-client.ts)
 * into the browser storageState. More reliable than driving the login form.
 */
const API = process.env.E2E_API_URL || 'http://localhost:5000/api/v1';
const AUTH_FILE = path.join(__dirname, '..', '.auth', 'admin.json');

setup('authenticate as super admin', async ({ request, context, page, baseURL }) => {
  const res = await request.post(`${API}/auth/login`, {
    data: { email: 'super.admin@test.com', password: 'TestPassword123!' },
  });
  expect(res.ok(), `login failed: ${res.status()}`).toBeTruthy();
  const body = await res.json();
  const accessToken: string = body.data.accessToken;
  const refreshToken: string = body.data.refreshToken;
  expect(accessToken).toBeTruthy();

  const host = new URL(baseURL || 'http://localhost:3000').hostname;
  await context.addCookies([
    { name: 'natlaupa_access_token', value: accessToken, domain: host, path: '/', sameSite: 'Lax' },
    { name: 'natlaupa_refresh_token', value: refreshToken, domain: host, path: '/', sameSite: 'Lax' },
  ]);

  // Sanity: the dashboard root should render (not bounce to /login).
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await expect(page).not.toHaveURL(/\/login/);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await context.storageState({ path: AUTH_FILE });
});
