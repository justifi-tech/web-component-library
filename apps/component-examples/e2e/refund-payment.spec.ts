import { test, expect } from '@playwright/test';
import {
  waitForComponent,
  listenForSubmitEvent,
  listenForErrorEvent,
} from './helpers';

test.describe('Refund Payment Component', () => {
  test('submit-event fires with void response for recent payment', async ({
    page,
  }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(page, 'justifi-refund-payment');
    const voidResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/void') &&
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

    const voidResponse = await voidResponsePromise;
    const body = await voidResponse.json();

    expect(voidResponse.status()).toBe(200);
    expect(body.data.id).toMatch(/^py_/);
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

  test('external refundPayment() method triggers full flow', async ({
    page,
  }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const submitPromise = listenForSubmitEvent(page);
    const errorPromise = listenForErrorEvent(page, 'justifi-refund-payment');
    const voidResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes('/void') &&
        resp.request().method() === 'POST',
    );

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

    const voidResponse = await voidResponsePromise;
    const body = await voidResponse.json();

    expect(voidResponse.status()).toBe(200);
    expect(body.data.id).toMatch(/^py_/);
  });
});
