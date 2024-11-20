jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CheckoutsListCore } from '../checkouts-list-core';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import mockSuccessResponse from '../../../../../../mockData/mockGetCheckoutsListSuccess.json';
import { IApiResponseCollection, ICheckout } from '../../../api';
import { makeGetCheckoutsList } from '../get-checkouts';
import { TableFiltersMenu } from '../../../ui-components/filters/table-filters-menu';
import { CheckoutsListFilters } from '../checkouts-list-filters';
import { SelectInput } from '../../../ui-components/form/form-control-select';

const mockCheckoutsListResponse = mockSuccessResponse as IApiResponseCollection<ICheckout[]>;
const components = [CheckoutsListCore, PaginationMenu, TableFiltersMenu, CheckoutsListFilters, SelectInput];

describe('checkouts-list-core', () => {
  it('renders properly with fetched data', async () => {
    const mockCheckoutsService = {
      fetchCheckoutsList: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: [CheckoutsListCore, PaginationMenu],
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.checkouts[0]).toEqual(expect.objectContaining({ account_id: mockCheckoutsListResponse.data[0].account_id }));
    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockCheckoutsListResponse.data.length);
    expect(mockCheckoutsService.fetchCheckoutsList).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockService = {
      fetchCheckoutsList: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: 'some-auth-token',
      service: mockService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: [CheckoutsListCore, PaginationMenu],
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits checkout-row-clicked event on row click', async () => {
    const mockCheckoutsService = {
      fetchCheckoutsList: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: [CheckoutsListCore, PaginationMenu],
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    await page.waitForChanges();

    const firstRow = page.root.querySelector('[data-test-id="table-row"]') as HTMLElement;
    expect(firstRow).not.toBeNull();

    const spyEvent = jest.fn();
    page.win.addEventListener('checkout-row-clicked', spyEvent);

    firstRow.click();
    expect(spyEvent).toHaveBeenCalled();
  });

  it('shows table filter menu on filter button click', async () => {
    const mockCheckoutsService = {
      fetchCheckoutsList: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: [CheckoutsListCore, PaginationMenu, TableFiltersMenu, CheckoutsListFilters],
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    await page.waitForChanges();

    const filterButton = page.root.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    expect(filterButton).not.toBeNull();

    filterButton.click();
    await page.waitForChanges();

    const filterMenu = page.root.querySelector('[data-test-id="filter-menu"]') as HTMLElement;
    expect(filterMenu).not.toBeNull();
  });

  it('updates params and refetches data on filter interaction', async () => {
    const mockCheckoutsService = {
      fetchCheckoutsList: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    const filterButton = page.root.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    filterButton.click();

    const filterMenu = page.root.querySelector('checkouts-list-filters') as HTMLElement;
    expect(filterMenu).not.toBeNull();

    const selectFilter = filterMenu.querySelector('form-control-select') as HTMLFormControlSelectElement;
    expect(selectFilter).not.toBeNull();

    const selectFilterInput = selectFilter.querySelector('select') as HTMLSelectElement;
    expect(selectFilterInput).not.toBeNull();

    selectFilterInput.click();

    const selectOptions = selectFilterInput.querySelectorAll('option');
    expect(selectOptions).not.toBeNull();

    const succeededOption = selectOptions[3] as HTMLOptionElement;
    succeededOption.click();
    selectFilterInput.value = 'succeeded';
    selectFilterInput.dispatchEvent(new Event('input'));

    expect(mockCheckoutsService.fetchCheckoutsList).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.params;
    expect(updatedParams).toEqual({ "status": "succeeded" });
  });

  it('clears filters and refetches data on clear filters interaction', async () => {
    const mockCheckoutsService = {
      fetchCheckoutsList: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    const filterButton = page.root.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    filterButton.click();

    const filterMenu = page.root.querySelector('table-filters-menu') as HTMLElement;
    expect(filterMenu).not.toBeNull();

    const selectFilter = filterMenu.querySelector('form-control-select') as HTMLFormControlSelectElement;
    expect(selectFilter).not.toBeNull();

    const selectFilterInput = selectFilter.querySelector('select') as HTMLSelectElement;
    expect(selectFilterInput).not.toBeNull();

    selectFilterInput.click();

    const selectOptions = selectFilterInput.querySelectorAll('option');
    expect(selectOptions).not.toBeNull();

    const succeededOption = selectOptions[3] as HTMLOptionElement;
    succeededOption.click();
    selectFilterInput.value = 'succeeded';
    selectFilterInput.dispatchEvent(new Event('input'));

    const clearButton = filterMenu.querySelector('[data-test-id="clear-filters-button"]') as HTMLElement;
    expect(clearButton).not.toBeNull();

    clearButton.click();

    expect(mockCheckoutsService.fetchCheckoutsList).toHaveBeenCalledTimes(3);
    const updatedParams = page.rootInstance.params;
    expect(updatedParams).toEqual({});
  });

  it('updates params and refetches data on pagination interaction', async () => {
    const mockCheckoutsService = {
      fetchCheckoutsList: jest.fn().mockResolvedValue(mockCheckoutsListResponse),
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: '123',
      service: mockCheckoutsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: [CheckoutsListCore, PaginationMenu],
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockCheckoutsService.fetchCheckoutsList).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.params;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });

  it('emits error event on fetch error', async () => {
    const mockService = {
      fetchCheckoutsList: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getCheckouts = makeGetCheckoutsList({
      accountId: 'mock_id',
      authToken: 'some-auth',
      service: mockService,
      apiOrigin: 'http://localhost:3000'
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: [CheckoutsListCore, PaginationMenu],
      template: () => <checkouts-list-core getCheckoutsList={getCheckouts} onError-event={errorEvent} />,
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
