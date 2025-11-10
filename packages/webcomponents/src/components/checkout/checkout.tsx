import { Component, Prop, h, State, Watch, Event, EventEmitter, Method, Listen } from '@stencil/core';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from './billing-form/billing-form-schema';
import { ICheckout, ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent, ComponentSubmitEvent } from '../../api/ComponentEvents';
import { ComponentErrorCodes } from '../../api/ComponentError';
import { CheckoutState, checkoutStore } from '../../store/checkout.store';
import { checkoutSummary } from '../../styles/parts';
import { StyledHost } from '../../ui-components';
import { CheckoutChangedEventDetail, Hook, PAYMENT_METHODS, SelectedPaymentMethod } from '../modular-checkout/ModularCheckout';
import { PaymentMethodPayload } from './payment-method-payload';

// Constants
const PAYMENT_METHOD_TYPE_LABELS = {
  [PAYMENT_METHODS.NEW_BANK_ACCOUNT]: 'New bank account',
  [PAYMENT_METHODS.NEW_CARD]: 'New credit or debit card',
} as const;

const ERROR_MESSAGES = {
  AUTH_TOKEN_REQUIRED: 'Auth token is required when using the tokenize-payment-method component not slotted in justifi-modular-checkout',
  ACCOUNT_ID_REQUIRED: 'Account ID is required when using the tokenize-payment-method component not slotted in justifi-modular-checkout',
  FORM_NOT_READY: 'Payment form not ready',
  VALIDATION_ERROR: 'Validation error',
} as const;

// Types
interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, any>;
}

interface TokenizeConfig {
  clientId: string;
  paymentMethodMetadata: any;
  account: string;
}
@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  analytics: JustifiAnalytics;
  modularCheckoutRef?: HTMLJustifiModularCheckoutElement;
  plaidPaymentMethodRef?: HTMLJustifiPlaidPaymentMethodElement;
  sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  @State() availablePaymentMethods: PAYMENT_METHODS[] = [];
  @State() checkout: ICheckout;
  @State() complete: Function;
  @State() errorMessage: string = '';
  @State() insuranceToggled: boolean = false;
  @State() isSubmitting: boolean = false; // This is used to prevent multiple submissions and is different from loading state
  @State() serverError: string;
  @State() selectedPaymentMethod?: PAYMENT_METHODS;

  @Prop() authToken: string;
  @Prop() checkoutId: string;
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
    if (this.disableCreditCard || this.disableBankAccount) {
      this.setDefaultSelectedPaymentMethod();
    }
  }

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  connectedCallback() {
    if (this.authToken && this.checkoutId) {
      this.updateStore();
    }
    this.setDefaultSelectedPaymentMethod();
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

  @Listen('radio-click')
  handleRadioClick(event: CustomEvent<string>) {
    const paymentMethodType = event.detail as PAYMENT_METHODS;
    if (paymentMethodType === PAYMENT_METHODS.NEW_CARD || paymentMethodType === PAYMENT_METHODS.NEW_BANK_ACCOUNT) {
      this.selectedPaymentMethod = paymentMethodType;
      checkoutStore.selectedPaymentMethod = { type: paymentMethodType };
    }
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    checkoutStore.billingFormFields = fields;
    this.billingFormRef?.fill(fields);
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

  private get availableNewPaymentMethods(): PAYMENT_METHODS[] {
    const methods: PAYMENT_METHODS[] = [];
    if (!this.disableCreditCard) {
      methods.push(PAYMENT_METHODS.NEW_CARD);
    }
    if (!this.disableBankAccount) {
      methods.push(PAYMENT_METHODS.NEW_BANK_ACCOUNT);
    }
    return methods;
  }

  private get shouldHideRadioInput(): boolean {
    return this.disableCreditCard || this.disableBankAccount;
  }

  private get paymentMethodGroupID(): string | undefined {
    return checkoutStore.paymentMethodGroupId;
  }

  private get shouldSavePaymentMethod(): boolean {
    return !!checkoutStore.savePaymentMethod;
  }

  private areFormsReady(): boolean {
    return !!(this.billingFormRef && this.paymentMethodFormRef);
  }

  private buildPaymentMethodMetadata(billingFormFieldValues: any) {
    return this.shouldSavePaymentMethod
      ? { ...billingFormFieldValues, payment_method_group_id: this.paymentMethodGroupID }
      : { ...billingFormFieldValues };
  }

  private async tokenize(): Promise<any> {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const config: TokenizeConfig = {
        clientId: this.authToken || checkoutStore.authToken,
        account: checkoutStore.accountId,
        paymentMethodMetadata: this.buildPaymentMethodMetadata(billingFormFieldValues),
      };
      return await this.paymentMethodFormRef.tokenize(config);
    } catch (error) {
      return error as any;
    }
  }

  private async performTokenization(): Promise<PaymentMethodPayload> {
    const tokenizeResponse = await this.tokenize();

    if (tokenizeResponse.error) {
      return { error: tokenizeResponse.error };
    }

    const tokenizeResponseData = tokenizeResponse.data;
    return {
      token: tokenizeResponseData.card?.token || tokenizeResponseData.bank_account?.token,
      data: tokenizeResponseData,
    };
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
      const validation = await this.validatePaymentMethod();

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

  private async validatePaymentMethod(): Promise<ValidationResult> {
    if (!this.areFormsReady()) {
      return { isValid: false, errors: { general: ERROR_MESSAGES.FORM_NOT_READY } };
    }

    const [billingValidation, paymentMethodValidation] = await Promise.all([
      this.billingFormRef.validate(),
      this.paymentMethodFormRef.validate(),
    ]);

    const result = {
      isValid: billingValidation.isValid && paymentMethodValidation.isValid,
      errors: { ...billingValidation.errors, ...paymentMethodValidation.errors },
    };
    return result;
  }

  private renderPaymentMethodOption(paymentMethodType: PAYMENT_METHODS) {
    const isSelected = this.selectedPaymentMethod === paymentMethodType && (checkoutStore.selectedPaymentMethod as SelectedPaymentMethod)?.id === undefined;

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
          <justifi-save-new-payment-method hidden={!this.paymentMethodGroupID} />
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
                    {this.availableNewPaymentMethods.map((method: PAYMENT_METHODS) => this.renderPaymentMethodOption(method))}
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
