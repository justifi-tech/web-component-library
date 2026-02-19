import { Component, h, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { ICheckoutPaymentModeParam, ICheckoutStatus } from '@api/Checkout';
import { filterParams, propsParams, clearParams } from './checkouts-list-params-state';
import { StyledHost } from '@ui-components/styled-host/styled-host';
import { convertToLocal, convertToUTC } from '../../utils/utils';
import {
  checkoutsListFilterMenu,
  paymentModeCheckoutsListFilterParam,
  statusCheckoutsListFilterParam,
  checkoutIdCheckoutsListFilterParam,
  createdAfterCheckoutsListFilterParam,
  createdBeforeCheckoutsListFilterParam
} from '../../styles/parts';

@Component({
  tag: 'justifi-checkouts-list-filters',
  shadow: true
})
export class CheckoutsListFilters {
  @Prop() checkoutStatus?: ICheckoutStatus;
  @Prop() paymentMode?: ICheckoutPaymentModeParam;
  @Prop() checkoutId?: string;
  @Prop() createdAfter?: string;
  @Prop() createdBefore?: string;

  private debouncedSetParamsOnChange: (name: string, value: string) => void;

  componentWillLoad() {
    // debounced input handler for text input
    this.debouncedSetParamsOnChange = debounce(this.setParamsOnChange, 300);

    const propsToSet = {
      status: this.checkoutStatus,
      payment_mode: this.paymentMode,
      checkout_id: this.checkoutId,
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
  }

  handleDateInput = (name: string, value: string) => {
    const utcDate = convertToUTC(value, { setExactTime: true });
    this.setParamsOnChange(name, utcDate);
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
      { label: 'Apple Pay', value: ICheckoutPaymentModeParam.apple_pay },
    ]
  }

  render() {
    const filterMenuParams = { ...filterParams }

    return (
      <StyledHost>
        <table-filters-menu params={filterMenuParams} clearParams={clearParams} part={checkoutsListFilterMenu}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text
                name="checkout_id"
                label="Checkout ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.checkoutId || filterParams.checkout_id}
                disabled={!!this.checkoutId}
                part={checkoutIdCheckoutsListFilterParam}
              />
            </div>
            <div class="p-2">
              <form-control-select
                name="status"
                label="Status"
                options={this.checkoutStatusOptions}
                inputHandler={this.setParamsOnChange}
                defaultValue={this.checkoutStatus || filterParams.status || ''}
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
                defaultValue={this.paymentMode || filterParams.payment_mode || ''}
                disabled={!!this.paymentMode}
                part={paymentModeCheckoutsListFilterParam}
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
                part={createdAfterCheckoutsListFilterParam}
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
                part={createdBeforeCheckoutsListFilterParam}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    )
  }
}
