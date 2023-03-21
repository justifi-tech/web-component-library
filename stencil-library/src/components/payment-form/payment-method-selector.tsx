import { Component, Event, EventEmitter, h } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

@Component({
  tag: 'justifi-payment-method-selector',
  shadow: false,
})
export class PaymentMethodSelector {
  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;

  onChangeHandler(event: any) {
    this.paymentMethodSelected.emit(event.target.value);
  }

  render() {
    return (
      <div>
        <div>
          <input
            id="cc"
            type="radio"
            name="paymentMethodType"
            value={PaymentMethodTypes.card}
            onChange={(event: any) => this.onChangeHandler(event)}
            checked />
          <label htmlFor="cc">Card</label>
        </div>
        <div>
          <input
            id="ach"
            type="radio"
            name="paymentMethodType"
            onChange={(event: any) => this.onChangeHandler(event)}
            value={PaymentMethodTypes.bankAccount}
          />
          <label htmlFor="ach">Bank Account</label>
        </div>
      </div>
    );
  };
}
