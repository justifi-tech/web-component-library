import { Component, h, Prop } from '@stencil/core';
import { filterParams, propsParams, clearParams } from './terminal-orders-list-params-state';
import { StyledHost } from '../../ui-components';
import { TerminalOrderStatus, TerminalOrderType } from '../../api';
import { convertToLocal, convertToUTC } from '../../utils/utils';
import {
  terminalOrdersListFilterMenu,
  orderStatusTerminalOrdersListFilterParam,
  orderTypeTerminalOrdersListFilterParam,
  createdAfterTerminalOrdersListFilterParam,
  createdBeforeTerminalOrdersListFilterParam
} from '../../styles/parts';

@Component({
  tag: 'justifi-terminal-orders-list-filters',
  shadow: true
})
export class TerminalOrdersListFilters {
  @Prop() orderStatus?: TerminalOrderStatus;
  @Prop() orderType?: TerminalOrderType;
  @Prop() createdAfter?: string;
  @Prop() createdBefore?: string;

  componentWillLoad() {
    const propsToSet = {
      order_status: this.orderStatus,
      order_type: this.orderType,
      created_after: this.createdAfter,
      created_before: this.createdBefore
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

  handleDateInput = (name: string, value: string) => {
    const utcDate = convertToUTC(value, { setExactTime: true });
    this.setParamsOnChange(name, utcDate);
  }

  get terminalOrderStatusOptions(): { label: string, value: any | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'Created', value: TerminalOrderStatus.created },
      { label: 'Completed', value: TerminalOrderStatus.completed },
      { label: 'Submitted', value: TerminalOrderStatus.submitted },
      { label: 'In Progress', value: TerminalOrderStatus.in_progress },
      { label: 'On Hold', value: TerminalOrderStatus.on_hold },
      { label: 'Canceled', value: TerminalOrderStatus.canceled }
    ]
  }

  get terminalOrderTypeOptions(): { label: string, value: TerminalOrderType | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'Boarding Only', value: TerminalOrderType.boardingOnly },
      { label: 'Boarding Shipping', value: TerminalOrderType.boardingShipping },
    ]
  }

  render() {
    const filterMenuParams = { ...filterParams }

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams} part={terminalOrdersListFilterMenu}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-select
                name="order_status"
                label="Order Status"
                options={this.terminalOrderStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.orderStatus || filterParams.order_status || ''}
                disabled={!!this.orderStatus}
                part={orderStatusTerminalOrdersListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-select
                name="order_type"
                label="Order Type"
                options={this.terminalOrderTypeOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.orderType || filterParams.order_type || ''}
                disabled={!!this.orderType}
                part={orderTypeTerminalOrdersListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_after"
                label="Created After"
                inputHandler={this.handleDateInput}
                defaultValue={
                  convertToLocal(this.createdAfter, { showInputDateTime: true }) ||
                  convertToLocal(filterParams.created_after, { showInputDateTime: true })
                }
                showTime
                disabled={!!this.createdAfter}
                part={createdAfterTerminalOrdersListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="Created Before"
                inputHandler={this.handleDateInput}
                defaultValue={
                  convertToLocal(this.createdBefore, { showInputDateTime: true }) ||
                  convertToLocal(filterParams.created_before, { showInputDateTime: true })
                }
                showTime
                disabled={!!this.createdBefore}
                part={createdBeforeTerminalOrdersListFilterParam}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    );
  }
}
