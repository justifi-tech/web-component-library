import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';
import { StyledHost } from '../../../ui-components';
import { checkoutStore } from '../../../store/checkout.store';
import { PAYMENT_METHODS } from '../../modular-checkout/ModularCheckout';

@Component({
  tag: 'justifi-save-new-payment-method',
  shadow: true
})
export class JustifiSaveNewPaymentMethod {
  @Prop() label?: string = 'Save New Payment Method';
  @Prop() hidden?: boolean;

  @Event({ bubbles: true }) checkboxChanged: EventEmitter<boolean>;

  render() {
    return (
      <StyledHost>
        <save-new-payment-method
          label={this.label}
          hidden={this.hidden || checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.SEZZLE}
          onCheckboxChanged={(e: CustomEvent<boolean>) => this.checkboxChanged.emit(e.detail)}
        />
      </StyledHost>
    );
  }
}
