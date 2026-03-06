jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');
jest.mock('../../../api/services/payment.service');
jest.mock('../../../api/services/refund.service');
jest.mock('../../../api/services/void.service');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiRefundPayment } from '../justifi-refund-payment';
import { PaymentService } from '../../../api/services/payment.service';
import { RefundService } from '../../../api/services/refund.service';
import JustifiAnalytics from '../../../api/Analytics';
import mockPaymentDetailsResponse from '../../../../../../mockData/mockPaymentDetailSuccess.json';

beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-refund-payment', () => {
  const components = [JustifiRefundPayment];

  const setupMockPaymentService = (responseOverrides?: Partial<(typeof mockPaymentDetailsResponse)['data']>) => {
    const response = responseOverrides
      ? { ...mockPaymentDetailsResponse, data: { ...mockPaymentDetailsResponse.data, ...responseOverrides } }
      : mockPaymentDetailsResponse;
    PaymentService.prototype.fetchPayment = jest.fn().mockResolvedValue(response);
  };

  it('renders RefundLoading while paymentLoading is true', async () => {
    // Never resolve the payment fetch so the component stays in loading state
    PaymentService.prototype.fetchPayment = jest.fn().mockReturnValue(new Promise(() => {}));

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    expect(page.root).toMatchSnapshot();
  });

  it('renders form with amount pre-filled from amount_refundable', async () => {
    setupMockPaymentService();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    await page.waitForChanges();

    const monetaryInput = page.root.shadowRoot.querySelector('form-control-monetary[name="amount"]');
    expect(monetaryInput).not.toBeNull();
    expect(monetaryInput.getAttribute('defaultValue') || monetaryInput['defaultValue']).toBe('23456');
  });

  it('button label reflects current amount (Refund $X.XX)', async () => {
    setupMockPaymentService();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    await page.waitForChanges();

    const button = page.root.shadowRoot.querySelector('[type="submit"]');
    expect(button.textContent).toContain('Refund $234.56');
  });

  it('hideSubmitButton=true hides the submit button', async () => {
    setupMockPaymentService();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" hideSubmitButton={true} />
      ),
    });

    await page.waitForChanges();

    const button = page.root.shadowRoot.querySelector('[type="submit"]');
    expect(button.getAttribute('hidden')).not.toBeNull();
  });

  it('missing authToken or paymentId emits error-event with MISSING_PROPS', async () => {
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="" accountId="" paymentId="" onError-event={errorSpy} />
      ),
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        errorCode: 'missing-props',
        message: 'Payment ID and Auth Token are required',
        severity: 'error',
      },
    }));
  });

  it('amount_refundable=0 emits error-event with INVALID_REFUND_AMOUNT and disables submit', async () => {
    setupMockPaymentService({ amount_refundable: 0 });

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" onError-event={errorSpy} />
      ),
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        errorCode: 'invalid-refund-amount',
        message: 'Refund amount must be greater than 0',
        severity: 'error',
      },
    }));

    expect(page.rootInstance.submitDisabled).toBe(true);
  });

  it('payment fetch failure emits error-event', async () => {
    PaymentService.prototype.fetchPayment = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" onError-event={errorSpy} />
      ),
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        errorCode: 'fetch-error',
        severity: 'error',
      }),
    }));
  });

  it('calling refundPayment() with invalid form returns early', async () => {
    setupMockPaymentService();
    RefundService.prototype.postRefund = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    await page.waitForChanges();

    // Set amount to empty to make the form invalid
    page.rootInstance.formController.setValues({ amount: '' });
    await page.rootInstance.refundPayment();

    expect(RefundService.prototype.postRefund).not.toHaveBeenCalled();
  });

  it('submit button is disabled after successful submission', async () => {
    setupMockPaymentService();
    RefundService.prototype.postRefund = jest.fn().mockResolvedValue({ data: { id: 'ref_123' } });

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    await page.waitForChanges();

    await page.rootInstance.refundPayment();
    await page.waitForChanges();

    expect(page.rootInstance.submitDisabled).toBe(true);
  });

  it('reason dropdown renders all options from refundReasonOptions', async () => {
    setupMockPaymentService();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    await page.waitForChanges();

    const select = page.root.shadowRoot.querySelector('form-control-select[name="reason"]');
    expect(select).not.toBeNull();

    const options = select['options'];
    expect(options).toEqual([
      { label: 'Select a reason', value: '' },
      { label: 'Customer requested a refund', value: 'customer_request' },
      { label: 'Customer was double-charged', value: 'duplicate' },
      { label: 'Payment was reported as fraud', value: 'fraudulent' },
    ]);
  });

  it('description textarea has maxLength of 250', async () => {
    setupMockPaymentService();

    const page = await newSpecPage({
      components,
      template: () => (
        <justifi-refund-payment authToken="token" accountId="acc" paymentId="py_123" />
      ),
    });

    await page.waitForChanges();

    const textarea = page.root.shadowRoot.querySelector('form-control-textarea[name="description"]');
    expect(textarea).not.toBeNull();
    expect(textarea.getAttribute('maxlength')).toBe('250');
  });
});
