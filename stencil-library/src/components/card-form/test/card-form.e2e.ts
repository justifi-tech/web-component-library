import { newE2EPage } from '@stencil/core/testing';

describe('card-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<justifi-card-form />');

    const element = await page.find('justifi-card-form');
    expect(element).toHaveClass('hydrated');
  });
});
