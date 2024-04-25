import { newE2EPage } from '@stencil/core/testing';

describe('justifi-identity-address-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-identity-address-form></justifi-identity-address-form>');

    const element = await page.find('justifi-identity-address-form');
    expect(element).toHaveClass('hydrated');
  });
});
