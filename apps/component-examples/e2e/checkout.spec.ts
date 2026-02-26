import { test, expect } from '@playwright/test';
import {
  fillIframeInput,
  waitForComponent,
  listenForErrorEvent,
  TEST_DATA,
} from './helpers';

test.describe('Checkout Component', () => {
  test('should complete checkout with credit card', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New credit or debit card' }).click();

    await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
    await fillIframeInput(
      page,
      'expirationMonth',
      TEST_DATA.card.expirationMonth,
    );
    await fillIframeInput(
      page,
      'expirationYear',
      TEST_DATA.card.expirationYear,
    );
    await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);

    await page
      .getByRole('textbox', { name: 'Postal Code' })
      .fill(TEST_DATA.postalCodes.minneapolis);

    // Let iframe JS fully initialize before triggering tokenization
    await page.waitForTimeout(2000);

    const errorPromise = listenForErrorEvent(page, 'justifi-checkout');
    const completeResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/v1/checkouts/') &&
        resp.url().endsWith('/complete') &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Pay', exact: true }).click();

    const result = await Promise.race([
      completeResponsePromise.then((resp) => ({
        type: 'success' as const,
        resp,
      })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(
        `Checkout failed before /complete was called: ${result.err}`,
      );
    }

    const completeResponse = result.resp;
    const body = await completeResponse.json();

    expect(completeResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^chc_/);
    expect(body.data.payment_status).toBe('succeeded');
    expect(body.data.payment_response.data.amount).toBe(1799);
  });
});
