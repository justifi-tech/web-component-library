import { Component, Prop, h, Host, State, Listen, Method } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';
import { BillingFormFields } from '../billing-form/billing-form-schema';

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

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.billingFormRef.fill(fields);
  }

  @Method()
  async submit(args: { clientId: string, paymentMethodData: any, accountId?: string }) {
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();
    if (!billingFormValidation.isValid || !paymentMethodFormValidation.isValid) return;

    const billingFormFieldValues = await this.billingFormRef.getValues();

    const paymentMethodData = { ...args.paymentMethodData, ...billingFormFieldValues };

    return this.paymentMethodFormRef.tokenize(args.clientId, paymentMethodData, args.accountId);
  }

  render() {
    return (
      <Host>
        <form>
          {(this.allowedPaymentMethodTypes.length > 1) && (
            <justifi-payment-method-selector
              paymentMethodTypes={this.allowedPaymentMethodTypes}
              selectedPaymentMethodType={this.selectedPaymentMethodType} />
          )}
          <justifi-payment-method-form
            payment-method-form-type={this.selectedPaymentMethodType}
            ref={el => { if (el) { this.paymentMethodFormRef = el } }}
          />
          <justifi-billing-form ref={el => { if (el) { this.billingFormRef = el } }} />
        </form>
      </Host>
    );
  }
}
