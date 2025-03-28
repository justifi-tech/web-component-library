import { Component, h, Prop, Method, Event, EventEmitter, State, Host } from '@stencil/core';
import { PaymentMethodOption } from './payment-method-option-utils';
import { formatCurrency } from '../../utils/utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { radioListItem } from '../../styles/parts';

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
  tag: 'justifi-sezzle-payment-method',
})
export class SezzlePaymentMethod {
  @Prop() bnpl: any; // type this
  @Prop() clientId: string;
  @Prop() accountId: string;
  @Prop() paymentMethodOption: PaymentMethodOption;
  @Prop() isSelected: boolean;
  @Prop() paymentAmount: number;

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
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!insuranceValidation.isValid) {
      return { validationError: true };
    }
    this.sezzleButtonRef.click();
    return this.sezzlePromise;
  }

  onPaymentMethodOptionClick = (e) => {
    e.preventDefault();
    this.paymentMethodOptionSelected.emit(this.paymentMethodOption);
  };

  initializeSezzleCheckout = () => {
    let resolveSezzlePromise;
    this.sezzlePromise = new Promise((resolve) => { resolveSezzlePromise = resolve; });
    const bnpl = this.bnpl;
    const amount = +this.paymentAmount; // convert to number
    const Checkout = (window as any).Checkout;
    const checkout = new Checkout({
      mode: 'popup',
      publicKey: bnpl.provider_client_id,
      apiMode: bnpl.provider_mode,
      apiVersion: bnpl.provider_api_version,
    });
    checkout.sezzleButtonElement = this.sezzleButtonRef;
    checkout.init({
      onClick: function (event) {
        event.preventDefault();
        checkout.startCheckout({
          checkout_url: bnpl.provider_checkout_url
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
      <Host class="payment-method">
        <script
          src="https://checkout-sdk.sezzle.com/checkout.min.js"
          async={true}
          ref={(el) => (this.scriptRef = el)}>
        </script>

        <div
          class="radio-list-item p-3"
          part={radioListItem}
          onClick={this.onPaymentMethodOptionClick}
        >
          <form-control-radio
            name="paymentMethodType"
            value={this.paymentMethodOption?.id}
            checked={this.isSelected}
            label={<div><div>Buy now, pay later with {sezzleLogo}</div>
              {this.installmentPlan && (
                <small>
                  <span>{this.installmentPlan?.installments.length}</span>&nbsp;
                  <span>{this.installmentPlan.schedule} payments of</span>&nbsp;
                  <span class="fw-bold">{formatCurrency(this.installmentPlan?.installments[0].amountInCents)}</span>
                </small>
              )}</div>}
          />
        </div>
      </Host>
    );
  }
}
