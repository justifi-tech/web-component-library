import { Component, h, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { filterParams, propsParams, clearParams } from './terminals-list-params-state';
import { StyledHost } from '../../ui-components';
import { ITerminalStatus } from '../../api';

@Component({
  tag: 'justifi-terminals-list-filters',
  shadow: true
})
export class TerminalsListFilters {
  @Prop() terminalId?: string;
  @Prop() terminalStatus?: ITerminalStatus;

  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);

    const propsToSet = {
      terminal_id: this.terminalId,
      status: this.terminalStatus,
    };

    Object.entries(propsToSet).forEach(([key, value]) => {
      if (value) {
        propsParams[key] = value;
      }
    });
  }

  setParamsOnChange = (name: string, value: string) => {
    filterParams[name] = value;
  };

  get terminalStatusOptions(): { label: string, value: ITerminalStatus | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'Connected', value: ITerminalStatus.connected },
      { label: 'Disconnected', value: ITerminalStatus.disconnected },
      { label: 'Unknown', value: ITerminalStatus.unknown },
    ]
  }

  render() {
    const filterMenuParams = { ...filterParams }

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text 
                name="terminal_id"
                label="Terminal ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.terminalId || filterParams.terminal_id}
                disabled={!!this.terminalId}
              />
            </div>
            <div class="p-2">
              <form-control-select 
                name="status"
                label="Status"
                options={this.terminalStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.terminalStatus || filterParams.status}
                disabled={!!this.terminalStatus}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    );
  }
}
