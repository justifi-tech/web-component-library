import { Component, Prop, h, State, Watch, Event, EventEmitter, Method } from '@stencil/core';
import { makeGetCheckout } from '../../actions/checkout/checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { Checkout as CheckoutConstructor, ICheckout, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import checkoutStore from '../../store/checkout.store';
import { Button, Header2, Header3, Skeleton } from '../../ui-components';
import { checkoutSummary } from '../../styles/parts';
import { insuranceValues, insuranceValuesOn, validateInsuranceValues } from '../insurance/insurance-state';

@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
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

  private async submit(_event) {
    // calls the submitCheckout method on the checkout wrapper
    this.modularCheckoutRef.submitCheckout();
  }

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

  get paymentTypeHeader() {
    const showPaymentTypeHeader = !this.disableCreditCard && !this.disableBankAccount;

    if (!showPaymentTypeHeader) return null;

    return (
      <Header3 text="Select payment type" class="fs-6 fw-bold lh-lg" />
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
      <justifi-modular-checkout
        ref={(el) => (this.modularCheckoutRef = el)}
        authToken={this.authToken}
        checkoutId={this.checkoutId}
      >
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
            {this.paymentTypeHeader}
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
      </justifi-modular-checkout>
    );
  }
}
