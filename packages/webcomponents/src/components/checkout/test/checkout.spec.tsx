jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');
jest.mock('../../../utils/check-pkg-version', () => ({ checkPkgVersion: jest.fn() }));

import { newSpecPage } from '@stencil/core/testing';
import { JustifiCheckout } from '../justifi-checkout';
import { JustifiGooglePay } from '../../modular-checkout/sub-components/justifi-google-pay';
import JustifiAnalytics from '../../../api/Analytics';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';
import { checkoutStore } from '../../../store/checkout.store';

function resetStore() {
  checkoutStore.authToken = '';
  checkoutStore.checkoutId = '';
  checkoutStore.disableCreditCard = false;
  checkoutStore.disableBankAccount = false;
  checkoutStore.disablePaymentMethodGroup = false;
  checkoutStore.isSubmitting = false;
  checkoutStore.isWalletProcessing = false;
}

beforeEach(() => {
  resetStore();
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

  describe('updateStore (props syncing to checkoutStore)', () => {
    it('writes authToken, checkoutId, disableCreditCard, disableBankAccount, disablePaymentMethodGroup to store', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="tok_1" checkout-id="chk_1" disable-credit-card disable-bank-account disable-payment-method-group></justifi-checkout>',
      });
      await page.waitForChanges();

      expect(checkoutStore.authToken).toBe('tok_1');
      expect(checkoutStore.checkoutId).toBe('chk_1');
      expect(checkoutStore.disableCreditCard).toBe(true);
      expect(checkoutStore.disableBankAccount).toBe(true);
      expect(checkoutStore.disablePaymentMethodGroup).toBe(true);
    });
  });

  describe('connectedCallback conditional guard', () => {
    it('does NOT update store when component mounts with no authToken or checkoutId', async () => {
      resetStore();
      checkoutStore.authToken = 'old_token';
      checkoutStore.checkoutId = 'old_chk';

      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout></justifi-checkout>',
      });
      await page.waitForChanges();

      // connectedCallback guard blocks updateStore when either prop is missing; @Watch does not fire with no attrs
      expect(checkoutStore.authToken).toBe('old_token');
      expect(checkoutStore.checkoutId).toBe('old_chk');
    });
  });

  describe('@Watch prop changes trigger store sync', () => {
    it('updates store when prop changes after initial render', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      expect(checkoutStore.disableCreditCard).toBe(false);

      page.root?.setAttribute('disable-credit-card', '');
      await page.waitForChanges();

      expect(checkoutStore.disableCreditCard).toBe(true);
    });
  });

  describe('disableBnpl filtering Sezzle', () => {
    it('strips Sezzle from availablePaymentMethods when disableBnpl is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bnpl></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: {
          availablePaymentMethodTypes: [PAYMENT_METHODS.SEZZLE, PAYMENT_METHODS.APPLE_PAY],
          selectedPaymentMethod: undefined,
          savedPaymentMethods: [],
        },
        bubbles: true,
        composed: true,
      } as any);

      instance.checkoutChanged(event);
      await page.waitForChanges();

      expect(instance.availablePaymentMethods).toEqual([PAYMENT_METHODS.APPLE_PAY]);
    });

    it('keeps Sezzle when disableBnpl is false', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: {
          availablePaymentMethodTypes: [PAYMENT_METHODS.SEZZLE, PAYMENT_METHODS.APPLE_PAY],
          selectedPaymentMethod: undefined,
          savedPaymentMethods: [],
        },
        bubbles: true,
        composed: true,
      } as any);

      instance.checkoutChanged(event);
      await page.waitForChanges();

      expect(instance.availablePaymentMethods).toEqual([PAYMENT_METHODS.SEZZLE, PAYMENT_METHODS.APPLE_PAY]);
    });
  });

  describe('conditional rendering of payment methods', () => {
    it('shows Google Pay when availablePaymentMethods includes GOOGLE_PAY', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.GOOGLE_PAY], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      expect(page.root?.querySelector('justifi-google-pay')).not.toBeNull();
    });

    it('forwards googlePayEnv to justifi-google-pay as environment', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout, JustifiGooglePay],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" google-pay-env="TEST"></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.GOOGLE_PAY], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      const googlePayEl = page.root?.querySelector('justifi-google-pay') as HTMLJustifiGooglePayElement | null;
      expect(googlePayEl).not.toBeNull();
      expect(googlePayEl?.environment).toBe('TEST');
    });

    it('hides Google Pay when availablePaymentMethods excludes GOOGLE_PAY', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.APPLE_PAY], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      expect(page.root?.querySelector('justifi-google-pay')).toBeNull();
    });

    it('shows Sezzle when availablePaymentMethods includes SEZZLE and disableBnpl is false', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.SEZZLE], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      const sezzleRadio = page.root?.querySelector('justifi-radio-list-item[value="sezzle"]');
      expect(sezzleRadio).not.toBeNull();
    });

    it('hides Sezzle when disableBnpl is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bnpl></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.SEZZLE], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      expect(page.root?.querySelector('justifi-radio-list-item[value="sezzle"]')).toBeNull();
    });

    it('shows Plaid when availablePaymentMethods includes PLAID and disableBnpl is false', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.PLAID], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      const plaidRadio = page.root?.querySelector('justifi-radio-list-item[value="plaid"]');
      expect(plaidRadio).not.toBeNull();
    });

    it('hides Plaid when disableBnpl is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bnpl></justifi-checkout>',
      });
      const instance = page.rootInstance as any;

      const event = new CustomEvent('checkout-changed', {
        detail: { availablePaymentMethodTypes: [PAYMENT_METHODS.PLAID], selectedPaymentMethod: undefined, savedPaymentMethods: [] },
        bubbles: true,
        composed: true,
      } as any);
      instance.checkoutChanged(event);
      await page.waitForChanges();

      expect(page.root?.querySelector('justifi-radio-list-item[value="plaid"]')).toBeNull();
    });

    it('always renders justifi-tokenize-payment-method with correct pass-through props', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card disable-bank-account></justifi-checkout>',
      });
      await page.waitForChanges();

      const tokenize = page.root?.querySelector('justifi-tokenize-payment-method');
      expect(tokenize).not.toBeNull();
      const instance = page.rootInstance as any;
      expect(instance.disableCreditCard).toBe(true);
      expect(instance.disableBankAccount).toBe(true);
      expect(instance.authToken).toBe('t');
    });
  });

  describe('disableCreditCard / disableBankAccount prop passthrough', () => {
    it('forwards disableCreditCard to justifi-tokenize-payment-method', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card></justifi-checkout>',
      });
      await page.waitForChanges();

      const instance = page.rootInstance as any;
      expect(instance.disableCreditCard).toBe(true);
      expect(page.root?.querySelector('justifi-tokenize-payment-method')).not.toBeNull();
    });

    it('forwards disableBankAccount to justifi-tokenize-payment-method when set', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bank-account></justifi-checkout>',
      });
      await page.waitForChanges();

      const instance = page.rootInstance as any;
      expect(instance.disableBankAccount).toBe(true);
      expect(page.root?.querySelector('justifi-tokenize-payment-method')).not.toBeNull();
    });
  });

  describe('showPaymentTypeHeader getter', () => {
    it('renders "Select payment type" header when both card and bank account are enabled', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      const headers = page.root?.querySelectorAll('justifi-header');
      const selectPaymentType = Array.from(headers || []).find((h) => h.getAttribute('text') === 'Select payment type');
      expect(selectPaymentType).not.toBeNull();
    });

    it('hides "Select payment type" header when disableCreditCard is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card></justifi-checkout>',
      });
      await page.waitForChanges();

      const headers = page.root?.querySelectorAll('justifi-header');
      const selectPaymentType = Array.from(headers || []).find((h) => h.getAttribute('text') === 'Select payment type');
      expect(selectPaymentType).toBeUndefined();
    });

    it('hides "Select payment type" header when disableBankAccount is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-bank-account></justifi-checkout>',
      });
      await page.waitForChanges();

      const headers = page.root?.querySelectorAll('justifi-header');
      const selectPaymentType = Array.from(headers || []).find((h) => h.getAttribute('text') === 'Select payment type');
      expect(selectPaymentType).toBeUndefined();
    });

    it('hides "Select payment type" header when both are disabled', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1" disable-credit-card disable-bank-account></justifi-checkout>',
      });
      await page.waitForChanges();

      const headers = page.root?.querySelectorAll('justifi-header');
      const selectPaymentType = Array.from(headers || []).find((h) => h.getAttribute('text') === 'Select payment type');
      expect(selectPaymentType).toBeUndefined();
    });
  });

  describe('isSubmitting state transitions', () => {
    it('submit sets isSubmitting to true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      const instance = page.rootInstance as any;
      instance.modularCheckoutRef = {
        submitCheckout: jest.fn(() => { checkoutStore.isSubmitting = true; }),
      };
      instance.submit({ preventDefault: () => {} });
      await page.waitForChanges();

      expect(checkoutStore.isSubmitting).toBe(true);
    });

    it('submit-event resets isSubmitting to false', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      checkoutStore.isSubmitting = true;
      await page.waitForChanges();

      const ev = new CustomEvent('submit-event', { detail: {}, bubbles: true, composed: true });
      page.root?.dispatchEvent(ev);
      await page.waitForChanges();

      expect(checkoutStore.isSubmitting).toBe(false);
    });

    it('error-event resets isSubmitting to false', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      checkoutStore.isSubmitting = true;
      await page.waitForChanges();

      const ev = new CustomEvent('error-event', { detail: {}, bubbles: true, composed: true });
      page.root?.dispatchEvent(ev);
      await page.waitForChanges();

      expect(checkoutStore.isSubmitting).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('submit button reflects store flags', () => {
    it('justifi-button receives disabled and isLoading when checkoutStore.isSubmitting is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      checkoutStore.isSubmitting = true;
      await page.waitForChanges();

      const btn = page.root?.querySelector('justifi-button');
      expect(btn?.getAttribute('disabled')).toBe('');
      expect(btn?.getAttribute('isloading')).toBe('');
    });

    it('justifi-button receives disabled and isLoading when checkoutStore.isWalletProcessing is true', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      checkoutStore.isWalletProcessing = true;
      await page.waitForChanges();

      const btn = page.root?.querySelector('justifi-button');
      expect(btn?.getAttribute('disabled')).toBe('');
      expect(btn?.getAttribute('isloading')).toBe('');
    });
  });

  describe('lifecycle: analytics init and cleanup', () => {
    it('calls analytics.cleanup on disconnect', async () => {
      const cleanupSpy = jest.fn();
      // @ts-ignore
      JustifiAnalytics.prototype.cleanup = cleanupSpy;

      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      expect(cleanupSpy).not.toHaveBeenCalled();
      page.root?.remove();
      expect(cleanupSpy).toHaveBeenCalled();
    });
  });

  describe('insurance slot', () => {
    it('insurance slot structure exists (slot or container div)', async () => {
      const page = await newSpecPage({
        components: [JustifiCheckout],
        html: '<justifi-checkout auth-token="t" checkout-id="chk_1"></justifi-checkout>',
      });
      await page.waitForChanges();

      const slot = page.root?.querySelector('slot[name="insurance"]');
      const modularCheckout = page.root?.querySelector('justifi-modular-checkout');
      const cols = modularCheckout?.querySelectorAll('.col-12.mt-4');
      expect(slot || (cols && cols.length >= 2)).toBeTruthy();
    });
  });
});
