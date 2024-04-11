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
  @State() sezzelLoaded: boolean = false;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  @Method()
  async getPaymentMethodToken(): Promise<string> {
    return '';
  }

  componentWillLoad() {
  }

  onPaymentMethodOptionClick = () => {
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  makeMockInstallmentPlan() {
    return {
      "schedule": "bi-weekly",
      "totalInCents": 1000,
      "installments": [
        {
          "installment": 1,
          "amountInCents": 250,
          "dueDate": "2020-10-14"
        },
        {
          "installment": 2,
          "amountInCents": 250,
          "dueDate": "2020-10-28"
        },
        {
          "installment": 3,
          "amountInCents": 250,
          "dueDate": "2020-11-11"
        },
        {
          "installment": 4,
          "amountInCents": 250,
          "dueDate": "2020-11-25"
        }
      ]
    };
  }

  showSezzelPaymentPlan() {
    this.loadSezzleScript();
    const paymentPlan = this.makeMockInstallmentPlan();

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
    );
  }

  loadSezzleScript() {
    const script = document.createElement('script');
    script.src = 'https://checkout-sdk.sezzle.com/checkout.min.js';
    script.onload = () => { this.sezzelLoaded = true; };
    // script.onerror = () => { };
    script.async = true;
    document.body.appendChild(script);
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

        {(this.isSelected) ? this.showSezzelPaymentPlan() : null}
      </div>
    );
  }
}
