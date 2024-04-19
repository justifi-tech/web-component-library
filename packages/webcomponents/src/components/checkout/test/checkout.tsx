import { newE2EPage } from '@stencil/core/testing';

describe('justifi-checkout', () => {
  it('should correctly render submit button with correct text', async () => {
    // Create new testing page and add our component to it
    const page = await newE2EPage();
    await page.setContent(
      `
        <justifi-checkout
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

    // Find the submit button on the page
    const submitButton = await page.find('justifi-checkout >>> button');

    // Assert that the submit button's text is set correctly
    expect(await submitButton.textContent).toBe('Pay Now');
  });
});
