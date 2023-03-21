import { Component, Prop, h, Host, State, Watch, Listen } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';

@Component({
  tag: 'justifi-payment-form',
  shadow: false,
})
export class PaymentForm {
  @Prop() bankAccount?: boolean;
  @Prop() card?: boolean;
  @State() selectedPaymentMethodType: PaymentMethodTypes;
  @State() allowedPaymentMethodTypes: PaymentMethodTypes[] = [];

  connectedCallback() {
    if (this.card) {
      this.allowedPaymentMethodTypes.push(PaymentMethodTypes.card);
    }
    if (this.bankAccount) {
      this.allowedPaymentMethodTypes.push(PaymentMethodTypes.bankAccount);
    }
    if (!this.allowedPaymentMethodTypes.length) {
      this.allowedPaymentMethodTypes.push(PaymentMethodTypes.card);
    }
    this.selectedPaymentMethodType = this.allowedPaymentMethodTypes[0];
  }

  @Listen('paymentMethodSelected')
  paymentMethodSelectedHandler(event: CustomEvent) {
    const paymentMethodType: PaymentMethodTypes = event.detail;
    this.selectedPaymentMethodType = paymentMethodType;
  }

  render() {
    return (
      <Host>
        <form>
          {(this.allowedPaymentMethodTypes.length > 1) && (
            <justifi-payment-method-selector paymentMethods={this.allowedPaymentMethodTypes}></justifi-payment-method-selector>
          )}
          <justifi-payment-method-form payment-method-form-type={this.selectedPaymentMethodType} />
          <justifi-billing-form></justifi-billing-form>
          <button type="submit">Submit</button>
        </form>
      </Host>
    );
  }
}
