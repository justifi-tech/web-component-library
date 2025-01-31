import { Component, h, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { filterParams, propsParams, clearParams } from './payments-list-params-state';
import { StyledHost } from '../../ui-components';
import { convertToLocal, convertToUTC } from '../../utils/utils';

@Component({
  tag: 'justifi-payments-list-filters',
  shadow: true
})
export class PaymentsListFilters {
  @Prop() paymentId?: string;
  @Prop() terminalId?: string;
  @Prop() paymentStatus?: string;
  @Prop() createdAfter?: string;
  @Prop() createdBefore?: string;
  
  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);

    const propsToSet = {
      payment_id: this.paymentId,
      terminal_id: this.terminalId,
      payment_status: this.paymentStatus,
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

  get paymentStatusOptions() {
    return [
      { label: 'All', value: '' },
      { label: 'Pending', value: 'pending' },
      { label: 'Authorized', value: 'authorized' },
      { label: 'Succeeded', value: 'succeeded' },
      { label: 'Failed', value: 'failed' },
      { label: 'Disputed', value: 'disputed' },
      { label: 'Refunded', value: 'refunded' }
    ]
  }

  render() {
    const filterMenuParams = { ...filterParams}

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text
                name="payment_id"
                label="Payment ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.paymentId || filterParams.payment_id}
                disabled={!!this.paymentId}
              />
            </div>
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
                name="payment_status"
                label="Status"
                options={this.paymentStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.paymentStatus || filterParams.payment_status}
                disabled={!!this.paymentStatus}
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
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="Created Before"
                inputHandler={this.handleDateInput}
                defaultValue={
                  convertToLocal(this.createdAfter, { showInputDateTime: true }) ||
                  convertToLocal(filterParams.created_before, { showInputDateTime: true })
                }
                showTime
                disabled={!!this.createdBefore}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    )
  }
}
