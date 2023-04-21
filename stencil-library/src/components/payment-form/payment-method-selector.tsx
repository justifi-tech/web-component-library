import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

const PaymentMethodLabels = {
  bankAccount: 'Bank Account',
  card: 'Card'
}

@Component({
  tag: 'justifi-payment-method-selector',
  styleUrl: 'payment-method-selector.scss',
  shadow: false,
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
      <div class="form-check">
        {this.paymentMethodTypes.map((paymentMethodType: PaymentMethodTypes) => {
          return (
            <div>
              <input
                id={paymentMethodType}
                type="radio"
                name="paymentMethodType"
                value={paymentMethodType}
                onChange={(event: any) => this.onChangeHandler(event)}
                checked={this.selectedPaymentMethodType === paymentMethodType}
                class="form-check-input"
              />
              <label htmlFor={paymentMethodType}>{PaymentMethodLabels[paymentMethodType]}</label>
            </div>
          );
        })}
      </div>
    );
  };
}
