import { newSpecPage } from '@stencil/core/testing';
import { MockPayoutService } from './MockPayoutService';
import { Table } from '../../table/table';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import { PayoutsListCore } from '../payouts-list-core';
import mockSuccessResponse from '../../../api/mockData/mockPayoutsSuccess.json';
import { IApiResponseCollection, IPayout } from '../../../api';

const mockPayoutsResponse = mockSuccessResponse as IApiResponseCollection<IPayout[]>;

describe('payouts-list-core', () => {
  it('renders properly', async () => {
    const mockPayoutService = new MockPayoutService({ fetchPayoutsResponse: mockPayoutsResponse });
    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `
        <payouts-list-core
          account-id="acc_123"
          auth-token="my-token"
        ></payouts-list-core>
      `,
    });

    page.root.payoutService = mockPayoutService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const rows = shadowRoot.querySelectorAll('[data-test-id="table-row"]');

    expect(rows.length).toBe(4);
  });

  it('renders an error state when no account id is passed', async () => {
    const mockPayoutService = new MockPayoutService({ fetchPayoutsResponse: mockPayoutsResponse });
    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `
        <payouts-list-core
          auth-token="my-token"
        ></payouts-list-core>
      `,
    });

    page.root.payoutService = mockPayoutService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
  });

  it('renders an error state when no auth token is passed', async () => {
    const mockPayoutService = new MockPayoutService({ fetchPayoutsResponse: mockPayoutsResponse });
    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `
        <payouts-list-core
          account-id="acc_123"
        ></payouts-list-core>
      `,
    });

    page.root.payoutService = mockPayoutService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
  });

  it('renders an error state when payout service fails', async () => {
    const mockPayoutService = new MockPayoutService({ fetchPayoutsResponse: null });
    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `
        <payouts-list-core
          account-id="acc_123"
          auth-token="my-token"
        ></payouts-list-core>
      `,
    });

    page.root.payoutService = mockPayoutService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
  });

  it('listens to row clicks', async () => {
    const mockPayoutService = new MockPayoutService({ fetchPayoutsResponse: mockPayoutsResponse });
    const page = await newSpecPage({
      components: [PayoutsListCore, Table, PaginationMenu],
      html: `<payouts-list-core account-id="acc_123" auth-token="my-token"></payouts-list-core>`,
    });

    page.root.payoutService = mockPayoutService;
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

    expect(rowClickedHandler).toHaveBeenCalled();
  });
});
