# Admin E2E — local run preconditions

`playwright.config.ts` points the `admin` project at the LOCAL stack and never at
production. The admin specs (`e2e/admin/*.spec.ts`) authenticate via
`e2e/admin/auth.setup.ts`, which logs in as `super.admin@test.com` and injects
the JWT cookies into the browser storageState.

Most admin specs only need the API + admin frontend. Two specs additionally
drive a **real audit run** and so also need the audit worker + a reachable
website:

- `audit-lifecycle.spec.ts` — create → Run → progress → Complete → Publish.
- `audit-requests.spec.ts` — public lead → convert (needs the API only).

## Services

Bring all of these up first (each in its own terminal):

| Service | Port | Start command (from its package dir) | Needed by |
|---|---|---|---|
| `natlaupa-server` API | `5000` | `npm run dev` | every admin spec |
| Audit worker | — | `npm run worker:audit` | `audit-lifecycle.spec.ts` |
| `natlaupa-admin` | `3002` | `npm run dev -- -p 3002` | every admin spec |
| `website` (public) | `3001` | `npm run dev -- -p 3001` | audit target url |
| `report-app` | `3005` | `npm run dev -- -p 3005` | `journey.spec.ts` only (optional) |

The server also needs Postgres + Redis reachable (see the repo's docker stack
notes). The worker and the API share the same DB/Redis.

## Environment (from the `website/` dir, where Playwright runs)

```bash
export E2E_ADMIN_URL=http://localhost:3002    # config default is :3000 — WRONG for us
export E2E_WEBSITE_URL=http://localhost:3001  # the reachable audit target
export E2E_API_URL=http://localhost:5000/api/v1
# export E2E_REPORT_APP_URL=http://localhost:3005   # only for journey.spec.ts
```

The admin frontend must be built/run with its API base pointing at the server,
i.e. `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` (the default). The
forced-500 test in `audit-lifecycle.spec.ts` intercepts `**/api/v1/audits/*`, so
the admin must fetch the API under that `/api/v1/` path (the default).

### CORS — the admin origin MUST be in the server's allowlist

The admin authenticates via a client-side (browser) call to the API, so the
server's `CORS_ORIGINS` **must include the exact admin origin** you run on
(scheme + host + port). If it doesn't, the browser call is CORS-blocked, the app
falls back to unauthenticated, and `auth.setup.ts` fails with a redirect to
`/login` — taking every admin spec down with it. Symptom: `expect(page).not.
toHaveURL(/\/login/)` fails in the setup step.

`natlaupa-server` reads `CORS_ORIGINS` (comma-separated) and defaults to only
`http://localhost:3000,http://localhost:3001`. Whatever port you serve the admin
on (`3002`, `3006`, …), that origin must be in `CORS_ORIGINS`, and `E2E_ADMIN_URL`
must match it. (Verified 2026-07-15: a server configured for `:3006` but not
`:3002` blocked the whole admin suite until the admin was served on `:3006`.)

## Seed

Seed the QA database with the account `auth.setup.ts` expects:

```bash
# from natlaupa-server/
npm run test:seed        # creates super.admin@test.com / TestPassword123!
```

Do NOT use `npm run prisma:seed` — that seeds a different account and the admin
login setup will fail.

## Determinism — keep provider keys UNSET

`audit-lifecycle.spec.ts` runs the pipeline with **no provider keys** on purpose,
so its assertions are deterministic and it never spends money / hits flaky
external APIs (the suite runs `workers:1, retries:0`).

- **Required for the gap-2 assertions** (the "AI-narration fallback" banner +
  per-card "AI fallback" badges): all **LLM** keys unset, so every dimension
  narration falls back:
  - `OLLAMA_BASE_URL`, `OLLAMA_API_KEY`, `OPENROUTER_API_KEY`
- **Additionally required to exercise gap-1** (the "data sources unavailable"
  degradedTools line — NOT hard-asserted by the spec, so optional): all
  **data-gathering** keys also unset:
  - `PAGESPEED_API_KEY`, `GOOGLE_PLACES_API_KEY`, `SERP_API_KEY`,
    `BROWSERLESS_URL`, `BROWSERLESS_TOKEN`

If a local box has data-API keys set but LLM keys unset, gap-2 still fires
deterministically; gap-1's line simply won't appear (which is why the spec does
not assert it).

The audit target must stay **reachable** (`http://localhost:3001/`): the degraded
worker only COMPLETEs when it can fetch the homepage — an unreachable domain
FAILS at the Band phase.

## Run

```bash
# from website/
npx playwright test e2e/admin/audits.spec.ts          # baseline (no worker needed)
npx playwright test e2e/admin/audit-requests.spec.ts  # convert paths (API only)
npx playwright test e2e/admin/audit-lifecycle.spec.ts # full run (worker required)
```

If `audit-lifecycle.spec.ts` fails fast with "worker did not start PROCESSING",
the audit worker (`npm run worker:audit`) is not running.
