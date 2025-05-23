import { Component, h, Prop, State, Watch, Listen, Method, Host } from '@stencil/core';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { IBnpl } from '../../api';
import { BillingFormFields } from './billing-form/billing-form-schema';

@Component({
  tag: 'justifi-payment-method-options',
})
export class PaymentMethodOptions {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop() showSavedPaymentMethods: boolean;
  @Prop() paymentMethodGroupId?: string;
  @Prop() bnpl: IBnpl;
  @Prop() insuranceToggled: boolean;
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() savedPaymentMethods: any[] = [];
  @Prop() paymentAmount: number;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;

  @State() selectedPaymentMethodId: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];

  private selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement | HTMLJustifiSavedPaymentMethodElement | HTMLJustifiSezzlePaymentMethodElement;

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    if (newPaymentMethodElement.fillBillingForm) {
      newPaymentMethodElement.fillBillingForm(fields);
    }
  }

  connectedCallback() {
    this.paymentMethodsChanged();
  }

  @Watch('savedPaymentMethods')
  paymentMethodsChanged() {
    this.paymentMethodOptions = this.savedPaymentMethods
      .map((paymentMethod) => new PaymentMethodOption(paymentMethod))
      .filter((paymentMethod) => {
        // Don't saved card or bank account if they are disabled
        return (
          (this.showCard || paymentMethod.type !== PaymentMethodTypes.card) &&
          (this.showAch || paymentMethod.type !== PaymentMethodTypes.bankAccount)
        );
      });
    if (this.showCard) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (this.showAch) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }
    if (!this.selectedPaymentMethodId) {
      this.selectedPaymentMethodId = this.paymentMethodOptions[0]?.id;
    }
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    this.selectedPaymentMethodId = event.detail.id;
  }

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    return await this.selectedPaymentMethodOptionRef?.resolvePaymentMethod(insuranceValidation);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    const isValid = await newPaymentMethodElement.validate();
    return { isValid: isValid };
  }

  render() {
    return (
      <Host>
        {this.paymentMethodOptions?.map((paymentMethodOption) => {
          const newCard = paymentMethodOption.id === PaymentMethodTypes.card;
          const newBankAccount = paymentMethodOption.id === PaymentMethodTypes.bankAccount;
          const isSelected = this.selectedPaymentMethodId === paymentMethodOption.id;
          if (newCard || newBankAccount) {
            return (
              <justifi-new-payment-method
                paymentMethodOption={paymentMethodOption}
                authToken={this.authToken}
                account-id={this.accountId}
                is-selected={isSelected}
                show-card={this.showCard}
                show-ach={this.showAch}
                paymentMethodGroupId={this.paymentMethodGroupId}
                hideCardBillingForm={this.hideCardBillingForm}
                hideBankAccountBillingForm={this.hideBankAccountBillingForm}
                ref={(el) => {
                  if (isSelected) {
                    this.selectedPaymentMethodOptionRef = el;
                  }
                }}
              />
            );
          }
          else if (this.showSavedPaymentMethods) {
            return (
              <justifi-saved-payment-method
                paymentMethodOption={paymentMethodOption}
                is-selected={isSelected}
                ref={(el) => {
                  if (isSelected) {
                    this.selectedPaymentMethodOptionRef = el;
                  }
                }}
              />
            );
          }
        })}
      </Host>
    );
  }
}
