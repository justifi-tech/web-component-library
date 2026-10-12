import { newSpecPage } from '@stencil/core/testing';
import { JustifiPaypal } from './justifi-paypal';
import { checkoutStore } from '../../../../store/checkout.store';
import { PaypalService } from '../../../../api/services/paypal.service';
import {
  PAYPAL_PRODUCTION_SCRIPT_URL,
  PAYPAL_SANDBOX_SCRIPT_URL,
  PAYPAL_SCRIPT_DATA_TEST_ID,
  PaypalErrorCode,
} from './paypal';

const CLIENT_ID = 'sb-client-id';
const SCRIPT_SELECTOR = `script[data-test-id="${PAYPAL_SCRIPT_DATA_TEST_ID}"]`;

const ORDER = {
  id: 'ppo_123',
  checkout_id: 'cho_1',
  funding_source: 'paypal' as const,
  provider_order_id: 'PAYPAL-ORDER-9XY',
};

const flush = async (page: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await page.waitForChanges();
};

const mockSession = () => ({ start: jest.fn().mockResolvedValue(undefined) });

const mockSdk = (eligible: string[]) => {
  const paypalSession = mockSession();
  const venmoSession = mockSession();
  const sdkInstance = {
    findEligibleMethods: jest.fn().mockResolvedValue({
      isEligible: (method: string) => eligible.includes(method),
    }),
    createPayPalOneTimePaymentSession: jest.fn().mockReturnValue(paypalSession),
    createVenmoOneTimePaymentSession: jest.fn().mockReturnValue(venmoSession),
  };
  const createInstance = jest.fn().mockResolvedValue(sdkInstance);
  return { createInstance, sdkInstance, paypalSession, venmoSession };
};

const createPage = async () =>
  newSpecPage({
    components: [JustifiPaypal],
    html: `<justifi-paypal></justifi-paypal>`,
  });

/**
 * `newSpecPage` swaps the global window, so the SDK mock has to be installed
 * after the page exists. Firing `load` on the appended tag then drives the
 * component through its real initialization path.
 */
const mount = async (eligible: string[] = ['paypal', 'venmo']) => {
  const page = await createPage();
  const mocks = mockSdk(eligible);
  (window as any).paypal = { createInstance: mocks.createInstance };

  const script = page.doc.head.querySelector(SCRIPT_SELECTOR);
  script?.dispatchEvent(new Event('load'));
  await flush(page);

  return { page, ...mocks };
};

const isShown = (el: Element | null | undefined) =>
  !!el && el.classList.contains('shown');

const containerShown = (page: any) =>
  isShown(page.root?.shadowRoot?.querySelector('.paypal-buttons'));

const buttonsOf = (page: any) => ({
  paypal: page.root?.shadowRoot?.querySelector('paypal-button') as HTMLElement,
  venmo: page.root?.shadowRoot?.querySelector('venmo-button') as HTMLElement,
});

