import { Component, h, Method, Event, EventEmitter, State } from '@stencil/core';
import { formatCurrency } from '../../../utils/utils';
import { PaymentMethodPayload } from '../../checkout/payment-method-payload';
import { radioListItem } from '../../../styles/parts';
import { checkoutStore } from '../../../store/checkout.store';
import { StyledHost } from '../../../ui-components';
import { PAYMENT_METHODS } from '../ModularCheckout';

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
  shadow: true
})
export class SezzlePaymentMethod {
  @State() installmentPlan: any;
  @State() sezzleCheckout: any;
  @State() sezzlePromise: Promise<PaymentMethodPayload>;

  private scriptRef: HTMLScriptElement;
  private sezzleButtonRef: HTMLButtonElement;
  private paymentMethodOptionId = PAYMENT_METHODS.SEZZLE;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  componentDidRender() {
    if (!this.scriptRef) return;

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
    checkoutStore.selectedPaymentMethod = this.paymentMethodOptionId;
    this.paymentMethodOptionSelected.emit(this.paymentMethodOptionId);
  };

  initializeSezzleCheckout = () => {
    let resolveSezzlePromise;
    this.sezzlePromise = new Promise((resolve) => { resolveSezzlePromise = resolve; });
    const amount = Number(checkoutStore.paymentAmount);
    const Checkout = (window as any).Checkout;
    const checkout = new Checkout({
      mode: 'popup',
      publicKey: checkoutStore.bnplProviderClientId,
      apiMode: checkoutStore.bnplProviderMode,
      apiVersion: checkoutStore.bnplProviderApiVersion,
    });
    checkout.sezzleButtonElement = this.sezzleButtonRef;
    checkout.init({
      onClick: function (event) {
        event.preventDefault();
        checkout.startCheckout({
          checkout_url: checkoutStore.bnplProviderCheckoutUrl,
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
    if (!checkoutStore.bnplEnabled || checkoutStore.disableBnpl) {
      console.warn('justifi-sezzle-payment-method: BNPL is not enabled for this account.');
      return null;
    }

    return (
      <StyledHost class="payment-method">
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
            value={this.paymentMethodOptionId}
            checked={checkoutStore.selectedPaymentMethod === PAYMENT_METHODS.SEZZLE}
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
      </StyledHost>
    );
  }
}
