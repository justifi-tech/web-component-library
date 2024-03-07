import { Component, Event, EventEmitter, h, Prop, Fragment } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

const PaymentMethodTypeLabels = {
  bankAccount: 'Bank Account',
  card: 'Card',
};

@Component({
  tag: 'justifi-payment-method-type-selector',
  styleUrl: 'payment-method-type-selector.scss',
  shadow: true,
})
export class PaymentMethodTypeSelector {
  @Prop() selectedPaymentMethodType: PaymentMethodTypes;
  @Prop() showCreditCard: boolean;
  @Prop() showAch: boolean;
  @Event({ bubbles: true }) paymentMethodSelected: EventEmitter;

  defaultRadioButtonOption!: HTMLInputElement;

  onChangeHandler(event: any) {
    this.paymentMethodSelected.emit(event.target.value);
  };

  inputFor(paymentMethodType: PaymentMethodTypes) {
    return (
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
          {PaymentMethodTypeLabels[paymentMethodType]}
        </label>
      </Fragment>
    );
  }

  render() {
    if (this.showCreditCard || this.showAch) {
      return (
        <div class="col-12">
          <div class="btn-group jfi-btn-radio-group" role="group" aria-label="Radio toggle group for payment method">
            {this.showCreditCard ? this.inputFor(PaymentMethodTypes.card) : ''}
            {this.showAch ? this.inputFor(PaymentMethodTypes.bankAccount) : ''}
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
