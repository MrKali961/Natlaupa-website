import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * W1.5b — keyboard / focus-management contract tests for the bespoke
 * (Radix-removed) admin component library, driven through the /harness page
 * on the admin app (authenticated 'admin' project).
 *
 * Harness testid contract (triggers/containers on /harness):
 *   hx-dialog                → button that opens the modal Dialog
 *   hx-dialog-nested-trigger → button INSIDE that dialog opening a nested AlertDialog
 *   hx-sheet                 → button that opens the Sheet (role=dialog)
 *   hx-sheet-nested-trigger  → button INSIDE the sheet opening a nested AlertDialog
 *   hx-select                → standalone Select trigger (role=combobox; options incl. Bali, Barcelona)
 *   hx-select-in-dialog      → Select trigger INSIDE the hx-dialog dialog
 *   hx-dropdown              → DropdownMenu trigger (menu contains a disabled item)
 *   hx-after-dropdown        → focusable element AFTER the dropdown trigger in tab order
 *   hx-tabs                  → Tabs container (one trigger disabled)
 *   hx-form                  → RHF form (text/email inputs + DatePicker; submit button)
 *   hx-toast                 → button firing the Undo toast (sonner v2: aria-live host section, li[data-sonner-toast])
 *
 * Component ARIA facts these assertions are built on (from
 * natlaupa-admin/src/components/ui/*): dialog content = role=dialog +
 * aria-modal, background siblings get aria-hidden + inert; alert dialog =
 * role=alertdialog, initial focus on Cancel, outside-click does NOT dismiss;
 * select = combobox trigger holding aria-activedescendant over an always-
 * mounted role=listbox ([role=option], data-disabled); dropdown = role=menu
 * with roving focus ([role^=menuitem], data-disabled skipped); tabs =
 * automatic activation, disabled trigger has aria-disabled="true"; form
 * messages = [data-slot="form-message"], invalid controls get aria-invalid.
 */

/** Poll until DOM focus (document.activeElement) sits inside `container`. */
async function expectFocusInside(container: Locator, label: string) {
  await expect(async () => {
    const inside = await container.evaluate((el) => el.contains(document.activeElement));
    expect(inside, `${label}: document.activeElement must be INSIDE the container`).toBe(true);
  }, label).toPass({ timeout: 5000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/harness');
});

// ---------------------------------------------------------------------------
// DIALOG — focus moves in, Tab is trapped, Esc closes, focus restores,
// background is aria-hidden/inert while open.
// ---------------------------------------------------------------------------
test('dialog: traps focus, Esc closes, focus restores, background inert', async ({ page }) => {
  const trigger = page.getByTestId('hx-dialog');
  await trigger.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // 1) Opening moves focus INSIDE the dialog.
  await expectFocusInside(dialog, 'dialog just opened');

  // 2) While open, the app root outside the portal is hidden from AT and
  //    unfocusable (aria-hidden + inert on the body-level siblings).
  const backgroundHidden = await trigger.evaluate(
    (el) => !!el.closest('[aria-hidden="true"], [inert]')
  );
  expect(backgroundHidden, 'app root behind the modal must be aria-hidden/inert').toBe(true);

  // 3) Tab cycles stay within the dialog (10 presses, always inside).
  for (let i = 1; i <= 10; i++) {
    await page.keyboard.press('Tab');
    await expectFocusInside(dialog, `dialog focus trap: Tab press #${i}`);
  }

  // 4) Esc closes; focus returns to the trigger; background restored.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const backgroundRestored = await trigger.evaluate(
    (el) => !el.closest('[aria-hidden="true"], [inert]')
  );
  expect(backgroundRestored, 'aria-hidden/inert must be released after close').toBe(true);
});

// ---------------------------------------------------------------------------
// ALERT DIALOG nested inside the dialog — Cancel gets focus, its OWN trap,
// inside/backdrop clicks don't dismiss, Esc peels one layer only.
// ---------------------------------------------------------------------------
test('alert dialog (nested in dialog): Cancel focused, own trap, click-safe, Esc closes only the alert', async ({
  page,
}) => {
  await page.getByTestId('hx-dialog').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.getByTestId('hx-dialog-nested-trigger').click();
  const alert = page.getByRole('alertdialog');
  await expect(alert).toBeVisible();

  // 1) Initial focus lands on the SAFE control (Cancel).
  const cancel = alert.getByRole('button', { name: /cancel/i });
  await expect(cancel).toBeFocused();

  // 2) Tab is trapped in the ALERT — never escapes into the outer dialog.
  for (let i = 1; i <= 6; i++) {
    await page.keyboard.press('Tab');
    await expectFocusInside(alert, `alert focus trap: Tab press #${i}`);
    const inOuterOnly = await dialog.evaluate((outer) => {
      const active = document.activeElement;
      return !!active && outer.contains(active);
    });
    expect(inOuterOnly, `Tab #${i}: focus must not fall back into the OUTER dialog`).toBe(false);
  }

  // 3) Clicking INSIDE the alert closes nothing.
  await alert.locator('[data-slot="alert-dialog-title"]').click();
  await expect(alert).toBeVisible();
  await expect(dialog).toBeVisible();

  // 4) Backdrop click does NOT dismiss an alert dialog.
  await page.mouse.click(5, 5);
  await expect(alert).toBeVisible();
  await expect(dialog).toBeVisible();

  // 5) Esc closes ONLY the alert; outer dialog survives; focus returns inside it.
  await page.keyboard.press('Escape');
  await expect(alert).toBeHidden();
  await expect(dialog).toBeVisible();
  await expectFocusInside(dialog, 'after closing nested alert');
});

// ---------------------------------------------------------------------------
// SHEET + nested alert — layered dismissal with focus restored per level.
// ---------------------------------------------------------------------------
test('sheet + nested alert: click inside keeps sheet open, Esc peels layers with focus restore', async ({
  page,
}) => {
  const sheetTrigger = page.getByTestId('hx-sheet');
  await sheetTrigger.click();
  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();

  await page.getByTestId('hx-sheet-nested-trigger').click();
  const alert = page.getByRole('alertdialog');
  await expect(alert).toBeVisible();

  // Clicking INSIDE the alert must not close the alert nor the sheet under it.
  await alert.locator('[data-slot="alert-dialog-title"]').click();
  await expect(alert).toBeVisible();
  await expect(sheet).toBeVisible();

  // Esc #1 → only the alert closes; focus returns into the sheet.
  await page.keyboard.press('Escape');
  await expect(alert).toBeHidden();
  await expect(sheet).toBeVisible();
  await expectFocusInside(sheet, 'after closing the sheet-nested alert');

  // Esc #2 → the sheet closes; focus restores to the sheet trigger.
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(sheetTrigger).toBeFocused();
});

// ---------------------------------------------------------------------------
// SELECT — full APG combobox/listbox keyboard model on the standalone select.
// ---------------------------------------------------------------------------
test('select: arrows/Home/End/type-ahead move aria-activedescendant, Enter selects, Esc/Tab close', async ({
  page,
}) => {
  const trigger = page.getByTestId('hx-select');

  /** Text of the option the trigger's aria-activedescendant points at. */
  const activeOptionText = () =>
    page.evaluate(() => {
      const t = document.querySelector('[data-testid="hx-select"]');
      const id = t?.getAttribute('aria-activedescendant');
      return id ? (document.getElementById(id)?.textContent ?? '').trim() : null;
    });

  // Focus the trigger; ArrowDown opens the listbox with an active option.
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-activedescendant', /.+/);
  const initialActive = await trigger.getAttribute('aria-activedescendant');

  // ArrowDown moves the active option (activedescendant changes, focus stays on trigger).
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => trigger.getAttribute('aria-activedescendant')).not.toBe(initialActive);
  await expect(trigger).toBeFocused();

  // Home/End jump to first/last ENABLED option.
  const optionIds: string[] = await listbox
    .locator('[role="option"]:not([data-disabled])')
    .evaluateAll((els) => els.map((el) => el.id));
  expect(optionIds.length, 'harness select needs enabled options').toBeGreaterThan(1);
  await page.keyboard.press('End');
  await expect(trigger).toHaveAttribute('aria-activedescendant', optionIds[optionIds.length - 1]);
  await page.keyboard.press('Home');
  await expect(trigger).toHaveAttribute('aria-activedescendant', optionIds[0]);

  // Type-ahead: 'b' jumps to Bali; repeating 'b' cycles to Barcelona.
  await page.keyboard.press('b');
  await expect.poll(activeOptionText, 'type-ahead "b" should land on Bali').toBe('Bali');
  await page.keyboard.press('b');
  await expect
    .poll(activeOptionText, 'repeated "b" should cycle Bali → Barcelona')
    .toBe('Barcelona');

  // Enter selects, closes, returns focus to the trigger, and shows the value.
  await page.keyboard.press('Enter');
  await expect(listbox).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText('Barcelona');

  // Esc closes WITHOUT changing the selection.
  await page.keyboard.press('ArrowDown'); // reopen
  await expect(listbox).toBeVisible();
  await page.keyboard.press('ArrowUp'); // move the active option away…
  await page.keyboard.press('Escape'); // …then bail out
  await expect(listbox).toBeHidden();
  await expect(trigger).toContainText('Barcelona'); // unchanged
  await expect(trigger).toBeFocused();

  // Tab while open just closes the listbox (focus moves on natively).
  await page.keyboard.press('ArrowDown'); // reopen
  await expect(listbox).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(listbox).toBeHidden();
});

