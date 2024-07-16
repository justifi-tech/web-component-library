import { newE2EPage } from '@stencil/core/testing';

describe('justifi-theme-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-theme-provider></justifi-theme-provider>');

    const element = await page.find('justifi-theme-provider');
    expect(element).toHaveClass('hydrated');
  });
});
