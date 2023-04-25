import { Component, Prop, h, Host, State, Listen, Method, Event, EventEmitter } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';
import { BillingFormFields } from '../billing-form/billing-form-schema';

@Component({
  tag: 'justifi-payment-form',
  styleUrl: 'payment-form.scss',
  shadow: true,
})
export class PaymentForm {
  @Prop() bankAccount?: boolean;
  @Prop() card?: boolean;
  @Prop() email?: string;
  @Prop() iframeOrigin?: string;
  @Prop() clientId: string;
  @Prop() accountId?: string;
  @Prop() submitButtonText?: string = 'Submit';
  @Event() onSubmitted: EventEmitter<{ data: any }>;
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

  async submit(event) {
    event.preventDefault();
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

    this.onSubmitted.emit(tokenizeResponse);
  }

  render() {
    return (
      <Host>
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
            <button
              onClick={(event) => this.submit(event)}
              type="submit"
              class="btn btn-primary">
              {this.submitButtonText}
            </button>
          </div>
        </form>
      </Host>
    );
  }
}
