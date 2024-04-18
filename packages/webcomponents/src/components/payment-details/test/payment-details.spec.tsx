import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PaymentDetails } from "../payment-details";
import { PaymentDetailsCore } from "../payment-details-core";
import { Details } from "../../details/details";
import { PaymentService } from '../../../api/services/payment.service';
import { API_NOT_AUTHENTICATED_ERROR } from "../../../api/shared";
jest.mock('../../../api/services/payment.service');

describe('payment-details', () => {
  const components = [PaymentDetails, PaymentDetailsCore, Details];
  it('renders an error message when paymentId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when paymentId is not provided', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details auth-token="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details payment-id="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event when there is no auth token', async () => {
    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components,
      template: () => <justifi-payment-details payment-id="abc" onErrorEvent={errorSpy} />,
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
      template: () => <justifi-payment-details auth-token="abc" onErrorEvent={errorSpy} />,
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
      template: () => <justifi-payment-details payment-id="abc" auth-token="abc" onErrorEvent={errorSpy} />,
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
      template: () => <justifi-payment-details payment-id="abc" auth-token="abc" onErrorEvent={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        message: 'Not Authenticated',
        errorCode: 'fetch-error',
        severity: 'error'
      }
    }));
  });
});

