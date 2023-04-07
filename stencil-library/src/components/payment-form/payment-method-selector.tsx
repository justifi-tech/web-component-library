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

  defaultRadioButtonOption!: HTMLInputElement;

  onChangeHandler(event: any) {
    this.paymentMethodSelected.emit(event.target.value);
  }

  componentDidRender() {
    this.defaultRadioButtonOption.checked = true;
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
                ref={(el) => {
                  if (paymentMethodType === this.paymentMethods[0]) {
                    this.defaultRadioButtonOption = el as HTMLInputElement
                  }
                }}
              />
              <label htmlFor={paymentMethodType}>{PaymentMethodLabels[paymentMethodType]}</label>
            </div>
          );
        })}
      </div>
    );
  };
}
