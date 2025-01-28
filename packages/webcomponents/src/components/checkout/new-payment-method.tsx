import { Component, h, Prop, Method, Event, EventEmitter, Listen, State, Host } from '@stencil/core';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { BillingFormFields, PostalFormFields } from '../billing-forms/billing-form-schema';
import { radioListItem } from '../../styles/parts';

const PaymentMethodTypeLabels = {
  bankAccount: 'New bank account',
  card: 'New credit or debit card',
};

@Component({
  tag: 'justifi-new-payment-method',
})
export class NewPaymentMethod {
  private billingFormWrapperRef?: HTMLJustifiBillingFormWrapperElement;
  private paymentMethodFormRef?: HTMLCardFormElement;

  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() paymentMethodGroupId?: string;
  @Prop() isSelected: boolean;
  @Prop() hideCardBillingForm?: boolean;

  @State() saveNewPaymentMethodChecked: boolean = false;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Listen('checkboxChanged')
  handleCheckboxChanged(event: CustomEvent<boolean>) {
    this.saveNewPaymentMethodChecked = event.detail;
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields | PostalFormFields) {
    this.billingFormWrapperRef.fill(fields);
  }

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!this.paymentMethodFormRef || !this.billingFormWrapperRef) return;

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
        return {
          token: tokenizeRessponseData.card?.token || tokenizeRessponseData.bank_account?.token,
          data: tokenizeRessponseData
        };
      }
    } catch (error) {
      return { error };
    }
  }

  async validate(): Promise<boolean> {
    const billingFormValidation = await this.billingFormWrapperRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();
    return billingFormValidation.isValid && paymentMethodFormValidation.isValid;
  }

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormWrapperRef.getValues();
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

  onPaymentMethodOptionClick = (e) => {
    e.preventDefault();
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  showNewPaymentMethodForm() {
    const paymentMethodType = this.paymentMethodOption?.id;
    return (
      <div class="mt-4 pb-4 border-bottom">
        <hidden-input />
        <div class="mb-4">
          {paymentMethodType === 'card' ? (
            <card-form ref={(el) => this.paymentMethodFormRef = el} />
          ) : (
            <bank-account-form ref={(el) => this.paymentMethodFormRef = el} />
          )}

        </div>
        <justifi-billing-form-wrapper
          ref={(el) => (this.billingFormWrapperRef = el)}
          hideCardBillingForm={this.hideCardBillingForm}
          paymentMethodType={paymentMethodType}
        />
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
          onClick={this.onPaymentMethodOptionClick}
        >
          <form-control-radio
            name="paymentMethodType"
            value={this.paymentMethodOption?.id}
            checked={this.isSelected}
            label={PaymentMethodTypeLabels[this.paymentMethodOption?.id]}
          />
        </div>

        {this.isSelected ? this.showNewPaymentMethodForm() : null}
      </Host>
    );
  }
}
