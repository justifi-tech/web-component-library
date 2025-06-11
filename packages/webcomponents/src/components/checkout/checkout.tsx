import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import { makeGetCheckout } from '../../actions/checkout/checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { Checkout as CheckoutConstructor, ICheckout, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import checkoutStore from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { insuranceValues, insuranceValuesOn, validateInsuranceValues } from '../insurance/insurance-state';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from './payment-method-option-utils';
import { PaymentMethodPayload } from './payment-method-payload';
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
  @Prop() disableBankAccount?: boolean;
  @Prop() disableBnpl?: boolean;
  @Prop() disableCreditCard?: boolean;
  @Prop() disablePaymentMethodGroup?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean = false;
  @Prop() hideCardBillingForm?: boolean = false;

  @Watch('authToken')
  @Watch('checkoutId')
  propChanged() {
    checkoutStore.authToken = this.authToken;
    checkoutStore.checkoutId = this.checkoutId;
    this.fetchData();
  }

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      checkoutStore.checkoutId = this.checkoutId;
      checkoutStore.authToken = this.authToken;
    }
    this.paymentMethodsChanged();
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
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    if (newPaymentMethodElement?.fillBillingForm) {
      newPaymentMethodElement.fillBillingForm(fields);
    }
  }

  @Method()
  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    return await this.selectedPaymentMethodOptionRef?.resolvePaymentMethod(insuranceValidation);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    const insuranceValidation = validateInsuranceValues();
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    const paymentMethodValidation = newPaymentMethodElement ? await newPaymentMethodElement.validate() : { isValid: true };

    if (!insuranceValidation.isValid || !paymentMethodValidation.isValid) {
      return { isValid: false };
    } else {
      return { isValid: true };
    }
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
        this.paymentMethodsChanged();
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

  private getNewPaymentMethodOptions(): PaymentMethodOption[] {
    const options: PaymentMethodOption[] = [];

    if (this.shouldShowSezzle()) {
      options.push(new PaymentMethodOption({ id: PaymentMethodTypes.sezzle }));
    }
    if (!this.disableCreditCard) {
      options.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (!this.disableBankAccount) {
      options.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }

    return options;
  }

  private getSavedPaymentMethods(): PaymentMethodOption[] {
    return this.checkout.payment_methods
      .map((paymentMethod) => new PaymentMethodOption(paymentMethod))
      .filter((paymentMethod) => this.isPaymentMethodAllowed(paymentMethod.type));
  }

  private isPaymentMethodAllowed(type: string): boolean {
    if (type === PaymentMethodTypes.card && this.disableCreditCard) {
      return false;
    }

    if (type === PaymentMethodTypes.bankAccount && this.disableBankAccount) {
      return false;
    }

    return true;
  }

  private paymentMethodsChanged() {
    if (!this.checkout?.payment_methods) return;

    this.paymentMethodOptions = [
      ...this.getSavedPaymentMethods(),
      ...this.getNewPaymentMethodOptions()
    ];

    this.setDefaultPaymentMethod();
  }

  private setDefaultPaymentMethod(): void {
    if (!checkoutStore.selectedPaymentMethod) {
      checkoutStore.selectedPaymentMethod = this.paymentMethodOptions[0]?.id;
    }
  }

  private shouldShowSezzle(): boolean {
    return !this.disableBnpl &&
      this.checkout?.bnpl?.provider === 'sezzle' &&
      !this.insuranceToggled;
  }

  private async submit(_event) {
    this.isSubmitting = true;
    this.modularCheckoutRef.submitCheckout();
  }

  private get canSavePaymentMethod() {
    return checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card || checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount;
  }

  private get hiddenRadioInput() {
    return this.disableBankAccount || this.disableCreditCard;
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
                      <payment-method-option
                        paymentMethodOptionId={PaymentMethodTypes.card}
                        isSelected={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card}
                        clickHandler={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.card }}
                        radioButtonHidden={this.hiddenRadioInput}
                        label={PaymentMethodTypeLabels[PaymentMethodTypes.card]}
                      />
                      {checkoutStore.selectedPaymentMethod === PaymentMethodTypes.card && (
                        <div class="mt-4 mb-4">
                          <justifi-card-form />
                        </div>
                      )}
                      <payment-method-option
                        paymentMethodOptionId={PaymentMethodTypes.bankAccount}
                        isSelected={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount}
                        clickHandler={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.bankAccount }}
                        radioButtonHidden={this.hiddenRadioInput}
                        label={PaymentMethodTypeLabels[PaymentMethodTypes.bankAccount]}
                      />
                      {checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount && (
                        <div class="mt-4 mb-4">
                          <justifi-bank-account-form />
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
