import { test, expect, type Page } from '@playwright/test';

/**
 * W2 EXIT-GATE — shell / navigation contract tests for the redesigned admin
 * shell (authenticated 'admin' project, baseURL = E2E_ADMIN_URL).
 *
 * Shell contract these assertions are built on (DESIGN-FOUNDATION.md §3.8 +
 * shell-nav-v1.decisions.json):
 *   - NON-SCROLLING SHELL: html,body{height:100%;overflow:hidden}; the ONLY
 *     scrollable pane is [data-scroll-container][data-testid="content-scroller"];
 *     sidebar + header + breadcrumb stay pinned (shell-persistent-chrome).
 *   - ACTIVE NAV: exactly one sidebar item carries aria-current="page"
 *     (sidebar-active-state: the single gold resting pop-out).
 *   - BREADCRUMBS: [data-testid="crumb-bar"] on inner pages, Section › List ›
 *     Record; ancestors are links, the current segment is aria-current="page";
 *     hidden on '/' (breadcrumbs decision).
 *   - PALETTE: { CommandPalette } renders its own header trigger
 *     [data-testid="cmdk-trigger"] (wide omnibox + kbd chip) and a
 *     Cmd/Ctrl-K-bound dialog [data-testid="cmdk-dialog"] with entity-scoped
 *     groups incl. Pages (cmdk-omnibox / cmdk-scoped-results /
 *     cmdk-keyboard-first).
 *   - MOBILE (<1024px): sidebar becomes an overlay drawer behind a header
 *     hamburger (mobile-drawer).
 */

const SCROLLER = '[data-testid="content-scroller"]';

/** Sidebar nav locator — excludes the breadcrumb <nav aria-label="Breadcrumb">. */
function sidebarNav(page: Page) {
  return page
    .locator('nav:not([aria-label="Breadcrumb" i])')
    .filter({ has: page.locator('a[href="/hotels"]') })
    .first();
}

/** Give the scroller guaranteed overflow (data-independent), then scroll it. */
async function padAndScroll(page: Page, scrollTo = 600): Promise<number> {
  return page.evaluate(
    ({ sel, scrollTo }) => {
      const scroller = document.querySelector(sel) as HTMLElement;
      if (!scroller) throw new Error('content-scroller not found');
      // Data-independent overflow: a tall inert spacer inside the scroller so
      // the scroll assertions never depend on how many DB rows are seeded.
      const spacer = document.createElement('div');
      spacer.setAttribute('data-e2e-spacer', 'true');
      spacer.style.height = '3000px';
      spacer.style.flexShrink = '0';
      scroller.appendChild(spacer);
      scroller.scrollTop = scrollTo;
      return scroller.scrollTop;
    },
    { sel: SCROLLER, scrollTo }
  );
}

const scrollTopOf = (page: Page) =>
  page.evaluate((sel) => (document.querySelector(sel) as HTMLElement).scrollTop, SCROLLER);

test.beforeEach(async ({ page }) => {
  await page.goto('/hotels');
  await expect(page.getByTestId('content-scroller')).toBeVisible();
});

