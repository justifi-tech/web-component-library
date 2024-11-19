import { Component, h, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { TerminalsTableFilterParams } from '../../api';

@Component({
  tag: 'terminals-list-filters'
})
export class TerminalsListFilters {
  @Prop() params: TerminalsTableFilterParams = {};
  @Prop() setParamsOnChange: (name: string, value: string) => void;
  @Prop() clearParams: () => void;

  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);
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
      <table-filters-menu params={this.params} clearParams={this.clearParams}>
        <div class="grid-cols-2 gap-3 p-1">
          <div class="p-2">
            <form-control-text 
              name="terminal_id"
              label="Terminal ID"
              inputHandler={this.debouncedSetParamsOnChange}
              defaultValue={this.params.terminal_id}
            />
          </div>
          <div class="p-2">
            <form-control-select 
              name="status"
              label="Status"
              options={this.terminalStatusOptions}
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.status}
            />
          </div>
        </div>
      </table-filters-menu>
    );
  }
}
