import { test, expect } from '@playwright/test';
import { waitForComponent } from './helpers';

test.describe('TokenizePaymentMethod Component', () => {
  test('card-form still validates when calling validate() after toggling from bank-account and back to card-form', async ({
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
    // errors.general should be empty
    expect(result.errors.general).toBeUndefined();
    expect(typeof result.isValid).toBe('boolean');
    expect(pageErrors).toHaveLength(0);
  });
});
