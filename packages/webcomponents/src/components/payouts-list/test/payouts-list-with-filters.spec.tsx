jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PayoutsList } from '../payouts-list';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import { defaultColumnsKeys } from '../payouts-table';
import { TableFiltersMenu } from '../../../ui-components/filters/table-filters-menu';
import { PayoutsListFilters } from '../payouts-list-filters';
import { queryParams } from '../payouts-list-params-state';
import { PayoutsListCore } from '../payouts-list-core';
import { DateInput } from '../../../ui-components/form/form-control-date';

const components = [PayoutsList, PayoutsListCore, PaginationMenu, TableFiltersMenu, PayoutsListFilters, DateInput];

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
          account-id="abc"
          auth-token="abc" 
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
          account-id="abc"
          auth-token="abc" 
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
    const updatedParams = queryParams;
    expect(updatedParams).toEqual({"created_after": "2021-01-01T23:59:59.000Z"});
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
          account-id="abc"
          auth-token="abc" 
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
    const updatedParams = queryParams;
    expect(updatedParams).toEqual({});
  });
});
