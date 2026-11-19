import { newSpecPage } from '@stencil/core/testing';
import { JustifiSavedPaymentMethod } from '../justifi-saved-payment-method';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';

const option: any = {
  id: 'pm_abc123',
  type: PAYMENT_METHODS.SAVED_CARD,
  brand: 'visa',
  acct_last_four: '4242',
};

describe('justifi-saved-payment-method', () => {
  it('reports the selection under both names, each with its own payload', async () => {
    const page = await newSpecPage({
      components: [JustifiSavedPaymentMethod],
      html: '<justifi-saved-payment-method></justifi-saved-payment-method>',
    });

    const instance: any = page.rootInstance;
    instance.paymentMethodOption = option;
    await page.waitForChanges();

    const current = jest.fn();
    const legacy = jest.fn();
    page.root.addEventListener('justifi-payment-method-selected', current as any);
    page.root.addEventListener('paymentMethodOptionSelected', legacy as any);

    instance.onPaymentMethodOptionClick({ preventDefault: jest.fn() });

    expect(current.mock.calls[0][0].detail).toEqual({
      id: 'pm_abc123',
      type: PAYMENT_METHODS.SAVED_CARD,
    });
    // the deprecated name keeps the whole option object it has always emitted
    expect(legacy.mock.calls[0][0].detail).toBe(option);
  });
});
