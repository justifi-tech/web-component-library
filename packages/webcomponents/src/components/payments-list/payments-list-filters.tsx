import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'payments-list-filters'
})
export class PaymentsListFilters {
  @Prop() params: any = {};
  @Prop() setParamsOnChange: (name: string, value: string) => void;
  @Prop() clearParams: () => void;

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
      <table-filters-menu params={this.params} clearParams={this.clearParams}>
        <div class="grid-cols-2 gap-3 p-1">
          <div class="p-2">
            <form-control-text 
              name="terminal_id"
              label="Terminal ID"
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.terminal_id}
            />
          </div>
          <div class="p-2">
            <form-control-select 
              name="payment_status"
              label="Status"
              options={this.paymentStatusOptions}
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.payment_status}
            />
          </div>
          <div class="p-2">
            <form-control-date 
              name="created_after"
              label="Start Date"
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.created_after}
            />
          </div>
          <div class="p-2">
            <form-control-date
              name="created_before"
              label="End Date"
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.created_before}
            />
          </div>
        </div>
      </table-filters-menu>
    )
  }
}
