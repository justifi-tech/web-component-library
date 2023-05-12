import { Component, Event, EventEmitter, Fragment, h, Prop } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

const PaymentMethodLabels = {
  bankAccount: 'Bank Account',
  card: 'Card'
}

@Component({
  tag: 'justifi-payment-method-selector',
  styleUrl: 'payment-method-selector.scss',
  shadow: true,
})
export class PaymentMethodSelector {
  @Prop() paymentMethodTypes: PaymentMethodTypes[] = [];
  @Prop() selectedPaymentMethodType: PaymentMethodTypes;
  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;

  defaultRadioButtonOption!: HTMLInputElement;

  onChangeHandler(event: any) {
    this.paymentMethodSelected.emit(event.target.value);
  }

  render() {
    return (
      <div
        class="btn-group"
        role="group"
        aria-label="Radio toggle group for payment method"
      >
        {this.paymentMethodTypes.map((paymentMethodType: PaymentMethodTypes) =>
          <Fragment>
            <input
              id={paymentMethodType}
              type="radio"
              name="paymentMethodType"
              value={paymentMethodType}
              onChange={(event: any) => this.onChangeHandler(event)}
              checked={this.selectedPaymentMethodType === paymentMethodType}
              class="btn-check jfi-btn-radio"
            />
            <label htmlFor={paymentMethodType} class="btn btn-outline-primary jfi-btn-radio-label">
              {PaymentMethodLabels[paymentMethodType]}
            </label>
          </Fragment>
        )}
      </div>
    );
  };
}