// ---------------------------------------------------------------------------
// SELECT inside a DIALOG — Esc peels the select first, the dialog second.
// ---------------------------------------------------------------------------
test('select in dialog: Esc closes only the select, second Esc closes the dialog', async ({
  page,
}) => {
  await page.getByTestId('hx-dialog').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.getByTestId('hx-select-in-dialog').click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();

  // Esc #1 → ONLY the select closes; the dialog stays open.
  await page.keyboard.press('Escape');
  await expect(listbox).toBeHidden();
  await expect(dialog).toBeVisible();

  // Esc #2 → now the dialog closes.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

// ---------------------------------------------------------------------------
// DROPDOWN MENU — APG menu-button keyboard model with roving focus.
// ---------------------------------------------------------------------------
test('dropdown: ArrowDown/Up open at first/last item, arrows skip disabled, Esc refocuses trigger, Tab exits forward', async ({
  page,
}) => {
  const trigger = page.getByTestId('hx-dropdown');
  const menu = page.getByRole('menu');
  const enabledItems = menu.locator('[role^="menuitem"]:not([data-disabled])');
  const disabledItems = menu.locator(
    '[role^="menuitem"][data-disabled], [role^="menuitem"][aria-disabled="true"]'
  );

  // ArrowDown on the trigger opens with the FIRST enabled item focused.
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(menu).toBeVisible();
  await expect(enabledItems.first()).toBeFocused();

  // Close and reopen with ArrowUp → LAST enabled item focused.
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(menu).toBeVisible();
  await expect(enabledItems.last()).toBeFocused();

  // The skip assertion is only meaningful if a disabled item actually exists.
  await expect(disabledItems, 'harness dropdown must contain a disabled item').not.toHaveCount(0);

  // Arrow through a full wrap-around cycle: focus must always land on an
  // ENABLED menu item — the disabled one is skipped, never focused.
  const enabledCount = await enabledItems.count();
  await page.keyboard.press('Home');
  await expect(enabledItems.first()).toBeFocused();
  for (let i = 1; i <= enabledCount; i++) {
    await page.keyboard.press('ArrowDown');
    const onEnabledItem = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const role = el.getAttribute('role') ?? '';
      return (
        role.startsWith('menuitem') &&
        el.getAttribute('data-disabled') === null &&
        el.getAttribute('aria-disabled') !== 'true'
      );
    });
    expect(onEnabledItem, `ArrowDown #${i}: focus must sit on an ENABLED menu item`).toBe(true);
  }

  // Esc closes and refocuses the trigger.
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  // Reopen, then Tab: the menu closes AND focus continues to the next
  // tab-order element after the trigger.
  await page.keyboard.press('ArrowDown');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(menu).toBeHidden();
  await expect(page.getByTestId('hx-after-dropdown')).toBeFocused();
});

