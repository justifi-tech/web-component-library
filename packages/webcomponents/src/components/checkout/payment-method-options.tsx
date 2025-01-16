import { Component, Event, EventEmitter, h, Prop, State, Watch, Listen, Method, Host } from '@stencil/core';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { IBnpl } from '../../api';
import { BillingFormFields, PostalFormFields } from '../billing-forms/billing-form-schema';

@Component({
  tag: 'justifi-payment-method-options',
})
export class PaymentMethodOptions {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop() showBnpl: boolean;
  @Prop() showSavedPaymentMethods: boolean;
  @Prop() paymentMethodGroupId?: string;
  @Prop() bnpl: IBnpl;
  @Prop() insuranceToggled: boolean;
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() savedPaymentMethods: any[] = [];
  @Prop() paymentAmount: number;
  @Prop() hideCardBillingForm?: boolean;

  @State() selectedPaymentMethodId: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];

  @Event({ bubbles: true }) toggleCreatingNewPaymentMethod: EventEmitter;

  private selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement | HTMLJustifiSavedPaymentMethodElement | HTMLJustifiSezzlePaymentMethodElement;

  @Method()
  async fillBillingForm(fields: BillingFormFields | PostalFormFields) {
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
    if (this.showBnpl && this.bnpl?.provider === 'sezzle' && !this.insuranceToggled) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.sezzle }));
    }
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

  render() {
    return (
      <Host>
        {this.paymentMethodOptions?.map((paymentMethodOption) => {
          const newCard = paymentMethodOption.id === PaymentMethodTypes.card;
          const newBankAccount = paymentMethodOption.id === PaymentMethodTypes.bankAccount;
          const isSelected = this.selectedPaymentMethodId === paymentMethodOption.id;
          const sezzle = paymentMethodOption.id === PaymentMethodTypes.sezzle;
          if (newCard || newBankAccount) {
            return (
              <justifi-new-payment-method
                paymentMethodOption={paymentMethodOption}
                authToken={this.authToken}
                account-id={this.accountId}
                is-selected={isSelected}
                paymentMethodGroupId={this.paymentMethodGroupId}
                hideCardBillingForm={this.hideCardBillingForm}
                ref={(el) => {
                  if (isSelected) {
                    this.selectedPaymentMethodOptionRef = el;
                  }
                }}
              />
            );
          } else if (sezzle) {
            return (
              <justifi-sezzle-payment-method
                paymentMethodOption={paymentMethodOption}
                is-selected={isSelected}
                paymentAmount={this.paymentAmount}
                bnpl={this.bnpl}
                ref={(el) => {
                  if (isSelected) {
                    this.selectedPaymentMethodOptionRef = el;
                  }
                }}>
              </justifi-sezzle-payment-method>);
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
