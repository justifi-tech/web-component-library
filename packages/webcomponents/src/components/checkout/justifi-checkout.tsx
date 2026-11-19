import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { ICheckout, ILoadedEventResponse } from '../../api';
import { detectDuplicateVersion } from '../../utils/detect-duplicate-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import { CheckoutState, checkoutStore, onChange } from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { emitPublic } from '../../api/emit-public';
import { StyledHost } from '../../ui-components';
import { CheckoutChangedEventDetail, Hook, PAYMENT_METHODS } from '../modular-checkout/ModularCheckout';

@Component({
  tag: 'justifi-checkout',
})
export class JustifiCheckout {
  analytics: JustifiAnalytics;
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  tokenizePaymentMethodRef?: HTMLJustifiTokenizePaymentMethodElement;
  plaidPaymentMethodRef?: HTMLJustifiPlaidPaymentMethodElement;
  sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  googlePayRef?: HTMLJustifiGooglePayElement;
  @State() availablePaymentMethods: PAYMENT_METHODS[] = [];
  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() serverError: string;

  private hasEmittedLoaded = false;
  private disposeLoadedListener?: () => void;

  @Prop() authToken!: string;
  @Prop() checkoutId!: string;
  @Prop() disableBankAccount?: boolean = false;
  @Prop() disableBnpl?: boolean = false;
  @Prop() disableCreditCard?: boolean = false;
  @Prop() disablePaymentMethodGroup?: boolean = false;
  @Prop() hideBankAccountBillingForm?: boolean = false;
  @Prop() hideCardBillingForm?: boolean = false;
  /** Passed to `justifi-google-pay` as `environment`. Omit to let the child use its default. */
  @Prop() googlePayEnv?: 'TEST' | 'PRODUCTION';
  @Prop() preCompleteHook?: Hook<CheckoutState>;
  /** Renders a "Confirm Account Number" field in the bank account form. */
  @Prop() showAccountNumberConfirmation?: boolean = false;
  /**
   * Mask the card number to its last four digits when the field loses focus,
   * with an eye toggle to reveal it. Defaults to false.
   *
   * Anti-shoulder-surfing only, not a secrecy boundary.
   */
  @Prop() maskCardNumber?: boolean = false;

  @Watch('authToken')
  @Watch('checkoutId')
  @Watch('disableCreditCard')
  @Watch('disableBankAccount')
  @Watch('disablePaymentMethodGroup')
  propChanged() {
    this.updateStore();
  }

  @Event({ eventName: 'justifi-error' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  /** @deprecated Listen for `justifi-error`. Removed in the next major. */
  @Event({ eventName: 'error-event' }) errorEventLegacy: EventEmitter<ComponentErrorEvent>;
  /** Fires once the checkout has loaded, with the checkout's status. */
  @Event({ eventName: 'justifi-checkout-loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;
  /** @deprecated Listen for `justifi-checkout-loaded`. Removed in the next major. */
  @Event({ eventName: 'loaded' }) loadedEventLegacy: EventEmitter<ILoadedEventResponse>;
  @Event({ eventName: 'justifi-submit' }) submitEvent: EventEmitter<ComponentSubmitEvent>;
  /** @deprecated Listen for `justifi-submit`. Removed in the next major. */
  @Event({ eventName: 'submit-event' }) submitEventLegacy: EventEmitter<ComponentSubmitEvent>;

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      this.updateStore();
    }
  }

  componentWillLoad() {
    detectDuplicateVersion();
    this.analytics = new JustifiAnalytics(this);
    this.emitWhenLoaded();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
    this.disposeLoadedListener?.();
  }

  /**
   * The checkout is fetched by the child justifi-modular-checkout, so the
   * store is what tells us it arrived. It may already be loaded by the time
   * this component mounts, hence the two paths.
   */
  private emitWhenLoaded() {
    if (checkoutStore.checkoutLoaded) {
      this.emitLoaded();
      return;
    }
    this.disposeLoadedListener = onChange('checkoutLoaded', (loaded) => {
      if (!loaded || this.hasEmittedLoaded) return;
      this.emitLoaded();
    });
  }

  private emitLoaded() {
    this.hasEmittedLoaded = true;
    emitPublic(this.loadedEvent, this.loadedEventLegacy, {
      checkout_status: checkoutStore.checkoutStatus,
    });
  }

  // the justifi- names only: each public event also fires under its
  // deprecated name, and listening for both would double-handle it
  @Listen('justifi-submit')
  checkoutComplete(_event: CustomEvent<any>) {
    checkoutStore.isSubmitting = false;
  }

  @Listen('justifi-error')
  checkoutError(_event: CustomEvent<any>) {
    checkoutStore.isSubmitting = false;
  }

  @Listen('justifi-checkout-changed')
  checkoutChanged(event: CustomEvent<CheckoutChangedEventDetail>) {
    this.availablePaymentMethods = event.detail.availablePaymentMethodTypes;
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    checkoutStore.billingFormFields = fields;
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
                        <justifi-google-pay
                          ref={(el) => (this.googlePayRef = el)}
                          {...(this.googlePayEnv != null ? { environment: this.googlePayEnv } : {})}
                        />
                      </div>
                    )}
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.PAYPAL) && (
                      <div class="mb-3">
                        <justifi-paypal />
                      </div>
                    )}
                    <justifi-saved-payment-methods />
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.SEZZLE) && !this.disableBnpl && (
                      <justifi-radio-list-item
                        name="paymentMethodType"
                        value={PAYMENT_METHODS.SEZZLE}
                        checked={checkoutStore?.selectedPaymentMethod?.type === PAYMENT_METHODS.SEZZLE}
                        label={
                          <justifi-sezzle-payment-method
                            ref={(el) => (this.sezzlePaymentMethodRef = el)}
                          />
                        }
                        radioClickHandler={() => { this.sezzlePaymentMethodRef?.handleSelectionClick(); }}
                      />
                    )}

                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.PLAID) && (
                      <justifi-radio-list-item
                        name="paymentMethodType"
                        value={PAYMENT_METHODS.PLAID}
                        checked={checkoutStore?.selectedPaymentMethod?.type === PAYMENT_METHODS.PLAID}
                        label={
                          <justifi-plaid-payment-method
                            ref={(el) => (this.plaidPaymentMethodRef = el)}
                          />
                        }
                        radioClickHandler={() => { this.plaidPaymentMethodRef?.handleSelectionClick(); }}
                      />
                    )}
                    <justifi-tokenize-payment-method
                      ref={(el) => (this.tokenizePaymentMethodRef = el)}
                      authToken={this.authToken}
                      accountId={checkoutStore.accountId}
                      disableCreditCard={this.disableCreditCard}
                      disableBankAccount={this.disableBankAccount}
                      hideCardBillingForm={this.hideCardBillingForm}
                      hideBankAccountBillingForm={this.hideBankAccountBillingForm}
                      hideSubmitButton={true}
                      paymentMethodGroupId={checkoutStore.paymentMethodGroupId}
                      showAccountNumberConfirmation={this.showAccountNumberConfirmation}
                      maskCardNumber={this.maskCardNumber}
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
                disabled={checkoutStore.isSubmitting || checkoutStore.isWalletProcessing}
                isLoading={checkoutStore.isSubmitting || checkoutStore.isWalletProcessing}
                customStyle={{ width: '100%', textAlign: "center" }}
              />
            </div>
          </div>
        </justifi-modular-checkout>
      </StyledHost>
    );
  }
}
