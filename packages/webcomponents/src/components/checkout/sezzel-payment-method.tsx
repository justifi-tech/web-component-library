import { Component, h, Prop, Method, Event, EventEmitter, State } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
import { formatCurrency } from '../../utils/utils';
import { PaymentMethodPayload } from './payment-method-payload';

const sezzleLogo = (
  <img
    class="sezzle-smart-button-logo-img"
    src="https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor.svg"
    alt="Sezzle"
    style={{
      display: 'inline',
      width: '80px',
      marginLeft: '5px',
      marginTop: '-5px',
    }}
  />
);

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
  @State() installmentPlan: any;
  @State() sezzleCheckout: any;
  @State() sezzlePromise: Promise<PaymentMethodPayload>;

  private scriptRef: HTMLScriptElement;
  private sezzleButtonRef: HTMLButtonElement;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  componentDidRender() {
    this.scriptRef.onload = () => {
      this.sezzleButtonRef = document.createElement('button');
      this.initializeSezzleCheckout();
    };
  }

  @Method()
  async resolvePaymentMethod(): Promise<PaymentMethodPayload> {
    this.sezzleButtonRef.click();
    return this.sezzlePromise;
  }

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  initializeSezzleCheckout = () => {
    const amount = 10000;
    let resolveSezzlePromise;
    this.sezzlePromise = new Promise((resolve) => { resolveSezzlePromise = resolve; });
    const Checkout = (window as any).Checkout;
    const checkout = new Checkout({
      mode: 'popup',
      publicKey: 'xxxx',
      apiMode: 'sandbox',
      apiVersion: 'v2'
    });
    checkout.sezzleButtonElement = this.sezzleButtonRef;
    checkout.init({
      onClick: function (event) {
        event.preventDefault();
        checkout.startCheckout({
          checkout_payload: {
            "order": {
              "intent": "AUTH",
              "reference_id": "ord_12345",
              "description": "sezzle-store - #12749253509255",
              "order_amount": {
                "amount_in_cents": amount,
                "currency": "USD"
              }
            }
          }
        });
      },
      onComplete: (event) => resolveSezzlePromise({ bnpl: event.data }),
      onCancel: (event) => resolveSezzlePromise({ bnpl: event.data }),
      onFailure: (event) => resolveSezzlePromise({ bnpl: event.data }),
    });
    this.sezzleCheckout = checkout;
    this.installmentPlan = this.sezzleCheckout.getInstallmentPlan(amount);
  };

  render() {
    return (
      <div class="payment-method">
        <script
          src="https://checkout-sdk.sezzle.com/checkout.min.js"
          async={true}
          ref={(el) => (this.scriptRef = el)}>
        </script>

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
            <div>Buy now, pay later with {sezzleLogo}</div>
            {this.installmentPlan && (
              <small>
                <span>{this.installmentPlan?.installments.length}</span>&nbsp;
                <span>{this.installmentPlan.schedule} payments of</span>&nbsp;
                <span class="fw-bold">{formatCurrency(this.installmentPlan?.installments[0].amountInCents)}</span>
              </small>
            )}
          </label>
        </div>
      </div>
    );
  }
}
