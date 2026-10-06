import { Component, h, Method, Event, EventEmitter, State, Element } from '@stencil/core';
import { formatCurrency } from '../../../utils/utils';
import { PaymentMethodPayload } from '../../checkout/payment-method-payload';
import { checkoutStore } from '../../../store/checkout.store';
import { StyledHost } from '../../../ui-components';
import { PAYMENT_METHODS } from '../ModularCheckout';

const SEZZLE_SDK_URL = 'https://checkout-sdk.sezzle.com/checkout.min.js';

// Loads the Sezzle SDK, reusing the script tag across instances.
const loadSezzleSdk = (): Promise<void> => {
  if ((window as any).Checkout) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SEZZLE_SDK_URL}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SEZZLE_SDK_URL;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => {
      script.remove();
      reject(new Error('Failed to load Sezzle SDK'));
    });
  });
};

const sezzleLogo = () => (
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
export class JustifiSezzlePaymentMethod {
  @Element() hostEl: HTMLJustifiSezzlePaymentMethodElement;

  @State() sezzleCheckout: any;

  private sezzleButton: HTMLButtonElement;
  private initPromise?: Promise<void>;
  private pendingResolve?: (payload: PaymentMethodPayload) => void;
  private paymentMethodOptionId = PAYMENT_METHODS.SEZZLE;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;

  // Lets justifi-modular-checkout find this element even when nested in another shadow root.
  @Event({ eventName: 'sezzle-payment-method-ready', bubbles: true, composed: true })
  sezzlePaymentMethodReady: EventEmitter<HTMLJustifiSezzlePaymentMethodElement>;

  componentDidLoad() {
    this.sezzlePaymentMethodReady.emit(this.hostEl);
  }

  componentDidRender() {
    if (checkoutStore.bnplEnabled) {
      this.ensureSezzleCheckout().catch(() => {});
    }
  }

  // Opens the Sezzle popup and resolves once the customer completes, cancels or fails.
  @Method()
  async resolvePaymentMethod(insuranceValidation?: { isValid: boolean }): Promise<PaymentMethodPayload> {
    if (insuranceValidation && !insuranceValidation.isValid) {
      return { validationError: true };
    }

    try {
      await this.ensureSezzleCheckout();
    } catch {
      return {
        error: { code: 'sezzle-load-error', message: 'Unable to load Sezzle. Please try again.', decline_code: '' },
      };
    }

    this.settle({ bnpl: { status: 'cancelled' } });
    return new Promise((resolve) => {
      this.pendingResolve = resolve;
      this.sezzleButton.click();
    });
  }

  @Method()
  async handleSelectionClick(): Promise<void> {
    checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.SEZZLE };
    checkoutStore.paymentToken = undefined;
    this.paymentMethodOptionSelected.emit(this.paymentMethodOptionId);
  }

  private ensureSezzleCheckout(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = loadSezzleSdk()
        .then(() => this.initializeSezzleCheckout())
        .catch((error) => {
          this.initPromise = undefined;
          throw error;
        });
    }
    return this.initPromise;
  }

  private settle(payload: PaymentMethodPayload) {
    const resolve = this.pendingResolve;
    this.pendingResolve = undefined;
    resolve?.(payload);
  }

  private initializeSezzleCheckout = () => {
    const Checkout = (window as any).Checkout;
    const checkout = new Checkout({
      mode: 'popup',
      publicKey: checkoutStore.bnplProviderClientId,
      apiMode: checkoutStore.bnplProviderMode,
      apiVersion: checkoutStore.bnplProviderApiVersion,
    });
    this.sezzleButton = document.createElement('button');
    checkout.sezzleButtonElement = this.sezzleButton;
    checkout.init({
      onClick: (event) => {
        event.preventDefault();
        checkout.startCheckout({
          checkout_url: checkoutStore.bnplProviderCheckoutUrl,
        });
      },
      onComplete: (event) => this.settle({ bnpl: { ...event?.data, status: 'success' } }),
      onCancel: (event) => this.settle({ bnpl: { ...event?.data, status: 'cancelled' } }),
      onFailure: (event) => this.settle({ bnpl: { ...event?.data, status: 'failure' } }),
    });
    this.sezzleCheckout = checkout;
  };

  render() {
    if (!checkoutStore.bnplEnabled) {
      console.warn('justifi-sezzle-payment-method: BNPL is not enabled for this account.');
      return null;
    }

    const installmentPlan = this.sezzleCheckout?.getInstallmentPlan(Number(checkoutStore.paymentAmount));

    return (
      <StyledHost class="payment-method">
        <div>
          <div>Buy now, pay later with {sezzleLogo()}</div>
          {installmentPlan && (
            <small>
              <span>{installmentPlan.installments.length}</span>&nbsp;
              <span>{installmentPlan.schedule} payments of</span>&nbsp;
              <span class="fw-bold">{formatCurrency(installmentPlan.installments[0].amountInCents)}</span>
            </small>
          )}
        </div>
      </StyledHost>
    );
  }
}
