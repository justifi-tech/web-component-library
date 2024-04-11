import { Component, h, Prop, Method, Event, EventEmitter, State } from '@stencil/core';
import { config } from '../../../config';
import { PaymentMethodOption } from './payment-method-option-utils';
import { mockSezzelInstallmentPlan } from './mock-sezzel-installment-plan';
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
  @State() sezzelLoaded: boolean = false;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Method()
  async getPaymentMethodToken(): Promise<string> {
    return '';
  }

  componentWillLoad() {
    this.loadSezzleScript();
  }

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  showSezzelPaymentPlan() {
    const paymentPlan = mockSezzelInstallmentPlan;

    return (
      <div class="mt-2 pb-4 border-bottom">
        {this.sezzelLoaded ? (
          <div class="mb-3">
            Make {paymentPlan.installments.length} {paymentPlan.schedule} payments
            <ul class="list-group">
              {paymentPlan.installments.map((installment) => {
                return (
                  <li class="list-group-item">Installment #{installment.installment}</li>
                  // <div>
                  //   <div>Installment #{installment.installment} {formatCurrency(installment.amountInCents)}</div>
                  //   <div>Due {formatDate(installment.dueDate)}</div>
                  // </div>
                );
              })}
            </ul>
          </div>
        ) : (
          <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  loadSezzleScript() {
    const script = document.createElement('script');
    script.src = 'https://checkout-sdk.sezzle.com/checkout.min.js';
    script.onload = () => {
      this.initSezzleCheckout();
    };
    // script.onerror = () => { };
    script.async = true;
    document.body.appendChild(script);
  }

  initSezzleCheckout() {
    this.sezzelLoaded = true;
    const Checkout = (window as any).Checkout;
    const checkout = new Checkout({
      mode: 'popup',
      publicKey: 'xxxx',
      apiMode: 'sandbox',
      apiVersion: 'v2'
    });
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
                "amount_in_cents": 10000,
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
    console.log('checkout:', checkout);
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
            Buy now, pay later with Sezzle
          </label>
        </div>

        {(this.isSelected) ? (
          <div>
            <div>{this.showSezzelPaymentPlan()}</div>
            <div id="sezzle-smart-button-container"></div>
          </div>
        ) : null}
      </div>
    );
  }
}
