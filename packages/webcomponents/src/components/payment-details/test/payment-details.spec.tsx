jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { JustifiPaymentDetails } from "../justifi-payment-details";
import { JustifiDetails } from "../../../ui-components/details/justifi-details";
import { PaymentService } from '../../../api/services/payment.service';
import { API_NOT_AUTHENTICATED_ERROR } from "../../../api/shared";
import JustifiAnalytics from "../../../api/Analytics";
import mockPaymentDetailsResponse from '../../../../../../mockData/mockPaymentDetailSuccess.json';

jest.mock('../../../api/services/payment.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('payment-details', () => {
  const components = [JustifiPaymentDetails, JustifiDetails];

  it('renders an error message when paymentId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="" authToken="" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when paymentId is not provided', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details authToken="abc" paymentId="" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="abc" authToken="" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when there is no auth token', async () => {
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="abc" authToken="" onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Payment ID and Auth Token are required',
        errorCode: 'missing-props',
        severity: 'error'
      }
    }));
  });

  it('emits an error event when there is no payment-id', async () => {
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details authToken="abc" paymentId="" onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Payment ID and Auth Token are required',
        errorCode: 'missing-props',
        severity: 'error'
      }
    }));
  });

  it('emits an error event when fetch fails', async () => {
    PaymentService.prototype.fetchPayment = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="abc" authToken="abc" onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Fetch error',
        errorCode: 'fetch-error',
        severity: 'error'
      }
    }));
  });

  it('emits an error event when API returns an error', async () => {
    PaymentService.prototype.fetchPayment = jest.fn().mockResolvedValue(API_NOT_AUTHENTICATED_ERROR);

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="abc" authToken="abc" onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Not Authenticated',
        errorCode: 'not-authenticated',
        severity: 'error'
      }
    }));
  });

  it('renders properly with fetched data', async () => {
    PaymentService.prototype.fetchPayment = jest.fn().mockResolvedValue(mockPaymentDetailsResponse);

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="123" authToken="123" />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.payment).toEqual(expect.objectContaining({ id: mockPaymentDetailsResponse.data.id }));
    expect(PaymentService.prototype.fetchPayment).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    PaymentService.prototype.fetchPayment = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="some-id" authToken="some-auth-token" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('renders Dispute Lost badge when payment is disputed and a dispute was lost', async () => {
    const disputedLostResponse = JSON.parse(JSON.stringify(mockPaymentDetailsResponse));

    disputedLostResponse.data.status = 'disputed';
    disputedLostResponse.data.disputed = true;
    disputedLostResponse.data.disputes = [
      {
        amount_cents: 1000,
        created_at: disputedLostResponse.data.created_at,
        currency: disputedLostResponse.data.currency,
        gateway_ref_id: 'gw_test_1',
        id: 'dp_test_1',
        payment_id: disputedLostResponse.data.id,
        reason: null,
        status: 'lost',
        updated_at: disputedLostResponse.data.updated_at,
      },
    ];

    PaymentService.prototype.fetchPayment = jest.fn().mockResolvedValue(disputedLostResponse);

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details paymentId="123" authToken="123" />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});

