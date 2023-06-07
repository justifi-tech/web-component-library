import { newE2EPage } from '@stencil/core/testing';

describe('business-representative', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<business-representative></business-representative>');

    const element = await page.find('business-representative');
    expect(element).toHaveClass('hydrated');
  });
});
