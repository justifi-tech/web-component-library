import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

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
 * The iframe becoming visible in the PARENT document is the readiness signal;
 * the inner input is visible well before the frame is listening.
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

/**
 * Hosted field scripts keep initialising after their input is interactive, and
 * a late init wipes what was typed. Nothing marks init as done.
 */
async function settleHostedFields(page: Page) {
  await page.waitForTimeout(3000);
}

export async function waitForCardForm(page: Page) {
  await Promise.all(CARD_IFRAMES.map((name) => waitForIframeInput(page, name)));
  await settleHostedFields(page);
}

export async function waitForBankAccountForm(page: Page) {
  await Promise.all(
    BANK_ACCOUNT_IFRAMES.map((name) => waitForIframeInput(page, name)),
  );
  await settleHostedFields(page);
}

export function firstTableRow(page: Page, tagName: string) {
  return page.locator(`${tagName} tbody tr[data-test-id="table-row"]`).first();
}

export async function waitForTableRows(page: Page, tagName: string) {
  await expect(firstTableRow(page, tagName)).toBeVisible({ timeout: 15000 });
}

export async function waitForTableRowChange(
  page: Page,
  tagName: string,
  previousText: string,
) {
  const firstRow = firstTableRow(page, tagName);
  await expect
    .poll(async () => (await firstRow.textContent()) ?? previousText, {
      timeout: 15000,
    })
    .not.toBe(previousText);
}

/**
 * Fill an input inside a hosted iframe, retrying until the value sticks.
 *
 * A field that is still initialising accepts the keystrokes and then clears
 * itself, so a single `fill()` can leave it empty.
 */
export async function fillIframeInput(
  page: Page,
  iframeName: string,
  value: string,
) {
  const input = await waitForIframeInput(page, iframeName);
  await expect(async () => {
    await input.fill(value);
    await expect(input).toHaveValue(/\S/, { timeout: 2000 });
  }).toPass({ timeout: 20000 });
}

/**
 * Wait for a web component to finish hydrating.
 *
 * Stencil stamps `hydrated` on the host once it has rendered. That is the
 * first render only — for a component that fetches, still its loading state.
 * Reading data or calling a method needs a second, more specific wait.
 */
export async function waitForComponent(page: Page, tagName: string) {
  await page
    .locator(`${tagName}.hydrated`)
    .waitFor({ state: 'visible', timeout: 30000 });
}

/**
 * Wait for typed hosted-field values to reach the host component.
 *
 * The read-back catches a frame that reloaded and dropped what was typed. The
 * sleep is deliberate: the value syncs to the host over postMessage and
 * nothing observable marks that as done (`validate()` reports valid too
 * early). Drop it if the component ever exposes a fields-ready signal.
 */
export async function waitForHostedFieldsSynced(
  page: Page,
  iframeNames: readonly string[],
) {
  await Promise.all(
    iframeNames.map((name) =>
      expect(
        page.frameLocator(`iframe[name="${name}"]`).locator('input'),
      ).toHaveValue(/\S/),
    ),
  );
  await page.waitForTimeout(2000);
}

export async function waitForCardFieldsSynced(page: Page) {
  await waitForHostedFieldsSynced(page, CARD_IFRAMES);
}

export async function waitForBankAccountFieldsSynced(page: Page) {
  await waitForHostedFieldsSynced(page, BANK_ACCOUNT_IFRAMES);
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
  await waitForCardForm(page);
  await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
  await fillIframeInput(
    page,
    'expirationMonth',
    TEST_DATA.card.expirationMonth,
  );
  await fillIframeInput(page, 'expirationYear', TEST_DATA.card.expirationYear);
  await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);
  await fillBillingFormViaButton(page);
  await waitForCardFieldsSynced(page);
}

/** Fill bank account iframe fields + billing via fill-billing-form button. */
export async function fillBankAccountForm(page: Page) {
  await waitForBankAccountForm(page);
  await fillIframeInput(
    page,
    'routingNumber',
    TEST_DATA.bankAccount.routingNumber,
  );
  await fillIframeInput(
    page,
    'accountNumber',
    TEST_DATA.bankAccount.accountNumber,
  );
  await fillBillingFormViaButton(page);
  await waitForBankAccountFieldsSynced(page);
}

/** Clicks fill-billing-form button to populate billing fields. */
export async function fillBillingFormViaButton(page: Page) {
  await page.locator('#fill-billing-form-button').click();
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
