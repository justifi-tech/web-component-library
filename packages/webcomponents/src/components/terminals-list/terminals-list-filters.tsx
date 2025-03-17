import { Component, h, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { filterParams, propsParams, clearParams } from './terminals-list-params-state';
import { StyledHost } from '../../ui-components';
import { ITerminalStatus } from '../../api';
import { 
  terminalsListFilterMenu,
  terminalIdTerminalsListFilterParam,
  terminalOrderIdTerminalsListFilterParam,
  terminalStatusTerminalsListFilterParam
} from '../../styles/parts';

@Component({
  tag: 'justifi-terminals-list-filters',
  shadow: true
})
export class TerminalsListFilters {
  @Prop() terminalId?: string;
  @Prop() terminalOrderId?: string;
  @Prop() terminalStatus?: ITerminalStatus;

  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);

    const propsToSet = {
      terminal_id: this.terminalId,
      status: this.terminalStatus,
      terminal_order_id: this.terminalOrderId
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
      { label: 'Pending Configuration', value: ITerminalStatus.pending_configuration }
    ]
  }

  render() {
    const filterMenuParams = { ...filterParams }

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams} part={terminalsListFilterMenu}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text 
                name="terminal_id"
                label="Terminal ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.terminalId || filterParams.terminal_id}
                disabled={!!this.terminalId}
                part={terminalIdTerminalsListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-text 
                name="terminal_order_id"
                label="Terminal Order ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.terminalOrderId || filterParams.terminal_order_id}
                disabled={!!this.terminalOrderId}
                part={terminalOrderIdTerminalsListFilterParam}
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
                part={terminalStatusTerminalsListFilterParam}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    );
  }
}
