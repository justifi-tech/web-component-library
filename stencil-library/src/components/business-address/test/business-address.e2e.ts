import { newE2EPage } from '@stencil/core/testing';

describe('justifi-business-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-business-address></justifi-business-address>');

    const element = await page.find('justifi-business-address');
    expect(element).toHaveClass('hydrated');
  });
});
