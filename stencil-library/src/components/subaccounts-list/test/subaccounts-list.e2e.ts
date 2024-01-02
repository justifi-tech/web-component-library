import { newE2EPage } from '@stencil/core/testing';

describe('subaccounts-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-subaccounts-list></justifi-subaccounts-list>');

    const element = await page.find('justifi-subaccounts-list');
    expect(element).toHaveClass('hydrated');
  });
});
