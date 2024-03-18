import { Component, Event, EventEmitter, h, Prop, Fragment, State } from '@stencil/core';
import { config } from '../../../config';

class PaymentMethod {
  id: string;
  label: string;

  constructor(id: string, label: string) {
    this.id = id;
    this.label = label;
  }
}

@Component({
  tag: 'justifi-payment-method-options',
  styleUrl: 'payment-method-options.scss',
  shadow: false,
})
export class PaymentMethodOptions {
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;
  @State() selectedPaymentMethodId: string;
  @State() savedPaymentMethods: PaymentMethod[] = [];

  componentWillLoad() {
    console.log('will load')
    this.savedPaymentMethods.push(new PaymentMethod('123', 'Citi DoubleCash *4567'));
    this.savedPaymentMethods.push(new PaymentMethod('456', 'Apple Card *7890'));
  }

  onPaymentMethodTypeOptionClick = (paymentMethod: PaymentMethod) => {
    this.selectedPaymentMethodId = paymentMethod.id;
  };

  paymentMethodOption = (paymentMethod: PaymentMethod) => {
    const isSelected = this.selectedPaymentMethodId == paymentMethod.id;
    return (
      <div class="payment-method">
        <div class="payment-method-header p-3" onClick={() => this.onPaymentMethodTypeOptionClick(paymentMethod)}>
          <input
            type="radio"
            name="paymentMethodType"
            id={paymentMethod.id}
            value={paymentMethod.id}
            checked={isSelected}
            onClick={(event) => event.preventDefault()}
            class="form-check-input me-2"
          />
          <label
            htmlFor={paymentMethod.id}
            class="form-check-label">
            {paymentMethod.label}
          </label>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <div class="d-flex flex-column">
          {this.savedPaymentMethods.map((option) => this.paymentMethodOption(option))}
          <div class="payment-method">
            <div class="payment-method-header p-3 d-flex">
              <div class="me-2">+</div> New payment method
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
