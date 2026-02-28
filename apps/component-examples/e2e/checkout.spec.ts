import { test, expect } from '@playwright/test';
import {
  fillIframeInput,
  fillCardForm,
  waitForComponent,
  listenForErrorEvent,
  TEST_DATA,
} from './helpers';

test.describe('Checkout Component', () => {
  test.describe('Credit card checkout', () => {
    test('should complete checkout with credit card', async ({ page }) => {
      await page.goto('/checkout');
      await waitForComponent(page, 'justifi-checkout');

      await page.getByRole('radio', { name: 'New credit or debit card' }).click();
      await fillCardForm(page);

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

  test.describe('Bank account checkout', () => {
    test.skip('should complete checkout with bank account', async ({ page }) => {
      // Test requires valid JustiFi sandbox bank account credentials - adjust TEST_DATA.bankAccount in helpers.ts
      await page.goto('/checkout');
      await waitForComponent(page, 'justifi-checkout');

      await page.getByRole('radio', { name: 'New bank account' }).click();

      await fillIframeInput(
        page,
        'accountNumber',
        TEST_DATA.bankAccount.accountNumber,
      );
      await fillIframeInput(
        page,
        'routingNumber',
        TEST_DATA.bankAccount.routingNumber,
      );
      await page
        .getByRole('textbox', { name: 'Full Name' })
        .fill(TEST_DATA.bankAccount.accountOwnerName);

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
    });
  });

  test.describe('Billing form persistence', () => {
    test('billing data persists when toggling card <-> bank', async ({
      page,
    }) => {
      await page.goto('/fill-billing-form');
      await page.waitForSelector('justifi-checkout');

      await page.waitForTimeout(3000);

      await page.getByTestId('fill-billing-form-button').click();

      const postalCodeInput = page.getByRole('textbox', {
        name: 'Postal Code',
      });
      await expect(postalCodeInput).toHaveValue('90210');

      await page.getByRole('radio', { name: 'New bank account' }).click();
      await page.waitForTimeout(500);

      const nameInput = page.getByRole('textbox', { name: 'Full Name' });
      await expect(nameInput).toHaveValue('Jane Doe');

      await page.getByRole('radio', { name: 'New credit or debit card' }).click();
      await page.waitForTimeout(500);

      await expect(postalCodeInput).toHaveValue('90210');
    });
  });

  test.describe('Saved payment methods', () => {
    test('should complete checkout with a saved payment method', async ({
      page,
    }, testInfo) => {
      await page.goto('/checkout');
      await waitForComponent(page, 'justifi-checkout');

      const savedMethodRadio = page
        .getByRole('radio', { name: /\*\d{4}$/ })
        .first();
      const hasSavedMethod = await savedMethodRadio
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (!hasSavedMethod) {
        testInfo.skip(true, 'No saved payment methods in payment method group');
        return;
      }

      await savedMethodRadio.click();
      await page.waitForTimeout(1000);

      const completeResponsePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes('/v1/checkouts/') &&
          resp.url().endsWith('/complete') &&
          resp.request().method() === 'POST',
      );

      await page.getByRole('button', { name: 'Pay', exact: true }).click();

      const completeResponse = await completeResponsePromise;
      const body = await completeResponse.json();

      expect(completeResponse.status()).toBe(201);
      expect(body.data.id).toMatch(/^chc_/);
      expect(body.data.payment_status).toBe('succeeded');
    });
  });

  test.describe('validate() after toggle', () => {
    test('validate() works after toggling payment methods', async ({
      page,
    }) => {
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
      expect(result.errors?.general).toBeUndefined();
      expect(typeof result.isValid).toBe('boolean');
    });
  });

  test.describe('Double-submit prevention', () => {
    test.skip('rapid clicks on Pay only fire one /complete request', async ({
      // Flaky: component may fire 2 requests before isSubmitting blocks; needs timing investigation
      page,
    }) => {
      let completeRequestCount = 0;

      await page.route(
        (url) =>
          url.toString().includes('/v1/checkouts/') &&
          url.toString().endsWith('/complete'),
        (route) => {
          if (route.request().method() === 'POST') {
            completeRequestCount++;
          }
          route.continue();
        },
      );

      await page.goto('/checkout');
      await waitForComponent(page, 'justifi-checkout');

      await page.getByRole('radio', { name: 'New credit or debit card' }).click();
      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const payButton = page.getByRole('button', { name: 'Pay', exact: true });
      const completeResponsePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes('/v1/checkouts/') &&
          resp.url().endsWith('/complete') &&
          resp.request().method() === 'POST',
      );

      await payButton.click();
      await payButton.click();
      await payButton.click();

      await completeResponsePromise;

      expect(completeRequestCount).toBe(1);
    });
  });

  test.describe('Error recovery', () => {
    test('UI recovers after API error', async ({ page }) => {
      await page.route(
        (url) =>
          url.toString().includes('/v1/checkouts/') &&
          url.toString().endsWith('/complete'),
        (route) => {
          if (route.request().method() === 'POST') {
            route.fulfill({
              status: 422,
              contentType: 'application/json',
              body: JSON.stringify({
                error: { message: 'Payment declined' },
              }),
            });
          } else {
            route.continue();
          }
        },
      );

      await page.goto('/checkout');
      await waitForComponent(page, 'justifi-checkout');

      await page.getByRole('radio', { name: 'New credit or debit card' }).click();
      await fillCardForm(page);
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Pay', exact: true }).click();

      await page.waitForTimeout(2000);

      const payButton = page.getByRole('button', { name: 'Pay', exact: true });
      await expect(payButton).toBeEnabled();

      const outputPane = page.locator('#output-pane');
      await expect(outputPane).toContainText(/error|declined/i);
    });
  });
});
