import { Component, h, Prop, State, Event, EventEmitter, Host, Listen } from '@stencil/core';
import { formatCurrency } from '../../utils/utils';
import { config } from '../../../config';
import { PaymentMethodPayload } from './payment-method-payload';
import { Checkout, ICheckout, ICheckoutCompleteResponse } from '../../api/Checkout';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { insuranceValues, insuranceValuesOn, validateInsuranceValues } from '../insurance/insurance-state';


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

  @State() hasLoadedFonts: boolean = false;
  @State() isLoading: boolean = false;
  @State() checkout: ICheckout;
  @State() serverError: boolean = false;
  @State() creatingNewPaymentMethod: boolean = false;

  @Event({ eventName: 'submitted' }) submitted: EventEmitter<ICheckoutCompleteResponse>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  private paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;


  componentWillLoad() {
    if (this.getCheckout) {
      this.fetchData();

      // Refresh the checkout data when insurance is added or removed
      insuranceValuesOn('set', (key) => {
        const value = insuranceValues[key]
        if (value !== undefined) {
          this.fetchData();
        }
      });
    }
  }

  @Listen('insurance-updated')
  handleInsuranceChanged() {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.getCheckout({
      onSuccess: ({ checkout }) => {
        this.checkout = new Checkout(checkout);
        this.isLoading = false;
      },
      onError: ({ error, code, severity }) => {
        this.isLoading = false;
        this.errorEvent.emit({
          errorCode: code,
          message: error,
          severity,
        });
      }
    });
  };

  async submit(event) {
    event.preventDefault();

    const insuranceInvalid = validateInsuranceValues();
    if (insuranceInvalid) return;

    this.isLoading = true;

    const payload: PaymentMethodPayload = await this.paymentMethodOptionsRef.resolvePaymentMethod();

    if (!payload) {
      this.isLoading = false;
    }
    else if (payload.error) {
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
    this.isLoading = false;
  };

  onError = ({ error, code, severity }: { error: string, code: ComponentErrorCodes, severity: ComponentErrorSeverity }) => {
    this.errorEvent.emit({
      errorCode: code,
      message: error,
      severity,
    });
    this.isLoading = false;
  };

  private loadingSpinner = (
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  );

  render() {
    return (
      <Host>
        <div class="row gy-3 jfi-checkout-core">
          <div class="col-12 mb-4">
            {/* componentize this */}
            <h2 class="fs-5 fw-bold pb-3 jfi-header">Summary</h2>
            {this.checkout && (
              <div>
                <div class="jfi-payment-description">{this.checkout?.payment_description}</div>
                <div class="jfi-payment-total">
                  <span class="jfi-payment-total-label">Total</span>&nbsp;
                  <span class="jfi-payment-total-amount">{formatCurrency(this.checkout.total_amount)}</span>
                </div>
              </div>
            )}
          </div>

          <div class="col-12">
            <h2 class="fs-5 fw-bold pb-3 jfi-header">Payment</h2>
            <h3 class="fs-6 fw-bold lh-lg">Select payment type</h3>
            <div class="d-flex flex-column">
              <justifi-payment-method-options
                ref={(el) => (this.paymentMethodOptionsRef = el)}
                show-card={this.checkout?.payment_settings?.credit_card_payments || true}
                show-ach={this.checkout?.payment_settings?.ach_payments || true}
                bnpl={this.checkout?.bnpl}
                client-id={this.checkout?.payment_client_id}
                account-id={this.checkout?.account_id}
                savedPaymentMethods={this.checkout?.payment_methods || []}
                paymentAmount={this.checkout?.payment_amount}
              />
            </div>
          </div>
          <slot name="insurance"></slot>
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
