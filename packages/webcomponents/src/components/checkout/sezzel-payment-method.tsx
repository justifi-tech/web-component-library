import { Component, h, Prop, Method, Event, EventEmitter } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';

@Component({
  tag: 'justifi-sezzel-payment-method',
  shadow: false,
})
export class SezzelPaymentMethod {
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() clientId: string;
  @Prop() accountId: string;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() isSelected: boolean;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Method()
  async getPaymentMethodToken(): Promise<string> {
    return '';
  }

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  showNewPaymentMethodForm() {
    return (
      <div class="mt-2 pb-4 border-bottom">
        <div class="mb-3">
          Payment Plan
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="payment-method">
        <div
          class={`payment-method-header p-3 border-bottom`}
          onClick={() => this.onPaymentMethodOptionClick()}>
          <input
            type="radio"
            name="paymentMethodType"
            id={this.paymentMethodOption?.id}
            value={this.paymentMethodOption?.id}
            onClick={(event) => event.preventDefault()}
            checked={this.isSelected}
            class="form-check-input me-2"
          />
          <label
            htmlFor={this.paymentMethodOption?.id}
            class="form-check-label">
            Sezzel
          </label>
        </div>

        {this.isSelected ? this.showNewPaymentMethodForm() : null}
      </div>
    );
  }
}
