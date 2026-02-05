import { test, expect } from '@playwright/test';

test.describe('Checkout Component', () => {
  test('should complete checkout with credit card', async ({ page }) => {
    await page.goto('/');

    // Wait for component to load
    await page.waitForSelector('justifi-checkout');

    // Select "New credit or debit card" radio button
    const creditCardRadio = page.getByRole('radio', { name: 'New credit or debit card' });
    await creditCardRadio.click();

    // Fill card number (in iframe)
    const cardNumberFrame = page.frameLocator('iframe[name="cardNumber"]');
    await cardNumberFrame.getByPlaceholder('1234 1234 1234 1234').fill('4242424242424242');

    // Fill expiration month (MM) (in iframe)
    const expirationMonthFrame = page.frameLocator('iframe[name="expirationMonth"]');
    await expirationMonthFrame.getByPlaceholder('MM').fill('11');

    // Fill expiration year (YY) (in iframe)
    const expirationYearFrame = page.frameLocator('iframe[name="expirationYear"]');
    await expirationYearFrame.getByPlaceholder('YY').fill('30');

    // Fill CVV (in iframe)
    const cvvFrame = page.frameLocator('iframe[name="CVV"]');
    await cvvFrame.getByPlaceholder('CVV').fill('123');

    // Fill Postal Code (regular input)
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('55114');

    // Setup request listener to verify a request is made when Pay is clicked
    const requestPromise = page.waitForRequest(
      request => request.url().includes('/v1/') && request.method() === 'POST',
      { timeout: 15000 }
    );

    // Click Pay button
    await page.getByRole('button', { name: 'Pay' }).click();

    // Assert that a request was made
    const request = await requestPromise;
    expect(request).toBeTruthy();
    expect(request.url()).toContain('/v1/');
  });
});
