import { Component, Prop, h, Host, State, Listen, Method, Event, EventEmitter } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';
import { BillingFormFields } from '../billing-form/billing-form-schema';
import { Theme } from '../payment-method-form/theme';
import getComputedTheme from '../payment-method-form/get-computed-theme';

const layoutSpacing = '4px';

const styleOverrides: Theme = {
  layout: {
    padding: layoutSpacing
  }
};

@Component({
  tag: 'justifi-payment-form',
  shadow: true,
  styleUrl: 'payment-form.scss'
})
export class PaymentForm {
  @Prop() clientId: string;
  @Prop() email: string;
  @Prop() iframeOrigin?: string;
  @Prop() accountId?: string;
  @Prop() bankAccount?: boolean;
  @Prop() card?: boolean;
  @State() selectedPaymentMethodType: PaymentMethodTypes;
  @State() allowedPaymentMethodTypes: PaymentMethodTypes[] = [];
  @Event() onSubmit: EventEmitter<{ data: any }>;

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

  async submit() {
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();
    if (!billingFormValidation.isValid || !paymentMethodFormValidation.isValid) return;

    const billingFormFieldValues = await this.billingFormRef.getValues();

    const paymentMethodData = { email: this.email, ...billingFormFieldValues };

    const tokenizeResponse = await this.paymentMethodFormRef.tokenize(
      this.clientId,
      paymentMethodData,
      this.accountId
    );

    this.onSubmit.emit(tokenizeResponse);
  }

  render() {
    return (
      <Host exportparts="label,input">
        <form class="row gy-3">
          {(this.allowedPaymentMethodTypes.length > 1) && (
            <div class="col-12">
              <justifi-payment-method-selector
                paymentMethodTypes={this.allowedPaymentMethodTypes}
                selectedPaymentMethodType={this.selectedPaymentMethodType} />
            </div>
          )}
          <div class="col-12">
            <justifi-payment-method-form
              style={{ margin: `0 -${layoutSpacing}` }}
              paymentMethodStyleOverrides={styleOverrides}
              payment-method-form-type={this.selectedPaymentMethodType}
              iframe-origin={this.iframeOrigin}
              ref={el => { if (el) { this.paymentMethodFormRef = el } }}
            />
          </div>
          <div class="col-12">
            <justifi-billing-form
              legend="Billing Info"
              ref={el => { if (el) { this.billingFormRef = el } }}
            />
          </div>
          <div class="col-12">
            <button class="btn btn-primary" onClick={() => this.submit()}>Submit</button>
          </div>
        </form>
      </Host>
    );
  }
}
