import { newSpecPage } from '@stencil/core/testing';
import { JustifiModularCheckout } from '../modular-checkout';
import { checkoutStore, getCheckoutState } from '../../../store/checkout.store';
import { JustifiSavedPaymentMethods } from '../sub-components/saved-payment-methods';
import { PAYMENT_METHODS, SavedPaymentMethod } from '../ModularCheckout';

describe('justifi-modular-checkout', () => {
  beforeAll(() => {
    (global as any).MutationObserver = class {
      constructor(_cb: any) { }
      observe() { }
      disconnect() { }
    };
  });

  it('uses saved payment method without billing validation or tokenization', async () => {
    const page = await newSpecPage({
      components: [JustifiModularCheckout, JustifiSavedPaymentMethods],
      html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123">
        <justifi-saved-payment-methods></justifi-saved-payment-methods>
      </justifi-modular-checkout>`,
    });

    const instance: any = page.rootInstance;

    // Provide saved payment methods in store
    checkoutStore.paymentMethods = [
      { id: 'pm_123', type: PAYMENT_METHODS.SAVED_CARD, acct_last_four: '4242', brand: 'visa' } as SavedPaymentMethod,
    ];

    await page.waitForChanges();

    // Click one of the saved payment methods to set selectedPaymentMethod and paymentToken
    const savedEl: any = page.root?.querySelector('justifi-saved-payment-methods');
    const listItem: HTMLElement | null = savedEl?.shadowRoot?.querySelector('.radio-list-item');
    listItem?.click();

    await page.waitForChanges();

    // Prevent real network/action calls
    instance.completeCheckout = jest.fn();

    instance.tokenizePaymentMethod = jest.fn();

    await instance.submitCheckout();

    // Should not attempt tokenization
    expect(instance.tokenizePaymentMethod).not.toHaveBeenCalled();

    // Should submit using the saved payment method id as payment_token
    expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    const arg = (instance.completeCheckout as jest.Mock).mock.calls[0][0];
    expect(arg.payment.payment_mode).toBe('ecom');
    expect(arg.payment.payment_token).toBe('pm_123');
  });

  it('sets bankAccountVerification from checkout.payment_settings', async () => {
    const page = await newSpecPage({
      components: [JustifiModularCheckout],
      html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
    });

    const instance: any = page.rootInstance;

    // Simulate checkout payload
    const checkout: any = {
      account_id: 'acc_123',
      payment_methods: [],
      payment_method_group_id: 'pmg_123',
      payment_description: 'desc',
      total_amount: 100,
      payment_amount: 100,
      payment_settings: {
        bnpl_payments: false,
        bank_account_verification: false,
        apple_payments: true,
      },
    };

    // Call private method directly for unit test purposes
    instance['updateStore'](checkout);

    expect(checkoutStore.bankAccountVerification).toBe(false);
    expect(checkoutStore.applePayEnabled).toBe(true);
  });

  describe('checkout-changed event', () => {
    beforeEach(() => {
      checkoutStore.disableCreditCard = false;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disablePaymentMethodGroup = false;
      checkoutStore.bnplEnabled = false;
      checkoutStore.bankAccountVerification = undefined;
      checkoutStore.paymentMethods = [] as any;
    });

    it('emits checkout-changed with availablePaymentMethodTypes on store updates', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;

      // Listen for event
      const handler = jest.fn();
      root.addEventListener('checkout-changed', handler as any);

      // Trigger store changes that affect availablePaymentMethods
      checkoutStore.bnplEnabled = true;
      await page.waitForChanges();
      checkoutStore.applePayEnabled = true;
      await page.waitForChanges();
      checkoutStore.paymentMethods = [
        { id: 'pm1', type: PAYMENT_METHODS.SAVED_CARD } as any,
        { id: 'pm2', type: PAYMENT_METHODS.SAVED_BANK_ACCOUNT } as any,
      ];
      await page.waitForChanges();

      expect(handler).toHaveBeenCalled();
      const lastCall = handler.mock.calls[handler.mock.calls.length - 1][0];
      const detail = (lastCall as CustomEvent).detail as any;
      expect(detail.availablePaymentMethodTypes).toEqual(
        expect.arrayContaining(['saved_card', 'saved_bank_account', 'new_card', 'new_bank_account', 'sezzle', 'apple_pay'])
      );
    });
  });

  describe('submitCheckout behavior and Apple Pay event handling', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = undefined;
      checkoutStore.paymentToken = undefined;
      checkoutStore.bnplEnabled = false;
    });

    it('emits error when submit called without selected payment method', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(handler).toHaveBeenCalled();
      expect((instance.completeCheckout as jest.Mock)).not.toHaveBeenCalled();
    });

    it('maps payment mode correctly for different payment methods', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();
      // Avoid hitting real tokenize path for new card/bank account
      instance.tokenizePaymentMethod = jest.fn().mockResolvedValue('tok_123');

      const assertPaymentMode = async (type: PAYMENT_METHODS, expectedMode: string) => {
        checkoutStore.selectedPaymentMethod = { type } as any;
        checkoutStore.paymentToken = 'tok_123';
        await instance.submitCheckout();
        const call = (instance.completeCheckout as jest.Mock).mock.calls.pop();
        expect(call[0].payment.payment_mode).toBe(expectedMode);
      };

      await assertPaymentMode(PAYMENT_METHODS.NEW_CARD, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.SAVED_CARD, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.NEW_BANK_ACCOUNT, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.SAVED_BANK_ACCOUNT, 'ecom');
      await assertPaymentMode(PAYMENT_METHODS.SEZZLE, 'bnpl');
      await assertPaymentMode(PAYMENT_METHODS.APPLE_PAY, 'apple_pay');
      await assertPaymentMode(PAYMENT_METHODS.GOOGLE_PAY, 'google_pay');
    });

    it('handles Apple Pay completed event success by setting token and submitting', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const event = new CustomEvent('applePayCompleted', {
        detail: { success: true, token: { id: 'pm_apple' }, paymentMethodId: 'pm_apple' },
      } as any);

      // Call the handler directly to simulate event
      (instance as any).handleApplePayCompleted(event);

      await page.waitForChanges();

      expect(checkoutStore.paymentToken).toBe('pm_apple');
      expect((instance.completeCheckout as jest.Mock)).toHaveBeenCalledTimes(1);
    });

    it('handles Apple Pay error by emitting error-event', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      const event = new CustomEvent('applePayError', { detail: { error: 'boom', code: 'X' } } as any);
      (instance as any).handleApplePayError(event);

      expect(handler).toHaveBeenCalled();
    });

    it('handles Google Pay completed event success by setting token and submitting', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const event = new CustomEvent('googlePayCompleted', {
        detail: { success: true, paymentMethodId: 'pm_google_123' },
      } as any);

      (instance as any).handleGooglePayCompleted(event);

      await page.waitForChanges();

      expect(checkoutStore.paymentToken).toBe('pm_google_123');
      expect(checkoutStore.selectedPaymentMethod).toEqual({ type: PAYMENT_METHODS.GOOGLE_PAY });
      expect((instance.completeCheckout as jest.Mock)).toHaveBeenCalledTimes(1);
    });

    it('handles Google Pay error by emitting error-event', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;
      const handler = jest.fn();
      root.addEventListener('error-event', handler as any);

      const instance: any = page.rootInstance;
      const event = new CustomEvent('googlePayCompleted', {
        detail: { success: false, error: { code: 'ERR', message: 'Payment failed' } },
      } as any);

      (instance as any).handleGooglePayCompleted(event);

      expect(handler).toHaveBeenCalled();
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.message).toBe('Payment failed');
    });

    it('handles Google Pay cancelled by clearing paymentToken and selectedPaymentMethod', async () => {
      checkoutStore.paymentToken = 'pm_123';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.GOOGLE_PAY };

      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      (instance as any).handleGooglePayCancelled();

      expect(checkoutStore.paymentToken).toBeUndefined();
      expect(checkoutStore.selectedPaymentMethod).toBeUndefined();
    });
  });

  describe('preCompleteHook', () => {
    beforeEach(() => {
      checkoutStore.checkoutLoaded = true;
      checkoutStore.authToken = 'auth';
      checkoutStore.accountId = 'acc_1';
      checkoutStore.paymentAmount = 1000;
      checkoutStore.totalAmount = 1050;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' };
      checkoutStore.paymentToken = 'pm_123';
    });

    it('proceeds with submission when hook calls resolve()', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const hookFn = jest.fn((state, resolve, _reject) => {
        resolve(state);
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('cancels submission when hook calls reject()', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      const hookFn = jest.fn((_state, _resolve, reject) => {
        reject();
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(instance.completeCheckout).not.toHaveBeenCalled();
    });

    it('proceeds with submission when no hook is provided', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      await instance.submitCheckout();

      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });

    it('passes full CheckoutState (including paymentToken) to hook for saved method', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      // Populate store to cover CheckoutState fields
      checkoutStore.paymentAmount = 2500;
      checkoutStore.totalAmount = 2500;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.paymentDescription = 'desc';
      checkoutStore.savePaymentMethod = true;
      checkoutStore.bnplEnabled = true;
      checkoutStore.applePayEnabled = true;
      checkoutStore.insuranceEnabled = false;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disableCreditCard = false;
      checkoutStore.disablePaymentMethodGroup = false;
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' } as any;
      checkoutStore.paymentToken = 'pm_123';

      let capturedState: any;
      const hookFn = jest.fn((state, resolve, _reject) => {
        capturedState = state;
        resolve(state);
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
      expect(capturedState).toMatchObject({
        selectedPaymentMethod: { type: PAYMENT_METHODS.SAVED_CARD, id: 'pm_123' },
        paymentAmount: 2500,
        totalAmount: 2500,
        paymentCurrency: 'USD',
        paymentDescription: 'desc',
        savePaymentMethod: true,
        bnplEnabled: true,
        applePayEnabled: true,
        insuranceEnabled: false,
        disableBankAccount: false,
        disableCreditCard: false,
        disablePaymentMethodGroup: false,
        paymentToken: 'pm_123',
      });
    });

    it('provides paymentToken in hook state after tokenization for new card', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      const instance: any = page.rootInstance;
      instance.completeCheckout = jest.fn();

      // Avoid real tokenize path; ensure tokenization sets the token before hook
      (instance as any).tokenizePaymentMethod = jest.fn().mockImplementation(async () => {
        checkoutStore.paymentToken = 'tok_999';
        return 'tok_999';
      });

      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD } as any;

      let capturedToken: string | undefined;
      const hookFn = jest.fn((state, resolve, _reject) => {
        capturedToken = state.paymentToken;
        resolve(state);
      });
      instance.preCompleteHook = hookFn;

      await instance.submitCheckout();

      expect(hookFn).toHaveBeenCalledTimes(1);
      expect(capturedToken).toBe('tok_999');
      expect(instance.completeCheckout).toHaveBeenCalledTimes(1);
    });
  });

  describe('fillBillingForm', () => {
    beforeEach(() => {
      checkoutStore.billingFormFields = { address_postal_code: '' };
    });

    it('exists and writes to checkoutStore.billingFormFields', async () => {
      const page = await newSpecPage({
        components: [JustifiModularCheckout],
        html: `<justifi-modular-checkout auth-token="t" checkout-id="chk_1"></justifi-modular-checkout>`,
      });

      await page.waitForChanges();

      const instance: any = page.rootInstance;
      expect(typeof instance.fillBillingForm).toBe('function');

      const fields = { name: 'Test', address_postal_code: '12345' };
      await instance.fillBillingForm(fields);

      expect(checkoutStore.billingFormFields).toEqual(fields);
    });
  });

  describe('getCheckoutState shape', () => {
    it('returns expected fields including optional paymentToken', () => {
      // Reset and populate store
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT } as any;
      checkoutStore.paymentAmount = 1234;
      checkoutStore.totalAmount = 1500;
      checkoutStore.paymentCurrency = 'USD';
      checkoutStore.paymentDescription = 'Payment';
      checkoutStore.paymentMethods = [] as any;
      checkoutStore.savePaymentMethod = false;
      checkoutStore.bnplEnabled = false;
      checkoutStore.applePayEnabled = false;
      checkoutStore.insuranceEnabled = true;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disableCreditCard = false;
      checkoutStore.disablePaymentMethodGroup = true;
      checkoutStore.paymentToken = undefined;

      const state = getCheckoutState();

      expect(state).toMatchObject({
        selectedPaymentMethod: { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT },
        paymentAmount: 1234,
        totalAmount: 1500,
        paymentCurrency: 'USD',
        paymentDescription: 'Payment',
        savedPaymentMethods: [],
        savePaymentMethod: false,
        bnplEnabled: false,
        applePayEnabled: false,
        insuranceEnabled: true,
        disableBankAccount: false,
        disableCreditCard: false,
        disablePaymentMethodGroup: true,
      });

      // Optional field can be undefined
      expect(state.paymentToken).toBeUndefined();
    });
  });
});


