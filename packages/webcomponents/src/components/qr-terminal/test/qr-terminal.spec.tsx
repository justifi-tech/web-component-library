jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');
jest.mock('qrcode', () => ({
  toString: jest.fn().mockResolvedValue('<svg>mock-qr</svg>'),
}));
jest.mock('../../../api/services/checkout.service');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiQrTerminal } from '../justifi-qr-terminal';
import { JustifiCheckoutQrCode } from '../../checkout-qr-code/justifi-checkout-qr-code';
import { CheckoutService } from '../../../api/services/checkout.service';
import JustifiAnalytics from '../../../api/Analytics';
import mockPending from '../../../../../../../mockData/mockGetCheckoutPending.json';
import mockCompleted from '../../../../../../../mockData/mockGetCheckoutCompleted.json';
import mockExpired from '../../../../../../../mockData/mockGetCheckoutExpired.json';
import mockWithFailedCompletion from '../../../../../../../mockData/mockGetCheckoutWithFailedCompletion.json';

beforeEach(() => {
  jest.useFakeTimers();
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

const components = [JustifiQrTerminal, JustifiCheckoutQrCode];

describe('justifi-qr-terminal — props validation', () => {
  it('emits error-event and renders nothing when authToken is missing', async () => {
    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => <justifi-qr-terminal authToken="" checkoutId="cho_abc" onError-event={errorSpy} />,
    });
    await page.waitForChanges();
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        message: 'authToken and checkoutId are required',
        errorCode: 'missing-props',
        severity: 'error',
      }),
    }));
    expect(page.root).toMatchSnapshot();
  });

  it('emits error-event and renders nothing when checkoutId is missing', async () => {
    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => <justifi-qr-terminal authToken="wct_abc" checkoutId="" onError-event={errorSpy} />,
    });
    await page.waitForChanges();
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ errorCode: 'missing-props' }),
    }));
  });
});

describe('justifi-qr-terminal — initial load', () => {
  it('transitions to ready state when checkout is created', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn().mockResolvedValue(mockPending);
    const page = await newSpecPage({
      components,
      template: () => <justifi-qr-terminal authToken="wct_abc" checkoutId="cho_pending_test" />,
    });
    await page.waitForChanges();
    expect(page.rootInstance.terminalState).toBe('ready');
    expect(page.root).toMatchSnapshot();
  });

  it('transitions to completed state and emits checkout-completed when checkout is already completed', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn().mockResolvedValue(mockCompleted);
    const completedSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal
          authToken="wct_abc"
          checkoutId="cho_completed_test"
          onCheckout-completed={completedSpy}
        />
      ),
    });
    await page.waitForChanges();
    expect(page.rootInstance.terminalState).toBe('completed');
    expect(completedSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { checkoutId: 'cho_completed_test', paymentStatus: 'succeeded' },
    }));
    expect(page.root).toMatchSnapshot();
  });

  it('transitions to expired state and emits checkout-expired when checkout is expired', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn().mockResolvedValue(mockExpired);
    const expiredSpy = jest.fn();
    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal
          authToken="wct_abc"
          checkoutId="cho_expired_test"
          onCheckout-expired={expiredSpy}
          onError-event={errorSpy}
        />
      ),
    });
    await page.waitForChanges();
    expect(page.rootInstance.terminalState).toBe('expired');
    expect(expiredSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { checkoutId: 'cho_expired_test' },
    }));
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ errorCode: 'checkout-expired' }),
    }));
    expect(page.root).toMatchSnapshot();
  });

  it('transitions to error state and emits error-event when initial fetch fails', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn().mockRejectedValue(new Error('Network error'));
    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal authToken="wct_abc" checkoutId="cho_abc" onError-event={errorSpy} />
      ),
    });
    await page.waitForChanges();
    expect(page.rootInstance.terminalState).toBe('error');
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ errorCode: 'fetch-error' }),
    }));
  });
});

describe('justifi-qr-terminal — polling', () => {
  it('transitions to payment-failed when a new failed completion is detected', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn()
      .mockResolvedValueOnce(mockPending)
      .mockResolvedValue(mockWithFailedCompletion);

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal authToken="wct_abc" checkoutId="cho_pending_test" pollIntervalMs={3000} />
      ),
    });
    await page.waitForChanges();

    jest.advanceTimersByTime(3000);
    await page.waitForChanges();

    expect(page.rootInstance.terminalState).toBe('payment-failed');
    expect(page.root).toMatchSnapshot();
  });

  it('auto-dismisses payment-failed back to ready after 3 seconds', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn()
      .mockResolvedValueOnce(mockPending)
      .mockResolvedValue(mockWithFailedCompletion);

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal authToken="wct_abc" checkoutId="cho_pending_test" pollIntervalMs={3000} />
      ),
    });
    await page.waitForChanges();

    jest.advanceTimersByTime(3000);
    await page.waitForChanges();
    expect(page.rootInstance.terminalState).toBe('payment-failed');

    jest.advanceTimersByTime(3000);
    await page.waitForChanges();
    expect(page.rootInstance.terminalState).toBe('ready');
  });

  it('transitions to completed and emits checkout-completed when checkout completes mid-poll', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn()
      .mockResolvedValueOnce(mockPending)
      .mockResolvedValue(mockCompleted);

    const completedSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal
          authToken="wct_abc"
          checkoutId="cho_pending_test"
          pollIntervalMs={3000}
          onCheckout-completed={completedSpy}
        />
      ),
    });
    await page.waitForChanges();

    jest.advanceTimersByTime(3000);
    await page.waitForChanges();

    expect(page.rootInstance.terminalState).toBe('completed');
    expect(completedSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { checkoutId: 'cho_pending_test', paymentStatus: 'succeeded' },
    }));
  });

  it('transitions to expired and emits events when checkout expires mid-poll', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn()
      .mockResolvedValueOnce(mockPending)
      .mockResolvedValue(mockExpired);

    const expiredSpy = jest.fn();
    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal
          authToken="wct_abc"
          checkoutId="cho_pending_test"
          pollIntervalMs={3000}
          onCheckout-expired={expiredSpy}
          onError-event={errorSpy}
        />
      ),
    });
    await page.waitForChanges();

    jest.advanceTimersByTime(3000);
    await page.waitForChanges();

    expect(page.rootInstance.terminalState).toBe('expired');
    expect(expiredSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ errorCode: 'checkout-expired' }),
    }));
  });

  it('emits error-event and stops polling after pollTimeoutMs', async () => {
    CheckoutService.prototype.fetchCheckout = jest.fn().mockResolvedValue(mockPending);

    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-qr-terminal
          authToken="wct_abc"
          checkoutId="cho_pending_test"
          pollTimeoutMs={10000}
          onError-event={errorSpy}
        />
      ),
    });
    await page.waitForChanges();

    jest.advanceTimersByTime(10001);
    await page.waitForChanges();

    expect(page.rootInstance.terminalState).toBe('error');
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        message: 'Checkout polling timed out',
        errorCode: 'fetch-error',
      }),
    }));
  });
});
