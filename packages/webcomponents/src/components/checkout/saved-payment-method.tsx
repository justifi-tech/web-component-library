import { Component, Event, EventEmitter, Fragment, h, Prop, Method } from '@stencil/core';
import { config } from '../../../config';
import { CardBrandLabels, PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';

@Component({
  tag: 'justifi-saved-payment-method',
  shadow: false,
})
export class SavedPaymentMethod {
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() isSelected: boolean;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Method()
  async resolvePaymentMethod(insuranceValidation?: any): Promise<PaymentMethodPayload> {
    if (insuranceValidation && !insuranceValidation.isValid) {
      return { validationError: true };
    }
    return { token: this.paymentMethodOption?.id };
  };

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  render() {
    return (
      <Fragment>
        <div class="payment-method">
          <div class="payment-method-header p-3" onClick={() => this.onPaymentMethodOptionClick()}>
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
              {CardBrandLabels[this.paymentMethodOption?.brand]} *{this.paymentMethodOption?.acct_last_four}
            </label>
          </div>
        </div>
      </Fragment>
    );
  }
}
