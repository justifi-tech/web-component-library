import { Component, h, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { ICheckoutPaymentModeParam, ICheckoutStatus } from '../../api';
import { filterParams, propsParams, clearParams } from './checkouts-list-params-state';
import { StyledHost } from '../../ui-components';
import { convertToLocal, convertToUTC } from '../../utils/utils';
import { filterMenu, filterParam } from '../../styles/parts';

@Component({
  tag: 'justifi-checkouts-list-filters',
  shadow: true
})
export class JustifiCheckoutsListFilters {
  @Prop() checkoutStatus?: ICheckoutStatus;
  @Prop() paymentMode?: ICheckoutPaymentModeParam;
  @Prop() checkoutId?: string;
  @Prop() successfulPaymentId?: string;
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
      successful_payment_id: this.successfulPaymentId,
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
        <table-filters-menu params={filterMenuParams} clearParams={clearParams} part={filterMenu}>
          <div class="grid-cols-2 gap-3 p-1">
            <div class="p-2">
              <form-control-text
                name="checkout_id"
                label="Checkout ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.checkoutId || filterParams.checkout_id}
                disabled={!!this.checkoutId}
                part={filterParam}
              />
            </div>
            <div class="p-2">
              <form-control-text
                name="successful_payment_id"
                label="Successful Payment ID"
                inputHandler={this.debouncedSetParamsOnChange}
                defaultValue={this.successfulPaymentId || filterParams.successful_payment_id}
                disabled={!!this.successfulPaymentId}
                part={filterParam}
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
                part={filterParam}
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
                part={filterParam}
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
                part={filterParam}
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
                part={filterParam}
              />
            </div>
          </div>
        </table-filters-menu>
      </StyledHost>
    )
  }
}
