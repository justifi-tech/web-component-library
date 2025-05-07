jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutsListCore } from '../checkouts-list-core';
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import mockCheckoutsSuccess from '../../../../../../mockData/mockGetCheckoutsListSuccess.json';
import mockSubAccountSuccessResponse from '../../../../../../mockData/mockSubAccountsListSuccess.json';
import { IApiResponseCollection, ICheckout, ISubAccount } from '../../../api';
import { makeGetCheckouts } from '../../../actions/checkout/get-checkouts';
import { TableFiltersMenu } from '../../../ui-components/filters/table-filters-menu';
import { CheckoutsListFilters } from '../checkouts-list-filters';
import { SelectInput } from '../../../ui-components/form/form-control-select';
import { makeGetSubAccounts } from '../../../actions/sub-account/get-subaccounts';
import { defaultColumnsKeys } from '../checkouts-table';

const mockCheckoutsListResponse = mockCheckoutsSuccess as IApiResponseCollection<ICheckout[]>;
const mockSubAccountsResponse = mockSubAccountSuccessResponse as IApiResponseCollection<ISubAccount[]>;
const components = [CheckoutsListCore, PaginationMenu, TableFiltersMenu, CheckoutsListFilters, SelectInput];

describe('checkouts-list-core', () => {

  it('renders properly with fetched data', async () => {
    const mockCheckoutsService = {
      fetchCheckouts: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckouts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckouts={getCheckouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.checkouts[0]).toEqual(expect.objectContaining({ account_id: mockCheckoutsListResponse.data[0].account_id }));
    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockCheckoutsListResponse.data.length);
    expect(mockCheckoutsService.fetchCheckouts).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockCheckoutsService = {
      fetchCheckouts: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getCheckouts = makeGetCheckouts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckouts={getCheckouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event on row click', async () => {
    const mockCheckoutsService = {
      fetchCheckouts: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckouts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService
    });


    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckouts={getCheckouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
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
    const mockCheckoutsService = {
      fetchCheckouts: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getCheckouts = makeGetCheckouts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckouts={getCheckouts} getSubAccounts={getSubAccounts} onError-event={errorEvent} columns={defaultColumnsKeys} />,
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

describe('checkouts-list-core pagination', () => {

  it('updates params and refetches data on pagination interaction', async () => {
    const mockCheckoutsService = {
      fetchCheckouts: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckouts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService
    });


    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckouts={getCheckouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockCheckoutsService.fetchCheckouts).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
