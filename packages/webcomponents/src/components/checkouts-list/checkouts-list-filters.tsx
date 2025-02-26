import { Component, h, Prop } from '@stencil/core';
import { ICheckoutPaymentModeParam, ICheckoutStatus } from '../../api';
import { filterParams, propsParams, clearParams } from './checkouts-list-params-state';
import { StyledHost } from '../../ui-components';
import { checkoutsListFilterMenu, paymentModeCheckoutsListFilterParam, statusCheckoutsListFilterParam } from '../../styles/parts';

@Component({
  tag: 'justifi-checkouts-list-filters',
  shadow: true
})
export class CheckoutsListFilters {
  @Prop() checkoutStatus?: ICheckoutStatus;
  @Prop() paymentMode?: ICheckoutPaymentModeParam;

  componentWillLoad() {
    const propsToSet = {
      status: this.checkoutStatus,
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
      { label: 'Created', value: ICheckoutStatus.created },
      { label: 'Completed', value: ICheckoutStatus.completed },
      { label: 'Attempted', value: ICheckoutStatus.attempted },
      { label: 'Expired', value: ICheckoutStatus.expired },
    ]
  }

  get checkoutPaymentModeOptions(): { label: string, value: ICheckoutPaymentModeParam | '' }[] {
    return [
      { label: 'All', value: '' },
      { label: 'E-commerce', value: ICheckoutPaymentModeParam.ecom },
      { label: 'BNPL', value: ICheckoutPaymentModeParam.bnpl },
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
                defaultValue={this.checkoutStatus || filterParams.status}
                disabled={!!this.checkoutStatus}
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
