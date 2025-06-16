import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import { makeGetCheckout } from '../../actions/checkout/checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { Checkout as CheckoutConstructor, ICheckout, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import { checkoutStore } from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { insuranceValues, insuranceValuesOn } from '../insurance/insurance-state';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';
import { StyledHost } from '../../ui-components';

const PaymentMethodTypeLabels = {
  bankAccount: 'New bank account',
  card: 'New credit or debit card',
};

@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  analytics: JustifiAnalytics;
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement | HTMLJustifiSavedPaymentMethodElement | HTMLJustifiSezzlePaymentMethodElement;

  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() isSubmitting: boolean = false; // This is used to prevent multiple submissions and is different from loading state
  @State() paymentMethodOptions: PaymentMethodOption[] = [];
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';
  @State() savePaymentMethod: boolean = false;
  @State() serverError: string;

  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() disableBankAccount?: boolean = false;
  @Prop() disableBnpl?: boolean = false;
  @Prop() disableCreditCard?: boolean = false;
  @Prop() disablePaymentMethodGroup?: boolean = false;
  @Prop() hideBankAccountBillingForm?: boolean = false;
  @Prop() hideCardBillingForm?: boolean = false;

  @Watch('authToken')
  @Watch('checkoutId')
  @Watch('disableCreditCard')
  @Watch('disableBankAccount')
  @Watch('disableBnpl')
  @Watch('disablePaymentMethodGroup')
  propChanged() {
    checkoutStore.authToken = this.authToken;
    checkoutStore.checkoutId = this.checkoutId;
    checkoutStore.disableCreditCard = this.disableCreditCard;
    checkoutStore.disableBankAccount = this.disableBankAccount;
    checkoutStore.disableBnpl = this.disableBnpl;
    checkoutStore.disablePaymentMethodGroup = this.disablePaymentMethodGroup;
    this.fetchData();
  }

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      checkoutStore.checkoutId = this.checkoutId;
      checkoutStore.authToken = this.authToken;
      checkoutStore.disableCreditCard = this.disableCreditCard;
      checkoutStore.disableBankAccount = this.disableBankAccount;
      checkoutStore.disableBnpl = this.disableBnpl;
      checkoutStore.disablePaymentMethodGroup = this.disablePaymentMethodGroup;
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
  }

  @Listen('checkboxChanged')
  savePaymentMethodChanged(event: CustomEvent<boolean>) {
    this.savePaymentMethod = event.detail;
  }

  @Listen('checkout-complete-event')
  checkoutComplete(event: CustomEvent<any>) {
    this.isSubmitting = false;
    this.submitEvent.emit({
      response: event.detail,
    });
  }

  @Listen('error-event')
  checkoutError(event: CustomEvent<any>) {
    this.isSubmitting = false;
    console.error('checkout error', event.detail);
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    checkoutStore.selectedPaymentMethod = event.detail.id;
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    checkoutStore.billingFormFields = fields;
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    return { isValid: await this.modularCheckoutRef?.validate() };
  }

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
    this.isSubmitting = true;
    this.modularCheckoutRef.submitCheckout(checkoutStore.billingFormFields);
  }

  private get canSavePaymentMethod() {
    return checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card || checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount;
  }

  private get isLoading() {
    return this.renderState === 'loading';
  }

  private get showBillingForm() {
    return (checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card && !this.hideCardBillingForm)
      || (checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount && !this.hideBankAccountBillingForm);
  }

  private get showBillingFormSection() {
    return checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card || checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount;
  }

  private get showPaymentTypeHeader() {
    return !this.disableCreditCard && !this.disableBankAccount;
  }

  private get showPostalCodeForm() {
    return checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card && this.hideCardBillingForm;
  }

  render() {
    return (
      <StyledHost>
        <justifi-modular-checkout
          ref={(el) => (this.modularCheckoutRef = el)}
          authToken={this.authToken}
          checkoutId={this.checkoutId}
          savePaymentMethod={this.canSavePaymentMethod && this.savePaymentMethod}
        >
          <div class="row gy-3 jfi-checkout-core">
            <div class="col-12" part={checkoutSummary}>
              <justifi-header text="Summary" level="h2" class="fs-5 fw-bold pb-3" />
              <section>
                {this.isLoading && (
                  <justifi-skeleton height="24px" />
                )}
                {!this.isLoading && <justifi-checkout-summary />}
              </section>
            </div>
            <div class="col-12 mt-4">
              <slot name="insurance"></slot>
            </div>
            <div class="col-12 mt-4">
              <justifi-header text="Payment" level="h2" class="fs-5 fw-bold pb-3" />
              {this.showPaymentTypeHeader && (
                <justifi-header text="Select payment type" level="h3" class="fs-6 fw-bold lh-lg" />
              )}
              <div class="d-flex flex-column">
                <section>
                  {/* For now, just return nothing to avoid breaking, but we can decide to show an error message here */}
                  {/* <div style={{ color: 'red' }}>Error: {this.serverError}</div>; */}
                  {this.isLoading && (
                    <justifi-skeleton height="300px" />
                  )}
                  {!this.isLoading && (
                    <div>
                      <justifi-saved-payment-methods />
                      <justifi-sezzle-payment-method />
                      {!this.disableCreditCard && (
                        <div>
                          <payment-method-option
                            paymentMethodOptionId={PaymentMethodTypes.card}
                            isSelected={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card}
                            clickHandler={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.card }}
                            radioButtonHidden={this.disableCreditCard}
                            label={PaymentMethodTypeLabels[PaymentMethodTypes.card]}
                          />
                          {checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card && (
                            <div class="mt-4 mb-4">
                              <justifi-card-form />
                            </div>
                          )}
                        </div>
                      )}
                      {!this.disableBankAccount && (
                        <div>
                          <payment-method-option
                            paymentMethodOptionId={PaymentMethodTypes.bankAccount}
                            isSelected={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount}
                            clickHandler={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.bankAccount }}
                            radioButtonHidden={this.disableBankAccount}
                            label={PaymentMethodTypeLabels[PaymentMethodTypes.bankAccount]}
                          />
                          {checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount && (
                            <div class="mt-4 mb-4">
                              <justifi-bank-account-form />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>
            </div>
            {this.showBillingFormSection && (
              <div class="col-12 mt-4">
                {this.showBillingForm && (
                  <justifi-header text="Billing Address" level="h2" class="fs-5 fw-bold pb-3" />
                )}
                {this.showPostalCodeForm && (
                  <justifi-postal-code-form />
                )}
                {this.showBillingForm && (
                  <justifi-billing-information-form />
                )}
              </div>
            )}
            <div class="col-12">
              {this.canSavePaymentMethod && (
                <justifi-save-new-payment-method />
              )}
            </div>
            <div class="mt-4">
              <justifi-button
                text="Pay"
                type="submit"
                variant="primary"
                clickHandler={(e) => this.submit(e)}
                disabled={this.isLoading || this.isSubmitting}
                isLoading={this.isLoading || this.isSubmitting}
                customStyle={{ width: '100%', textAlign: "center" }}
              />
            </div>
          </div>
        </justifi-modular-checkout>
      </StyledHost>
    );
  }
}
