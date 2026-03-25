jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');
jest.mock('qrcode', () => ({
  toString: jest.fn().mockResolvedValue('<svg>mock-qr</svg>'),
}));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import QRCode from 'qrcode';
import { JustifiCheckoutQrCode } from '../justifi-checkout-qr-code';
import JustifiAnalytics from '../../../api/Analytics';

beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-checkout-qr-code', () => {
  it('emits error-event and renders nothing when checkoutId is missing', async () => {
    const errorSpy = jest.fn();
    const page = await newSpecPage({
      components: [JustifiCheckoutQrCode],
      template: () => <justifi-checkout-qr-code checkoutId="" onError-event={errorSpy} />,
    });
    await page.waitForChanges();
    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'checkoutId is required',
        errorCode: 'missing-props',
        severity: 'error',
      },
    }));
    expect(page.root).toMatchSnapshot();
  });

  it('calls QRCode.toString with the hosted checkout URL when checkoutId is provided', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckoutQrCode],
      template: () => <justifi-checkout-qr-code checkoutId="cho_abc123" />,
    });
    await page.waitForChanges();
    expect(QRCode.toString).toHaveBeenCalledWith(
      'https://components.justifi.ai/hosted-checkout/cho_abc123',
      expect.objectContaining({ type: 'svg', width: 256 }),
    );
    expect(page.root).toMatchSnapshot();
  });

  it('uses the size prop when provided', async () => {
    const page = await newSpecPage({
      components: [JustifiCheckoutQrCode],
      template: () => <justifi-checkout-qr-code checkoutId="cho_abc123" size={512} />,
    });
    await page.waitForChanges();
    expect(QRCode.toString).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ width: 512 }),
    );
  });
});
