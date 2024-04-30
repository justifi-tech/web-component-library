import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PaymentsList } from "../payments-list";
import { PaymentsListCore } from "../payments-list-core";
import { PaymentService } from '../../../api/services/payment.service';
jest.mock('../../../api/services/payment.service');

describe('payments-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      template: () => <justifi-payments-list />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      template: () => <justifi-payments-list auth-token="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      template: () => <justifi-payments-list account-id="abc" />,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      template: () => <justifi-payments-list onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
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
