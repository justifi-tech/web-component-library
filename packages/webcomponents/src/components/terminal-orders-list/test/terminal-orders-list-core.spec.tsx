jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TerminalOrdersListCore } from '../terminal-orders-list-core';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import mockSuccessResponse from '../../../../../../mockData/mockTerminalOrdersListSuccess.json';
import { IApiResponseCollection, ITerminalOrder } from '../../../api';
import { makeGetTerminalOrders } from '../../../actions/terminal/get-terminal-orders';
import { TerminalOrdersListFilters } from '../terminal-orders-list-filters';
import { TableFiltersMenu } from '../../../ui-components/filters/table-filters-menu';
import { SelectInput } from '../../../ui-components/form/form-control-select';
import { defaultColumnsKeys } from '../terminal-orders-table';

const mockOrdersResponse = mockSuccessResponse as IApiResponseCollection<ITerminalOrder[]>;
const components = [TerminalOrdersListCore, PaginationMenu, TableFiltersMenu, TerminalOrdersListFilters, SelectInput];

describe('terminal-orders-list-core', () => {

  it('renders properly with fetched data', async () => {
    const mockTerminalsService = {
      fetchTerminalOrders: jest.fn().mockResolvedValue(mockOrdersResponse),
    };

    const getTerminalOrders = makeGetTerminalOrders({
      id: '123',
      authToken: '123',
      service: mockTerminalsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminal-orders-list-core getTerminalOrders={getTerminalOrders} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.terminalOrders[0]).toEqual(expect.objectContaining({ sub_account_id: mockOrdersResponse.data[0].sub_account_id }));
    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockOrdersResponse.data.length);
    expect(mockTerminalsService.fetchTerminalOrders).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockService = {
      fetchTerminalOrders: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getTerminalOrders = makeGetTerminalOrders({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminal-orders-list-core getTerminalOrders={getTerminalOrders} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event event on row click', async () => {
    const mockTerminalsService = {
      fetchTerminalOrders: jest.fn().mockResolvedValue(mockOrdersResponse),
    };

    const getTerminalOrders = makeGetTerminalOrders({
      id: '123',
      authToken: '123',
      service: mockTerminalsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminal-orders-list-core getTerminalOrders={getTerminalOrders} columns={defaultColumnsKeys} />,
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
      fetchTerminalOrders: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getTerminalOrders = makeGetTerminalOrders({
      id: 'some-id',
      authToken: 'some-auth',
      service: mockService,
      apiOrigin: 'http://localhost:3000'
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: components,
      template: () => <terminal-orders-list-core getTerminalOrders={getTerminalOrders} columns={defaultColumnsKeys} onError-event={errorEvent} />,
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

describe('terminal-orders-list-core pagination', () => {

  it('updates params and refetches data on pagination interaction', async () => {
    const mockTerminalsService = {
      fetchTerminalOrders: jest.fn().mockResolvedValue(mockOrdersResponse),
    };

    const getTerminalOrders = makeGetTerminalOrders({
      id: '123',
      authToken: '123',
      service: mockTerminalsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminal-orders-list-core getTerminalOrders={getTerminalOrders} columns={defaultColumnsKeys} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockTerminalsService.fetchTerminalOrders).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
