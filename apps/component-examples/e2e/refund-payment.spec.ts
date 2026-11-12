import { test, expect } from '@playwright/test';
import type { Page, Request } from '@playwright/test';
import {
  waitForComponent,
  listenForSubmitEvent,
  listenForErrorEvent,
} from './helpers';

/**
 * Stub a successful void.
 *
 * Staging's processor started declining these voids (400 `generic_decline`,
 * seen on every attempt from 2026-11-11), which has nothing to do with the
 * component and turns the suite red. What is worth testing here is the
 * component's own behaviour --
 * that it posts to the right payment's void endpoint with the sub-account
 * header, and surfaces the response through submit-event -- so the response
 * itself is stubbed and the request is asserted instead.
 *
 * The payment GET is deliberately left real: it is not what fails, and the
 * example page creates the payment server-side anyway, out of reach of
 * page.route.
 */
async function stubVoidSuccess(page: Page): Promise<() => Request> {
  let voidRequest: Request | undefined;

  await page.route('**/v1/payments/*/void', async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') return route.continue();

    voidRequest = request;
    const paymentId = request.url().match(/payments\/([^/]+)\/void/)?.[1];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: paymentId,
        type: 'payment',
        data: {
          id: paymentId,
          status: 'canceled',
          captured: false,
          amount: 1000,
          amount_refundable: 0,
          amount_refunded: 0,
          currency: 'usd',
          description: 'Test payment for refund example file',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }),
    });
  });

  return () => {
    if (!voidRequest) throw new Error('void was never requested');
    return voidRequest;
  };
}

/** The payment id the example page rendered onto the component. */
function paymentIdOnPage(page: Page) {
  return page
    .locator('justifi-refund-payment')
    .getAttribute('payment-id') as Promise<string>;
}

test.describe('Refund Payment Component', () => {
  test('submit-event fires with void response for recent payment', async ({
    page,
  }) => {
    const getVoidRequest = await stubVoidSuccess(page);

    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const paymentId = await paymentIdOnPage(page);
    const accountId = await page
      .locator('justifi-refund-payment')
      .getAttribute('account-id');

    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(page, 'justifi-refund-payment');

    await page.getByRole('button', { name: /Refund/ }).click();

    const result = await Promise.race([
      submitPromise.then((msg) => ({ type: 'success' as const, msg })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Refund failed: ${result.err}`);
    }

    const voidRequest = getVoidRequest();
    expect(voidRequest.url()).toContain(`/payments/${paymentId}/void`);
    expect(voidRequest.headers()['sub-account']).toBe(accountId);

    // submit-event carried the void response through to the page.
    await expect(page.locator('#output-pane')).toContainText(paymentId);
  });

  test('submit-event fires with refund response for old payment', async ({
    page,
  }) => {
    await page.route('**/v1/payments/*', async (route) => {
      if (route.request().method() === 'GET') {
        const response = await route.fetch();
        const body = await response.json();
        body.data.created_at = new Date(
          Date.now() - 30 * 60 * 1000,
        ).toISOString();
        await route.fulfill({ response, body: JSON.stringify(body) });
      } else {
        await route.continue();
      }
    });

    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(page, 'justifi-refund-payment');
    const refundResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/refunds') &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: /Refund/ }).click();

    const result = await Promise.race([
      submitPromise.then((msg) => ({ type: 'success' as const, msg })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Refund failed: ${result.err}`);
    }

    const refundResponse = await refundResponsePromise;
    const body = await refundResponse.json();

    expect(refundResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^re_/);
  });

  test('void failure falls back to refund', async ({ page }) => {
    await page.route('**/v1/payments/*/void', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { code: 'unprocessable', message: 'Void not allowed' },
        }),
      });
    });

    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const submitPromise = listenForSubmitEvent(page);
    const refundResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/refunds') &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: /Refund/ }).click();

    // The mocked void emits an error-event by design, so only the refund
    // fallback is raced against here.
    const refundResponse = await refundResponsePromise;
    const body = await refundResponse.json();

    expect(refundResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^re_/);

    await expect(submitPromise).resolves.toContain('submit-event');
  });

  test('external refundPayment() method triggers full flow', async ({
    page,
  }) => {
    const getVoidRequest = await stubVoidSuccess(page);

    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');
    // This test calls the method directly instead of clicking, so it has to wait
    // for readiness itself.
    await expect(page.getByRole('button', { name: /Refund/ })).toBeVisible();

    const paymentId = await paymentIdOnPage(page);

    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(page, 'justifi-refund-payment');

    await page.evaluate(() => {
      (document.querySelector('justifi-refund-payment') as any).refundPayment();
    });

    const result = await Promise.race([
      submitPromise.then((msg) => ({ type: 'success' as const, msg })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Refund failed: ${result.err}`);
    }

    const voidRequest = getVoidRequest();
    expect(voidRequest.url()).toContain(`/payments/${paymentId}/void`);

    await expect(page.locator('#output-pane')).toContainText(paymentId);
  });
});
