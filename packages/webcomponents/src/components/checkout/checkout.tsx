import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { ICheckout, ILoadedEventResponse, PaymentMethodTypes } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import { checkoutStore } from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { StyledHost } from '../../ui-components';
import { CheckoutChangedEventDetail, PAYMENT_METHODS } from '../modular-checkout/ModularCheckout';

@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  analytics: JustifiAnalytics;
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  tokenizePaymentMethodRef?: HTMLJustifiTokenizePaymentMethodElement;
  plaidPaymentMethodRef?: HTMLJustifiPlaidPaymentMethodElement;
  sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  @State() availablePaymentMethods: PAYMENT_METHODS[] = [];
  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() isSubmitting: boolean = false; // This is used to prevent multiple submissions and is different from loading state
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
    this.isSubmitting = false;
  }

  @Listen('checkout-changed')
  checkoutChanged(event: CustomEvent<CheckoutChangedEventDetail>) {
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
    checkoutStore.disableBnpl = this.disableBnpl;
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
                    <justifi-saved-payment-methods />
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.SEZZLE) && (
                      <justifi-radio-list-item
                        name="paymentMethodType"
                        value={PAYMENT_METHODS.SEZZLE}
                        checked={checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.sezzle}
                        label={
                          <justifi-sezzle-payment-method
                            ref={(el) => (this.sezzlePaymentMethodRef = el)}
                          />
                        }
                        onRadio-click={() => { this.sezzlePaymentMethodRef?.handleSelectionClick(); }}
                      />
                    )}

                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.PLAID) && (
                      <justifi-radio-list-item
                        name="paymentMethodType"
                        value={PAYMENT_METHODS.PLAID}
                        checked={checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.plaid}
                        label={
                          <justifi-plaid-payment-method
                            ref={(el) => (this.plaidPaymentMethodRef = el)}
                          />
                        }
                        onRadio-click={() => { this.plaidPaymentMethodRef?.handleSelectionClick(); }}
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
