import { Component, h, Prop } from '@stencil/core';
import { ICheckoutStatus } from '../../api';
import { filterParams, propsParams, clearParams } from './checkouts-list-params-state';
import { StyledHost } from '../../ui-components';
import { checkoutsListFilterMenu, paymentModeCheckoutsListFilterParam, statusCheckoutsListFilterParam } from '../../styles/parts';

@Component({
  tag: 'justifi-checkouts-list-filters',
  shadow: true
})
export class CheckoutsListFilters {
  @Prop() status?: ICheckoutStatus;
  @Prop() paymentMode?: string;

  componentWillLoad() {
    const propsToSet = {
      status: this.status,
      payment_mode: this.paymentMode,
    };

    Object.entries(propsToSet).forEach(([key, value]) => {
      if (value) {
        propsParams[key] = value;
      }
    });
  }
  
  setParamsOnChange = (name: string, value: string) => {
    filterParams[name] = value;
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
    const filterMenuParams = { ...filterParams }

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams} part={checkoutsListFilterMenu}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-select
                name="status"
                label="Status"
                options={this.checkoutStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.status || filterParams.status}
                disabled={!!this.status}
                part={statusCheckoutsListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-select
                name="payment_mode"
                label="Payment Mode"
                options={this.checkoutPaymentModeOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.paymentMode || filterParams.payment_mode}
                disabled={!!this.paymentMode}
                part={paymentModeCheckoutsListFilterParam}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    )
  }
}
