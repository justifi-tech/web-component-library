import { Component, Prop, h, State, Watch, Event, EventEmitter, Method } from '@stencil/core';
import { makeGetCheckout, makeCheckoutComplete } from '../../actions/checkout/checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { Checkout as CheckoutConstructor, ICheckout, ICheckoutCompleteResponse, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import checkoutStore from '../../store/checkout.store';
import { Button, Header2, Header3, Skeleton, StyledHost } from '../../ui-components';
import { checkoutSummary } from '../../styles/parts';
import { insuranceValues, insuranceValuesOn, validateInsuranceValues } from '../insurance/insurance-state';
import { PaymentMethodPayload } from './payment-method-payload';

@Component({
  tag: 'justifi-checkout',
  shadow: true,
})
export class Checkout {
  paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;
  analytics: JustifiAnalytics;

  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';
  @State() serverError: string;

  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() disableCreditCard?: boolean;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableBnpl?: boolean;
  @Prop() disablePaymentMethodGroup?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;

  @Watch('authToken')
  @Watch('checkoutId')
  propChanged() {
    checkoutStore.authToken = this.authToken;
    checkoutStore.checkoutId = this.checkoutId;
    this.fetchData();
  }

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      checkoutStore.checkoutId = this.checkoutId;
      checkoutStore.authToken = this.authToken;
    }
  }

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);

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

  disconnectedCallback() {
    this.analytics?.cleanup();
  };

  private fetchData = (): void => {
    this.renderState = 'loading';

    const actionsConfig = {
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService()
    };
    const getCheckout = makeGetCheckout(actionsConfig);

    getCheckout({
      onSuccess: ({ checkout }) => {
        this.checkout = new CheckoutConstructor(checkout);
        const { status } = this.checkout;
        this.loadedEvent.emit({ checkout_status: status });
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

  private async submit(event) {
    event.preventDefault();
    this.renderState = 'loading';

    const insuranceValidation = validateInsuranceValues();
    const payload: PaymentMethodPayload = await this.paymentMethodOptionsRef.resolvePaymentMethod(insuranceValidation);

    if (payload.validationError) {
      this.renderState = 'error';
    } else if (payload.error) {
      this.renderState = 'error';
      this.serverError = payload.error.message;
      this.onError({
        code: (payload.error.code as ComponentErrorCodes),
        error: payload.error.message,
        severity: ComponentErrorSeverity.ERROR,
      });
    } else if (payload.token) {
      this.completeCheckout({ payment_mode: 'ecom', payment_token: payload.token });
    } else if (payload.bnpl?.status === 'success') {
      this.completeCheckout({ payment_mode: 'bnpl' });
    } else {
      this.renderState = 'error';
    }
  }

  private completeCheckout = async (payment: { payment_mode: string, payment_token?: string }) => {
    const complete = makeCheckoutComplete({
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService()
    });

    complete({
      payment,
      onSuccess: this.onSubmitted,
      onError: this.onError,
    });
  }

  private onSubmitted = (response: ICheckoutCompleteResponse) => {
    this.submitEvent.emit({ response: response });
    this.renderState = 'success';
  };

  private onError = ({ error, code, severity }: { error: string, code: ComponentErrorCodes, severity: ComponentErrorSeverity }) => {
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

  get summary() {
    return (
      <section>
        <div class={!this.isLoading && 'visually-hidden'}>
          <Skeleton height="24px" />
        </div>
        <justifi-checkout-summary />
      </section>
    );
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
            hideBankAccountBillingForm={this.hideBankAccountBillingForm}
            bnpl={this.checkout?.bnpl}
            authToken={this.authToken}
            account-id={this.checkout?.account_id}
            savedPaymentMethods={this.checkout?.payment_methods || []}
            paymentAmount={this.checkout?.payment_amount}
            insuranceToggled={this.insuranceToggled}
          />
        </div>
      </section>
    );
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.paymentMethodOptionsRef.fillBillingForm(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    const insuranceValidation = validateInsuranceValues();
    const { isValid } = await this.paymentMethodOptionsRef.validate();

    if (!insuranceValidation.isValid || !isValid) {
      return { isValid: false };
    } else {
      return { isValid: true };
    }
  }

  render() {
    return (
      <StyledHost>
        <justifi-checkout-wrapper
          authToken={this.authToken}
          checkoutId={this.checkoutId}
        >
          <div class="row gy-3 jfi-checkout-core">
            <div class="col-12" part={checkoutSummary}>
              <Header2 text="Summary" class="fs-5 fw-bold pb-3" />
              {this.summary}
            </div>
            <div class="col-12">
              <div slot="insurance">
                <slot name="insurance"></slot>
              </div>
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
        </justifi-checkout-wrapper>
      </StyledHost>
    );
  }
}
