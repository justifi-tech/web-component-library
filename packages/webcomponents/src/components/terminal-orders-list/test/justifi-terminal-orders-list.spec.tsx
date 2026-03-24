jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiTerminalOrdersList } from '../justifi-terminal-orders-list';
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import mockSuccessResponse from '../../../../../../mockData/mockTerminalOrdersListSuccess.json';
import { IApiResponseCollection, ITerminalOrder } from '../../../api';
import { JustifiTerminalOrdersListFilters } from '../justifi-terminal-orders-list-filters';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { FormControlSelect } from '../../../ui-components/form/form-control-select';
import { defaultColumnsKeys } from '../terminal-orders-table';
import { TerminalOrderService } from '../../../api/services/terminal_orders.service';
import JustifiAnalytics from '../../../api/Analytics';

jest.mock('../../../api/services/terminal_orders.service');

const mockOrdersResponse = mockSuccessResponse as IApiResponseCollection<ITerminalOrder[]>;
const tableTestComponents = [
  JustifiTerminalOrdersList,
  PaginationMenu,
  TableFiltersMenu,
  JustifiTerminalOrdersListFilters,
  FormControlSelect,
];

beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-terminal-orders-list', () => {
  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiTerminalOrdersList],
      template: () => <justifi-terminal-orders-list accountId="" authToken="" onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
  });

  it('emit an error event when fetch fails', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiTerminalOrdersList],
      template: () => (
        <justifi-terminal-orders-list accountId="abc" authToken="abc" onError-event={errorEvent} />
      ),
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        },
      }),
    );
  });
});

describe('justifi-terminal-orders-list table', () => {
  it('renders properly with fetched data', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockResolvedValue(mockOrdersResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-terminal-orders-list accountId="123" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    expect(page.rootInstance.terminalOrders[0]).toEqual(
      expect.objectContaining({ sub_account_id: mockOrdersResponse.data[0].sub_account_id }),
    );
    const rows = page.root.shadowRoot.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockOrdersResponse.data.length);
    expect(TerminalOrderService.prototype.fetchTerminalOrders).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-terminal-orders-list accountId="some-id" authToken="some-auth-token" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event event on row click', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockResolvedValue(mockOrdersResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-terminal-orders-list accountId="123" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    const firstRow = page.root.shadowRoot.querySelector('[data-test-id="table-row"]') as HTMLElement;
    expect(firstRow).not.toBeNull();

    const spyEvent = jest.fn();
    page.win.addEventListener('click-event', spyEvent);

    firstRow.click();
    expect(spyEvent).toHaveBeenCalled();
  });

  it('emits error event on fetch error', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-terminal-orders-list
          accountId="some-id"
          authToken="some-auth"
          columns={defaultColumnsKeys}
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
        },
      }),
    );
  });
});

describe('justifi-terminal-orders-list pagination', () => {
  it('updates params and refetches data on pagination interaction', async () => {
    TerminalOrderService.prototype.fetchTerminalOrders = jest.fn().mockResolvedValue(mockOrdersResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-terminal-orders-list accountId="123" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    expect(TerminalOrderService.prototype.fetchTerminalOrders).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
