jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { newSpecPage } from '@stencil/core/testing';
import { JustifiCheckout } from '../checkout';
import JustifiAnalytics from '../../../api/Analytics';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';
import { checkoutStore } from '../../../store/checkout.store';

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-checkout', () => {
  it('renders loading', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout></justifi-checkout>',
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders Apple Pay when availablePaymentMethods includes APPLE_PAY', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
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

  it('fillBillingForm writes to checkoutStore.billingFormFields (store-only, no ref delegation needed)', async () => {
    checkoutStore.billingFormFields = { address_postal_code: '' };

    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });

    await page.waitForChanges();

    const fields = { name: 'Store Test', address_postal_code: '55114' };
    try {
      await (page.root as any).fillBillingForm(fields);
    } catch {
      // Ref may throw if internal component not ready; store is written first
    }
    expect(checkoutStore.billingFormFields).toEqual(fields);
  });
});
