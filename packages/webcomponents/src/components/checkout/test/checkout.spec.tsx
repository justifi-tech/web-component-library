jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { newSpecPage } from '@stencil/core/testing';
import { Checkout } from '../checkout';
import JustifiAnalytics from '../../../api/Analytics';
import { PAYMENT_METHODS } from '@justifi/types';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-checkout', () => {
  it('renders loading', async () => {
    const page = await newSpecPage({
      components: [Checkout],
      html: '<justifi-checkout></justifi-checkout>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders Apple Pay when availablePaymentMethods includes APPLE_PAY', async () => {
    const page = await newSpecPage({
      components: [Checkout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });

    const instance: any = page.rootInstance;

    // Simulate checkout-changed event from modular checkout
    const event = new CustomEvent('checkout-changed', {
      detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.APPLE_PAY], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
      bubbles: true,
      composed: true,
    } as any);

    (instance as any).checkoutChanged(event);
    await page.waitForChanges();

    // Ensure the Apple Pay component is rendered
    const el = page.root?.querySelector('justifi-apple-pay');
    expect(el).not.toBeNull();
  });
});
