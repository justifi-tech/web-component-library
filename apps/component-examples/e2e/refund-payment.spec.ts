import { test, expect } from '@playwright/test';
import { waitForComponent, listenForErrorEvent } from './helpers';

test.describe('Refund Payment Component', () => {
  test('should load payment and display refund form', async ({ page }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const amountInput = page.getByLabel('Refund Amount');
    await expect(amountInput).toHaveValue('10.00');

    const submitButton = page.getByRole('button', { name: /Refund \$10\.00/ });
    await expect(submitButton).toBeVisible();
  });

  test('should successfully submit a refund (void path)', async ({ page }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const errorPromise = listenForErrorEvent(
      page,
      'justifi-refund-payment',
    );
    const responsePromise = page.waitForResponse(
      (resp) =>
        (resp.url().includes('/void') || resp.url().includes('/refunds')) &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: /Refund/ }).click();

    const result = await Promise.race([
      responsePromise.then((resp) => ({ type: 'success' as const, resp })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Refund failed: ${result.err}`);
    }

    const body = await result.resp.json();
    expect([200, 201]).toContain(result.resp.status());
    expect(body.data.id).toBeDefined();
  });

  test('should submit with partial amount and optional fields', async ({
    page,
  }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const amountInput = page.getByLabel('Refund Amount');
    await amountInput.clear();
    await amountInput.fill('500');

    const reasonSelect = page.getByLabel('Reason for refund (optional)');
    await reasonSelect.selectOption('customer_request');

    const descriptionTextarea = page.getByLabel('Note (optional)');
    await descriptionTextarea.fill('Partial refund for testing');

    const errorPromise = listenForErrorEvent(
      page,
      'justifi-refund-payment',
    );
    const responsePromise = page.waitForResponse(
      (resp) =>
        (resp.url().includes('/void') || resp.url().includes('/refunds')) &&
        resp.request().method() === 'POST',
    );

    await page.getByRole('button', { name: /Refund/ }).click();

    const result = await Promise.race([
      responsePromise.then((resp) => ({ type: 'success' as const, resp })),
      errorPromise.then((err) => ({ type: 'error' as const, err })),
    ]);

    if (result.type === 'error') {
      throw new Error(`Refund failed: ${result.err}`);
    }

    expect([200, 201]).toContain(result.resp.status());
  });

  test('should show validation error for amount exceeding refundable', async ({
    page,
  }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const amountInput = page.getByLabel('Refund Amount');
    await amountInput.clear();
    await amountInput.fill('999999');

    await page.getByRole('button', { name: /Refund/ }).click();

    const errorText = page.getByText(
      'Refund amount cannot be more than payment amount',
    );
    await expect(errorText).toBeVisible();
  });

  test('should show validation error for zero amount', async ({ page }) => {
    await page.goto('/refund-payment');
    await waitForComponent(page, 'justifi-refund-payment');

    const amountInput = page.getByLabel('Refund Amount');
    await amountInput.clear();
    await amountInput.fill('0');

    await page.getByRole('button', { name: /Refund/ }).click();

    const errorText = page.getByText('Refund amount must be greater than 0');
    await expect(errorText).toBeVisible();
  });
});
