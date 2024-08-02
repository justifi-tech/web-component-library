import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { formatCurrency } from '../../utils/utils';
import { config } from '../../../config';
import { PaymentMethodPayload } from './payment-method-payload';
import { Checkout, ICheckout, ICheckoutCompleteResponse } from '../../api/Checkout';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { insuranceValues, insuranceValuesOn, validateInsuranceValues } from '../insurance/insurance-state';
import StyledHost from '../../utils/styled-host/styled-host';


@Component({
  tag: 'justifi-checkout-core',
  styleUrls: ['checkout-core.css', 'header.css'],
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

      // Refresh the checkout data when insurance is added or removed
      insuranceValuesOn('set', (key) => {
        const value = insuranceValues[key];
        if (value !== undefined) {
          this.fetchData();
        }
      });
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

  async submit(event) {
    event.preventDefault();
    this.renderState = 'loading';

    const insuranceValidation = validateInsuranceValues();
    const payload: PaymentMethodPayload = await this.paymentMethodOptionsRef.resolvePaymentMethod();

    if (!insuranceValidation.isValid) {
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
      this.completeCheckout({ payment_mode: 'ecom', payment_token: payload.token });
    }
    else if (payload.bnpl?.status === 'success') {
      this.completeCheckout({ payment_mode: 'bnpl' });
    }
    else {
      this.renderState = 'error';
    }
  }

  completeCheckout = async (payment: { payment_mode: string, payment_token?: string }) => {
    this.complete({
      payment,
      onSuccess: this.onSubmitted,
      onError: this.onError,
    });
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
    return (
      <section>
        {/* For now, just return nothing to avoid breaking, but we can decide to show an error message here */}
        {/* <div style={{ color: 'red' }}>Error: {this.serverError}</div>; */}
        <div class={!this.isLoading && 'visually-hidden'}>
          <justifi-skeleton variant="rounded" height="300px" />
        </div>
        <div class={this.isLoading && 'visually-hidden'}>
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
        </div>
      </section>
    );
  }

  get summary() {
    return (
      <section>
        <div class={!this.isLoading && 'visually-hidden'}>
          <justifi-skeleton height="24px" />
        </div>
        <div class={this.isLoading && 'visually-hidden'}>
          <div class="jfi-payment-description">{this.checkout?.payment_description}</div>
          <div class="jfi-payment-total">
            <span class="jfi-payment-total-label">Total</span>&nbsp;
            <span class="jfi-payment-total-amount">{formatCurrency(+this.checkout?.total_amount)}</span>
          </div>
        </div>
      </section>
    );
  }

  private loadingSpinner = (
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  );

  render() {
    return (
      <StyledHost>
        <div class="row gy-3 jfi-checkout-core">
          <div class="col-12 mb-4">
            {/* componentize this */}
            <h2 class="fs-5 fw-bold pb-3 jfi-header">Summary</h2>
            {this.summary}
          </div >

          <div class="col-12">
            <h2 class="fs-5 fw-bold pb-3 jfi-header">Payment</h2>
            <h3 class="fs-6 fw-bold lh-lg">Select payment type</h3>
            <div class="d-flex flex-column">
              {this.paymentType}
            </div>
          </div>
          <div class="col-12">
            <slot name="insurance"></slot>
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
      </StyledHost>
    );
  }
}
