import { Component, h, Prop, Method, Event, EventEmitter, State } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
// import { formatCurrency, formatDate } from '../../utils/utils';

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

  private scriptRef: HTMLScriptElement;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  componentDidRender() {
    this.scriptRef.onload = () => {
      this.sezzelScriptLoaded = true;
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
    checkout.renderSezzleButton("sezzle-smart-button-container");
    checkout.init({
      onClick: function () {
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
      },
      onCancel: function () {
        console.log("checkout canceled");
      },
      onFailure: function () {
        console.log("checkout failed");
      }
    });
    this.installmentPlan = checkout.getInstallmentPlan(amount);
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

        {(this.isSelected) ? (
          <div class="mt-2 pb-4 border-bottom">
            {this.initializeSezzleCheckout()}
            {this.installmentPlan ? (
              <div>
                <div class="mb-3">
                  Make {this.installmentPlan?.installments.length} {this.installmentPlan?.schedule} payments
                  <ul class="list-group">
                    {this.installmentPlan?.installments.map((installment) => {
                      return (
                        <li class="list-group-item">Installment #{installment.installment} {installment.dueDate} {installment.amountInCents}</li>
                        // <div>
                        //   <div>Installment #{installment.installment} {formatCurrency(installment.amountInCents)}</div>
                        //   <div>Due {formatDate(installment.dueDate)}</div>
                        // </div>
                      );
                    })}
                  </ul>
                </div>
                <div id="sezzle-smart-button-container"></div>
              </div>
            ) : (
              <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div >
    );
  }
}
