import { newSpecPage } from '@stencil/core/testing';
import { ModularCheckout } from '../modular-checkout';
import { checkoutStore } from '../../../store/checkout.store';
import { SavedPaymentMethods } from '../sub-components/saved-payment-methods';

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
      { id: 'pm_123', type: 'card', acct_last_four: '4242', brand: 'visa' } as any,
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

  describe('getAvailablePaymentMethods', () => {
    beforeEach(() => {
      // Reset store to defaults that matter for these tests
      checkoutStore.disableCreditCard = false;
      checkoutStore.disableBankAccount = false;
      checkoutStore.disableBnpl = false;
      checkoutStore.disablePaymentMethodGroup = false;
      checkoutStore.bnplEnabled = false;
      checkoutStore.bankAccountVerification = undefined;
      checkoutStore.paymentMethods = [] as any;
    });

    it('returns new card and new bank when neither is disabled', async () => {
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });
      const instance: any = page.rootInstance as ModularCheckout;

      const methods = await instance.getAvailablePaymentMethods();
      expect(methods).toEqual(expect.arrayContaining(['new_card', 'new_bank_account']));
    });

    it('excludes credit card when disabled', async () => {
      checkoutStore.disableCreditCard = true;
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });
      const instance: any = page.rootInstance as ModularCheckout;

      const methods = await instance.getAvailablePaymentMethods();
      expect(methods).not.toContain('new_card');
      expect(methods).toContain('new_bank_account');
    });

    it('includes saved methods when present and group enabled', async () => {
      checkoutStore.paymentMethods = [
        { id: 'pm1', type: 'card' } as any,
        { id: 'pm2', type: 'bank_account' } as any,
      ];
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });
      const instance: any = page.rootInstance as ModularCheckout;

      const methods = await instance.getAvailablePaymentMethods();
      expect(methods).toEqual(expect.arrayContaining(['saved_card', 'saved_bank_account']));
    });

    it('excludes saved card when credit card is disabled', async () => {
      checkoutStore.paymentMethods = [{ id: 'pm1', type: 'card' } as any];
      checkoutStore.disableCreditCard = true;
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });
      const instance: any = page.rootInstance as ModularCheckout;

      const methods = await instance.getAvailablePaymentMethods();
      expect(methods).not.toContain('saved_card');
    });

    it('includes SEZZLE when bnpl is enabled and not disabled', async () => {
      checkoutStore.bnplEnabled = true;
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });
      const instance: any = page.rootInstance as ModularCheckout;

      const methods = await instance.getAvailablePaymentMethods();
      expect(methods).toContain('sezzle');
    });

    it('includes PLAID when bankAccountVerification is true and bank account not disabled', async () => {
      checkoutStore.bankAccountVerification = true;
      const page = await newSpecPage({
        components: [ModularCheckout],
        html: `<justifi-modular-checkout auth-token="test" checkout-id="chk_123"></justifi-modular-checkout>`,
      });
      const instance: any = page.rootInstance as ModularCheckout;

      const methods = await instance.getAvailablePaymentMethods();
      expect(methods).toContain('plaid');
    });
  });
});


