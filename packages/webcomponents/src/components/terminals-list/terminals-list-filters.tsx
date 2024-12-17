import { Component, h } from '@stencil/core';
import { debounce } from 'lodash';
import { queryParams, clearParams } from './terminals-list-params-state';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'terminals-list-filters'
})
export class TerminalsListFilters {
  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);
  }

  setParamsOnChange = (name: string, value: string) => {
    queryParams[name] = value;
  }

  get terminalStatusOptions() {
    return [
      { label: 'All', value: '' },
      { label: 'Connected', value: 'connected' },
      { label: 'Disconnected', value: 'disconnected' },
      { label: 'Unknown', value: 'unknown' },
    ]
  }

  render() {
    return (
      <StyledHost>
        <table-filters-menu params={ {...queryParams} } clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text 
                name="terminal_id"
                label="Terminal ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={queryParams.terminal_id}
              />
            </div>
            <div class="p-2">
              <form-control-text
                name="account_id"
                label="Account ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={queryParams.account_id}
              />
            </div>
            <div class="p-2">
              <form-control-select 
                name="status"
                label="Status"
                options={this.terminalStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.status || ''}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
      
    );
  }
}
