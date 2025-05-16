jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TerminalsListCore } from '../terminals-list-core';
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import mockTerminalSuccessResponse from '../../../../../../mockData/mockTerminalsListSuccess.json';
import mockSubAccountSuccessResponse from '../../../../../../mockData/mockSubAccountsListSuccess.json';
import { IApiResponseCollection, ISubAccount, ITerminal } from '../../../api';
import { makeGetTerminals } from '../../../actions/terminal/get-terminals';
import { TerminalsListFilters } from '../terminals-list-filters';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { SelectInput } from '../../../ui-components/form/form-control-select';
import { defaultColumnsKeys } from '../terminals-table';
import { makeGetSubAccounts } from '../../../actions/sub-account/get-subaccounts';

const mockTerminalsResponse = mockTerminalSuccessResponse as IApiResponseCollection<ITerminal[]>;
const mockSubAccountsResponse = mockSubAccountSuccessResponse as IApiResponseCollection<ISubAccount[]>;
const components = [TerminalsListCore, PaginationMenu, TableFiltersMenu, TerminalsListFilters, SelectInput];

describe('terminals-list-core', () => {

  it('renders properly with fetched data', async () => {
    const mockTerminalsService = {
      fetchTerminals: jest.fn().mockResolvedValue(mockTerminalsResponse),
    };

    const getTerminals = makeGetTerminals({
      id: '123',
      authToken: '123',
      service: mockTerminalsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: '123',
      authToken: '123',
      service: mockSubAccountsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.terminals[0]).toEqual(expect.objectContaining({ account_id: mockTerminalsResponse.data[0].account_id }));
    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockTerminalsResponse.data.length);
    expect(mockTerminalsService.fetchTerminals).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockService = {
      fetchTerminals: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getTerminals = makeGetTerminals({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: '123',
      authToken: '123',
      service: mockSubAccountsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event event on row click', async () => {
    const mockTerminalsService = {
      fetchTerminals: jest.fn().mockResolvedValue(mockTerminalsResponse),
    };

    const getTerminals = makeGetTerminals({
      id: '123',
      authToken: '123',
      service: mockTerminalsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: '123',
      authToken: '123',
      service: mockSubAccountsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
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
      fetchTerminals: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getTerminals = makeGetTerminals({
      id: 'some-id',
      authToken: 'some-auth',
      service: mockService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: '123',
      authToken: '123',
      service: mockSubAccountsService
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} onError-event={errorEvent} />,
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

describe('terminals-list-core pagination', () => {

  it('updates params and refetches data on pagination interaction', async () => {
    const mockTerminalsService = {
      fetchTerminals: jest.fn().mockResolvedValue(mockTerminalsResponse),
    };

    const getTerminals = makeGetTerminals({
      id: '123',
      authToken: '123',
      service: mockTerminalsService
    });

    const mockSubAccountsService = {
      fetchSubAccounts: jest.fn().mockResolvedValue(mockSubAccountsResponse),
    };

    const getSubAccounts = makeGetSubAccounts({
      accountId: '123',
      authToken: '123',
      service: mockSubAccountsService
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} getSubAccounts={getSubAccounts} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockTerminalsService.fetchTerminals).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
