import { test, expect } from '@playwright/test';
import {
  fillIframeInput,
  waitForComponent,
  listenForErrorEvent,
  TEST_DATA,
} from './helpers';

test.describe('Checkout Component', () => {
  test('should complete checkout with bank account', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New bank account' }).click();
    await page.waitForTimeout(2000);

    await page.getByTestId('fill-billing-form-button').click();
    await page.waitForTimeout(500);

    await fillIframeInput(page, 'routingNumber', TEST_DATA.bankAccount.routingNumber);
    await fillIframeInput(page, 'accountNumber', TEST_DATA.bankAccount.accountNumber);

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
    expect(['succeeded', 'pending']).toContain(body.data.payment_status);
    expect(body.data.payment_response.data.amount).toBe(1799);
  });

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

  // Requires PAYMENT_METHOD_GROUP_ID env with saved payment methods
  test('should complete checkout with saved payment method', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    const savedMethodLocator = page
      .getByRole('radio')
      .filter({ hasText: /\*\d{4}/ });
    if ((await savedMethodLocator.count()) === 0) {
      test.skip(true, 'No saved payment methods - set PAYMENT_METHOD_GROUP_ID');
    }

    await savedMethodLocator.first().click();
    await page.waitForTimeout(1000);

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
  });

  // Documents expected behavior; may fail until isSubmitting fully blocks rapid clicks
  test.fixme('should prevent double-submit on rapid Pay clicks', async ({
    page,
  }) => {
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
    await page.waitForTimeout(2000);

    const completeRequests: string[] = [];
    page.on('request', (req) => {
      if (
        req.url().includes('/v1/checkouts/') &&
        req.url().endsWith('/complete') &&
        req.method() === 'POST'
      ) {
        completeRequests.push(req.url());
      }
    });

    const payButton = page.getByRole('button', { name: 'Pay', exact: true });
    await payButton.click();
    await payButton.click();
    await payButton.click();

    await page.waitForTimeout(5000);

    expect(completeRequests.length).toBe(1);
  });

  test('should surface error and re-enable Pay button on API failure', async ({
    page,
  }) => {
    await page.route(
      '**/v1/checkouts/*/complete',
      async (route) => route.abort('failed'),
    );

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
    await page.waitForTimeout(2000);

    const payButton = page.getByRole('button', { name: 'Pay', exact: true });
    await payButton.click();

    await page.waitForTimeout(3000);

    await expect(payButton).toBeEnabled();
    const outputPane = page.locator('#output-pane');
    await expect(outputPane).toContainText(/error|fail/i);
  });

  test('validate() works after toggling payment methods', async ({ page }) => {
    await page.goto('/checkout');
    await waitForComponent(page, 'justifi-checkout');

    await page.getByRole('radio', { name: 'New bank account' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('radio', { name: 'New credit or debit card' }).click();
    await page.waitForTimeout(3000);

    const result = await page.evaluate(async () => {
      const el = document.querySelector('justifi-checkout');
      return el ? await (el as any).validate() : null;
    });

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('isValid');
    expect(typeof result.isValid).toBe('boolean');
  });
});
