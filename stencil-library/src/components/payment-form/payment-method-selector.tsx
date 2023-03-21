import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

const PaymentMethodLabels = {
  bankAccount: 'Bank Account',
  card: 'Card'
}

@Component({
  tag: 'justifi-payment-method-selector',
  shadow: false,
})
export class PaymentMethodSelector {
  @Prop() paymentMethods: PaymentMethodTypes[] = [];
  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;

  onChangeHandler(event: any) {
    this.paymentMethodSelected.emit(event.target.value);
  }

  render() {
    return (
      <div>
        {this.paymentMethods.map((paymentMethodType: PaymentMethodTypes) => {
          return (
            <div>
              <input
                id={paymentMethodType}
                type="radio"
                name="paymentMethodType"
                value={paymentMethodType}
                onChange={(event: any) => this.onChangeHandler(event)}
                checked />
              <label htmlFor={paymentMethodType}>{PaymentMethodLabels[paymentMethodType]}</label>
            </div>
          );
        })}
      </div>
    );
  };
}
