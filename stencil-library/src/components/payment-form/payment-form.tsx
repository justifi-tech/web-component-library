import { Component, Prop, h, Host, State, Watch, Listen } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

@Component({
  tag: 'justifi-payment-form',
  shadow: false,
})
export class PaymentForm {
  @Prop() bankAccountOnly: boolean;
  @Prop() creditCardOnly: boolean;
  @State() selectedPaymentMethodType: PaymentMethodTypes = PaymentMethodTypes.card;

  @Listen('paymentMethodSelected')
  paymentMethodSelectedHandler(event: CustomEvent) {
    const paymentMethodType: PaymentMethodTypes = event.detail;
    this.selectedPaymentMethodType = paymentMethodType;
  }

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

  render() {
    return (
      <Host>
        <form>
          {(!this.creditCardOnly && !this.bankAccountOnly) && <justifi-payment-method-selector></justifi-payment-method-selector>}
          <justifi-payment-method-form payment-method-form-type={this.selectedPaymentMethodType} />
          <justifi-billing-form></justifi-billing-form>
          <button type="submit">Submit</button>
        </form>
      </Host>
    );
  }
}
