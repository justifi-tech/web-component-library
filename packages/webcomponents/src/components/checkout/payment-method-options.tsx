import { Component, Event, EventEmitter, h, Prop, State, Watch, Listen, Method } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { IBnpl } from '../../api';

@Component({
  tag: 'justifi-payment-method-options',
  styleUrl: 'payment-method-options.scss',
  shadow: false,
})
export class PaymentMethodOptions {
  @Prop() showCard: boolean;
  @Prop() showAch: boolean;
  @Prop() bnpl: IBnpl;
  @Prop() clientId: string;
  @Prop() accountId: string;
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() savedPaymentMethods: any[] = [];
  @Prop() paymentAmount: number;

  @State() selectedPaymentMethodId: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];

  @Event({ bubbles: true }) toggleCreatingNewPaymentMethod: EventEmitter;

  private selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement | HTMLJustifiSavedPaymentMethodElement | HTMLJustifiSezzelPaymentMethodElement;

  @Watch('savedPaymentMethods')
  paymentMethodsChanged() {
    this.paymentMethodOptions = this.savedPaymentMethods.map((paymentMethod) => new PaymentMethodOption(paymentMethod));
    if (this.showCard) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (this.showAch) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }
    if (this.bnpl?.provider === 'sezzle') {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.sezzel }));
    }
    this.selectedPaymentMethodId = this.paymentMethodOptions[0].id;
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    this.selectedPaymentMethodId = event.detail.id;
  }

  @Method()
  async resolvePaymentMethod(): Promise<PaymentMethodPayload> {
    return await this.selectedPaymentMethodOptionRef?.resolvePaymentMethod();
  }

  render() {
    return (
      <div>
        {this.paymentMethodOptions?.map((paymentMethodOption) => {
          const newCard = paymentMethodOption.id === PaymentMethodTypes.card;
          const newBankAccount = paymentMethodOption.id === PaymentMethodTypes.bankAccount;
          const isSelected = this.selectedPaymentMethodId === paymentMethodOption.id;
          const sezzel = paymentMethodOption.id === PaymentMethodTypes.sezzel;
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
          } else if (sezzel) {
            return (
              <justifi-sezzel-payment-method
                paymentMethodOption={paymentMethodOption}
                is-selected={isSelected}
                paymentAmount={this.paymentAmount}
                bnpl={this.bnpl}
                ref={(el) => {
                  if (isSelected) {
                    this.selectedPaymentMethodOptionRef = el;
                  }
                }}>
              </justifi-sezzel-payment-method>);
          }
          else {
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
