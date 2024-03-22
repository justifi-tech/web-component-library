import { newE2EPage } from '@stencil/core/testing';

describe('justifi-business-address-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-business-address-form></justifi-business-address-form>');

    const element = await page.find('justifi-business-address-form');
    expect(element).toHaveClass('hydrated');
  });
});
