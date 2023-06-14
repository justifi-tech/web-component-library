import { newE2EPage } from '@stencil/core/testing';

describe('justifi-payment-form', () => {
  it('should correctly receive and set the props', async () => {
    // Create new testing page and add our component to it
    const page = await newE2EPage();
    await page.setContent(
      `
        <justifi-payment-form
          bank-account="true"
          card="true"
          email="test@example.com"
          iframe-origin="https://iframe.example.com"
          client-id="testId"
          account-id="accountId"
          submit-button-text="Pay Now"
        />
      `,
    );

    // Find our component on the page
    const element = await page.find('justifi-payment-form');

    // Assert that the properties are correctly set on our component
    expect(await element.getProperty('bankAccount')).toBe(true);
    expect(await element.getProperty('card')).toBe(true);
    expect(await element.getProperty('email')).toBe('test@example.com');
    expect(await element.getProperty('iframeOrigin')).toBe('https://iframe.example.com');
    expect(await element.getProperty('clientId')).toBe('testId');
    expect(await element.getProperty('accountId')).toBe('accountId');
    expect(await element.getProperty('submitButtonText')).toBe('Pay Now');
  });
});
