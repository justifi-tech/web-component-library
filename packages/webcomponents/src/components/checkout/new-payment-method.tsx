import { Component, h, Prop, Method, Event, EventEmitter } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';

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
  async resolvePaymentMethod(): Promise<PaymentMethodPayload> {
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();

    if (!billingFormValidation.isValid || !paymentMethodFormValidation.isValid) return;
    const token = await this.tokenize();
    return { token: token };
  }

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const paymentMethodData = { ...billingFormFieldValues };
      const clientId = this.clientId;
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(clientId, paymentMethodData, this.accountId);

      if (tokenizeResponse.error) {
        console.error(`An error occured submitting the form: ${tokenizeResponse.error.message}`);
        return null;
      }

      const data = tokenizeResponse.data;
      const tokenizedPaymentMethod = (data as any).card || (data as any).ach; // fix the response types to avoid this
      return tokenizedPaymentMethod.token;
    } catch (error) {
      console.error(`An error occured submitting the form: ${error}`);
      return null;
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
