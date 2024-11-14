import { Component, h, Prop } from '@stencil/core';
import { ICheckoutsParams, ICheckoutPaymentMode, ICheckoutStatus } from '../../api';

@Component({
  tag: 'checkouts-list-filters'
})
export class CheckoutsListFilters {
  @Prop() params: ICheckoutsParams = {};
  @Prop() setParamsOnChange: (name: string, value: string) => void;
  @Prop() clearParams: () => void;

  get checkoutStatusOptions(): { label: string, value: ICheckoutStatus | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'Created', value: 'created' },
      { label: 'Completed', value: 'completed' },
      { label: 'Attempted', value: 'attempted' },
      { label: 'Expired', value: 'expired' },
    ]
  }

  get checkoutPaymentModeOptions(): { label: string, value: ICheckoutPaymentMode | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'E-commerce', value: 'ecom' },
      { label: 'BNPL', value: 'bnpl' },
    ]
  }

  render() {
    return (
      <table-filters-menu params={this.params} clearParams={this.clearParams}>
        <div class="grid-cols-2 gap-3 p-1">
          <div class="p-2">
            <form-control-select
              name="status"
              label="Status"
              options={this.checkoutStatusOptions}
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.status}
            />
          </div>
          <div class="p-2">
            <form-control-select
              name="payment_mode"
              label="Payment Mode"
              options={this.checkoutPaymentModeOptions}
              inputHandler={this.setParamsOnChange}
              defaultValue={this.params.payment_mode}
            />
          </div>
        </div>
      </table-filters-menu>
    )
  }
}
