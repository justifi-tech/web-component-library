import { test, expect } from '@playwright/test';

test.describe('Modular Checkout', () => {
  test('renders Google Pay button when enabled', async ({ page }) => {
    // Intercept checkout GET to ensure google_payments is enabled
    await page.route('**/v1/checkouts/*', async (route, request) => {
      if (request.method() !== 'GET') return route.continue();
      const response = await route.fetch();
      const json = await response.json();
      json.data.payment_settings.google_payments = true;
      await route.fulfill({ response, json });
    });

    await page.goto('/modular-checkout');
    await page.waitForSelector('justifi-modular-checkout');
    await page.waitForTimeout(3000);

    const gpayIframe = page.locator('justifi-google-pay iframe[src*="googlePay"]');
    await expect(gpayIframe).toBeAttached();
  });

  test('allows pre-filling billing form fields externally (fillBillingForm())', async ({
    page,
  }) => {
    await page.goto('/modular-checkout');
    await page.waitForSelector('justifi-modular-checkout');

    // Wait for checkout data fetch
    await page.waitForTimeout(3000);

    // Click Fill Billing Form button to populate billing data
    await page.getByTestId('fill-billing-form-button').click();

    // Verify all billing fields are pre-filled
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue(
      'Jane Doe',
    );
    await expect(
      page.getByRole('textbox', { name: 'Street Address' }),
    ).toHaveValue('456 Oak Ave');
    await expect(
      page.getByRole('textbox', { name: 'Apartment, Suite, etc. (optional)' }),
    ).toHaveValue('Suite 2');
    await expect(page.getByRole('textbox', { name: 'City' })).toHaveValue(
      'Los Angeles',
    );
    await expect(page.getByRole('combobox', { name: 'State' })).toHaveValue(
      'CA',
    );
    await expect(
      page.getByRole('textbox', { name: 'Postal Code' }),
    ).toHaveValue('90210');
  });
});
