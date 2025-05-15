jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TerminalsList } from '../terminals-list';
import { defaultColumnsKeys } from '../terminals-table';
import { TableFiltersMenu } from '../../filters/table-filters-menu';
import { TerminalsListFilters } from '../terminals-list-filters';
import { SelectInput } from '../../../ui-components/form/form-control-select';
import { filterParams } from '../terminals-list-params-state';
import { TerminalsListCore } from '../terminals-list-core';

const components = [TerminalsList, TerminalsListCore, TableFiltersMenu, TerminalsListFilters, SelectInput];

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
        <justifi-terminals-list-filters />
        <justifi-terminals-list 
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
    expect(updatedParams).toEqual({"status": "connected"});
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
});
