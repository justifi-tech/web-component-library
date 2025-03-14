import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PaymentsList } from "../payments-list";
import { PaymentsListCore } from "../payments-list-core";
import { PaymentService } from '../../../api/services/payment.service';
import JustifiAnalytics from "../../../api/Analytics";
jest.mock('../../../api/services/payment.service');

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('payments-list', () => {
  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      template: () => <justifi-payments-list onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'missing-props',
          message: 'Account ID and Auth Token are required',
          severity: 'error',
        },
      })
    );
  });

  it('emit an error event when fetch fails', async () => {
    PaymentService.prototype.fetchPayments = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      template: () => (
        <justifi-payments-list
          account-id="abc"
          auth-token="abc"
          onError-event={errorEvent}
        />
      ),
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });
});
