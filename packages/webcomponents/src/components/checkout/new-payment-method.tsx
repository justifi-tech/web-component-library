import { Component, h, Prop, Method, Event, EventEmitter } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { BillingFormFields } from '../billing-form/billing-form-schema';

const PaymentMethodTypeLabels = {
  bankAccount: 'New bank account',
  card: 'New credit or debit card',
};

@Component({
  tag: 'justifi-new-payment-method',
  shadow: false,
})
export class NewPaymentMethod {
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() clientId: string;
  @Prop() accountId: string;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() isSelected: boolean;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.billingFormRef.fill(fields);
  }

  @Method()
  async resolvePaymentMethod(): Promise<PaymentMethodPayload> {
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();

    if (!billingFormValidation.isValid || !paymentMethodFormValidation.isValid) return;

    const tokenizeResponse = await this.tokenize();

    if (tokenizeResponse.error) {
      return { error: tokenizeResponse.error };
    } else {
      const tokenizeRessponseData = tokenizeResponse.data;
      return { token: tokenizeRessponseData.card?.token || tokenizeRessponseData.bank_account?.token };
    }
  }

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const paymentMethodData = { ...billingFormFieldValues };
      const clientId = this.clientId;
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(clientId, paymentMethodData, this.accountId);
      return tokenizeResponse;
    } catch (error) {
      return error;
    }
  }

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  showNewPaymentMethodForm() {
    return (
      <div class="mt-2 pb-4 border-bottom">
        <div class="mb-3">
          <justifi-payment-method-form
            ref={(el) => (this.paymentMethodFormRef = el)}
            payment-method-form-type={this.paymentMethodOption?.id}
            iframe-origin={this.iframeOrigin}
          />
        </div>
        <h3 class="fs-6 fw-bold lh-lg mb-4">Billing address</h3>
        <justifi-billing-form ref={(el) => (this.billingFormRef = el)} />
      </div>
    );
  }

  render() {
    return (
      <div class="payment-method">
        <div
          class={`payment-method-header p-3`}
          onClick={() => this.onPaymentMethodOptionClick()}>
          <input
            type="radio"
            name="paymentMethodType"
            id={this.paymentMethodOption?.id}
            value={this.paymentMethodOption?.id}
            onClick={(event) => event.preventDefault()}
            checked={this.isSelected}
            class="form-check-input me-2"
          />
          <label
            htmlFor={this.paymentMethodOption?.id}
            class="form-check-label">
            {PaymentMethodTypeLabels[this.paymentMethodOption?.id]}
          </label>
        </div>

        {this.isSelected ? this.showNewPaymentMethodForm() : null}
      </div>
    );
  }
}
