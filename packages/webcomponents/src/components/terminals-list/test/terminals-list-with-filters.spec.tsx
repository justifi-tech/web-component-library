jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiTerminalsList } from '../terminals-list';
import { defaultColumnsKeys } from '../terminals-table';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { JustifiTerminalsListFilters } from '../terminals-list-filters';
import { FormControlSelect } from '../../../ui-components/form/form-control-select';
import { FormControlDate } from '../../../ui-components/form/form-control-date';
import { filterParams } from '../terminals-list-params-state';
import { TerminalsListCore } from '../terminals-list-core';

const components = [JustifiTerminalsList, TerminalsListCore, TableFiltersMenu, JustifiTerminalsListFilters, FormControlSelect, FormControlDate];

describe('justifi-terminals-list with filters', () => {
  const fetchDataSpy = jest.spyOn(TerminalsListCore.prototype, 'fetchData');
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
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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

    const selectFilter = filterMenu.querySelector('form-control-select') as HTMLFormControlSelectElement;
    expect(selectFilter).not.toBeNull();

    const selectFilterInput = selectFilter.querySelector('select') as HTMLSelectElement;
    expect(selectFilterInput).not.toBeNull();

    selectFilterInput.click();

    const selectOptions = selectFilterInput.querySelectorAll('option');
    expect(selectOptions).not.toBeNull();

    const succeededOption = selectOptions[3] as HTMLOptionElement;
    succeededOption.click();
    selectFilterInput.value = 'connected';
    selectFilterInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams).toEqual({ "status": "connected" });
  });

  it('clears filters and refetches data on clear filters interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      flushQueue: true,
      template: () =>
        <div>
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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

    const selectFilter = page.root.shadowRoot.querySelector('form-control-select') as HTMLFormControlSelectElement;
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

    const clearButton = page.root.shadowRoot.querySelector('[data-test-id="clear-filters-button"]') as HTMLElement;
    expect(clearButton).not.toBeNull();

    clearButton.click();

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = page.rootInstance.params;
    expect(updatedParams).toEqual(undefined);
  });

  it('updates params and refetches data on created_after date filter interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      template: () =>
        <div>
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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

    const dateFilters = filterMenu.querySelectorAll('form-control-date');
    expect(dateFilters.length).toBe(2);

    const createdAfterFilter = dateFilters[0] as HTMLFormControlDateElement;
    expect(createdAfterFilter).not.toBeNull();

    const dateInput = createdAfterFilter.querySelector('input');
    expect(dateInput).not.toBeNull();

    dateInput.value = '2024-01-15T10:30';
    dateInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams.created_after).toBe('2024-01-15T10:30:00.000Z');
  });

  it('updates params and refetches data on created_before date filter interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      template: () =>
        <div>
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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

    const dateFilters = filterMenu.querySelectorAll('form-control-date');
    expect(dateFilters.length).toBe(2);

    const createdBeforeFilter = dateFilters[1] as HTMLFormControlDateElement;
    expect(createdBeforeFilter).not.toBeNull();

    const dateInput = createdBeforeFilter.querySelector('input');
    expect(dateInput).not.toBeNull();

    dateInput.value = '2024-12-31T23:59';
    dateInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams.created_before).toBe('2024-12-31T23:59:00.000Z');
  });

  it('updates params with both created_after and created_before date filters', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      template: () =>
        <div>
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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

    const dateFilters = filterMenu.querySelectorAll('form-control-date');
    expect(dateFilters.length).toBe(2);

    const createdAfterInput = (dateFilters[0] as HTMLFormControlDateElement).querySelector('input');
    const createdBeforeInput = (dateFilters[1] as HTMLFormControlDateElement).querySelector('input');

    createdAfterInput.value = '2024-01-01T00:00';
    createdAfterInput.dispatchEvent(new Event('input'));

    createdBeforeInput.value = '2024-12-31T23:59';
    createdBeforeInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams.created_after).toBe('2024-01-01T00:00:00.000Z');
    expect(updatedParams.created_before).toBe('2024-12-31T23:59:00.000Z');
  });

  it('clears date filters and refetches data on clear filters interaction', async () => {

    page = await newSpecPage({
      components: components,
      autoApplyChanges: true,
      flushQueue: true,
      template: () =>
        <div>
          <justifi-terminals-list-filters />
          <justifi-terminals-list
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

    const dateFilters = filterMenu.querySelectorAll('form-control-date');
    const createdAfterInput = (dateFilters[0] as HTMLFormControlDateElement).querySelector('input');

    createdAfterInput.value = '2024-01-15T10:30';
    createdAfterInput.dispatchEvent(new Event('input'));

    expect(fetchDataSpy).toHaveBeenCalled();
    expect(filterParams.created_after).toBeDefined();

    const clearButton = page.root.shadowRoot.querySelector('[data-test-id="clear-filters-button"]') as HTMLElement;
    expect(clearButton).not.toBeNull();

    clearButton.click();

    expect(fetchDataSpy).toHaveBeenCalled();
    const updatedParams = filterParams;
    expect(updatedParams).toEqual({});
  });

  it('initializes with createdAfter and createdBefore props', async () => {

    page = await newSpecPage({
      components: [JustifiTerminalsListFilters],
      autoApplyChanges: true,
      template: () =>
        <justifi-terminals-list-filters
          createdAfter="2024-01-01T00:00:00.000Z"
          createdBefore="2024-12-31T23:59:59.999Z"
        />
    });

    expect(page.rootInstance.createdAfter).toBe('2024-01-01T00:00:00.000Z');
    expect(page.rootInstance.createdBefore).toBe('2024-12-31T23:59:59.999Z');
  });
});
