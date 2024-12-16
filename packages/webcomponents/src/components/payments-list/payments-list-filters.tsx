import { Component, h } from '@stencil/core';
import { debounce } from 'lodash';
import { queryParams, clearParams } from './payments-list-params-state';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-payments-list-filters',
  shadow: true
})
export class PaymentsListFilters {
  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);
  }

  setParamsOnChange = (name: string, value: string) => {
    queryParams[name] = value;
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
    return (
      <StyledHost>
        <table-filters-menu params={ {...queryParams} } clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text
                name="payment_id"
                label="Payment ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={queryParams.payment_id}
              />
            </div>
            <div class="p-2">
              <form-control-text
                name="terminal_id"
                label="Terminal ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={queryParams.terminal_id}
              />
            </div>
            <div class="p-2">
              <form-control-select
                name="payment_status"
                label="Status"
                options={this.paymentStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.payment_status || ''}
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_after"
                label="Start Date"
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.created_after}
                showTime
                filterTimeZone
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="End Date"
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.created_before}
                showTime
                filterTimeZone
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    )
  }
}
