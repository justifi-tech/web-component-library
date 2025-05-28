import { Component, h, Prop, Method, Event, EventEmitter, Listen, State, Host } from '@stencil/core';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { radioListItem } from '../../styles/parts';

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

  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() paymentMethodGroupId?: string;
  @Prop() isSelected: boolean;
  @Prop() showCard?: boolean;
  @Prop() showAch?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;

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
      const { isValid, errors } = await this.validate();

      if (!isValid || !insuranceValidation.isValid) {

        // get propety value from first property in errors object
        const message = `${Object.values(errors)[0] || 'Validation error'}`

        return {
          validationError: true,
          error: {
            code: 'validation_error',
            message,
            decline_code: undefined
          }
        };
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

  @Method()
  async validate(): Promise<{ isValid: boolean, errors: any }> {
    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();

    const isValid = billingFormValidation.isValid && paymentMethodFormValidation.isValid;
    const errors = {
      ...billingFormValidation.errors,
      ...paymentMethodFormValidation.errors,
    }
    return { isValid, errors };
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

  onPaymentMethodOptionClick = (e) => {
    e.preventDefault();
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  showNewPaymentMethodForm() {
    const paymentMethodType = this.paymentMethodOption?.id;
    return (
      <div class="mt-4 pb-4">
        <hidden-input />
          {paymentMethodType === 'card' ? (
            <card-form ref={(el) => this.paymentMethodFormRef = el} />
          ) : (
            <bank-account-form ref={(el) => this.paymentMethodFormRef = el} />
          )}
        <justifi-billing-form
          ref={(el) => (this.billingFormRef = el)}
          hideCardBillingForm={this.hideCardBillingForm}
          hideBankAccountBillingForm={this.hideBankAccountBillingForm}
          paymentMethodType={paymentMethodType}
        />
        <justifi-save-new-payment-method hidden={!this.paymentMethodGroupId} />
      </div>
    );
  }

  private get hiddenRadioInput() {
    return !this.showAch || !this.showCard;
  }

  render() {
    return (
      <Host class="payment-method">
        <div
          class="radio-list-item p-3"
          part={radioListItem}
          onClick={this.onPaymentMethodOptionClick}
          hidden={this.hiddenRadioInput}
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
