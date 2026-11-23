import { Component, Event, EventEmitter, h, Prop, Method, Host } from '@stencil/core';
import { CardBrandLabels, PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { radioListItem } from '../../styles/parts';
import { emitPublic } from '../../api/emit-public';

@Component({
  tag: 'justifi-saved-payment-method',
})
export class JustifiSavedPaymentMethod {
  @Prop() paymentMethodOption!: PaymentMethodOption;
  @Prop() isSelected!: boolean;

  @Event({ eventName: 'justifi-payment-method-selected', bubbles: true }) paymentMethodOptionSelected: EventEmitter;
  /** @deprecated Listen for `justifi-payment-method-selected`. Removed in the next major. */
  @Event({ eventName: 'paymentMethodOptionSelected', bubbles: true }) paymentMethodOptionSelectedLegacy: EventEmitter;

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!insuranceValidation.isValid) {
      return { validationError: true };
    }
    return { token: this.paymentMethodOption?.id };
  };

  onPaymentMethodOptionClick = (e) => {
    e.preventDefault();
    emitPublic(this.paymentMethodOptionSelected, this.paymentMethodOptionSelectedLegacy, this.paymentMethodOption);
  };

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
            label={`${CardBrandLabels[this.paymentMethodOption?.brand] || ''} *${this.paymentMethodOption?.acct_last_four}`}
          />
        </div>
      </Host>
    );
  }
}
