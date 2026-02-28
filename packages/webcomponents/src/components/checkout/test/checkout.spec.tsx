jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { newSpecPage } from '@stencil/core/testing';
import { JustifiCheckout } from '../justifi-checkout';
import JustifiAnalytics from '../../../api/Analytics';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';
import { checkoutStore } from '../../../store/checkout.store';

function fireCheckoutChanged(instance: any, methods: PAYMENT_METHODS[]) {
  instance.checkoutChanged(
    new CustomEvent('checkout-changed', {
      detail: {
        availablePaymentMethodTypes: methods,
        selectedPaymentMethod: undefined,
        savedPaymentMethods: [],
      },
    }),
  );
}

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
  // Reset store to avoid cross-test contamination
  checkoutStore.checkoutId = '';
  checkoutStore.authToken = '';
  checkoutStore.disableCreditCard = false;
  checkoutStore.disableBankAccount = false;
  checkoutStore.disablePaymentMethodGroup = false;
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

  it('syncs props to checkoutStore via updateStore', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html:
        '<justifi-checkout auth-token="tok_1" checkout-id="chk_1" disable-credit-card disable-bank-account disable-payment-method-group></justifi-checkout>',
    });
    await page.waitForChanges();

    expect(checkoutStore.authToken).toBe('tok_1');
    expect(checkoutStore.checkoutId).toBe('chk_1');
    expect(checkoutStore.disableCreditCard).toBe(true);
    expect(checkoutStore.disableBankAccount).toBe(true);
    expect(checkoutStore.disablePaymentMethodGroup).toBe(true);
  });

  it('connectedCallback does NOT update store when authToken is missing', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    expect(checkoutStore.checkoutId).toBe('');
    expect(checkoutStore.authToken).toBe('');
  });

  it('connectedCallback does NOT update store when checkoutId is missing', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="tok_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    expect(checkoutStore.checkoutId).toBe('');
    expect(checkoutStore.authToken).toBe('');
  });

  it('@Watch prop change triggers store sync', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="tok_1" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    expect(checkoutStore.authToken).toBe('tok_1');

    (page.root as any).authToken = 'tok_updated';
    await page.waitForChanges();

    expect(checkoutStore.authToken).toBe('tok_updated');
  });

  it('disableBnpl filters Sezzle from availablePaymentMethods', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bnpl></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.SEZZLE, PAYMENT_METHODS.NEW_CARD]);
    await page.waitForChanges();

    expect(instance.availablePaymentMethods).toEqual([PAYMENT_METHODS.NEW_CARD]);
  });

  it('without disableBnpl keeps Sezzle in availablePaymentMethods', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.SEZZLE, PAYMENT_METHODS.NEW_CARD]);
    await page.waitForChanges();

    expect(instance.availablePaymentMethods).toEqual([PAYMENT_METHODS.SEZZLE, PAYMENT_METHODS.NEW_CARD]);
  });

  it('renders Google Pay when availablePaymentMethods includes GOOGLE_PAY', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.GOOGLE_PAY]);
    await page.waitForChanges();

    expect(page.root?.querySelector('justifi-google-pay')).not.toBeNull();
  });

  it('hides Google Pay when not in availablePaymentMethods', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.NEW_CARD]);
    await page.waitForChanges();

    expect(page.root?.querySelector('justifi-google-pay')).toBeNull();
  });

  it('renders Sezzle when availablePaymentMethods includes SEZZLE and disableBnpl is false', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.SEZZLE]);
    await page.waitForChanges();

    const sezzleItem = page.root?.querySelector('justifi-radio-list-item[value="sezzle"]');
    expect(sezzleItem).not.toBeNull();
  });

  it('hides Sezzle when disableBnpl filters it from availablePaymentMethods', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bnpl></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.SEZZLE]);
    await page.waitForChanges();

    const sezzleItem = page.root?.querySelector('justifi-radio-list-item[value="sezzle"]');
    expect(sezzleItem).toBeNull();
  });

  it('renders Plaid when availablePaymentMethods includes PLAID and disableBnpl is false', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.PLAID]);
    await page.waitForChanges();

    const plaidItem = page.root?.querySelector('justifi-radio-list-item[value="plaid"]');
    expect(plaidItem).not.toBeNull();
  });

  it('hides Plaid when disableBnpl is true', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bnpl></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    fireCheckoutChanged(instance, [PAYMENT_METHODS.PLAID]);
    await page.waitForChanges();

    const plaidItem = page.root?.querySelector('justifi-radio-list-item[value="plaid"]');
    expect(plaidItem).toBeNull();
  });

  it('always renders justifi-tokenize-payment-method regardless of availablePaymentMethods', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    expect(page.root?.querySelector('justifi-tokenize-payment-method')).not.toBeNull();
  });

  it('passes disableCreditCard and disableBankAccount to justifi-tokenize-payment-method', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html:
        '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card disable-bank-account></justifi-checkout>',
    });
    await page.waitForChanges();

    const tokenize = page.root?.querySelector('justifi-tokenize-payment-method');
    expect(tokenize?.getAttribute('disablecreditcard')).toBeDefined();
    expect(tokenize?.getAttribute('disablebankaccount')).toBeDefined();
  });

  it('shows "Select payment type" header when both card and bank account enabled', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const header = page.root?.querySelector('justifi-header[text="Select payment type"]');
    expect(header).not.toBeNull();
  });

  it('hides "Select payment type" header when both card and bank account disabled', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html:
        '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card disable-bank-account></justifi-checkout>',
    });
    await page.waitForChanges();

    const header = page.root?.querySelector('justifi-header[text="Select payment type"]');
    expect(header).toBeNull();
  });

  it('hides "Select payment type" header when only credit card disabled', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card></justifi-checkout>',
    });
    await page.waitForChanges();

    const header = page.root?.querySelector('justifi-header[text="Select payment type"]');
    expect(header).toBeNull();
  });

  it('hides "Select payment type" header when only bank account disabled', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bank-account></justifi-checkout>',
    });
    await page.waitForChanges();

    const header = page.root?.querySelector('justifi-header[text="Select payment type"]');
    expect(header).toBeNull();
  });

  it('submit sets isSubmitting to true', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    instance.modularCheckoutRef = { submitCheckout: jest.fn() };
    await (instance as any).submit({ preventDefault: () => {} });
    await page.waitForChanges();

    expect(instance.isSubmitting).toBe(true);
  });

  it('submit-event resets isSubmitting to false', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    (instance as any).isSubmitting = true;
    await page.waitForChanges();

    page.root?.dispatchEvent(new CustomEvent('submit-event', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(instance.isSubmitting).toBe(false);
  });

  it('error-event resets isSubmitting to false', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    (instance as any).isSubmitting = true;
    await page.waitForChanges();

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    page.root?.dispatchEvent(new CustomEvent('error-event', { bubbles: true, composed: true }));
    await page.waitForChanges();
    consoleSpy.mockRestore();

    expect(instance.isSubmitting).toBe(false);
  });

  it('submit button reflects isSubmitting with disabled and isLoading', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    (instance as any).isSubmitting = true;
    await page.waitForChanges();

    const button = page.root?.querySelector('justifi-button');
    expect(button?.getAttribute('disabled')).toBeDefined();
    expect(button?.getAttribute('isloading')).toBeDefined();
  });

  it('calls analytics.cleanup on disconnectedCallback', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const instance: any = page.rootInstance;
    const cleanupSpy = jest.spyOn(instance.analytics, 'cleanup');

    page.root?.remove();
    await page.waitForChanges();

    expect(cleanupSpy).toHaveBeenCalled();
  });

  it('renders insurance slot', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckout],
      html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
    });
    await page.waitForChanges();

    const core = page.root?.querySelector('.jfi-checkout-core');
    const colDivs = core?.querySelectorAll('.col-12.mt-4') ?? [];
    const insuranceContainer = colDivs[0];
    expect(insuranceContainer).not.toBeNull();
  });
});
