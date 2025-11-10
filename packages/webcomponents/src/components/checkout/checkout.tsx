import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { ComponentErrorCodes, ComponentErrorSeverity, ICheckout, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import { checkoutStore } from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { StyledHost } from '../../ui-components';
import { CheckoutChangedEventDetail, PAYMENT_METHODS, SelectedPaymentMethod } from '../modular-checkout/ModularCheckout';
import { PaymentMethodPayload } from './payment-method-payload';
import { ERROR_MESSAGES, PAYMENT_METHOD_TYPE_LABELS } from './message-event-types';

@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  analytics: JustifiAnalytics;
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  tokenizePaymentMethodRef?: HTMLJustifiTokenizePaymentMethodElement;
  plaidPaymentMethodRef?: HTMLJustifiPlaidPaymentMethodElement;
  sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  @State() availablePaymentMethods: PAYMENT_METHODS[] = [];
  @State() selectedPaymentMethod?: PAYMENT_METHODS;
  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() isSubmitting: boolean = false; // This is used to prevent multiple submissions and is different from loading state
  @State() isLoading: boolean = false;
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
  @Watch('disablePaymentMethodGroup')
  propChanged() {
    this.updateStore();
    this.setDefaultSelectedPaymentMethod();
  }

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      this.updateStore();
        this.setDefaultSelectedPaymentMethod();
        this.setComputedHideSubmitButton();
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


  private renderSelectedPaymentMethodForm(paymentMethodType: string) {
    return (
      <div class="mt-4 pb-4">
        {this.renderPaymentMethodForm(paymentMethodType)}
        <div class="mt-4">
          <justifi-billing-form
            ref={(el) => (this.billingFormRef = el)}
            hideCardBillingForm={this.hideCardBillingForm}
            hideBankAccountBillingForm={this.hideBankAccountBillingForm}
            paymentMethodType={paymentMethodType}
          />
        </div>
        <div class="mt-4">
          <justifi-save-new-payment-method hidden={!checkoutStore.paymentMethodGroupId} label={checkoutStore.savePaymentMethodLabel} />
        </div>
      </div>
    );
  }

  private renderPaymentMethodForm(paymentMethodType: string) {
    return paymentMethodType === PAYMENT_METHODS.NEW_CARD ? (
      <justifi-card-form ref={(el) => (this.paymentMethodFormRef = el)} />
    ) : (
      <justifi-bank-account-form ref={(el) => (this.paymentMethodFormRef = el)} />
    );
  }

  private get shouldHideRadioInput(): boolean {
    return this.disableCreditCard || this.disableBankAccount;
  }

  private renderPaymentMethodOption(paymentMethodType: PAYMENT_METHODS) {
    const isSelected = this.selectedPaymentMethod === paymentMethodType && (checkoutStore.selectedPaymentMethod as SelectedPaymentMethod).id === undefined;

    return (
      <div class="payment-method">
        <justifi-radio-list-item
          name="paymentMethodType"
          value={paymentMethodType}
          checked={isSelected}
          label={PAYMENT_METHOD_TYPE_LABELS[paymentMethodType]}
          hidden={this.shouldHideRadioInput}
        />
        {isSelected && this.renderSelectedPaymentMethodForm(paymentMethodType)}
      </div>
    );
  }


  private setComputedHideSubmitButton() {
    // If hideSubmitButton prop is explicitly set, use that value
    if (this.hideSubmitButton !== undefined) {
      this.computedHideSubmitButton = this.hideSubmitButton;
      return;
    }

    // Otherwise, auto-detect if component is slotted within modular-checkout
    const isWithinModularCheckout = this.isSlottedWithinModularCheckout();
    this.computedHideSubmitButton = isWithinModularCheckout;
  }

  private isSlottedWithinModularCheckout(): boolean {
    let parent: Element | null = this.host?.parentElement;

    while (parent) {
      if (parent.tagName === 'JUSTIFI-MODULAR-CHECKOUT') {
        return true;
      }
      parent = parent.parentElement;
    }

    return false;
  }

  private setDefaultSelectedPaymentMethod() {
    if (this.selectedPaymentMethod) {
      return;
    }

    if (!this.disableCreditCard) {
      this.selectedPaymentMethod = PAYMENT_METHODS.NEW_CARD;
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };
    } else if (!this.disableBankAccount) {
      this.selectedPaymentMethod = PAYMENT_METHODS.NEW_BANK_ACCOUNT;
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT };
    }
  }

  private validateRequiredProps() {
    if (!checkoutStore.authToken) {
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: ERROR_MESSAGES.AUTH_TOKEN_REQUIRED,
      });
    }

    if (!checkoutStore.accountId) {
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: ERROR_MESSAGES.ACCOUNT_ID_REQUIRED,
      });
    }
  }

  private areFormsReady(): boolean {
    return !!(this.billingFormRef && this.paymentMethodFormRef);
  }

  private emitError(errorData: { errorCode: ComponentErrorCodes; message: string }) {
    this.errorEvent.emit({
      ...errorData,
      severity: ComponentErrorSeverity.ERROR,
    });
  }

  private createErrorResponse(code: ComponentErrorCodes, message: string): PaymentMethodPayload {
    return {
      error: {
        code: code,
        message,
        decline_code: undefined,
      },
    };
  }

  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!this.areFormsReady()) {
      return this.createErrorResponse('form_not_ready' as ComponentErrorCodes, ERROR_MESSAGES.FORM_NOT_READY);
    }

    try {
      const validation = await this.validate();

      if (!validation.isValid || !insuranceValidation.isValid) {
        const errorMessage = Object.values(validation.errors)[0] || ERROR_MESSAGES.VALIDATION_ERROR;
        return {
          validationError: true,
          error: {
            code: 'validation_error',
            message: String(errorMessage),
            decline_code: undefined,
          },
        };
      }

      const result = await this.performTokenization();
      return result;
    } catch (error) {
      return { error } as any;
    }
  }

  @Method()
  async tokenizePaymentMethod(event?: MouseEvent): Promise<PaymentMethodPayload> {
    event?.preventDefault();
    this.validateRequiredProps();
    this.isLoading = true;

    try {
      const validation = await this.validate();
      if (!validation.isValid) {
        this.errorEvent.emit({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
        });

        this.isLoading = false;
        return;
      }

      const tokenizeResponse = await this.resolvePaymentMethod({ isValid: true });

      if (tokenizeResponse.error) {
        this.emitError({
          errorCode: tokenizeResponse.error.code as ComponentErrorCodes,
          message: tokenizeResponse.error.message,
        });
      }

      this.submitEvent.emit({ response: tokenizeResponse });
      return tokenizeResponse;
    } catch (error) {
      const errorResponse = this.createErrorResponse(ComponentErrorCodes.TOKENIZE_ERROR, error.message as string);
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: (error as any).message,
      });
      this.submitEvent.emit({ response: errorResponse });
      return errorResponse;
    } finally {
      this.isLoading = false;
    }
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
                    {this.availablePaymentMethods.includes(PAYMENT_METHODS.APPLE_PAY) && (
                      <div class="mb-3">
                        <justifi-apple-pay />
                      </div>
                    )}
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
                    <form>
                      <fieldset>
                        <div class="row gy-3">
                          <div class="col-12">
                            {this.availablePaymentMethods.map((method: PAYMENT_METHODS) => this.renderPaymentMethodOption(method))}
                          </div>
                          <div class="col-12">
                            <justifi-button
                              text="Submit"
                              variant="primary"
                              type="submit"
                              clickHandler={(e) => this.tokenizePaymentMethod(e)}
                              isLoading={this.isLoading}
                              data-testid="submit-button"
                              hidden={this.computedHideSubmitButton}
                            />
                          </div>
                        </div>
                      </fieldset>
                    </form>
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
