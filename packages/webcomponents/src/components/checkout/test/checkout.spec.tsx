import { newSpecPage } from '@stencil/core/testing';
import { Checkout } from '../checkout';
import { CheckoutCore } from '../checkout-core';

describe('justifi-checkout', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Checkout, CheckoutCore],
      html: '<justifi-checkout></justifi-checkout>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
