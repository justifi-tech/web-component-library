import { newSpecPage } from '@stencil/core/testing';
import { ModularCheckout } from '../modular-checkout';
import { checkoutStore } from '../../../store/checkout.store';
import { SavedPaymentMethods } from '../sub-components/saved-payment-methods';
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
      components: [ModularCheckout, SavedPaymentMethods],
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
      components: [ModularCheckout],
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
      },
    };

    // Call private method directly for unit test purposes
    instance['updateStore'](checkout);

    expect(checkoutStore.bankAccountVerification).toBe(false);
  });

  describe('checkout-changed event', () => {
    beforeEach(() => {
      checkoutStore.disableCreditCard = false;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disableBnpl = false;
      checkoutStore.disablePaymentMethodGroup = false;
      checkoutStore.bnplEnabled = false;
      checkoutStore.bankAccountVerification = undefined;
      checkoutStore.paymentMethods = [] as any;
    });

    it('emits checkout-changed with availablePaymentMethodTypes on store updates', async () => {
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });

      const root = page.root as HTMLElement;

      // Listen for event
      const handler = jest.fn();
      root.addEventListener('checkout-changed', handler as any);

      // Trigger store changes that affect availablePaymentMethods
      checkoutStore.bnplEnabled = true;
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
        expect.arrayContaining(['saved_card', 'saved_bank_account', 'new_card', 'new_bank_account', 'sezzle'])
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
      checkoutStore.disableBnpl = false;
    });

    it('emits error when submit called without selected payment method', async () => {
      const page = await newSpecPage({
        components: [ModularCheckout],
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
        components: [ModularCheckout],
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
    });

    it('handles Apple Pay completed event success by setting token and submitting', async () => {
      const page = await newSpecPage({
        components: [ModularCheckout],
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
        components: [ModularCheckout],
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
  });
});


