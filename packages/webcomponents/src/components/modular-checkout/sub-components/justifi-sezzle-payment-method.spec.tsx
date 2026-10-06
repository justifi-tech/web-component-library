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

  describe('resolvePaymentMethod', () => {
    let checkoutInstances: any[];

    class MockSezzleCheckout {
      handlers: any;
      sezzleButtonElement: HTMLButtonElement;
      startCheckout = jest.fn();
      getInstallmentPlan = jest.fn().mockReturnValue(undefined);
      init = jest.fn((handlers) => {
        this.handlers = handlers;
        this.sezzleButtonElement.addEventListener('click', handlers.onClick);
      });
      constructor() {
        checkoutInstances.push(this);
      }
    }

    beforeEach(() => {
      checkoutInstances = [];
    });

    const setup = async () => {
      const page = await newSpecPage({
        components: [JustifiSezzlePaymentMethod],
        html: `<justifi-sezzle-payment-method></justifi-sezzle-payment-method>`,
      });
      (window as any).Checkout = MockSezzleCheckout;
      const instance: any = page.rootInstance;
      instance.scriptRef.onload();
      return { instance, checkout: checkoutInstances[0] };
    };

    it('returns validationError when invalid', async () => {
      const { instance, checkout } = await setup();

      expect(await instance.resolvePaymentMethod({ isValid: false })).toEqual({ validationError: true });
      expect(checkout.startCheckout).not.toHaveBeenCalled();
    });

    it('returns error when Sezzle script not loaded', async () => {
      const page = await newSpecPage({
        components: [JustifiSezzlePaymentMethod],
        html: `<justifi-sezzle-payment-method></justifi-sezzle-payment-method>`,
      });
      const result = await (page.rootInstance as any).resolvePaymentMethod({ isValid: true });

      expect(result.error).toBeDefined();
    });

    it('opens Sezzle checkout and resolves with onComplete data', async () => {
      const { instance, checkout } = await setup();

      const promise = instance.resolvePaymentMethod({ isValid: true });
      expect(checkout.startCheckout).toHaveBeenCalledWith({ checkout_url: 'https://checkout' });

      checkout.handlers.onComplete({ data: { status: 'success' } });
      expect(await promise).toEqual({ bnpl: { status: 'success' } });
    });

    it('re-opens Sezzle on retry after cancel', async () => {
      const { instance, checkout } = await setup();

      const first = instance.resolvePaymentMethod({ isValid: true });
      checkout.handlers.onCancel({ data: { status: 'cancelled' } });
      expect(await first).toEqual({ bnpl: { status: 'cancelled' } });

      const second = instance.resolvePaymentMethod({ isValid: true });
      checkout.handlers.onComplete({ data: { status: 'success' } });
      expect(await second).toEqual({ bnpl: { status: 'success' } });
      expect(checkout.startCheckout).toHaveBeenCalledTimes(2);
    });
  });
});
