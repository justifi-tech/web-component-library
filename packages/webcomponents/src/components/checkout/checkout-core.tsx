import { Component, h, Prop, State, Event, EventEmitter, Host, Method } from '@stencil/core';
import { extractComputedFontsToLoad, formatCurrency } from '../../utils/utils';
import { config } from '../../../config';
import { PaymentMethodPayload } from './payment-method-payload';
import { Checkout, ICheckout, ICheckoutCompleteResponse } from '../../api/Checkout';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';

@Component({
  tag: 'justifi-checkout-core',
  styleUrl: 'checkout-core.scss',
  shadow: true,
})
export class CheckoutCore {
  /**
 * URL for the rendered iFrame. End-users need not use this.
 */
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() authToken: string;
  @Prop() getCheckout: Function;
  @Prop() complete: Function;
  @Prop() checkoutId: string;

  @Prop() disableCreditCard?: boolean;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableBnpl?: boolean;
  @Prop() disablePaymentMethodGroup?: boolean;

  @State() hasLoadedFonts: boolean = false;
  @State() checkout: ICheckout;
  @State() serverError: string;
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';
  @State() creatingNewPaymentMethod: boolean = false;

  @Event({ eventName: 'submitted' }) submitted: EventEmitter<ICheckoutCompleteResponse>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  private paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;

  componentWillLoad() {
    if (this.getCheckout) {
      this.fetchData();
    }
  }

  connectedCallback() {
    if (!this.hasLoadedFonts) {
      this.loadFontsOnParent();
      this.hasLoadedFonts = true;
    }
  }

  fetchData(): void {
    this.renderState = 'loading';
    this.getCheckout({
      onSuccess: ({ checkout }) => {
        this.checkout = new Checkout(checkout);
        this.renderState = 'success';
      },
      onError: ({ error, code, severity }) => {
        this.serverError = error;
        this.renderState = 'error';
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  };


  @Method()
  async loadFontsOnParent() {
    const parent = document.body;
    const fontsToLoad = extractComputedFontsToLoad();
    if (!parent || !fontsToLoad) {
      return null;
    }

    // This approach is needed to load the font in a parent of the component
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;

    parent.append(fonts);
  }

  async submit(event) {
    event.preventDefault();

    this.renderState = 'loading';

    const payload: PaymentMethodPayload = await this.paymentMethodOptionsRef.resolvePaymentMethod();

    if (!payload) {
      this.renderState = 'error';
    }
    else if (payload.error) {
      this.renderState = 'error';
      this.serverError = payload.error.message;
      this.onError({
        code: (payload.error.code as ComponentErrorCodes),
        error: payload.error.message,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
    else if (payload.token) {
      this.complete({
        payment: { payment_mode: 'ecom', payment_token: payload.token },
        onSuccess: this.onSubmitted,
        onError: this.onError,
      })
    }
    else if (payload.bnpl?.status === 'success') {
      this.complete({
        payment: { payment_mode: 'bnpl' },
        onSuccess: this.onSubmitted,
        onError: this.onError,
      })
    }
  }

  onSubmitted = (data: ICheckoutCompleteResponse) => {
    this.submitted.emit(data);
    this.renderState = 'success';
  };

  onError = ({ error, code, severity }: { error: string, code: ComponentErrorCodes, severity: ComponentErrorSeverity }) => {
    this.serverError = error;
    this.errorEvent.emit({
      errorCode: code,
      message: error,
      severity,
    });
    this.renderState = 'error';
  };

  get isLoading() {
    return this.renderState === 'loading';
  }

  get isError() {
    return this.renderState === 'error';
  }

  get paymentType() {
    if (this.isError) {
      // For now, just return nothing to avoid breaking, but we can decide to show an error message here
      // return <div style={{ color: 'red' }}>Error: {this.serverError}</div>;
      return null;
    }

    if (this.isLoading) {
      return <justifi-skeleton variant="rounded" height="300px" />;
    }

    return (
      <justifi-payment-method-options
        ref={(el) => (this.paymentMethodOptionsRef = el)}
        show-card={!this.disableCreditCard}
        show-ach={!this.disableBankAccount}
        show-bnpl={!this.disableBnpl}
        show-saved-payment-methods={!this.disablePaymentMethodGroup}
        bnpl={this.checkout?.bnpl}
        client-id={this.checkout?.payment_client_id}
        account-id={this.checkout?.account_id}
        savedPaymentMethods={this.checkout?.payment_methods || []}
        paymentAmount={this.checkout?.payment_amount}
      />
    );
  }

  get summary() {
    if (this.isLoading) {
      return <justifi-skeleton height="50px" />;
    }

    if (this.isError) {
      return null;
    }

    return (
      <div>
        <div class="jfi-payment-description">{this.checkout?.payment_description}</div>
        <div class="jfi-payment-total">
          <span class="jfi-payment-total-label">Total</span>&nbsp;
          <span class="jfi-payment-total-amount">{formatCurrency(+this.checkout.payment_amount)}</span>
        </div>
      </div>
    );
  }

  get loadingSpinner() {
    return <justifi-loading-spinner />;
  }

  render() {
    return (
      <Host>
        <div class="row gy-3 jfi-checkout-core">
          <div class="col-12 mb-4">
            {/* componentize this */}
            <h2 class="fs-5 fw-bold pb-3 jfi-header">Summary</h2>
            {this.summary}
          </div>

          <div class="col-12">
            <h2 class="fs-5 fw-bold pb-3 jfi-header">Payment</h2>
            <h3 class="fs-6 fw-bold lh-lg">Select payment type</h3>
            <div class="d-flex flex-column">
              {this.paymentType}
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex justify-content-end">
              <button
                type="submit"
                onClick={event => this.submit(event)}
                disabled={this.isLoading}
                part="pay-button"
                class={`btn btn-primary jfi-submit-button ${this.isLoading ? 'jfi-submit-button-loading' : ''}`}
              >
                {this.isLoading ? this.loadingSpinner : 'Pay'}
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
