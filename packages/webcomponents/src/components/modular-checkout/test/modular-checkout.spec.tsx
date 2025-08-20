import { newSpecPage } from '@stencil/core/testing';
import { ModularCheckout } from '../modular-checkout';
import { checkoutStore } from '../../../store/checkout.store';

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
      components: [ModularCheckout],
      html: `<justifi-modular-checkout></justifi-modular-checkout>`,
    });

    const instance: any = page.rootInstance;

    // Set saved payment methods in store and select one
    checkoutStore.paymentMethods = [
      { id: 'pm_123', type: 'card', acct_last_four: '4242', brand: 'visa' } as any,
    ];
    checkoutStore.selectedPaymentMethod = 'pm_123';

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
});


