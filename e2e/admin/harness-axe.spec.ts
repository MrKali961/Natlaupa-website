import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * W1.5b — axe-core accessibility scans over the /harness page in BOTH themes,
 * at every overlay composition (base page, dialog + nested alert, sheet,
 * open select, open dropdown, form in its submitted-invalid state).
 *
 * Theme is set BEFORE navigation via localStorage 'theme' (next-themes with
 * attribute="class" reads it on hydration and stamps <html class="dark">),
 * so every scan runs against fully themed colors — this is what makes the
 * color-contrast checks meaningful per theme.
 *
 * Zero-violation policy: expect([]) — no rule filters. If a rule ever needs
 * to be excluded as a verified false positive, filter by rule id inline with
 * a justifying comment (max 2 such filters).
 */

/** Run axe on the current page state and assert ZERO violations. */
async function expectNoAxeViolations(page: Page, state: string, include?: string) {
  const builder = new AxeBuilder({ page });
  if (include) builder.include(include);
  const results = await builder.analyze();
  // Filter 1 of max 2 — 'region' (best-practice "all content in landmarks"):
  // verified false positive for portaled popups. It fires only on the open
  // select listbox / dropdown menu, i.e. role="listbox" / role="menu" surfaces
  // that the WAI-APG combobox and menu-button patterns render in a portal at
  // <body> (outside every landmark) so they can escape ancestor
  // overflow/stacking contexts. That is the correct accessible markup: a
  // transient, trigger-anchored popup is not page content, and wrapping it in
  // a landmark role would pollute landmark navigation. axe-core itself
  // exempts modal dialog content from this rule for the same reason, and
  // portaled popover/menu content is a long-documented 'region' false
  // positive upstream (dequelabs/axe-core discussions; Radix UI portaled
  // primitives trip it identically).
  const filtered = results.violations.filter((v) => v.id !== 'region');
  // Summarize for a readable failure diff (rule id, impact, offending nodes).
  const violations = filtered.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }));
  expect(violations, `axe violations in state: ${state}`).toEqual([]);
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`axe (${theme} theme)`, () => {
    test.beforeEach(async ({ page }) => {
      // next-themes (attribute=class) reads localStorage 'theme' at hydration —
      // must be set BEFORE navigation.
      await page.addInitScript((t) => {
        window.localStorage.setItem('theme', t);
      }, theme);
      await page.goto('/harness');
      // Prove the theme actually applied, so a dark scan never silently runs
      // against light colors (or vice versa).
      if (theme === 'dark') {
        await expect(page.locator('html')).toHaveClass(/dark/);
      } else {
        await expect(page.locator('html')).not.toHaveClass(/dark/);
      }
    });

    test('base page', async ({ page }) => {
      await expectNoAxeViolations(page, `base /harness page [${theme}]`);
    });

    test('card grid section', async ({ page }) => {
      // The base-page scan already covers the whole document; this SCOPED
      // scan pins the CardGrid composition explicitly (stretched-link cards,
      // sibling checkbox/kebab layering — the nested-interactive hotspot) so
      // a regression there is named, not buried in a page-level diff.
      const section = page.getByTestId('hx-cardgrid-section');
      await expect(section).toBeVisible();
      await expect(
        section.getByTestId('card-grid-item').first()
      ).toBeVisible();
      await expectNoAxeViolations(
        page,
        `card grid section [${theme}]`,
        '[data-testid="hx-cardgrid-section"]'
      );
    });

    test('dialog open, then nested alert open', async ({ page }) => {
      await page.getByTestId('hx-dialog').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expectNoAxeViolations(page, `dialog open [${theme}]`);

      await page.getByTestId('hx-dialog-nested-trigger').click();
      await expect(page.getByRole('alertdialog')).toBeVisible();
      await expectNoAxeViolations(page, `dialog + nested alert open [${theme}]`);
    });

    test('sheet open', async ({ page }) => {
      await page.getByTestId('hx-sheet').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expectNoAxeViolations(page, `sheet open [${theme}]`);
    });

    test('select open', async ({ page }) => {
      await page.getByTestId('hx-select').click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expectNoAxeViolations(page, `select listbox open [${theme}]`);
    });

    test('dropdown open', async ({ page }) => {
      const trigger = page.getByTestId('hx-dropdown');
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('menu')).toBeVisible();
      await expectNoAxeViolations(page, `dropdown menu open [${theme}]`);
    });

    test('form submitted-invalid', async ({ page }) => {
      const form = page.getByTestId('hx-form');
      await form.getByRole('button', { name: /submit/i }).click();
      await expect(form.locator('[data-slot="form-message"]').first()).toBeVisible();
      await expectNoAxeViolations(page, `form submitted-invalid [${theme}]`);
    });
  });
}
