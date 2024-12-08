import { Component, Event, EventEmitter, Fragment, h, Prop, Method } from '@stencil/core';
import { config } from '../../../config';
import { CardBrandLabels, PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';

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

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  render() {
    return (
      <Fragment>
        <div class="payment-method">
          <div
            class="radio-list-item p-3"
            onClick={() => this.onPaymentMethodOptionClick()}
            part="radio-list-item"
          >
            <form-control-radio
              name="paymentMethodType"
              value={this.paymentMethodOption?.id}
              label={`${CardBrandLabels[this.paymentMethodOption?.brand] || ''} *${this.paymentMethodOption?.acct_last_four}`}
              defaultChecked={this.isSelected}
              inputHandler={() => this.onPaymentMethodOptionClick()}
              disabled={false}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
