import { Component, h } from '@stencil/core';
import { ICheckoutStatus } from '../../api';
import { queryParams, clearParams } from './checkouts-list-params-state';
import { StyledHost } from '../../ui-components';

@Component({
  tag: 'justifi-checkouts-list-filters',
  shadow: true
})
export class CheckoutsListFilters {
  
  setParamsOnChange = (name: string, value: string) => {
    queryParams[name] = value;
  }

  get checkoutStatusOptions(): { label: string, value: ICheckoutStatus | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'Created', value: 'created' },
      { label: 'Completed', value: 'completed' },
      { label: 'Attempted', value: 'attempted' },
      { label: 'Expired', value: 'expired' },
    ]
  }

  get checkoutPaymentModeOptions(): { label: string, value: string }[] {
    return [
      { label: 'All', value: '' },
      { label: 'E-commerce', value: 'ecom' },
      { label: 'BNPL', value: 'bnpl' },
    ]
  }

  render() {
    return (
      <StyledHost>
        <table-filters-menu params={ {...queryParams} } clearParams={clearParams}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-select
                name="status"
                label="Status"
                options={this.checkoutStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.status || ''}
              />
            </div>
            <div class="p-2">
              <form-control-select
                name="payment_mode"
                label="Payment Mode"
                options={this.checkoutPaymentModeOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={queryParams.payment_mode || ''}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    )
  }
}