// ---------------------------------------------------------------------------
// TABS — automatic activation, disabled trigger skipped, Home/End, panel ARIA.
// ---------------------------------------------------------------------------
test('tabs: ArrowRight moves focus+selection skipping disabled, Home/End work, panel labelled by its tab', async ({
  page,
}) => {
  const tabs = page.getByTestId('hx-tabs');
  const tablist = tabs.getByRole('tablist');
  const enabledTabs = tablist.locator('[role="tab"]:not([aria-disabled="true"]):not([disabled])');
  const disabledTabs = tablist.locator('[role="tab"][aria-disabled="true"], [role="tab"][disabled]');

  // The skip assertion needs an actual disabled trigger in the harness.
  await expect(disabledTabs, 'harness tabs must contain a disabled trigger').not.toHaveCount(0);
  const enabledCount = await enabledTabs.count();
  expect(enabledCount, 'harness tabs need at least 2 enabled triggers').toBeGreaterThan(1);

  // Click the first enabled tab → focused + selected.
  await enabledTabs.first().click();
  await expect(enabledTabs.first()).toBeFocused();
  await expect(enabledTabs.first()).toHaveAttribute('aria-selected', 'true');

  // ArrowRight walks EXACTLY the enabled-tab sequence (automatic activation):
  // matching the nth ENABLED tab at each step proves the disabled trigger is
  // skipped for both focus and selection.
  for (let i = 1; i < enabledCount; i++) {
    await page.keyboard.press('ArrowRight');
    await expect(enabledTabs.nth(i)).toBeFocused();
    await expect(enabledTabs.nth(i)).toHaveAttribute('aria-selected', 'true');
  }

  // Home → first enabled tab; End → last enabled tab (focus + selection).
  await page.keyboard.press('Home');
  await expect(enabledTabs.first()).toBeFocused();
  await expect(enabledTabs.first()).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(enabledTabs.last()).toBeFocused();
  await expect(enabledTabs.last()).toHaveAttribute('aria-selected', 'true');

  // The visible panel is a role=tabpanel labelled by the selected tab.
  const selectedTabId = await enabledTabs.last().getAttribute('id');
  expect(selectedTabId, 'selected tab must have an id for panel labelling').toBeTruthy();
  const panel = tabs.getByRole('tabpanel');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('aria-labelledby', selectedTabId!);
});

