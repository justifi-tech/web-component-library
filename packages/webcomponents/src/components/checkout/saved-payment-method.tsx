import { Component, Event, EventEmitter, h, Prop, Method, Host } from '@stencil/core';
import { config } from '../../../config';
import { CardBrandLabels, PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { radioListItem } from '../../styles/parts';

@Component({
  tag: 'justifi-saved-payment-method',
})
export class SavedPaymentMethod {
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() isSelected: boolean;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!insuranceValidation.isValid) {
      return { validationError: true };
    }
    return { token: this.paymentMethodOption?.id };
  };

  onPaymentMethodOptionClick = (e) => {
    e.preventDefault();
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
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