describe('justifi-paypal', () => {
  let createPaypalOrder: jest.SpyInstance;

  beforeEach(() => {
    checkoutStore.paypalEnabled = true;
    checkoutStore.checkoutLoaded = true;
    checkoutStore.paypalProviderClientId = CLIENT_ID;
    checkoutStore.paymentCurrency = 'usd';
    checkoutStore.checkoutMode = 'test';
    checkoutStore.authToken = 'auth_1';
    checkoutStore.checkoutId = 'cho_1';

    createPaypalOrder = jest
      .spyOn(PaypalService.prototype, 'createPaypalOrder')
      .mockResolvedValue({ data: ORDER } as any);
  });

  afterEach(() => {
    delete (window as any).paypal;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('sdk script', () => {
    it('appends the sandbox script for a test checkout', async () => {
      const page = await createPage();

      const script = page.doc.head.querySelector(SCRIPT_SELECTOR);
      expect(script?.getAttribute('src')).toBe(PAYPAL_SANDBOX_SCRIPT_URL);
    });

    it('appends the production script for a live checkout', async () => {
      checkoutStore.checkoutMode = 'live';
      const page = await createPage();

      const script = page.doc.head.querySelector(SCRIPT_SELECTOR);
      expect(script?.getAttribute('src')).toBe(PAYPAL_PRODUCTION_SCRIPT_URL);
    });

    it('reuses the existing script tag instead of appending a second one', async () => {
      const page = await createPage();
      const instance: any = page.rootInstance;

      // not awaited: without a `load` event these promises stay pending
      instance.loadPaypalScript();
      instance.loadPaypalScript();

      expect(page.doc.head.querySelectorAll(SCRIPT_SELECTOR).length).toBe(1);
    });
  });

  describe('initialization', () => {
    it('emits a config error and stays hidden when the store has no client id', async () => {
      checkoutStore.paypalProviderClientId = '';
      const page = await createPage();
      const handler = jest.fn();
      page.root?.addEventListener('paypalError', handler as any);

      await (page.rootInstance as any).initializePaypal();
      await page.waitForChanges();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            error: 'Missing Paypal client id',
            code: PaypalErrorCode.CONFIG_ERROR,
          },
        })
      );
      expect(containerShown(page)).toBe(false);
    });

    it('calls createInstance with the store client id and a valid v6 config', async () => {
      const { createInstance } = await mount();

      expect(createInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: CLIENT_ID,
          components: ['paypal-payments', 'venmo-payments'],
          pageType: 'checkout',
        })
      );
      // the old `pagetType` typo must not survive
      expect(createInstance.mock.calls[0][0]).not.toHaveProperty('pagetType');
    });

    it('normalizes the store currency to upper case for eligibility', async () => {
      const { sdkInstance } = await mount();

      expect(sdkInstance.findEligibleMethods).toHaveBeenCalledWith({
        currencyCode: 'USD',
      });
    });

    it('emits an initialization error and stays hidden when createInstance rejects', async () => {
      const page = await createPage();
      (window as any).paypal = {
        createInstance: jest.fn().mockRejectedValue(new Error('bad client id')),
      };
      const handler = jest.fn();
      page.root?.addEventListener('paypalError', handler as any);

      await (page.rootInstance as any).initializePaypal();
      await page.waitForChanges();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            error: 'bad client id',
            code: PaypalErrorCode.INITIALIZATION_ERROR,
          },
        })
      );
      expect(containerShown(page)).toBe(false);
    });
  });

  describe('display', () => {
    it('renders both buttons side by side when both are eligible in USD', async () => {
      const { page } = await mount(['paypal', 'venmo']);
      const { paypal, venmo } = buttonsOf(page);

      expect(isShown(paypal)).toBe(true);
      expect(isShown(venmo)).toBe(true);
      expect(paypal.parentElement).toBe(venmo.parentElement);
      expect(paypal.parentElement?.getAttribute('class')).toContain(
        'paypal-buttons'
      );
    });

    it('hides venmo when the currency is not USD, even if the sdk says eligible', async () => {
      checkoutStore.paymentCurrency = 'cad';
      const { page } = await mount(['paypal', 'venmo']);
      const { paypal, venmo } = buttonsOf(page);

      expect(isShown(paypal)).toBe(true);
      expect(isShown(venmo)).toBe(false);
    });

    it('hides a button when its method is not eligible', async () => {
      const { page } = await mount(['venmo']);
      const { paypal, venmo } = buttonsOf(page);

      expect(isShown(paypal)).toBe(false);
      expect(isShown(venmo)).toBe(true);
    });

    it('stays hidden when paypal is disabled on the checkout', async () => {
      checkoutStore.paypalEnabled = false;
      const { page } = await mount();

      expect(containerShown(page)).toBe(false);
    });

    it('stays hidden when venmo is the only eligible method outside USD', async () => {
      checkoutStore.paymentCurrency = 'cad';
      const { page } = await mount(['venmo']);

      expect(containerShown(page)).toBe(false);
    });

    it('reveals the buttons when eligibility resolves late, without a second render', async () => {
      const page = await createPage();
      const mocks = mockSdk(['paypal', 'venmo']);
      (window as any).paypal = { createInstance: mocks.createInstance };

      expect(containerShown(page)).toBe(false);

      const renderSpy = jest.spyOn(page.rootInstance as any, 'render');

      const script = page.doc.head.querySelector(SCRIPT_SELECTOR);
      script?.dispatchEvent(new Event('load'));
      // drains the sdk promises only — deliberately no `waitForChanges()`
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(renderSpy).not.toHaveBeenCalled();
      expect(containerShown(page)).toBe(true);
      expect(isShown(buttonsOf(page).paypal)).toBe(true);
      expect(isShown(buttonsOf(page).venmo)).toBe(true);
    });
  });

  describe('starting a payment', () => {
    it('emits paypalStarted and creates a paypal order on click', async () => {
      const { page } = await mount(['paypal']);
      const started = jest.fn();
      page.root?.addEventListener('paypalStarted', started as any);

      buttonsOf(page).paypal.click();
      await flush(page);

      expect(started).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { fundingSource: 'paypal' } })
      );
      expect(createPaypalOrder).toHaveBeenCalledWith(
        'auth_1',
        'cho_1',
        'paypal'
      );
    });

    it('starts the session synchronously off the click, so popup blockers stay out', async () => {
      const { page, paypalSession } = await mount(['paypal']);

      buttonsOf(page).paypal.click();

      // no await: `start` has to have been called inside the click's call stack,
      // with the order still pending.
      expect(paypalSession.start).toHaveBeenCalledTimes(1);
      await flush(page);
    });

    it("hands the session a promise of PayPal's provider order id", async () => {
      const { page, paypalSession } = await mount(['paypal']);

      buttonsOf(page).paypal.click();
      await flush(page);

      expect(paypalSession.start).toHaveBeenCalledWith(
        { presentationMode: 'auto' },
        expect.any(Promise)
      );
      await expect(paypalSession.start.mock.calls[0][1]).resolves.toEqual({
        orderId: ORDER.provider_order_id,
      });
    });

    it('creates a venmo order from the venmo button', async () => {
      const { page, venmoSession } = await mount(['paypal', 'venmo']);

      buttonsOf(page).venmo.click();
      await flush(page);

      expect(createPaypalOrder).toHaveBeenCalledWith(
        'auth_1',
        'cho_1',
        'venmo'
      );
      expect(venmoSession.start).toHaveBeenCalled();
    });

    it('emits paypalError when the order cannot be created', async () => {
      createPaypalOrder.mockResolvedValue({
        error: { message: 'paypal_not_enabled' },
      } as any);
      const { page } = await mount(['paypal']);
      const errorHandler = jest.fn();
      const completedHandler = jest.fn();
      page.root?.addEventListener('paypalError', errorHandler as any);
      page.root?.addEventListener('paypalCompleted', completedHandler as any);

      buttonsOf(page).paypal.click();
      await flush(page);

      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            error: 'paypal_not_enabled',
            code: PaypalErrorCode.ORDER_ERROR,
          },
        })
      );
      expect(completedHandler).not.toHaveBeenCalled();
    });
  });

  describe('session callbacks', () => {
    it('emits paypalCompleted with our ppo id, not the provider order id', async () => {
      const { page, sdkInstance } = await mount(['paypal']);
      const handler = jest.fn();
      page.root?.addEventListener('paypalCompleted', handler as any);

      buttonsOf(page).paypal.click();
      await flush(page);

      const options =
        sdkInstance.createPayPalOneTimePaymentSession.mock.calls[0][0];
      options.onApprove({ orderId: ORDER.provider_order_id });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            success: true,
            paymentMethodId: ORDER.id,
            fundingSource: 'paypal',
          },
        })
      );
    });

    it('emits paypalCancelled with the funding source', async () => {
      const { page, sdkInstance } = await mount(['paypal', 'venmo']);
      const handler = jest.fn();
      page.root?.addEventListener('paypalCancelled', handler as any);

      const options =
        sdkInstance.createVenmoOneTimePaymentSession.mock.calls[0][0];
      options.onCancel();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { fundingSource: 'venmo' } })
      );
    });

    it('emits paypalError when the session reports a failure', async () => {
      const { page, sdkInstance } = await mount(['paypal']);
      const handler = jest.fn();
      page.root?.addEventListener('paypalError', handler as any);

      const options =
        sdkInstance.createPayPalOneTimePaymentSession.mock.calls[0][0];
      options.onError(new Error('instrument declined'));

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            error: 'instrument declined',
            code: PaypalErrorCode.PAYMENT_FAILED,
          },
        })
      );
    });
  });
});
