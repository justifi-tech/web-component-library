import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { ICheckout, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '@justifi/types';
import { checkoutStore } from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { StyledHost } from '../../ui-components';
import type { CheckoutState, CheckoutChangedEventDetail, Hook } from '@justifi/types';
import { PAYMENT_METHODS } from '@justifi/types';

/**
 * @part font-family - Controls the font family for the component.
 * @part color - Controls the text color.
 * @part background-color - Controls the background color.
 * @part button - Button styles.
 * @part button-disabled - Disabled button styles.
 * @part input - Input field styles.
 * @part input-focused - Input styles when focused.
 * @part input-invalid - Input styles when invalid.
 * @part input-invalid-and-focused - Input styles when invalid and focused.
 * @part input-radio - Radio input styles.
 * @part input-checkbox - Checkbox input styles.
 * @part input-checkbox-checked - Checkbox input styles when checked.
 * @part input-checkbox-checked-focused - Checkbox input styles when checked and focused.
 * @part input-checkbox-focused - Checkbox input styles when focused.
 * @part button-primary - Primary button styles.
 * @part radio-list-item - Radio list item styles.
 * @part checkout-summary - Summary section of the checkout component.
 */
@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  analytics: JustifiAnalytics;
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  tokenizePaymentMethodRef?: HTMLInternalTokenizePaymentMethodElement;
  plaidPaymentMethodRef?: HTMLJustifiPlaidPaymentMethodElement;
  sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  googlePayRef?: HTMLJustifiGooglePayElement;
  @State() availablePaymentMethods: PAYMENT_METHODS[] = [];
  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() isSubmitting: boolean = false; // This is used to prevent multiple submissions and is different from loading state
  @State() serverError: string;

  @Prop() authToken!: string;
  @Prop() checkoutId!: string;
  @Prop() disableBankAccount?: boolean = false;
  @Prop() disableBnpl?: boolean = false;
  @Prop() disableCreditCard?: boolean = false;
  @Prop() disablePaymentMethodGroup?: boolean = false;
  @Prop() hideBankAccountBillingForm?: boolean = false;
  @Prop() hideCardBillingForm?: boolean = false;
  @Prop() preCompleteHook?: Hook<CheckoutState>;

  @Watch('authToken')
  @Watch('checkoutId')
  @Watch('disableCreditCard')
  @Watch('disableBankAccount')
  @Watch('disablePaymentMethodGroup')
  propChanged() {
    this.updateStore();
  }

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      this.updateStore();
    }
  }

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Listen('submit-event')
  checkoutComplete(_event: CustomEvent<any>) {
    this.isSubmitting = false;
  }

  @Listen('error-event')
  checkoutError(_event: CustomEvent<any>) {
    console.error('[justifi-checkout] error-event received', _event?.detail);
    this.isSubmitting = false;
  }

  @Listen('checkout-changed')
  checkoutChanged(event: CustomEvent<CheckoutChangedEventDetail>) {
    // if disabled bnpl, remove sezzle from available payment methods
    if (this.disableBnpl) {
      this.availablePaymentMethods = event.detail.availablePaymentMethodTypes.filter((method) => method !== PAYMENT_METHODS.SEZZLE);
      return;
    }
    this.availablePaymentMethods = event.detail.availablePaymentMethodTypes;
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    checkoutStore.billingFormFields = fields;
    this.tokenizePaymentMethodRef?.fillBillingForm(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    const modularValidation = await this.modularCheckoutRef?.validate();
    return { isValid: modularValidation };
  }

  private updateStore() {
    checkoutStore.checkoutId = this.checkoutId;
    checkoutStore.authToken = this.authToken;
    checkoutStore.disableCreditCard = this.disableCreditCard;
    checkoutStore.disableBankAccount = this.disableBankAccount;
    checkoutStore.disablePaymentMethodGroup = this.disablePaymentMethodGroup;
  }

  private async submit(_event) {
    this.isSubmitting = true;
    this.modularCheckoutRef?.submitCheckout(checkoutStore.billingFormFields);
  }

  private get showPaymentTypeHeader() {
    return !this.disableCreditCard && !this.disableBankAccount;
  }

  render() {
    return (
      <StyledHost>
        <justifi-modular-checkout
          ref={(el) => {
            this.modularCheckoutRef = el;
          }}
          authToken={this.authToken}
          checkoutId={this.checkoutId}
          preCompleteHook={this.preCompleteHook}
        >
          <div class="row gy-3 jfi-checkout-core">
            <div class="col-12" part={checkoutSummary}>
              <justifi-header text="Summary" level="h2" class="fs-5 fw-bold pb-3" />
              <section>
                <justifi-checkout-summary />
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
                  <div>
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.APPLE_PAY) && (
                      <div class="mb-3">
                        <justifi-apple-pay />
                      </div>
                    )}
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.GOOGLE_PAY) && (
                      <div class="mb-3">
                        <justifi-google-pay ref={(el) => (this.googlePayRef = el)} />
                      </div>
                    )}
                    <justifi-saved-payment-methods />
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.SEZZLE) && (
                      <justifi-radio-list-item
                        name="paymentMethodType"
                        value={PAYMENT_METHODS.SEZZLE}
                        checked={checkoutStore?.selectedPaymentMethod?.type === PAYMENT_METHODS.SEZZLE}
                        label={
                          <justifi-sezzle-payment-method
                            ref={(el) => (this.sezzlePaymentMethodRef = el)}
                          />
                        }
                        onRadio-click={() => { this.sezzlePaymentMethodRef?.handleSelectionClick(); }}
                      />
                    )}

                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.PLAID) && !this.disableBnpl && (
                      <justifi-radio-list-item
                        name="paymentMethodType"
                        value={PAYMENT_METHODS.PLAID}
                        checked={checkoutStore?.selectedPaymentMethod?.type === PAYMENT_METHODS.PLAID}
                        label={
                          <justifi-plaid-payment-method
                            ref={(el) => (this.plaidPaymentMethodRef = el)}
                          />
                        }
                        onRadio-click={() => { this.plaidPaymentMethodRef?.handleSelectionClick(); }}
                      />
                    )}
                    <internal-tokenize-payment-method
                      ref={(el) => (this.tokenizePaymentMethodRef = el)}
                      authToken={this.authToken}
                      accountId={checkoutStore.accountId}
                      disableCreditCard={this.disableCreditCard}
                      disableBankAccount={this.disableBankAccount}
                      hideCardBillingForm={this.hideCardBillingForm}
                      hideBankAccountBillingForm={this.hideBankAccountBillingForm}
                      hideSubmitButton={true}
                      paymentMethodGroupId={checkoutStore.paymentMethodGroupId}
                    />
                  </div>
                </section>
              </div>
            </div>
            <div class="mt-4">
              <justifi-button
                text="Pay"
                type="submit"
                variant="primary"
                clickHandler={(e) => this.submit(e)}
                disabled={this.isSubmitting}
                isLoading={this.isSubmitting}
                customStyle={{ width: '100%', textAlign: "center" }}
              />
            </div>
          </div>
        </justifi-modular-checkout>
      </StyledHost>
    );
  }
}