// ---------------------------------------------------------------------------
// FORM — invalid submit surfaces messages + focuses the first invalid control;
// fixing every field (incl. the DatePicker) makes the submit succeed.
// ---------------------------------------------------------------------------
test('form: empty submit shows messages + focuses first invalid; fixing fields (incl. DatePicker) clears them', async ({
  page,
}) => {
  const form = page.getByTestId('hx-form');
  const submit = form.getByRole('button', { name: /submit/i });
  // Spec adjusted to the library's real (and correct) live-region markup:
  // FormMessage renders an ALWAYS-MOUNTED <p data-slot="form-message"
  // aria-live="polite"> placeholder (reserved height for zero CLS; a live
  // region must already exist in the DOM before text is injected for AT to
  // announce it). So "a validation message is showing" means the node has
  // TEXT, not that the node exists — count only non-empty messages.
  const messages = form
    .locator('[data-slot="form-message"]')
    .filter({ hasText: /\S/ });
  const invalidControls = form.locator('[aria-invalid="true"]');

  // 1) Submit empty → validation messages render.
  await submit.click();
  await expect(messages.first()).toBeVisible();
  expect(await messages.count()).toBeGreaterThan(0);

  // 2) Focus moved to the FIRST invalid control, which carries aria-invalid.
  await expect(invalidControls.first()).toBeFocused();

  // 3) Fix the fields. Text/email inputs first.
  const textboxes = form.getByRole('textbox');
  const textboxCount = await textboxes.count();
  for (let i = 0; i < textboxCount; i++) {
    const box = textboxes.nth(i);
    const type = ((await box.getAttribute('type')) ?? '').toLowerCase();
    await box.fill(type === 'email' ? 'harness@example.com' : 'Playwright harness');
  }

  // Any select in the form: pick the first enabled option.
  const combo = form.locator('[role="combobox"]');
  if ((await combo.count()) > 0) {
    await combo.first().click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await listbox.locator('[role="option"]:not([data-disabled])').first().click();
    await expect(listbox).toBeHidden();
  }

  // 4) DatePicker: open the popover, pick a day, popover closes, value shown.
  const dateTrigger = form.getByRole('button', { name: /date/i }).first();
  await dateTrigger.click();
  const calendar = page.locator('[data-slot="calendar"]');
  await expect(calendar).toBeVisible();
  await calendar
    .locator('table button:not([disabled])')
    .filter({ hasText: /^15$/ })
    .first()
    .click();
  await expect(calendar).toBeHidden();
  await expect(dateTrigger, 'DatePicker trigger must display the picked date').toContainText(/15/);

  // 5) Submit again → success: no messages, nothing invalid.
  await submit.click();
  await expect(messages).toHaveCount(0);
  await expect(invalidControls).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// CARD GRID — stretched-link card: tab order is checkbox → link → kebab
// (checkbox and kebab are SIBLINGS layered above the link's ::after overlay,
// never nested inside the anchor); the checkbox toggles the controlled
// selection; the whole card body is the link's click target; the kebab opens
// its menu without triggering the card navigation.
// Harness testids: hx-cardgrid-rich / hx-cardgrid-compact wrap CardGrid
// instances (card-grid-item / card-link / card-select), hx-card-kebab is the
// per-card actions trigger.
// ---------------------------------------------------------------------------
test('card grid: tab order checkbox → stretched link → kebab; checkbox toggles selection; kebab stays local; card body navigates', async ({
  page,
}) => {
  const rich = page.getByTestId('hx-cardgrid-rich');
  const card = rich.getByTestId('card-grid-item').first();
  const checkbox = card.getByTestId('card-select');
  const link = card.getByTestId('card-link');
  const kebab = card.getByTestId('hx-card-kebab');

  // 1) Tab order per card: checkbox → stretched link → kebab (DOM order).
  await checkbox.focus();
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(kebab).toBeFocused();

  // 2) Controlled selection: Space toggles the checkbox and the card reads
  //    selected (data-selected tint channel); toggling back clears it.
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(card).toHaveAttribute('data-selected', 'true');
  await expect(rich.getByText('Rich (1 selected)')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(card).not.toHaveAttribute('data-selected', /.*/);
  await expect(rich.getByText('Rich (0 selected)')).toBeVisible();

  // 3) Kebab opens its menu WITHOUT navigating (sibling above the overlay).
  const urlBefore = page.url();
  await kebab.click();
  await expect(page.getByRole('menu')).toBeVisible();
  expect(page.url()).toBe(urlBefore);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(kebab).toBeFocused();

  // 4) Stretched link: clicking the card itself activates the card link
  //    (href = /harness#rich-stay-1) — the ::after overlay (a descendant of
  //    the card) intercepts every non-interactive region, so the card-level
  //    click IS the whole-card open gesture.
  await card.click();
  await expect(page).toHaveURL(/#rich-stay-1$/);
});

// ---------------------------------------------------------------------------
// TOAST — Undo toast announces via the toaster's aria-live region and its
// action is focusable.
// ---------------------------------------------------------------------------
test('toast: Undo toast renders inside sonner’s aria-live region with a keyboard-focusable Undo button', async ({
  page,
}) => {
  await page.getByTestId('hx-toast').click();

  // Spec adjusted to sonner v2's REAL accessible markup (verified against
  // sonner 2.0.7 dist): it renders NO role="status" node. Announcements come
  // from the Toaster host — a <section aria-label="Notifications …"
  // aria-live="polite" aria-relevant="additions text"> (computed role:
  // region) — and each toast is an <li data-sonner-toast> inside it. So we
  // assert the live-region semantics on the host and locate the toast by
  // sonner's stable data attribute instead of a role=status that never exists.
  const toaster = page.locator('section[aria-label^="Notifications"]');
  await expect(toaster).toHaveAttribute('aria-live', 'polite');

  const toast = page
    .locator('[data-sonner-toast]')
    .filter({ has: page.getByRole('button', { name: /undo/i }) });
  await expect(toast).toBeVisible();

  const undo = toast.getByRole('button', { name: /undo/i });
  // Keyboard-focusable: not opted out of the tab order, and actually focusable.
  const tabindex = await undo.getAttribute('tabindex');
  expect(
    tabindex === null || Number(tabindex) >= 0,
    'Undo button must not have a negative tabindex'
  ).toBe(true);
  await undo.focus();
  await expect(undo).toBeFocused();
});
