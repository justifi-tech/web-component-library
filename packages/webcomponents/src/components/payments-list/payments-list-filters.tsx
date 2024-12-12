import { Component, h, State } from '@stencil/core';
import { debounce } from 'lodash';
import { paymentsListParams, onPaymentsParamsChange, clearParams } from './payments-list-params-state';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-payments-list-filters',
  shadow: true
})
export class PaymentsListFilters {
  @State() params = { ...paymentsListParams };

  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);

    // Listen for changes to paymentsListParams and update state
    onPaymentsParamsChange('set', () => {
      this.params = { ...paymentsListParams };
    });

  }

  setParamsOnChange = (name: string, value: string) => {
    // Create a new object with the updated value
    const updatedParams = { ...paymentsListParams, [name]: value };
    // Assign the new object to the store
    Object.assign(paymentsListParams, updatedParams);
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
        <table-filters-menu params={this.params} clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text
                name="payment_id"
                label="Payment ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.params.payment_id}
              />
            </div>
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
                name="payment_status"
                label="Status"
                options={this.paymentStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.params.payment_status || ''}
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_after"
                label="Start Date"
                inputHandler={this.setParamsOnChange}
                defaultValue={this.params.created_after}
                showTime
                filterTimeZone
              />
            </div>
            <div class="p-2">
              <form-control-date
                name="created_before"
                label="End Date"
                inputHandler={this.setParamsOnChange}
                defaultValue={this.params.created_before}
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
