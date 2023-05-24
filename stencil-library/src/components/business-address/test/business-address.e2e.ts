import { newE2EPage } from '@stencil/core/testing';

describe('business-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<business-address></business-address>');

    const element = await page.find('business-address');
    expect(element).toHaveClass('hydrated');
  });
});
