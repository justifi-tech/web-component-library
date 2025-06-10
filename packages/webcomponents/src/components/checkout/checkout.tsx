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
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  private selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement | HTMLJustifiSavedPaymentMethodElement | HTMLJustifiSezzlePaymentMethodElement;

  analytics: JustifiAnalytics;

  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() renderState: 'loading' | 'error' | 'success' = 'loading';
  @State() serverError: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];

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

  paymentMethodsChanged() {
    if (!this.checkout?.payment_methods) return;

    this.paymentMethodOptions = this.checkout.payment_methods
      .map((paymentMethod) => new PaymentMethodOption(paymentMethod))
      .filter((paymentMethod) => {
        // Don't save card or bank account if they are disabled
        return (
          (!this.disableCreditCard || paymentMethod.type !== PaymentMethodTypes.card) &&
          (!this.disableBankAccount || paymentMethod.type !== PaymentMethodTypes.bankAccount)
        );
      });

    if (!this.disableBnpl && this.checkout?.bnpl?.provider === 'sezzle' && !this.insuranceToggled) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.sezzle }));
    }
    if (!this.disableCreditCard) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (!this.disableBankAccount) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }
    if (!checkoutStore.selectedPaymentMethod) {
      checkoutStore.selectedPaymentMethod = this.paymentMethodOptions[0]?.id;
    }
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    checkoutStore.selectedPaymentMethod = event.detail.id;
  }

  private async submit(_event) {
    // calls the submitCheckout method on the checkout wrapper
    this.modularCheckoutRef.submitCheckout();
  }

  private get hiddenRadioInput() {
    return this.disableBankAccount || this.disableCreditCard;
  }

  get isLoading() {
    return this.renderState === 'loading';
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

  render() {
    const showPaymentTypeHeader = !this.disableCreditCard && !this.disableBankAccount;

    return (
      <StyledHost>
        <justifi-modular-checkout
          ref={(el) => (this.modularCheckoutRef = el)}
          authToken={this.authToken}
          checkoutId={this.checkoutId}
        >
          <div class="row gy-3 jfi-checkout-core">
            <div class="col-12 mb-4" part={checkoutSummary}>
              <justifi-header text="Summary" level="h2" class="fs-5 fw-bold pb-3" />
              <section class="mb-4">
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
              {showPaymentTypeHeader && (
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
                      <payment-method-option
                        paymentMethodOptionId={PaymentMethodTypes.bankAccount}
                        isSelected={checkoutStore.selectedPaymentMethod === PaymentMethodTypes.bankAccount}
                        clickHandler={() => { checkoutStore.selectedPaymentMethod = PaymentMethodTypes.bankAccount }}
                        radioButtonHidden={this.hiddenRadioInput}
                        label={PaymentMethodTypeLabels[PaymentMethodTypes.bankAccount]}
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-end">
                <justifi-button
                  text="Pay"
                  type="submit"
                  variant="primary"
                  clickHandler={(e) => this.submit(e)}
                  disabled={this.isLoading}
                  isLoading={this.isLoading}
                  customStyle={{ width: '100%', textAlign: "center" }}
                />
              </div>
            </div>
          </div>
        </justifi-modular-checkout>
      </StyledHost>
    );
  }
}
