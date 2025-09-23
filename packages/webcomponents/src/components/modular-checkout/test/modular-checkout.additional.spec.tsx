import { newSpecPage } from '@stencil/core/testing';
import { ModularCheckout } from '../modular-checkout';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../ModularCheckout';

describe('justifi-modular-checkout (additional)', () => {
  beforeAll(() => {
    (global as any).MutationObserver = class {
      constructor(_cb: any) { }
      observe() { }
      disconnect() { }
    };
  });

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


