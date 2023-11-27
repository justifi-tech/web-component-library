import { newE2EPage } from '@stencil/core/testing';

describe('subaccount-details', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<subaccount-details></subaccount-details>');

    const element = await page.find('subaccount-details');
    expect(element).toHaveClass('hydrated');
  });
});
