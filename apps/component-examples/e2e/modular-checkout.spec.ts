import { test, expect } from '@playwright/test';
import { waitForComponent } from './helpers';

test.describe('Modular Checkout', () => {
  test('allows pre-filling billing form fields externally (fillBillingForm())', async ({
    page,
  }) => {
    await page.goto('/modular-checkout');
    await waitForComponent(page, 'justifi-modular-checkout');
    // The button is plain page markup, clickable before the component can answer
    // fillBillingForm(). Wait for the form it writes into.
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toBeVisible();

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
    await expect(
      page.getByLabel('State / Province'),
    ).toHaveValue(
      'CA',
    );
    await expect(
      page.getByRole('textbox', { name: 'Postal Code' }),
    ).toHaveValue('90210');
  });
});
