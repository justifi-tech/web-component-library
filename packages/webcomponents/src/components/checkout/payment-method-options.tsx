
import { Component, h, Prop, State, Watch, Listen, Method } from '@stencil/core';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { IBnpl } from '../../api';
import { BillingFormFields } from './billing-form/billing-form-schema';
import checkoutStore from '../../store/checkout.store';
import { radioListItem } from '../../styles/parts';

const PaymentMethodTypeLabels = {
  bankAccount: 'New bank account',
  card: 'New credit or debit card',
};

@Component({
  tag: 'justifi-payment-method-options',
})
export class PaymentMethodOptions {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop() showSavedPaymentMethods: boolean;
  @Prop() showBnpl: boolean;
  @Prop() paymentMethodGroupId?: string;
  @Prop() bnpl: IBnpl;
  @Prop() insuranceToggled: boolean;
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() savedPaymentMethods: any[] = [];
  @Prop() paymentAmount: number;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;

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

    if (this.showBnpl && this.bnpl?.provider === 'sezzle' && !this.insuranceToggled) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.sezzle }));
    }
    if (this.showCard) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (this.showAch) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }
    if (!checkoutStore.selectedPaymentMethod) {
      checkoutStore.selectedPaymentMethod = this.paymentMethodOptions[0]?.id;
    }
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    checkoutStore.selectedPaymentMethod = event.detail.id;
  }

  private get hiddenRadioInput() {
    return !this.showAch || !this.showCard;
  }

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    return await this.selectedPaymentMethodOptionRef?.resolvePaymentMethod(insuranceValidation);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors?: any }> {
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    return newPaymentMethodElement.validate();
  }

  render() {
    return (
      <div>
        <div
          class="radio-list-item p-3"
          part={radioListItem}
          onClick={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.card }}
          hidden={this.hiddenRadioInput}
        >
          <form-control-radio
            name="paymentMethodType"
            value={PaymentMethodTypes.card}
            checked={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card}
            label={PaymentMethodTypeLabels[PaymentMethodTypes.card]}
          />
        </div>
        <div
          class="radio-list-item p-3"
          part={radioListItem}
          onClick={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.bankAccount }}
          hidden={this.hiddenRadioInput}
        >
          <form-control-radio
            name="paymentMethodType"
            value={PaymentMethodTypes.bankAccount}
            checked={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount}
            label={PaymentMethodTypeLabels[PaymentMethodTypes.bankAccount]}
          />
        </div>
        <justifi-sezzle-payment-method />
        <justifi-saved-payment-methods exportparts={radioListItem.split(' ').join(',')} />
      </div>
    );
  }
}
