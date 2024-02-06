import { newSpecPage } from '@stencil/core/testing';
import { MockPaymentService } from './MockPaymentService';
import { Table } from '../../table/table';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import { PaymentsListCore } from '../payments-list-core';
import { FetchPaymentsResponseType } from '../../../api';
import mockSuccessResponse from '../../../api/mockData/mockPaymentsSuccess.json';

const mockPaymentsResponse = mockSuccessResponse as FetchPaymentsResponseType;

describe('payments-list-core', () => {
  it('renders properly', async () => {
    const mockPaymentService = new MockPaymentService({ fetchPaymentsResponse: mockPaymentsResponse });
    const page = await newSpecPage({
      components: [PaymentsListCore, Table, PaginationMenu],
      html: `
        <payments-list-core
          account-id="acc_123"
          auth-token="my-token"
        ></payments-list-core>
      `,
    });

    page.root.paymentService = mockPaymentService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const rows = shadowRoot.querySelectorAll('[data-test-id="table-row"]');

    expect(rows.length).toBe(2);
  });

  it('renders an error state when no account id is passed', async () => {
    const mockPaymentService = new MockPaymentService({ fetchPaymentsResponse: mockPaymentsResponse });
    const page = await newSpecPage({
      components: [PaymentsListCore, Table, PaginationMenu],
      html: `
        <payments-list-core
          auth-token="my-token"
        ></payments-list-core>
      `,
    });

    page.root.paymentService = mockPaymentService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
  });

  it('renders an error state when no auth token is passed', async () => {
    const mockPaymentService = new MockPaymentService({ fetchPaymentsResponse: mockPaymentsResponse });
    const page = await newSpecPage({
      components: [PaymentsListCore, Table, PaginationMenu],
      html: `
        <payments-list-core
          account-id="acc_123"
        ></payments-list-core>
      `,
    });

    page.root.paymentService = mockPaymentService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
  });

  it('renders an error state when payment service fails', async () => {
    const mockPaymentService = new MockPaymentService({ fetchPaymentsResponse: null });
    const page = await newSpecPage({
      components: [PaymentsListCore, Table, PaginationMenu],
      html: `
        <payments-list-core
          account-id="acc_123"
          auth-token="my-token"
        ></payments-list-core>
      `,
    });

    page.root.paymentService = mockPaymentService

    await page.waitForChanges();

    const justifiTable = page.root.querySelector('justifi-table');

    const shadowRoot = justifiTable.shadowRoot;

    const error = shadowRoot.querySelector('[data-test-id="error-state"]');
    expect(error).toBeTruthy();
  });

  it('listens to row clicks', async () => {
    const mockPaymentService = new MockPaymentService({ fetchPaymentsResponse: mockPaymentsResponse });
    const page = await newSpecPage({
      components: [PaymentsListCore, Table, PaginationMenu],
      html: `<payments-list-core account-id="acc_123" auth-token="my-token"></payments-list-core>`,
    });

    page.root.paymentService = mockPaymentService;
    await page.waitForChanges();

    // Add the event listener to the window object to capture bubbled events
    const rowClickedHandler = jest.fn();
    page.win.addEventListener('payment-row-clicked', rowClickedHandler);

    const justifiTable = page.root.querySelector('justifi-table');
    const shadowRoot = justifiTable.shadowRoot;
    const rows = shadowRoot.querySelectorAll('[data-test-id="table-row"]');

    if (rows.length > 0) {
      (rows[0] as HTMLElement).click();
      await page.waitForChanges(); // Wait for any asynchronous updates post-click
    }

    // Check if the event handler was called
    expect(rowClickedHandler).toHaveBeenCalled();
  });
});
