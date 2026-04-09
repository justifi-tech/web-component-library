import { newSpecPage } from '@stencil/core/testing';
import { JustifiPlaidPaymentMethod } from './justifi-plaid-payment-method';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../ModularCheckout';

describe('justifi-plaid-payment-method', () => {
  beforeEach(() => {
    checkoutStore.bankAccountVerification = undefined;
    checkoutStore.checkoutLoaded = false;
    checkoutStore.achPaymentsEnabled = true;
    jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
    document.querySelector('script[src*="link-initialize"]')?.remove();
  });

  it('does not render and warns when bankAccountVerification is false', async () => {
    checkoutStore.bankAccountVerification = false;

    const page = await newSpecPage({
      components: [JustifiPlaidPaymentMethod],
      html: `<justifi-plaid-payment-method></justifi-plaid-payment-method>`,
    });

    expect(console.warn).toHaveBeenCalledWith(
      '[JustifiPlaidPaymentMethod] bank_account_verification is disabled. Component will not render.'
    );
    expect(page.root).toBeTruthy();
    expect(page.root?.shadowRoot?.innerHTML).toBe('');
  });

  it('loads Plaid script into document.head when bankAccountVerification and checkoutLoaded are true', async () => {
    checkoutStore.bankAccountVerification = true;
    checkoutStore.checkoutLoaded = true;
    checkoutStore.achPaymentsEnabled = true;

    const page = await newSpecPage({
      components: [JustifiPlaidPaymentMethod],
      html: `<justifi-plaid-payment-method></justifi-plaid-payment-method>`,
    });

    expect(page.root).toBeTruthy();
    const script = document.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
    expect(script).not.toBeNull();
    expect(script?.parentElement).toBe(document.head);
  });

  it('does not load Plaid script when ACH payments are disabled for checkout', async () => {
    checkoutStore.bankAccountVerification = true;
    checkoutStore.checkoutLoaded = true;
    checkoutStore.achPaymentsEnabled = false;

    const page = await newSpecPage({
      components: [JustifiPlaidPaymentMethod],
      html: `<justifi-plaid-payment-method></justifi-plaid-payment-method>`,
    });

    await page.waitForChanges();

    expect(console.warn).toHaveBeenCalledWith(
      '[JustifiPlaidPaymentMethod] ACH payments are disabled for this checkout. Component will not render.'
    );
    const script = document.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
    expect(script).toBeNull();
  });

  describe('Store Integration', () => {
    it('initializes selection state from store when selected is PLAID', async () => {
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.PLAID } as any;

      const page = await newSpecPage({
        components: [JustifiPlaidPaymentMethod],
        html: '<justifi-plaid-payment-method></justifi-plaid-payment-method>',
      });

      const instance = page.rootInstance as any as JustifiPlaidPaymentMethod;
      expect((instance as any).isSelected).toBe(true);
    });
  });

  describe('Component Methods', () => {
    it('isCurrentlySelected returns true when selected', async () => {
      const page = await newSpecPage({
        components: [JustifiPlaidPaymentMethod],
        html: '<justifi-plaid-payment-method></justifi-plaid-payment-method>',
      });

      const instance = page.rootInstance as any as JustifiPlaidPaymentMethod;
      (instance as any).isSelected = true;
      const result = await instance.isCurrentlySelected();
      expect(result).toBe(true);
    });

    it('reset clears publicToken and error', async () => {
      const page = await newSpecPage({
        components: [JustifiPlaidPaymentMethod],
        html: '<justifi-plaid-payment-method></justifi-plaid-payment-method>',
      });

      const instance = page.rootInstance as any as JustifiPlaidPaymentMethod;
      (instance as any).publicToken = 'tok';
      (instance as any).error = {
        code: 'plaid-sdk-load-failed',
        message: 'x',
        severity: 'error',
        retryable: true,
      } as any;

      await instance.reset();

      expect((instance as any).publicToken).toBeNull();
      expect((instance as any).error).toBeNull();
      expect((instance as any).isAuthenticating).toBe(false);
    });
  });

  describe('Plaid success flow', () => {
    it('stores public token in store and does not set payment token', async () => {
      const page = await newSpecPage({
        components: [JustifiPlaidPaymentMethod],
        html: '<justifi-plaid-payment-method></justifi-plaid-payment-method>',
      });

      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.PLAID } as any;
      const instance = page.rootInstance as any as JustifiPlaidPaymentMethod;

      (instance as any).handlePlaidSuccess('public-sandbox-xyz', {});
      await page.waitForChanges();
      await new Promise((r) => setTimeout(r, 0));

      expect(checkoutStore.plaidPublicToken).toBe('public-sandbox-xyz');
      expect(checkoutStore.paymentToken).toBeUndefined();
    });
  });
});


