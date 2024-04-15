import { Component, h, Prop, Method, Event, EventEmitter, State } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
import { formatCurrency, formatDate } from '../../utils/utils';

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
  @State() sezzelScriptLoaded: boolean = false;
  @State() sezzleCheckout: any;

  private scriptRef: HTMLScriptElement;
  private sezzleButtonRef: HTMLButtonElement;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  componentDidRender() {
    this.scriptRef.onload = () => {
      this.sezzelScriptLoaded = true;
      this.initializeSezzleCheckout();
    };
  }

  @Method()
  async getPaymentMethodToken(): Promise<string> {
    return '';
  }

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  initializeSezzleCheckout = () => {
    const amount = 10000;
    const Checkout = (window as any).Checkout;
    const checkout = new Checkout({
      mode: 'popup',
      publicKey: 'sz_pub_HXPKLKcufF0NBsRGTFdZQ0hGmz7DIO7R',
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
      onComplete: function (event) {
        console.log(event.data)
        console.log("checkout completed");
      },
      onCancel: function (event) {
        console.log(event.data)
        console.log("checkout canceled");
      },
      onFailure: function (event) {
        console.log(event.data)
        console.log("checkout failed");
      }
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
            Buy now, pay later with Sezzle
          </label>
        </div>

        <div class={this.isSelected && this.installmentPlan ? "p-3 border-bottom" : "visually-hidden"}>
          <div class="mb-3">
            <h6>Installment Plan</h6>
            <ul class="list-group">
              {this.installmentPlan?.installments.map((installment) => {
                return (
                  <li class="list-group-item">
                    <div>{formatCurrency(installment.amountInCents)} due {formatDate(installment.dueDate)}</div>
                  </li>
                );
              })}
            </ul>
          </div>
          <button
            ref={(el) => (this.sezzleButtonRef = el)}
            class="btn btn-dark"
            style={{ whiteSpace: 'nowrap' }}>
            Checkout with
            <img
              class="sezzle-smart-button-logo-img"
              src="https://media.sezzle.com/branding/2.0/Sezzle_Logo_FullColor_WhiteWM.svg"
              alt="Sezzle"
              style={{
                display: 'inline',
                width: '80px',
                marginLeft: '5px',
                marginTop: '-5px',
              }}
            />
          </button>
        </div>
      </div >
    );
  }
}
