jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import { PayoutsListCore } from '../payouts-list-core';
import mockSuccessResponse from '../../../../../../mockData/mockPayoutsSuccess.json';
import mockSubAccountSuccessResponse from '../../../../../../mockData/mockSubAccountsListSuccess.json';
import { IApiResponseCollection, IPayout, ISubAccount } from '../../../api';
import { makeGetPayouts } from '../get-payouts';
import { makeGetSubAccounts } from '../../../api/get-subaccounts';
import { defaultColumnsKeys } from '../payouts-table';
import { TableFiltersMenu } from '../../../ui-components/filters/table-filters-menu';
import { PayoutsListFilters } from '../payouts-list-filters';

const mockPayoutsResponse = mockSuccessResponse as IApiResponseCollection<IPayout[]>;
const mockSubAccountsResponse = mockSubAccountSuccessResponse as IApiResponseCollection<ISubAccount[]>;
const components = [PayoutsListCore, PaginationMenu, TableFiltersMenu, PayoutsListFilters];

describe('payouts-list-core', () => {
  it('renders properly', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockResolvedValue(mockPayoutsResponse),
    };
    const getPayouts = makeGetPayouts({
      id: '123',
      authToken: '123',
      service: mockPayoutService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <payouts-list-core getPayouts={getPayouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');

    expect(rows.length).toBe(5);
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPayouts = makeGetPayouts({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockPayoutService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <payouts-list-core getPayouts={getPayouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    const error = page.root.querySelector('[data-test-id="table-error-state"]');
    expect(error).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('emits an error event on failed data fetch', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getPayouts = makeGetPayouts({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockPayoutService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService,
      apiOrigin: 'http://localhost:3000'
    });

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: components,
      template: () => <payouts-list-core getPayouts={getPayouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} onError-event={errorSpy} />,
    });

    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        errorCode: 'fetch-error',
        message: 'Fetch error',
        severity: 'error',
      }
    }));
  });

  it('emits payout-row-clicked event on row click', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockResolvedValue(mockPayoutsResponse),
    };

    const getPayouts = makeGetPayouts({
      id: '123',
      authToken: '123',
      service: mockPayoutService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <payouts-list-core getPayouts={getPayouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    const rowClickedHandler = jest.fn();
    page.win.addEventListener('payout-row-clicked', rowClickedHandler);

    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');

    if (rows.length > 0) {
      (rows[0] as HTMLElement).click();
      await page.waitForChanges();
    }
  });

  it('updates params and refetches data on pagination interaction', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockResolvedValue(mockPayoutsResponse),
    };

    const getPayouts = makeGetPayouts({
      id: '123',
      authToken: '123',
      service: mockPayoutService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: 'mock_id',
      authToken: '123',
      service: mockSubAccountsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <payouts-list-core getPayouts={getPayouts} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });
    await page.waitForChanges();

    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockPayoutService.fetchPayouts).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.params;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
