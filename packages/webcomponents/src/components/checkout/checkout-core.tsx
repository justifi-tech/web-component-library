import { Component, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { formatCurrency } from '../../utils/utils';
import { PaymentMethodPayload } from './payment-method-payload';
import { Checkout, ICheckout, ICheckoutCompleteResponse, ILoadedEventResponse } from '../../api/Checkout';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { insuranceValues, insuranceValuesOn, validateInsuranceValues } from '../insurance/insurance-state';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { Button, StyledHost, Skeleton, Header2, Header3 } from '../../ui-components';
import { checkoutSummary, text } from '../../styles/parts';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-checkout-core',
  shadow: true,
})
export class CheckoutCore {
  @Prop() authToken: string;
  @Prop() getCheckout: Function;
  @Prop() complete: Function;
  @Prop() checkoutId: string;
  @Prop() iframeOrigin: string;

  @Prop() disableCreditCard?: boolean;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableBnpl?: boolean;
  @Prop() disablePaymentMethodGroup?: boolean;
  @Prop() hideCardBillingForm?: boolean;

  @State() hasLoadedFonts: boolean = false;
  @State() checkout: ICheckout;
  @State() serverError: string;
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';
  @State() creatingNewPaymentMethod: boolean = false;
  @State() insuranceToggled: boolean = false;

  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'loaded' }) loaded: EventEmitter<ILoadedEventResponse>;

  private paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.paymentMethodOptionsRef.fillBillingForm(fields);
  }

  componentWillLoad() {
    if (this.getCheckout) {
      this.fetchData();

      // Refresh the checkout data when insurance is added or removed
      insuranceValuesOn('set', (key) => {
        const value = insuranceValues[key];
        if (value !== undefined) {
          this.insuranceToggled = value;
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
        const { status } = this.checkout;
        this.loaded.emit({ checkout_status: status });
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
    const payload: PaymentMethodPayload = await this.paymentMethodOptionsRef.resolvePaymentMethod(insuranceValidation);

    if (payload.validationError) {
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

  onSubmitted = (response: ICheckoutCompleteResponse) => {
    this.submitEvent.emit({ response: response });
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
          <Skeleton height="300px" />
        </div>
        <div class={this.isLoading && 'visually-hidden'}>
          <justifi-payment-method-options
            ref={(el) => (this.paymentMethodOptionsRef = el)}
            show-card={!this.disableCreditCard}
            show-ach={!this.disableBankAccount}
            show-bnpl={!this.disableBnpl}
            paymentMethodGroupId={this.checkout?.payment_method_group_id}
            show-saved-payment-methods={!this.disablePaymentMethodGroup}
            hideCardBillingForm={this.hideCardBillingForm}
            bnpl={this.checkout?.bnpl}
            authToken={this.authToken}
            account-id={this.checkout?.account_id}
            savedPaymentMethods={this.checkout?.payment_methods || []}
            paymentAmount={this.checkout?.payment_amount}
            insuranceToggled={this.insuranceToggled}
            iframeOrigin={this.iframeOrigin}
          />
        </div>
      </section>
    );
  }

  get summary() {
    return (
      <section>
        <div class={!this.isLoading && 'visually-hidden'}>
          <Skeleton height="24px" />
        </div>
        <div class={this.isLoading && 'visually-hidden'}>
          <div part={text}>{this.checkout?.payment_description}</div>
          <div>
            <span part={text}>Total</span>&nbsp;
            <span part={text}>{formatCurrency(+this.checkout?.total_amount)}</span>
          </div>
        </div>
      </section>
    );
  }

  render() {
    return (
      <StyledHost>
        <div class="row gy-3 jfi-checkout-core">
          <div class="col-12" part={checkoutSummary}>
            <Header2 text="Summary" class="fs-5 fw-bold pb-3" />
            {this.summary}
          </div>
          <div class="col-12">
            <slot name="insurance"></slot>
          </div>
          <div class="col-12 mt-4">
            <Header2 text="Payment" class="fs-5 fw-bold pb-3" />
            <Header3 text="Select payment type" class="fs-6 fw-bold lh-lg" />
            <div class="d-flex flex-column">
              {this.paymentType}
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex justify-content-end">
              <Button
                type="submit"
                variant="primary"
                onClick={(e) => this.submit(e)}
                disabled={this.isLoading}
                isLoading={this.isLoading}
                style={{ width: '100%' }}
              >
                Pay
              </Button>
            </div>
          </div>
        </div>
      </StyledHost>
    );
  }
}
