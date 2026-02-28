jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiPayoutsList } from '../justifi-payouts-list';
import { PaginationMenu } from '../../../ui-components/pagination-menu/pagination-menu';
import { defaultColumnsKeys } from '../payouts-table';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { JustifiPayoutsListFilters } from '../justifi-payouts-list-filters';
import { filterParams } from '../payouts-list-params-state';
import { PayoutsListCore } from '../payouts-list-core';
import { FormControlDate } from '../../../ui-components/form/form-control-date';
import { FormControlSelect } from '../../../ui-components/form/form-control-select';

const components = [JustifiPayoutsList, PayoutsListCore, PaginationMenu, TableFiltersMenu, JustifiPayoutsListFilters, FormControlDate, FormControlSelect];

describe('justifi-payouts-list filters', () => {
  const fetchDataSpy = jest.spyOn(PayoutsListCore.prototype, 'fetchData');
  let page;

  afterEach(() => {
    page = null;
    jest.resetAllMocks();
  });

  it('shows table filter menu on filter button click', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      flushQueue: true,
      template: () =>
        <div>
          <justifi-payouts-list-filters />
          <justifi-payouts-list
            accountId="abc"
            authToken="abc"
            columns={defaultColumnsKeys}
          />,
        </div>
    });

    const filterButton = page.root.shadowRoot.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    expect(filterButton).not.toBeNull();

    filterButton.click();

    const filterMenu = page.root.shadowRoot.querySelector('[data-test-id="filter-menu"]') as HTMLElement;
    expect(filterMenu).not.toBeNull();
  });

  it('updates params and refetches data on filter interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      template: () =>
        <div>
          <justifi-payouts-list-filters />
          <justifi-payouts-list
            accountId="abc"
            authToken="abc"
            columns={defaultColumnsKeys}
          />,
        </div>
    });

    expect(fetchDataSpy).toHaveBeenCalled();

    const filterButton = page.root.shadowRoot.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    filterButton.click();

    const filterMenu = page.root.shadowRoot.querySelector('[data-test-id="filter-menu"]') as HTMLElement;
    expect(filterMenu).not.toBeNull();

    const dateFilter = filterMenu.querySelector('form-control-date') as HTMLFormControlDateElement;
    expect(dateFilter).not.toBeNull();

    const dateFilterInput = dateFilter.querySelector('input');
    expect(dateFilterInput).not.toBeNull();

    dateFilterInput.value = '2021-01-01';
    dateFilterInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams).toEqual({ "created_after": "2021-01-01T23:59:59.000Z" });
  });

  it('clears filters and refetches data on clear filters interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      flushQueue: true,
      template: () =>
        <div>
          <justifi-payouts-list-filters />
          <justifi-payouts-list
            accountId="abc"
            authToken="abc"
            columns={defaultColumnsKeys}
          />,
        </div>
    });

    expect(fetchDataSpy).toHaveBeenCalled();

    const filterButton = page.root.shadowRoot.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    filterButton.click();

    const filterMenu = page.root.shadowRoot.querySelector('[data-test-id="filter-menu"]') as HTMLElement;
    expect(filterMenu).not.toBeNull();

    const dateFilter = filterMenu.querySelector('form-control-date') as HTMLFormControlDateElement;
    expect(dateFilter).not.toBeNull();

    const dateFilterInput = dateFilter.querySelector('input');
    expect(dateFilterInput).not.toBeNull();

    dateFilterInput.value = '2021-01-01';
    dateFilterInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();

    const clearButton = page.root.shadowRoot.querySelector('[data-test-id="clear-filters-button"]') as HTMLElement;
    expect(clearButton).not.toBeNull();

    clearButton.click();

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams).toEqual({});
  });

  it('updates params and refetches data on status filter interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      template: () =>
        <div>
          <justifi-payouts-list-filters />
          <justifi-payouts-list
            accountId="abc"
            authToken="abc"
            columns={defaultColumnsKeys}
          />,
        </div>
    });

    expect(fetchDataSpy).toHaveBeenCalled();

    const filterButton = page.root.shadowRoot.querySelector('[data-test-id="open-filters-button"]') as HTMLElement;
    filterButton.click();

    const filterMenu = page.root.shadowRoot.querySelector('[data-test-id="filter-menu"]') as HTMLElement;
    expect(filterMenu).not.toBeNull();

    const statusFilter = filterMenu.querySelector('form-control-select') as HTMLFormControlSelectElement;
    expect(statusFilter).not.toBeNull();

    const statusFilterSelect = statusFilter.querySelector('select') as HTMLSelectElement;
    expect(statusFilterSelect).not.toBeNull();

    statusFilterSelect.value = 'paid';
    statusFilterSelect.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams).toEqual({ "status": "paid" });
  });
});
