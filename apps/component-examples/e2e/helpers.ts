import type { Page } from '@playwright/test';

/** Fill an input inside a hosted iframe. */
export async function fillIframeInput(
  page: Page,
  iframeName: string,
  value: string,
) {
  const frame = page.frameLocator(`iframe[name="${iframeName}"]`);
  const input = frame.locator('input');
  await input.waitFor({ state: 'visible', timeout: 15000 });
  await input.fill(value);
}

/** Wait for a web component to appear in the DOM + delay for iframe initialization. */
export async function waitForComponent(page: Page, tagName: string) {
  await page.waitForSelector(tagName);
  await page.waitForTimeout(3000);
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
  await page.waitForTimeout(500);
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
