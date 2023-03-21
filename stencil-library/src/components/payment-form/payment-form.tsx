import { Component, Prop, h, Host, State, Watch } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

@Component({
  tag: 'justifi-payment-form',
  shadow: false,
})
export class PaymentForm {
  @Prop() bankAccount: boolean;
  @Prop() creditCard: boolean;
  @State() selectedPaymentMethodType: PaymentMethodTypes = PaymentMethodTypes.card;

  // @Watch('bankAccount')
  // watchBankAccountHandler(newValue: boolean) {
  //   if (!newValue && this.creditCard) this.selectedPaymentMethodType = PaymentMethodTypes.card;
  // }

  // @Watch('creditCard')
  // watchCreditCardHandler(newValue: boolean) {
  //   if (!newValue && this.bankAccount) this.selectedPaymentMethodType = PaymentMethodTypes.bankAccount;
  // }

  setSelectedPaymentMethodType(type: PaymentMethodTypes) {
    this.selectedPaymentMethodType = type;
  }

  paymentMethodTypeSelector() {
    return (
      <div>
        <div>
          <input
            id="cc"
            type="radio"
            name="paymentMethodType"
            value={PaymentMethodTypes.card}
            onChange={(e: any) => this.setSelectedPaymentMethodType(e.target.value)}
            checked />
          <label htmlFor="cc">Card</label>
        </div>
        <div>
          <input
            id="ach"
            type="radio"
            name="paymentMethodType"
            value={PaymentMethodTypes.bankAccount}
            onChange={(e: any) => this.setSelectedPaymentMethodType(e.target.value)}
          />
          <label htmlFor="ach">Bank Account</label>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Host>
        <form>
          {(this.creditCard && this.bankAccount) && this.paymentMethodTypeSelector()}
          {(this.creditCard) && <justifi-card-form></justifi-card-form>}
          {(this.bankAccount) && <justifi-bank-account></justifi-bank-account>}
          <justifi-billing-form></justifi-billing-form>
          <button type="submit">Submit</button>
        </form>
      </Host>
    );
  }
}
