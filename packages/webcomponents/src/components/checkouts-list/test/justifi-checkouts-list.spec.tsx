jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiCheckoutsList } from '../justifi-checkouts-list';
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import mockCheckoutsSuccess from '../../../../../../mockData/mockGetCheckoutsListSuccess.json';
import mockSubAccountSuccessResponse from '../../../../../../mockData/mockSubAccountsListSuccess.json';
import { IApiResponseCollection, ICheckout, ISubAccount } from '../../../api';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { JustifiCheckoutsListFilters } from '../checkouts-list-filters';
import { FormControlSelect } from '../../../ui-components/form/form-control-select';
import { defaultColumnsKeys } from '../checkouts-table';
import { CheckoutService } from '../../../api/services/checkout.service';
import { SubAccountService } from '../../../api/services/subaccounts.service';
import JustifiAnalytics from '../../../api/Analytics';

jest.mock('../../../api/services/checkout.service');
jest.mock('../../../api/services/subaccounts.service');

const mockCheckoutsListResponse = mockCheckoutsSuccess as IApiResponseCollection<ICheckout[]>;
const mockSubAccountsResponse = mockSubAccountSuccessResponse as IApiResponseCollection<ISubAccount[]>;
const tableTestComponents = [JustifiCheckoutsList, PaginationMenu, TableFiltersMenu, JustifiCheckoutsListFilters, FormControlSelect];

beforeEach(() => {
  // @ts-ignore
  JustifiAnalytics.prototype.trackCustomEvents = jest.fn();
});

describe('justifi-checkouts-list', () => {
  it('emit an error event when accountId and authToken are not provided', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => <justifi-checkouts-list accountId="" authToken="" onError-event={errorEvent} />,
    });
    await page.waitForChanges();
    expect(errorEvent).toHaveBeenCalled();
  });

  it('emit an error event when fetch fails', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockRejectedValue(new Error('Fetch error'));

    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => (
        <justifi-checkouts-list accountId="abc" authToken="abc" onError-event={errorEvent} />
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

describe('justifi-checkouts-list with subAccountId', () => {
  it('uses subAccountId when provided instead of accountId for fetching checkouts', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => (
        <justifi-checkouts-list accountId="acc_123" authToken="token_123" subAccountId="sub_acc_456" />
      ),
    });
    await page.waitForChanges();

    expect(page.rootInstance.getCheckouts).toBeDefined();
  });

  it('uses accountId when subAccountId is not provided', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => <justifi-checkouts-list accountId="acc_123" authToken="token_123" />,
    });
    await page.waitForChanges();

    expect(page.rootInstance.getCheckouts).toBeDefined();
  });

  it('prioritizes subAccountId over accountId when both are provided', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => (
        <justifi-checkouts-list accountId="acc_123" authToken="token_123" subAccountId="sub_acc_456" />
      ),
    });
    await page.waitForChanges();

    expect(page.rootInstance.getCheckouts).toBeDefined();
    expect(page.rootInstance.getSubAccounts).toBeDefined();
  });

  it('emits error when only subAccountId is provided without authToken', async () => {
    const errorEvent = jest.fn();
    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => (
        <justifi-checkouts-list
          accountId=""
          subAccountId="sub_acc_456"
          authToken=""
          onError-event={errorEvent}
        />
      ),
    });
    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          errorCode: 'missing-props',
          message: 'Account ID/Sub Account ID and Auth Token are required',
        }),
      }),
    );
  });

  it('initializes getSubAccounts with primary accountId, not subAccountId', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    const mockFetchSubAccounts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;
    SubAccountService.prototype.fetchSubAccounts = mockFetchSubAccounts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => (
        <justifi-checkouts-list accountId="acc_123" authToken="token_123" subAccountId="sub_acc_456" />
      ),
    });
    await page.waitForChanges();

    expect(page.rootInstance.getSubAccounts).toBeDefined();
  });

  it('does not initialize getSubAccounts when accountId is missing', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => (
        <justifi-checkouts-list accountId="" authToken="token_123" subAccountId="sub_acc_456" />
      ),
    });
    await page.waitForChanges();

    expect(page.rootInstance.getSubAccounts).toBeUndefined();
  });

  it('reinitializes data when accountId prop changes', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => <justifi-checkouts-list accountId="acc_123" authToken="token_123" />,
    });
    await page.waitForChanges();

    const initialGetCheckouts = page.rootInstance.getCheckouts;

    page.rootInstance.accountId = 'acc_456';
    await page.waitForChanges();

    expect(page.rootInstance.getCheckouts).toBeDefined();
    expect(page.rootInstance.getCheckouts).not.toBe(initialGetCheckouts);
  });

  it('reinitializes data when authToken prop changes', async () => {
    const mockFetchCheckouts = jest.fn().mockResolvedValue({ data: [] });
    CheckoutService.prototype.fetchCheckouts = mockFetchCheckouts;

    const page = await newSpecPage({
      components: [JustifiCheckoutsList],
      template: () => <justifi-checkouts-list accountId="acc_123" authToken="token_123" />,
    });
    await page.waitForChanges();

    const initialGetCheckouts = page.rootInstance.getCheckouts;

    page.rootInstance.authToken = 'token_456';
    await page.waitForChanges();

    expect(page.rootInstance.getCheckouts).toBeDefined();
    expect(page.rootInstance.getCheckouts).not.toBe(initialGetCheckouts);
  });
});

