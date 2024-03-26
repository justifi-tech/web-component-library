import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { PaymentsList } from "../payments-list";
import { PaymentsListCore } from "../payments-list-core";
import { Table } from "../../table/table";
import { PaymentService } from "../../../api/services/payment.service";

describe('payments-list', () => {
  it('renders an error message when accountId and authToken are not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      html: '<justifi-payments-list></justifi-payments-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when accountId is not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      html: '<justifi-payments-list auth-token="abc"></justifi-payments-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders an error message when authToken is not provided', async () => {
    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore],
      html: '<justifi-payments-list account-id="abc"></justifi-payments-list>',
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('emit tokenExpired event when the authToken has expired', async () => {
    const fetchPaymentsMock = jest.spyOn(PaymentService.prototype, 'fetchPayments' as keyof PaymentService);

    fetchPaymentsMock.mockResolvedValue({
      "error": {
        "code": "not_authenticated",
        "message": "Not Authenticated"
      }
    });

    const spy = jest.fn();

    const page = await newSpecPage({
      components: [PaymentsList, PaymentsListCore, Table],
      template: () => <justifi-payments-list account-id="abc" auth-token="abc" onTokenExpired={spy} />,
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();

    expect(spy).toHaveBeenCalled();
  });
});
