import { newSpecPage } from '@stencil/core/testing';
import { Table } from '../../table/table';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import { PayoutsListCore } from '../payouts-list-core';
import mockSuccessResponse from '../../../api/mockData/mockPayoutsSuccess.json';
import { IApiResponseCollection, IPayout } from '../../../api';
import { makeGetPayouts } from '../get-payouts';

const mockPayoutsResponse = mockSuccessResponse as IApiResponseCollection<IPayout[]>;

describe('payouts-list-core', () => {
  it('renders properly', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockResolvedValue(mockPayoutsResponse),
    };
    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `
        <payouts-list-core></payouts-list-core>
      `,
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPayouts = makeGetPayouts({
      id: '123',
      authToken: '123',
      service: mockPayoutService
    });

    page.rootInstance.fetchData();

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const rows = shadowRoot.querySelectorAll('[data-test-id="table-row"]');

    expect(rows.length).toBe(4);
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

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: '<payouts-list-core></payouts-list-core>',
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPayouts = getPayouts;

    page.rootInstance.fetchData();

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('emits payout-row-clicked event on row click', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockResolvedValue(mockPayoutsResponse),
    };

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: '<payouts-list-core></payouts-list-core>',
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPayouts = makeGetPayouts({
      id: '123',
      authToken: '123',
      service: mockPayoutService
    });

    page.rootInstance.fetchData();

    await page.waitForChanges();

    const rowClickedHandler = jest.fn();
    page.win.addEventListener('payout-row-clicked', rowClickedHandler);

    const justifiTable = page.root.querySelector('justifi-table');
    const shadowRoot = justifiTable.shadowRoot;
    const rows = shadowRoot.querySelectorAll('[data-test-id="table-row"]');

    if (rows.length > 0) {
      (rows[0] as HTMLElement).click();
      await page.waitForChanges();
    }
  });


  it('updates params and refetches data on pagination interaction', async () => {
    const mockPayoutService = {
      fetchPayouts: jest.fn().mockResolvedValue(mockPayoutsResponse),
    };

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `<payouts-list-core></payouts-list-core>`,
    });

    page.rootInstance.componentWillLoad = () => { };

    page.rootInstance.getPayouts = makeGetPayouts({
      id: '123',
      authToken: '123',
      service: mockPayoutService
    });

    page.rootInstance.fetchData();

    await page.waitForChanges();

    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 3 times: once for the initial load, twice for when mockGetPayouts is set and later after the pagination interaction
    expect(mockPayoutService.fetchPayouts).toHaveBeenCalledTimes(3);
    const updatedParams = page.rootInstance.params;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
