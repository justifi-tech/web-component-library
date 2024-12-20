import { Component, h, Prop, Method, Event, EventEmitter, Listen, State, Host } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { BillingFormFields } from '../billing-form/billing-form-schema';
import { Header3 } from '../../ui-components';
import { billingForm, radioListItem } from '../../styles/parts';

const PaymentMethodTypeLabels = {
  bankAccount: 'New bank account',
  card: 'New credit or debit card',
};

@Component({
  tag: 'justifi-new-payment-method',
})
export class NewPaymentMethod {
  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLCardFormElement;

  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() paymentMethodGroupId?: string;
  @Prop() isSelected: boolean;

  @State() saveNewPaymentMethodChecked: boolean = false;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Listen('checkboxChanged')
  handleCheckboxChanged(event: CustomEvent<boolean>) {
    this.saveNewPaymentMethodChecked = event.detail;
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.billingFormRef.fill(fields);
  }

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    try {
      const isValid = await this.validate();

      if (!isValid || !insuranceValidation.isValid) {
        return { validationError: true };
      }

      const tokenizeResponse = await this.tokenize();

      if (tokenizeResponse.error) {
        return { error: tokenizeResponse.error };
      } else {
        const tokenizeRessponseData = tokenizeResponse.data;
        return { token: tokenizeRessponseData.card?.token || tokenizeRessponseData.bank_account?.token };
      }
    } catch (error) {
      return { error };
    }
  }

  async validate(): Promise<boolean> {
    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();
    return billingFormValidation.isValid && paymentMethodFormValidation.isValid;
  }

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      let paymentMethodData;
      if (this.saveNewPaymentMethodChecked) {
        paymentMethodData = { ...billingFormFieldValues, payment_method_group_id: this.paymentMethodGroupId };
      } else {
        paymentMethodData = { ...billingFormFieldValues };
      }
      const clientId = this.authToken;
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
      <div class="mt-4 pb-4 border-bottom">
        <hidden-input />
        <div class="mb-4">
          {this.paymentMethodOption?.id === 'card' ? (
            <card-form ref={(el) => this.paymentMethodFormRef = el} />
          ) : (
            <bank-account-form ref={(el) => this.paymentMethodFormRef = el} />
          )}

        </div>
        <div part={billingForm}>
          <Header3 text="Billing address" class="fs-6 fw-bold lh-lg mb-4" />
          <justifi-billing-form ref={(el) => (this.billingFormRef = el)} />
        </div>
        <justifi-save-new-payment-method hidden={!this.paymentMethodGroupId} />
      </div>
    );
  }

  render() {
    return (
      <Host class="payment-method">
        <div
          class="radio-list-item p-3"
          part={radioListItem}
        >
          <form-control-radio
            id={this.paymentMethodOption?.id}
            name="paymentMethodType"
            value={this.paymentMethodOption?.id}
            checked={this.isSelected}
            label={PaymentMethodTypeLabels[this.paymentMethodOption?.id]}
            inputHandler={this.onPaymentMethodOptionClick}
          />
        </div>

        {this.isSelected ? this.showNewPaymentMethodForm() : null}
      </Host>
    );
  }
}
