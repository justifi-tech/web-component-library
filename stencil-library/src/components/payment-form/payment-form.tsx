import { Component, Prop, h, Host, State, Listen } from '@stencil/core';
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

  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;

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

  async submitForm(event: Event) {
    event.preventDefault();
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();
    if (!billingFormValidation.isValid || !paymentMethodFormValidation.isValid) return;

    // const billingFormFieldValues = await this.billingFormRef.getValues();
    // const paymentMethodMetadata = { payment_intent_id: '', ...billingFormFieldValues };
    // const tokenizeResponse = this.paymentMethodFormRef.tokenize();
    // submit payment with token
  }

  render() {
    return (
      <Host>
        <form>
          {(this.allowedPaymentMethodTypes.length > 1) && (
            <justifi-payment-method-selector paymentMethods={this.allowedPaymentMethodTypes}></justifi-payment-method-selector>
          )}
          <justifi-payment-method-form
            payment-method-form-type={this.selectedPaymentMethodType}
            ref={el => { if (el) { this.paymentMethodFormRef = el } }}
          />
          <justifi-billing-form ref={el => { if (el) { this.billingFormRef = el } }} />
          <button type="submit" onClick={(event: Event) => this.submitForm(event)}>Submit</button>
        </form>
      </Host>
    );
  }
}
