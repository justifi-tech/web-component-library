jest.mock('../../../ui-components/styled-host/modified-bootstrap.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Table } from '../../table/table';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import { PayoutsListCore } from '../payouts-list-core';
import mockSuccessResponse from '../../../../../../mockData/mockPayoutsSuccess.json';
import { IApiResponseCollection, IPayout } from '../../../api';
import { makeGetPayouts } from '../get-payouts';

const mockPayoutsResponse = mockSuccessResponse as IApiResponseCollection<IPayout[]>;

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

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      template: () => <payouts-list-core getPayouts={getPayouts} />,
    });

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const rows = justifiTable.querySelectorAll('[data-test-id="table-row"]');

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
      template: () => <payouts-list-core getPayouts={getPayouts} />,
    });

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const error = justifiTable.querySelector('[data-test-id="table-error-state"]');
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

    const errorSpy = jest.fn();

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      template: () => <payouts-list-core getPayouts={getPayouts} onError-event={errorSpy} />,
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

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      template: () => <payouts-list-core getPayouts={getPayouts} />,
    });

    await page.waitForChanges();

    const rowClickedHandler = jest.fn();
    page.win.addEventListener('payout-row-clicked', rowClickedHandler);

    const justifiTable = page.root.querySelector('justifi-table');
    const rows = justifiTable.querySelectorAll('[data-test-id="table-row"]');

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

    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      template: () => <payouts-list-core getPayouts={getPayouts} />,
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
