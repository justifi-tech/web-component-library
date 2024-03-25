import { Component, Event, EventEmitter, h, Prop, State, Watch, Listen, Method } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';

@Component({
  tag: 'justifi-payment-method-options',
  styleUrl: 'payment-method-options.scss',
  shadow: false,
})
export class PaymentMethodOptions {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop() clientId: string;
  @Prop() accountId: string;
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() savedPaymentMethods: any[] = [];
  @Prop() selectedPaymentMethodId: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];

  @Event({ bubbles: true }) toggleCreatingNewPaymentMethod: EventEmitter;

  private selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement | HTMLJustifiSavedPaymentMethodElement;

  @Watch('savedPaymentMethods')
  paymentMethodsChanged() {
    this.paymentMethodOptions = this.savedPaymentMethods.map((paymentMethod) => new PaymentMethodOption(paymentMethod));
    if (this.showCard) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (this.showAch) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }
    this.selectedPaymentMethodId = this.paymentMethodOptions[0].id;
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    this.selectedPaymentMethodId = event.detail.id;
  }

  @Method()
  async getPaymentMethodToken(): Promise<string> {
    return await this.selectedPaymentMethodOptionRef?.getPaymentMethodToken();
  }

  render() {
    return (
      <div>
        {this.paymentMethodOptions?.map((paymentMethodOption) => {
          const newCard = paymentMethodOption.id === PaymentMethodTypes.card;
          const newBankAccount = paymentMethodOption.id === PaymentMethodTypes.bankAccount;
          const isSelected = this.selectedPaymentMethodId === paymentMethodOption.id;
          if (newCard || newBankAccount) {
            return (
              <justifi-new-payment-method
                paymentMethodOption={paymentMethodOption}
                client-id={this.clientId}
                account-id={this.accountId}
                is-selected={isSelected}
                ref={(el) => {
                  if (isSelected) {
                    this.selectedPaymentMethodOptionRef = el;
                  }
                }}
              />
            );
          } else {
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
      </div>
    );
  }
}
