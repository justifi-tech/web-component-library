import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiGooglePay } from '../google-pay';
import { checkoutStore } from '../../../../store/checkout.store';

// Mock configState
jest.mock('../../../config-provider/config-state', () => ({
  configState: { iframeOrigin: 'https://test-iframe.justifi.ai' },
  waitForConfig: jest.fn().mockResolvedValue(undefined),
}));

describe('justifi-google-pay', () => {
  const IFRAME_ORIGIN = 'https://test-iframe.justifi.ai';

  beforeEach(() => {
    checkoutStore.googlePayEnabled = true;
    checkoutStore.accountId = 'acc_123';
    checkoutStore.authToken = 'auth_token';
    checkoutStore.paymentAmount = 1000;
    checkoutStore.paymentCurrency = 'USD';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('returns null when googlePayEnabled is false', async () => {
      checkoutStore.googlePayEnabled = false;

      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      expect(page.root?.shadowRoot?.innerHTML).toBe('');
    });

    it('shows skeleton when isReadyToPay is false', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.isReadyToPay = false;
      await page.waitForChanges();

      const skeleton = page.root?.shadowRoot?.querySelector('.container-fluid');
      expect(skeleton).not.toBeNull();

      const iframe = page.root?.shadowRoot?.querySelector('iframe');
      expect(iframe?.style.display).toBe('none');
    });

    it('shows iframe when isReadyToPay is true', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.isReadyToPay = true;
      await page.waitForChanges();

      const iframe = page.root?.shadowRoot?.querySelector('iframe');
      expect(iframe?.style.display).toBe('block');
    });
  });

  describe('message handling', () => {
    it('ignores messages from wrong origin', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;
      const initialIframeReady = instance.iframeReady;

      const event = new MessageEvent('message', {
        origin: 'https://malicious.com',
        data: { eventType: 'justifi.googlePay.ready' },
      });

      instance.handleMessage(event);

      expect(instance.iframeReady).toBe(initialIframeReady);
    });

    it('sets iframeReady on ready event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: { eventType: 'justifi.googlePay.ready' },
      });

      instance.handleMessage(event);

      expect(instance.iframeReady).toBe(true);
    });

    it('sets sdkLoaded and calls sendInitialize on sdkLoaded event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;
      instance.sendInitialize = jest.fn();

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: { eventType: 'justifi.googlePay.sdkLoaded' },
      });

      instance.handleMessage(event);

      expect(instance.sdkLoaded).toBe(true);
      expect(instance.sendInitialize).toHaveBeenCalledTimes(1);
    });

    it('sets isReadyToPay from initializeResult event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: {
          eventType: 'justifi.googlePay.initializeResult',
          data: { isReadyToPay: true },
        },
      });

      instance.handleMessage(event);

      expect(instance.isReadyToPay).toBe(true);
    });

    it('calls sendStartPayment on buttonClicked event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;
      instance.sendStartPayment = jest.fn();

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: { eventType: 'justifi.googlePay.buttonClicked' },
      });

      instance.handleMessage(event);

      expect(instance.sendStartPayment).toHaveBeenCalledTimes(1);
    });

    it('emits googlePayCompleted with success on paymentSuccess event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const handler = jest.fn();
      page.root?.addEventListener('googlePayCompleted', handler);

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: {
          eventType: 'justifi.googlePay.paymentSuccess',
          data: {
            paymentMethodId: 'pm_google_123',
            cardNetwork: 'VISA',
            cardDetails: '1234',
          },
        },
      });

      instance.handleMessage(event);

      expect(handler).toHaveBeenCalledTimes(1);
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.success).toBe(true);
      expect(detail.paymentMethodId).toBe('pm_google_123');
      expect(detail.cardNetwork).toBe('VISA');
      expect(detail.cardDetails).toBe('1234');
    });

    it('emits googlePayCancelled on paymentCanceled event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const handler = jest.fn();
      page.root?.addEventListener('googlePayCancelled', handler);

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: { eventType: 'justifi.googlePay.paymentCanceled' },
      });

      instance.handleMessage(event);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('emits googlePayCompleted with error on paymentError event', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const handler = jest.fn();
      page.root?.addEventListener('googlePayCompleted', handler);

      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: {
          eventType: 'justifi.googlePay.paymentError',
          data: { code: 'PAYMENT_FAILED', message: 'Payment declined' },
        },
      });

      instance.handleMessage(event);

      expect(handler).toHaveBeenCalledTimes(1);
      const detail = handler.mock.calls[0][0].detail;
      expect(detail.success).toBe(false);
      expect(detail.error.code).toBe('PAYMENT_FAILED');
      expect(detail.error.message).toBe('Payment declined');
    });
  });

  describe('postMessage communication', () => {
    it('sendInitialize sends correct config to iframe', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => (
          <justifi-google-pay
            environment="TEST"
            merchantName="Test Merchant"
          />
        ),
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const mockPostMessage = jest.fn();
      instance.iframeElement = {
        contentWindow: { postMessage: mockPostMessage },
      };

      instance.sendInitialize();

      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          eventType: 'justifi.googlePay.initialize',
          data: {
            environment: 'TEST',
            gatewayMerchantId: 'acc_123',
            merchantName: 'Test Merchant',
            authToken: 'auth_token',
            accountId: 'acc_123',
          },
        },
        IFRAME_ORIGIN
      );
    });

    it('sendStartPayment sends transaction info to iframe', async () => {
      checkoutStore.paymentAmount = 2500;
      checkoutStore.paymentCurrency = 'EUR';

      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeOrigin = IFRAME_ORIGIN;

      const mockPostMessage = jest.fn();
      instance.iframeElement = {
        contentWindow: { postMessage: mockPostMessage },
      };

      instance.sendStartPayment();

      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          eventType: 'justifi.googlePay.startPayment',
          data: {
            totalPrice: '25',
            totalPriceStatus: 'FINAL',
            currencyCode: 'EUR',
          },
        },
        IFRAME_ORIGIN
      );
    });

    it('sendInitialize does nothing if iframe not available', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeElement = null;

      expect(() => instance.sendInitialize()).not.toThrow();
    });

    it('sendStartPayment does nothing if iframe not available', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;
      instance.iframeElement = null;

      expect(() => instance.sendStartPayment()).not.toThrow();
    });
  });

  describe('lifecycle', () => {
    it('componentDidLoad sets up handleMessage as event handler', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;

      // Verify handleMessage is defined and bound
      expect(typeof instance.handleMessage).toBe('function');

      // Verify the handler processes messages correctly (already tested in message handling)
      instance.iframeOrigin = IFRAME_ORIGIN;
      const event = new MessageEvent('message', {
        origin: IFRAME_ORIGIN,
        data: { eventType: 'justifi.googlePay.ready' },
      });

      instance.handleMessage(event);
      expect(instance.iframeReady).toBe(true);
    });

    it('disconnectedCallback can be called without error', async () => {
      const page = await newSpecPage({
        components: [JustifiGooglePay],
        template: () => <justifi-google-pay />,
      });

      const instance = page.rootInstance as any;

      // Should not throw
      expect(() => instance.disconnectedCallback()).not.toThrow();
    });
  });
});
