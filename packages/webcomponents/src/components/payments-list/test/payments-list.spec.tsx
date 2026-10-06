jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";
import { JustifiPaymentsList } from "../justifi-payments-list";
import { PaymentService } from '../../../api/services/payment.service';
import JustifiAnalytics from "../../../api/Analytics";
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import mockSuccessResponse from '../../../../../../mockData/mockPaymentsSuccess.json';
import { IApiResponseCollection, IPayment } from '../../../api';
import { defaultColumnsKeys } from '../payments-table';

jest.mock('../../../api/services/payment.service');

const mockPaymentsResponse = mockSuccessResponse as IApiResponseCollection<IPayment[]>;

beforeEach(() => {
  // Bypass Analytics to avoid errors. Analytics attaches events listeners to HTML elements
  // which are not available in Jest/node environment
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-payments-list', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiPaymentsList, PaginationMenu],
      template: () => <justifi-payments-list accountId="" authToken="" onError-event={errorEvent} />,
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
      components: [JustifiPaymentsList, PaginationMenu],
      template: () => (
        <justifi-payments-list
          accountId="abc"
          authToken="abc"
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

  it('renders properly with fetched data', async () => {
    PaymentService.prototype.fetchPayments = jest.fn().mockResolvedValue(mockPaymentsResponse);

    const page = await newSpecPage({
      components: [JustifiPaymentsList, PaginationMenu],
      template: () => <justifi-payments-list accountId="123" authToken="123" columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.payments[0]).toEqual(expect.objectContaining({ account_id: mockPaymentsResponse.data[0].account_id }));
    const rows = page.root.shadowRoot.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockPaymentsResponse.data.length);
    expect(PaymentService.prototype.fetchPayments).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    PaymentService.prototype.fetchPayments = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const page = await newSpecPage({
      components: [JustifiPaymentsList, PaginationMenu],
      template: () => <justifi-payments-list accountId="some-id" authToken="some-auth-token" columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event on row click', async () => {
    PaymentService.prototype.fetchPayments = jest.fn().mockResolvedValue(mockPaymentsResponse);

    const page = await newSpecPage({
      components: [JustifiPaymentsList, PaginationMenu],
      template: () => <justifi-payments-list accountId="123" authToken="123" columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    const firstRow = page.root.shadowRoot.querySelector('[data-test-id="table-row"]') as HTMLElement;
    expect(firstRow).not.toBeNull();

    const spyEvent = jest.fn();
    page.doc.addEventListener('click-event', spyEvent);

    firstRow.click();
    expect(spyEvent).toHaveBeenCalled();
  });

  it('updates params and refetches data on pagination interaction', async () => {
    PaymentService.prototype.fetchPayments = jest.fn().mockResolvedValue(mockPaymentsResponse);

    const page = await newSpecPage({
      components: [JustifiPaymentsList, PaginationMenu],
      template: () => <justifi-payments-list accountId="123" authToken="123" columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(PaymentService.prototype.fetchPayments).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
