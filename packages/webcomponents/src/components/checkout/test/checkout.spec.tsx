import { newSpecPage } from '@stencil/core/testing';
import { Checkout } from '../checkout';
import { CheckoutCore } from '../checkout-core';
import JustifiAnalytics from '../../../api/Analytics';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

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