// ---------------------------------------------------------------------------
// 1. NON-SCROLLING SHELL — the document never scrolls; only the content pane
//    does; sidebar + header stay pinned through a deep content scroll.
// ---------------------------------------------------------------------------
test('non-scrolling shell: document has no vertical scrollbar, content-scroller is the only scroll pane, chrome stays pinned', async ({
  page,
}) => {
  // The document itself must not be scrollable (±2px tolerance for
  // sub-pixel rounding of the scrolling element's metrics).
  const doc = await page.evaluate(() => {
    const se = document.scrollingElement!;
    return { scrollHeight: se.scrollHeight, clientHeight: se.clientHeight };
  });
  expect(
    doc.scrollHeight,
    'document.scrollingElement must not overflow vertically (html/body overflow:hidden)'
  ).toBeLessThanOrEqual(doc.clientHeight + 2);

  // The single sanctioned scroll pane exists and is styled scrollable.
  const scroller = page.locator(SCROLLER);
  await expect(scroller).toHaveCount(1);
  await expect(scroller).toHaveAttribute('data-scroll-container', /.*/);
  const overflowY = await scroller.evaluate((el) => getComputedStyle(el).overflowY);
  expect(['auto', 'scroll'], 'content-scroller must be the scrollable pane').toContain(overflowY);

  // Scroll deep inside the pane (guaranteed overflow via injected spacer)…
  const scrolled = await padAndScroll(page, 800);
  expect(scrolled, 'content-scroller must actually scroll').toBeGreaterThan(0);

  // …and the wayfinding chrome must remain in the viewport: sidebar nav and
  // the header's palette trigger are still visible, and the window itself
  // did not move.
  await expect(sidebarNav(page)).toBeVisible();
  await expect(page.getByTestId('cmdk-trigger')).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

// ---------------------------------------------------------------------------
// 2. SCROLL RESET — navigating via the sidebar returns the pane to the top.
// ---------------------------------------------------------------------------
test('scroll reset: sidebar navigation returns content-scroller scrollTop to 0', async ({
  page,
}) => {
  const scrolled = await padAndScroll(page, 700);
  expect(scrolled).toBeGreaterThan(0);

  // Click a different sidebar destination (Offers).
  await sidebarNav(page).locator('a[href="/offers"]').click();
  await expect(page).toHaveURL(/\/offers/);
  await expect(page.getByTestId('content-scroller')).toBeVisible();

  await expect
    .poll(() => scrollTopOf(page), 'scroll position must reset to top after navigation')
    .toBe(0);
});

// ---------------------------------------------------------------------------
// 3. ACTIVE NAV — exactly ONE sidebar item is aria-current="page".
// ---------------------------------------------------------------------------
test('active nav: on /hotels the /hotels sidebar link is aria-current="page" and is the only one', async ({
  page,
}) => {
  const nav = sidebarNav(page);
  await expect(nav.locator('a[href="/hotels"]')).toHaveAttribute('aria-current', 'page');
  // The single-pop-out rule: no other nav item may claim the active state.
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
});

// ---------------------------------------------------------------------------
// 4. BREADCRUMBS — Section › List › Record trail; hidden on '/'.
// ---------------------------------------------------------------------------
test('breadcrumbs: /hotels shows current crumb, nested route shows linked ancestor + leaf, "/" hides the bar', async ({
  page,
}) => {
  // /hotels (from beforeEach): bar visible, 'Hotels' is the current crumb.
  const crumbBar = page.getByTestId('crumb-bar');
  await expect(crumbBar).toBeVisible();
  const current = crumbBar.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toContainText(/hotels/i);

  // Nested route: a linked ancestor plus a non-linked current leaf.
  // SPEC FIX (justified): /inquiries/hotel is deliberately rendered as ONE
  // crumb ("Hotel Inquiries") because no /inquiries index page exists — a
  // linked "Inquiries" ancestor would be a dead 404 link, violating the
  // honest-navigation decision. /hotels/new is a real nested route whose
  // ancestor (/hotels) is a live page, so it exercises the same contract.
  await page.goto('/hotels/new');
  await expect(crumbBar).toBeVisible();
  const ancestorLinks = crumbBar.locator('a[href]');
  await expect(
    ancestorLinks.first(),
    'nested route must render at least one LINKED ancestor crumb'
  ).toBeVisible();
  const leaf = crumbBar.locator('[aria-current="page"]');
  await expect(leaf).toHaveCount(1);
  // The current leaf is never itself a navigable ancestor link.
  await expect(crumbBar.locator('a[href][aria-current="page"]')).toHaveCount(0);

  // Root: no breadcrumb bar.
  await page.goto('/');
  await expect(page.getByTestId('crumb-bar')).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// 5. COMMAND PALETTE — Ctrl/Cmd-K opens, Pages search navigates, trigger
//    reopens, Esc closes AND restores focus to the trigger.
// ---------------------------------------------------------------------------
test('palette: Ctrl+K opens, "hote" surfaces Pages→Hotels, Enter navigates, trigger reopens, Esc restores focus', async ({
  page,
}) => {
  const dialog = page.getByTestId('cmdk-dialog');
  const trigger = page.getByTestId('cmdk-trigger');

  // Start from a page that is NOT /hotels so the Enter-navigation is observable.
  await page.goto('/offers');
  await expect(trigger).toBeVisible();

  // Keyboard open.
  await page.keyboard.press('ControlOrMeta+k');
  await expect(dialog).toBeVisible();

  // Type-to-search: Pages result for Hotels surfaces on 'hote'.
  await page.keyboard.type('hote');
  const hotelsResult = dialog
    .locator('[role="option"], [cmdk-item], [data-cmdk-item], a, button')
    .filter({ hasText: /^hotels$/i })
    .first();
  await expect(hotelsResult, 'Pages group must surface a Hotels result for "hote"').toBeVisible();

  // Enter opens the selected page.
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/hotels/);
  await expect(dialog).toBeHidden();

  // Reopen via the header omnibox trigger.
  await trigger.click();
  await expect(dialog).toBeVisible();

  // Record-search stability: ≥2 chars must not crash/blank the dialog —
  // we deliberately do NOT depend on seeded records being returned.
  await page.keyboard.type('ba');
  await expect(dialog).toBeVisible();

  // Esc closes AND focus returns to the trigger.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

// ---------------------------------------------------------------------------
// 6. SCROLL-BEHIND-MODAL (M2) — with a dialog open, wheel over the overlay
//    must NOT scroll the content pane; closing restores scrolling.
// ---------------------------------------------------------------------------
test('scroll-behind-modal: open dialog blocks wheel-scroll of content-scroller, close restores it', async ({
  page,
}) => {
  await page.goto('/harness');
  await expect(page.getByTestId('content-scroller')).toBeVisible();

  // Guarantee overflow and park the pane mid-scroll.
  const before = await padAndScroll(page, 400);
  expect(before).toBeGreaterThan(0);

  // Open the harness modal dialog.
  await page.getByTestId('hx-dialog').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Wheel over the overlay (viewport corner, outside the dialog panel).
  await page.mouse.move(10, Math.floor(page.viewportSize()!.height / 2));
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(250); // allow any (buggy) scroll to flush
  expect(
    await scrollTopOf(page),
    'content-scroller must NOT scroll behind an open modal'
  ).toBe(before);

  // Close the dialog → scrolling works again.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.mouse.move(
    Math.floor(page.viewportSize()!.width / 2),
    Math.floor(page.viewportSize()!.height / 2)
  );
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => scrollTopOf(page), 'scrolling must be restored after the modal closes')
    .toBeGreaterThan(before);
});

// ---------------------------------------------------------------------------
// 7. MOBILE SMOKE (390x844) — hamburger drawer navigates; palette reachable.
// ---------------------------------------------------------------------------
test.describe('mobile smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile: menu button opens the drawer, a nav link navigates, palette is reachable', async ({
    page,
  }) => {
    // beforeEach already landed on /hotels at mobile viewport.
    // Open the drawer via the header hamburger.
    const menuButton = page
      .getByRole('button', { name: /menu|navigation|open nav/i })
      .first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // A nav link inside the drawer navigates.
    // SPEC FIX (justified): the desktop sidebar legitimately stays in the DOM
    // at mobile widths (CSS `hidden lg:flex` — standard responsive practice),
    // so an unscoped `.first()` resolves to that CSS-hidden desktop link, not
    // the drawer's. Scope to the open drawer (role="dialog") — which is the
    // actual intent: "a nav link INSIDE THE DRAWER navigates".
    const offersLink = page.getByRole('dialog').locator('a[href="/offers"]').first();
    await expect(offersLink).toBeVisible();
    await offersLink.click();
    await expect(page).toHaveURL(/\/offers/);

    // Palette is reachable: click the trigger if it survived the mobile
    // header, otherwise the global Ctrl/Cmd-K binding must still work.
    const trigger = page.getByTestId('cmdk-trigger');
    const dialog = page.getByTestId('cmdk-dialog');
    if (await trigger.isVisible()) {
      await trigger.click();
    } else {
      await page.keyboard.press('ControlOrMeta+k');
    }
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
