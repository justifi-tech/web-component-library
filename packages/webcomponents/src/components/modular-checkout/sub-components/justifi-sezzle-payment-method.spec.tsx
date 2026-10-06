import { newSpecPage } from '@stencil/core/testing';
import { JustifiSezzlePaymentMethod } from './justifi-sezzle-payment-method';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../ModularCheckout';

class MockSezzleCheckout {
  static instances: MockSezzleCheckout[] = [];
  config: any;
  handlers: any;
  sezzleButtonElement: HTMLButtonElement;
  startCheckout = jest.fn();
  getInstallmentPlan = jest.fn((amount: number) => ({
    schedule: 'bi-weekly',
    installments: Array(4).fill({ amountInCents: amount / 4 }),
  }));

  constructor(config: any) {
    this.config = config;
    MockSezzleCheckout.instances.push(this);
  }

  init(handlers: any) {
    this.handlers = handlers;
    this.sezzleButtonElement.addEventListener('click', (e) => handlers.onClick(e));
  }
}

const SDK_SELECTOR = 'script[src="https://checkout-sdk.sezzle.com/checkout.min.js"]';

const flush = () => new Promise((resolve) => setTimeout(resolve));

const newPage = () =>
  newSpecPage({
    components: [JustifiSezzlePaymentMethod],
    html: `<justifi-sezzle-payment-method></justifi-sezzle-payment-method>`,
  });

// newSpecPage resets window, so the SDK global is installed after the page is created.
const newPageWithSdk = async () => {
  const page = await newPage();
  (page.win as any).Checkout = MockSezzleCheckout;
  page.doc.head.querySelector(SDK_SELECTOR)?.dispatchEvent(new (page.win as any).Event('load'));
  await flush();
  await page.waitForChanges();
  return page;
};

describe('justifi-sezzle-payment-method', () => {
  beforeEach(() => {
    MockSezzleCheckout.instances = [];
    checkoutStore.bnplEnabled = true;
    checkoutStore.paymentAmount = 1000;
    checkoutStore.bnplProviderClientId = 'client';
    checkoutStore.bnplProviderMode = 'sandbox';
    checkoutStore.bnplProviderApiVersion = 'v1';
    checkoutStore.bnplProviderCheckoutUrl = 'https://checkout';
  });

  it('does not render when BNPL is disabled', async () => {
    checkoutStore.bnplEnabled = false;

    const page = await newPage();

    expect(page.root?.shadowRoot?.innerHTML).toBe('');
  });

  it('emits selection and sets store when handleSelectionClick called', async () => {
    const page = await newPage();

    const root = page.root as HTMLElement;
    const handler = jest.fn();
    root.addEventListener('paymentMethodOptionSelected', handler as any);

    const instance: any = page.rootInstance;
    await instance.handleSelectionClick();

    expect(handler).toHaveBeenCalled();
    expect(checkoutStore.selectedPaymentMethod?.type).toBe(PAYMENT_METHODS.SEZZLE);
  });

  it('clears stale payment token on selection', async () => {
    checkoutStore.paymentToken = 'pm_old';
    const page = await newPage();

    await (page.rootInstance as any).handleSelectionClick();

    expect(checkoutStore.paymentToken).toBeUndefined();
  });

  it('emits sezzle-payment-method-ready with its element on load', async () => {
    const handler = jest.fn();
    const page = await newSpecPage({ components: [JustifiSezzlePaymentMethod], html: `<div></div>` });
    page.body.addEventListener('sezzle-payment-method-ready', handler);

    page.body.innerHTML = `<justifi-sezzle-payment-method></justifi-sezzle-payment-method>`;
    await page.waitForChanges();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toBe(page.body.querySelector('justifi-sezzle-payment-method'));
  });

  it('initializes Sezzle once the SDK loads', async () => {
    const page = await newPageWithSdk();

    expect(MockSezzleCheckout.instances).toHaveLength(1);
    expect(MockSezzleCheckout.instances[0].config).toEqual({
      mode: 'popup',
      publicKey: 'client',
      apiMode: 'sandbox',
      apiVersion: 'v1',
    });
    const plan = page.root?.shadowRoot?.querySelector('small')?.textContent?.replace(/\s+/g, ' ');
    expect(plan).toBe('4 bi-weekly payments of $2.50');
  });

  it('returns validationError without opening Sezzle when insurance is invalid', async () => {
    const page = await newPageWithSdk();

    const result = await (page.rootInstance as any).resolvePaymentMethod({ isValid: false });

    expect(result).toEqual({ validationError: true });
    expect(MockSezzleCheckout.instances[0].startCheckout).not.toHaveBeenCalled();
  });

  it('opens Sezzle checkout and resolves success on complete', async () => {
    const page = await newPageWithSdk();
    const sezzle = MockSezzleCheckout.instances[0];

    const resultPromise = (page.rootInstance as any).resolvePaymentMethod();
    await flush();

    expect(sezzle.startCheckout).toHaveBeenCalledWith({ checkout_url: 'https://checkout' });

    sezzle.handlers.onComplete({ data: { order_uuid: 'ord_1', session_uuid: 'ses_1' } });

    await expect(resultPromise).resolves.toEqual({
      bnpl: { order_uuid: 'ord_1', session_uuid: 'ses_1', status: 'success' },
    });
  });

  it('resolves cancelled on cancel and allows retry', async () => {
    const page = await newPageWithSdk();
    const sezzle = MockSezzleCheckout.instances[0];
    const instance: any = page.rootInstance;

    const first = instance.resolvePaymentMethod();
    await flush();
    sezzle.handlers.onCancel({});
    await expect(first).resolves.toEqual({ bnpl: { status: 'cancelled' } });

    const second = instance.resolvePaymentMethod();
    await flush();
    expect(sezzle.startCheckout).toHaveBeenCalledTimes(2);
    sezzle.handlers.onComplete({ data: {} });
    await expect(second).resolves.toEqual({ bnpl: { status: 'success' } });
  });

  it('resolves failure on Sezzle failure', async () => {
    const page = await newPageWithSdk();
    const sezzle = MockSezzleCheckout.instances[0];

    const result = (page.rootInstance as any).resolvePaymentMethod();
    await flush();
    sezzle.handlers.onFailure({ data: { order_uuid: 'ord_1' } });

    await expect(result).resolves.toEqual({ bnpl: { order_uuid: 'ord_1', status: 'failure' } });
  });

  it('loads the SDK script once and returns an error if it fails to load', async () => {
    const page = await newPage();
    await page.waitForChanges();

    const scripts = page.doc.head.querySelectorAll(SDK_SELECTOR);
    expect(scripts).toHaveLength(1);

    const result = (page.rootInstance as any).resolvePaymentMethod();
    scripts[0].dispatchEvent(new (page.win as any).Event('error'));

    await expect(result).resolves.toEqual({
      error: { code: 'sezzle-load-error', message: 'Unable to load Sezzle. Please try again.', decline_code: '' },
    });
  });
});
