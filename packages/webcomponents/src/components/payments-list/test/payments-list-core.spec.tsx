jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentsListCore } from '../payments-list-core';
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import mockSuccessResponse from '../../../../../../mockData/mockPaymentsSuccess.json';
import { IApiResponseCollection, IPayment } from '../../../api';
import { makeGetPayments } from '../../../actions/payment/get-payments';
import { defaultColumnsKeys } from '../payments-table';

const mockPaymentsResponse = mockSuccessResponse as IApiResponseCollection<IPayment[]>;
const components = [PaymentsListCore, PaginationMenu];


describe('payments-list-core render and events', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders properly with fetched data', async () => {
    const mockPaymentsService = {
      fetchPayments: jest.fn().mockResolvedValue(mockPaymentsResponse),
    };

    const getPayments = makeGetPayments({
      id: '123',
      authToken: '123',
      service: mockPaymentsService
    });

    const page = await newSpecPage({
      components: [PaymentsListCore, PaginationMenu],
      template: () => <payments-list-core getPayments={getPayments} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.payments[0]).toEqual(expect.objectContaining({ account_id: mockPaymentsResponse.data[0].account_id }));
    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockPaymentsResponse.data.length);
    expect(mockPaymentsService.fetchPayments).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockService = {
      fetchPayments: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPayments = makeGetPayments({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const page = await newSpecPage({
      components: [PaymentsListCore, PaginationMenu],
      template: () => <payments-list-core getPayments={getPayments} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event on row click', async () => {
    const mockPaymentsService = {
      fetchPayments: jest.fn().mockResolvedValue(mockPaymentsResponse),
    };

    const getPayments = makeGetPayments({
      id: '123',
      authToken: '123',
      service: mockPaymentsService
    });

    const page = await newSpecPage({
      components: [PaymentsListCore, PaginationMenu],
      template: () => <payments-list-core getPayments={getPayments} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    const firstRow = page.root.querySelector('[data-test-id="table-row"]') as HTMLElement;
    expect(firstRow).not.toBeNull();

    const spyEvent = jest.fn();
    page.win.addEventListener('click-event', spyEvent);

    firstRow.click();
    expect(spyEvent).toHaveBeenCalled();
  });

  it('emits error event on fetch error', async () => {
    const mockService = {
      fetchPayments: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPayments = makeGetPayments({
      id: 'some-id',
      authToken: 'some-auth',
      service: mockService
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [PaymentsListCore, PaginationMenu],
      template: () => <payments-list-core getPayments={getPayments} columns={defaultColumnsKeys} onError-event={errorEvent} />,
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

describe('payments-list-core pagination', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('updates params and refetches data on pagination interaction', async () => {
    const mockPaymentsService = {
      fetchPayments: jest.fn().mockResolvedValue(mockPaymentsResponse),
    };

    const getPayments = makeGetPayments({
      id: '123',
      authToken: '123',
      service: mockPaymentsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <payments-list-core getPayments={getPayments} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockPaymentsService.fetchPayments).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