describe('justifi-checkouts-list table', () => {
  it('renders properly with fetched data', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockResolvedValue(mockCheckoutsListResponse);
    SubAccountService.prototype.fetchSubAccounts = jest.fn().mockResolvedValue(mockSubAccountsResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-checkouts-list accountId="mock_id" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    expect(page.rootInstance.checkouts[0]).toEqual(
      expect.objectContaining({ account_id: mockCheckoutsListResponse.data[0].account_id }),
    );
    const rows = page.root.shadowRoot.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockCheckoutsListResponse.data.length);
    expect(CheckoutService.prototype.fetchCheckouts).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockRejectedValue(new Error('Fetch error'));
    SubAccountService.prototype.fetchSubAccounts = jest.fn().mockResolvedValue(mockSubAccountsResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-checkouts-list accountId="mock_id" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits click-event on row click', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockResolvedValue(mockCheckoutsListResponse);
    SubAccountService.prototype.fetchSubAccounts = jest.fn().mockResolvedValue(mockSubAccountsResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-checkouts-list accountId="mock_id" authToken="123" columns={defaultColumnsKeys} />
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
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockRejectedValue(new Error('Fetch error'));
    SubAccountService.prototype.fetchSubAccounts = jest.fn().mockResolvedValue(mockSubAccountsResponse);

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-checkouts-list
          accountId="mock_id"
          authToken="123"
          onError-event={errorEvent}
          columns={defaultColumnsKeys}
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

  it('displays Apple Pay payment mode correctly in the UI', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockResolvedValue(mockCheckoutsListResponse);
    SubAccountService.prototype.fetchSubAccounts = jest.fn().mockResolvedValue(mockSubAccountsResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-checkouts-list accountId="mock_id" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    const applePayCheckout = page.rootInstance.checkouts.find(
      (checkout) => checkout.id === 'cho_5e6f7g8h9i0j1a2b3c4d',
    );
    expect(applePayCheckout).toBeDefined();
    expect(applePayCheckout.payment_mode).toBe('Apple Pay');

    const paymentModeCells = page.root.shadowRoot.querySelectorAll('td');
    const applePayCell = Array.from(paymentModeCells).find((cell) => cell.textContent === 'Apple Pay');
    expect(applePayCell).toBeTruthy();
  });
});

describe('justifi-checkouts-list pagination', () => {
  it('updates params and refetches data on pagination interaction', async () => {
    CheckoutService.prototype.fetchCheckouts = jest.fn().mockResolvedValue(mockCheckoutsListResponse);
    SubAccountService.prototype.fetchSubAccounts = jest.fn().mockResolvedValue(mockSubAccountsResponse);

    const page = await newSpecPage({
      components: tableTestComponents,
      template: () => (
        <justifi-checkouts-list accountId="mock_id" authToken="123" columns={defaultColumnsKeys} />
      ),
    });

    await page.waitForChanges();

    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    expect(CheckoutService.prototype.fetchCheckouts).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.pagingParams;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });
});
