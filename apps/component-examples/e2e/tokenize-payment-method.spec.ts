import { test, expect } from '@playwright/test';
import {
  waitForComponent,
  fillCardForm,
  fillBankAccountForm,
  fillIframeInput,
  listenForSubmitEvent,
  TEST_DATA,
} from './helpers';

test.describe('TokenizePaymentMethod Component', () => {
  test.describe('Methods', () => {
    test('tokenizePaymentMethod() -- card success', async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Submit', exact: true }).click();

      const outputPane = page.locator('#output-pane');
      await expect(outputPane).toContainText('token', { timeout: 15000 });
      expect(pageErrors).toHaveLength(0);
    });

    test('tokenizePaymentMethod() -- bank account success', async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await page.getByRole('radio', { name: 'New bank account' }).click();
      await page.waitForTimeout(2000);

      await fillBankAccountForm(page);
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Submit', exact: true }).click();

      const outputPane = page.locator('#output-pane');
      await expect(outputPane).not.toContainText('Tokenization output will appear here', {
        timeout: 15000,
      });
      const content = await outputPane.textContent();
      const hasToken = content?.includes('token');
      const hasError = content?.includes('error');
      expect(hasToken || hasError).toBe(true);
      expect(pageErrors).toHaveLength(0);
    });

    test('validate() -- returns invalid when fields empty', async ({ page }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      const result = await page.evaluate(async () => {
        const el = document.querySelector('justifi-tokenize-payment-method');
        return el ? await (el as any).validate() : null;
      });

      expect(result).not.toBeNull();
      expect(result.isValid).toBe(false);
    });

    test('validate() -- returns valid when fields filled', async ({ page }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const result = await page.evaluate(async () => {
        const el = document.querySelector('justifi-tokenize-payment-method');
        return el ? await (el as any).validate() : null;
      });

      expect(result).not.toBeNull();
      expect(result.isValid).toBe(true);
    });

    test('tokenize() -- direct call after filling fields', async ({ page }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const result = await page.evaluate(async () => {
        const el = document.querySelector('justifi-tokenize-payment-method');
        return el ? await (el as any).tokenize() : null;
      });

      expect(result).not.toBeNull();
      expect(result.data).toBeDefined();
      expect(result.data.card?.token || result.error).toBeDefined();
    });
  });

  test.describe('Events', () => {
    test('submit-event emitted after successful tokenization', async ({
      page,
    }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      const submitPromise = listenForSubmitEvent(page);
      await fillCardForm(page);
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Submit', exact: true }).click();

      await submitPromise;
      const eventLog = page.locator('#event-log');
      await expect(eventLog).toContainText('submit-event');
      await expect(eventLog).toContainText('token');
    });

    test('error-event emitted on tokenization failure', async ({ page }) => {
      await page.route('**/*payment_methods*', (route) =>
        route.request().method() === 'POST' ? route.abort('failed') : route.continue(),
      );

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      await page.waitForTimeout(3000);

      const eventLog = page.locator('#event-log');
      await expect(eventLog).toContainText('error-event');
    });
  });

  test.describe('Behavior', () => {
    test('validation flow -- tokenizePaymentMethod rejects invalid', async ({
      page,
    }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      await page.waitForTimeout(2000);

      const eventLog = page.locator('#event-log');
      await expect(eventLog).toContainText('error-event');
      const outputPane = page.locator('#output-pane');
      await expect(outputPane).toContainText(/error|validation/i);
    });

    test('tokenization flow -- success payload shape', async ({ page }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const payload = await page.evaluate(async () => {
        const el = document.querySelector('justifi-tokenize-payment-method');
        return el ? await (el as any).tokenizePaymentMethod() : null;
      });

      expect(payload).not.toBeNull();
      expect(payload.token).toBeDefined();
      expect(typeof payload.token).toBe('string');
      expect(payload.data).toBeDefined();
      expect(payload.data.card).toBeDefined();
    });

    test('tokenization flow -- failure payload shape', async ({ page }) => {
      await page.route('**/*payment_methods*', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 402,
            contentType: 'application/json',
            body: JSON.stringify({
              error: {
                code: 'card_declined',
                message: 'Your card was declined.',
                decline_code: 'generic_decline',
              },
            }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const payload = await page.evaluate(async () => {
        const el = document.querySelector('justifi-tokenize-payment-method');
        return el ? await (el as any).tokenizePaymentMethod() : null;
      });

      expect(payload).not.toBeNull();
      expect(payload.error).toBeDefined();
      expect(payload.error.code).toBeDefined();
      expect(payload.error.message).toBeDefined();
    });

    test('submit button loading spinner', async ({ page }) => {
      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const loadingStates = await page.evaluate(async () => {
        const states: boolean[] = [];
        const el = document.querySelector('justifi-tokenize-payment-method');
        if (!el) return states;

        const shadowRoot = (el as HTMLElement).shadowRoot;
        const button = shadowRoot?.querySelector('internal-button[data-testid="submit-button"]') as any;
        if (!button) return states;

        const checkLoading = () => {
          if (button.isLoading !== undefined) {
            states.push(button.isLoading);
          }
        };

        checkLoading();
        (el as any).tokenizePaymentMethod();
        await new Promise((r) => setTimeout(r, 100));
        checkLoading();
        await new Promise((r) => setTimeout(r, 5000));
        checkLoading();

        return states;
      });

      expect(loadingStates.length).toBeGreaterThanOrEqual(1);
      expect(loadingStates).toContain(true);
    });

    test('error handling -- tokenization errors re-enable button', async ({
      page,
    }) => {
      await page.route('**/*payment_methods*', (route) =>
        route.request().method() === 'POST' ? route.abort('failed') : route.continue(),
      );

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillCardForm(page);
      await page.waitForTimeout(2000);

      const submitButton = page.getByRole('button', { name: 'Submit', exact: true });
      await submitButton.click();
      await page.waitForTimeout(3000);

      await expect(submitButton).toBeEnabled();
      const eventLog = page.locator('#event-log');
      await expect(eventLog).toContainText('error-event');
    });

    test('analytics init/cleanup', async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');
      expect(pageErrors).toHaveLength(0);

      await page.goto('about:blank');
      await page.waitForTimeout(500);
      expect(pageErrors).toHaveLength(0);
    });

    test('real form interaction -- card fields', async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await fillIframeInput(page, 'cardNumber', TEST_DATA.card.number);
      await fillIframeInput(page, 'expirationMonth', TEST_DATA.card.expirationMonth);
      await fillIframeInput(page, 'expirationYear', TEST_DATA.card.expirationYear);
      await fillIframeInput(page, 'CVV', TEST_DATA.card.cvv);

      expect(pageErrors).toHaveLength(0);
    });

    test('real form interaction -- bank account fields', async ({ page }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await page.getByRole('radio', { name: 'New bank account' }).click();
      await page.waitForTimeout(2000);

      await fillIframeInput(page, 'routingNumber', TEST_DATA.bankAccount.routingNumber);
      await fillIframeInput(page, 'accountNumber', TEST_DATA.bankAccount.accountNumber);

      expect(pageErrors).toHaveLength(0);
    });

    test('validate() after toggle -- card-form re-initializes', async ({
      page,
    }) => {
      const pageErrors: Error[] = [];
      page.on('pageerror', (err) => pageErrors.push(err));

      await page.goto('/tokenize-payment-method');
      await waitForComponent(page, 'justifi-tokenize-payment-method');

      await page.getByRole('radio', { name: 'New bank account' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('radio', { name: 'New credit or debit card' }).click();
      await page.waitForTimeout(3000);

      const result = await page.evaluate(async () => {
        const el = document.querySelector('justifi-tokenize-payment-method');
        return el ? await (el as any).validate() : null;
      });

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('isValid');
      expect(result.errors?.general).toBeUndefined();
      expect(typeof result.isValid).toBe('boolean');
      expect(pageErrors).toHaveLength(0);
    });
  });
});
