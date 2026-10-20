import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/** Iframe names rendered by each payment form. */
const CARD_IFRAMES = [
  'cardNumber',
  'expirationMonth',
  'expirationYear',
  'CVV',
] as const;
const BANK_ACCOUNT_IFRAMES = ['routingNumber', 'accountNumber'] as const;

/**
 * Wait for a hosted iframe to be loaded and interactive.
 *
 * `iframe-input` renders its wrapper as `visibility: hidden; height: 0` until
 * the frame reports `iframeLoaded`, so the iframe element becoming visible in
 * the PARENT document is the real readiness signal. The inner input can be
 * "visible" inside its own document long before that, which is not enough:
 * `validate()` and `tokenize()` postMessage into the frame and wait for a
 * reply with no timeout, so talking to a frame that is not listening yet hangs
 * until the test times out rather than failing.
 */
export async function waitForIframeInput(page: Page, iframeName: string) {
  await page
    .locator(`iframe[name="${iframeName}"]`)
    .waitFor({ state: 'visible', timeout: 15000 });
  const input = page
    .frameLocator(`iframe[name="${iframeName}"]`)
    .locator('input');
  await input.waitFor({ state: 'visible', timeout: 15000 });
  return input;
}

/** Wait for every card-form iframe to be loaded and interactive. */
export async function waitForCardForm(page: Page) {
  await Promise.all(CARD_IFRAMES.map((name) => waitForIframeInput(page, name)));
}

/** Wait for every bank-account-form iframe to be loaded and interactive. */
export async function waitForBankAccountForm(page: Page) {
  await Promise.all(
    BANK_ACCOUNT_IFRAMES.map((name) => waitForIframeInput(page, name)),
  );
}

/**
 * Wait for a list component's table to finish loading real rows.
 *
 * The table renders a single-cell `loading-state` / `empty-state` /
 * `error-state` row while it has no data, so a row simply existing is not a
 * signal that the data arrived.
 */
export async function waitForTableRows(page: Page, tagName: string) {
  await expect(
    page
      .locator(
        `${tagName} tbody tr:first-child td:not(.loading-state):not(.empty-state):not(.error-state)`,
      )
      .first(),
  ).toBeVisible({ timeout: 15000 });
}

/**
 * Wait for a table's first row to settle on content different from `previousText`.
 *
 * Asserting `not.toHaveText(previousText)` alone passes on the loading row that
 * renders mid-fetch, so this ignores any state where the table is still loading.
 */
export async function waitForTableRowChange(
  page: Page,
  tagName: string,
  previousText: string,
) {
  const firstRow = page.locator(`${tagName} tbody tr:first-child`);
  await expect
    .poll(
      async () => {
        if ((await page.locator(`${tagName} td.loading-state`).count()) > 0) {
          return previousText;
        }
        return (await firstRow.textContent()) ?? previousText;
      },
      { timeout: 15000 },
    )
    .not.toBe(previousText);
}

/** Fill an input inside a hosted iframe. */
export async function fillIframeInput(
  page: Page,
  iframeName: string,
  value: string,
) {
  const input = await waitForIframeInput(page, iframeName);
  await input.fill(value);
}

/**
 * Wait for a web component to finish hydrating.
 *
 * Stencil stamps the `hydrated` class on the host element once the component
 * has rendered, which is the real signal this used to approximate with a flat
 * 3s sleep.
 *
 * This is hydration ONLY — the first render, which for a component that fetches
 * is still its loading state. Anything that reads data, calls a component
 * method, or clicks a control the component owns needs a second wait for the
 * thing it actually depends on: `waitForCardForm()`, `waitForTableRows()`, or a
 * web-first assertion on the element in question.
 */
export async function waitForComponent(page: Page, tagName: string) {
  await page
    .locator(`${tagName}.hydrated`)
    .waitFor({ state: 'visible', timeout: 30000 });
}

/**
 * Wait for a component to report its filled fields as valid.
 *
 * Hosted iframe fields report their state back to the host component
 * asynchronously, so a successful `fill()` does not mean the component has
 * registered the value yet. `validate()` is the component's own view of that
 * state, which is what the flat 2s sleeps used to approximate.
 */
export async function waitForFieldsValid(page: Page, tagName: string) {
  await expect
    .poll(
      () =>
        page.evaluate(async (tag) => {
          const el = document.querySelector(tag) as any;
          if (!el) return false;
          const result = await el.validate();
          return !!result?.isValid;
        }, tagName),
      { timeout: 15000 },
    )
    .toBe(true);
}

/** Returns a promise that resolves when a console error-event is logged for the given component. */
export function listenForErrorEvent(
  page: Page,
  componentName: string,
): Promise<string> {
  return new Promise((resolve) => {
    page.on('console', (msg) => {
      if (
        msg.type() === 'error' &&
        msg.text().includes(`[${componentName}] error-event`)
      ) {
        resolve(msg.text());
      }
    });
  });
}

/** Returns a promise that resolves when submit-event is logged (e.g. from example page listener). */
export function listenForSubmitEvent(page: Page): Promise<string> {
  return new Promise((resolve) => {
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('submit-event')) {
        resolve(text);
      }
    });
  });
}

/** Fill card iframe fields + billing via fill-billing-form button. */
export async function fillCardForm(page: Page) {
  await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
  await fillIframeInput(page, 'expirationMonth', TEST_DATA.card.expirationMonth);
  await fillIframeInput(page, 'expirationYear', TEST_DATA.card.expirationYear);
  await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);
  await fillBillingFormViaButton(page);
}

/** Fill bank account iframe fields + billing via fill-billing-form button. */
export async function fillBankAccountForm(page: Page) {
  await fillIframeInput(page, 'routingNumber', TEST_DATA.bankAccount.routingNumber);
  await fillIframeInput(page, 'accountNumber', TEST_DATA.bankAccount.accountNumber);
  await fillBillingFormViaButton(page);
}

/** Clicks fill-billing-form button to populate billing fields. */
export async function fillBillingFormViaButton(page: Page) {
  await page.locator('#fill-billing-form-button').click();
  // The example pages all pass name: 'John Doe'; waiting on the rendered value
  // is what the old 500ms sleep was standing in for.
  await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue(
    'John Doe',
  );
}

/** Test data constants for E2E tests */
export const TEST_DATA = {
  card: {
    number: '4242424242424242',
    expirationMonth: '11',
    expirationYear: '30',
    expiration: '11/30',
    cvv: '123',
  },
  bankAccount: {
    routingNumber: '110000000',
    accountNumber: '000123456789',
  },
  postalCodes: {
    minneapolis: '55114',
    newYork: '10001',
    losAngeles: '90001',
  },
  billingAddress: {
    line1: '123 Main St',
    line2: 'Apt 4',
    city: 'Minneapolis',
    state: 'MN',
    postalCode: '55114',
    country: 'US',
  },
} as const;
