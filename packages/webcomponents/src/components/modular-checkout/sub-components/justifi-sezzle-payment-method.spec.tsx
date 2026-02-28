import { newSpecPage } from '@stencil/core/testing';
import { JustifiSezzlePaymentMethod } from './justifi-sezzle-payment-method';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../ModularCheckout';

describe('justifi-sezzle-payment-method', () => {
  beforeEach(() => {
    checkoutStore.bnplEnabled = true;
    checkoutStore.paymentAmount = 1000;
    checkoutStore.bnplProviderClientId = 'client';
    checkoutStore.bnplProviderMode = 'sandbox';
    checkoutStore.bnplProviderApiVersion = 'v1';
    checkoutStore.bnplProviderCheckoutUrl = 'https://checkout';
  });

  it('does not render when BNPL is disabled', async () => {
    checkoutStore.bnplEnabled = false;

    const page = await newSpecPage({
      components: [JustifiSezzlePaymentMethod],
      html: `<justifi-sezzle-payment-method></justifi-sezzle-payment-method>`,
    });

    expect(page.root?.shadowRoot?.innerHTML).toBe('');
  });

  it('emits selection and sets store when handleSelectionClick called', async () => {
    const page = await newSpecPage({
      components: [JustifiSezzlePaymentMethod],
      html: `<justifi-sezzle-payment-method></justifi-sezzle-payment-method>`,
    });

    const root = page.root as HTMLElement;
    const handler = jest.fn();
    root.addEventListener('paymentMethodOptionSelected', handler as any);

    const instance: any = page.rootInstance;
    await instance.handleSelectionClick();

    expect(handler).toHaveBeenCalled();
    expect(checkoutStore.selectedPaymentMethod?.type).toBe(PAYMENT_METHODS.SEZZLE);
  });
});


