import { Component, h, Prop, State, Event, EventEmitter, Method, Watch, Listen, Element } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from '../../components';
import { PaymentMethodPayload } from '../checkout/payment-method-payload';
import { PaymentMethodTypes } from '../../api/Payment';
import {
  ComponentSubmitEvent,
  ComponentErrorEvent,
  ComponentErrorCodes,
  ComponentErrorSeverity
} from '../../api';
import { checkoutStore, onChange } from '../../store/checkout.store';

// Constants
const PAYMENT_METHOD_TYPE_LABELS = {
  [PaymentMethodTypes.bankAccount]: 'New bank account',
  [PaymentMethodTypes.card]: 'New credit or debit card',
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
  tag: 'justifi-tokenize-payment-method',
})
export class TokenizePaymentMethod {
  analytics: JustifiAnalytics;
  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;

  @Element() host: HTMLElement;

  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodId?: string;
  @State() computedHideSubmitButton: boolean = false;

  @Prop() accountId?: string;
  @Prop() authToken?: string;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableCreditCard?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideSubmitButton?: boolean;
  @Prop() paymentMethodGroupId?: string;
  @Prop() submitButtonText?: string = 'Submit';

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    console.debug('[TokenizePaymentMethod] componentWillLoad: analytics initialized');
  }

  connectedCallback() {
    console.debug('[TokenizePaymentMethod] connectedCallback');
    this.setDefaultSelectedPaymentMethod();
    this.setComputedHideSubmitButton();
    // Sync initial state with store and subscribe to future changes
    this.syncWithStore();
    this.unsubscribeFromStore = onChange('selectedPaymentMethod', this.syncWithStore);
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
    console.debug('[TokenizePaymentMethod] disconnectedCallback: analytics cleaned up');
    if (this.unsubscribeFromStore) {
      this.unsubscribeFromStore();
    }
  }

  @Watch('disableCreditCard')
  @Watch('disableBankAccount')
  paymentMethodsChanged() {
    this.setDefaultSelectedPaymentMethod();
  }

  @Listen('radio-click')
  handleRadioClick(event: CustomEvent<string>) {
    console.debug('[TokenizePaymentMethod] radio-click', { selected: event.detail });
    this.selectedPaymentMethodId = event.detail;
  }


  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    console.debug('[TokenizePaymentMethod] fillBillingForm', { providedFieldKeys: Object.keys(fields || {}) });
    this.billingFormRef?.fill(fields);
  }

  @Method()
  async tokenizePaymentMethod(event?: MouseEvent): Promise<PaymentMethodPayload> {
    event?.preventDefault();
    console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: start');
    const selectedPaymentMethod = checkoutStore.selectedPaymentMethod;
    console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: selectedPaymentMethod from store', {
      selectedPaymentMethod,
    });
    console.log('[TokenizePaymentMethod] selectedPaymentMethod =', selectedPaymentMethod);

    // Short-circuit for Plaid: skip validation/tokenization and return stored token
    if (selectedPaymentMethod === 'plaid') {
      const plaidToken = checkoutStore.paymentToken;
      console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: plaid selected; skipping validation/tokenization', {
        hasPlaidToken: !!plaidToken,
      });
      console.log('[TokenizePaymentMethod] plaid path: has token =', !!plaidToken);

      if (!plaidToken) {
        console.error('[TokenizePaymentMethod] tokenizePaymentMethod: plaid selected but payment token is missing');
        const errorResponse = this.createErrorResponse(
          ComponentErrorCodes.TOKENIZE_ERROR,
          'Missing payment token for plaid'
        );
        this.emitError({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: 'Missing payment token for plaid',
        });
        this.submitEvent.emit({ response: errorResponse });
        return errorResponse;
      }

      const response: PaymentMethodPayload = { token: plaidToken };
      this.submitEvent.emit({ response });
      console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: plaid response emitted');
      console.log('[TokenizePaymentMethod] plaid response emitted with token');
      return response;
    }

    this.validateRequiredProps();
    this.isLoading = true;

    try {
      const validation = await this.validate();
      console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: validation result', validation);
      if (!validation.isValid) {
        console.error('[TokenizePaymentMethod] tokenizePaymentMethod: validation error', {
          validation,
        });
        this.errorEvent.emit({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: ERROR_MESSAGES.VALIDATION_ERROR,
        });

        this.isLoading = false;
        return;
      }

      const tokenizeResponse = await this.resolvePaymentMethod({ isValid: true });
      console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: resolvePaymentMethod result', {
        hasError: !!tokenizeResponse?.error,
        hasToken: !!tokenizeResponse?.token,
      });

      if (tokenizeResponse.error) {
        console.error('[TokenizePaymentMethod] tokenizePaymentMethod: error', {
          code: tokenizeResponse.error.code,
          message: tokenizeResponse.error.message,
          decline_code: tokenizeResponse.error.decline_code,
        });
        this.emitError({
          errorCode: tokenizeResponse.error.code as ComponentErrorCodes,
          message: tokenizeResponse.error.message,
        });
      }

      this.submitEvent.emit({ response: tokenizeResponse });
      return tokenizeResponse;
    } catch (error) {
      console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: exception', { message: error.message });
      const errorResponse = this.createErrorResponse(ComponentErrorCodes.TOKENIZE_ERROR, error.message);
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: error.message,
      });
      this.submitEvent.emit({ response: errorResponse });
      return errorResponse;
    } finally {
      console.debug('[TokenizePaymentMethod] tokenizePaymentMethod: end');
      this.isLoading = false;
    }
  }

  @Method()
  async validate(): Promise<ValidationResult> {
    if (!this.areFormsReady()) {
      console.debug('[TokenizePaymentMethod] validate: forms not ready');
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
    console.debug('[TokenizePaymentMethod] validate: result', result);
    return result;
  }

  private validateRequiredProps() {
    if (!this.authToken && !checkoutStore.authToken) {
      console.debug('[TokenizePaymentMethod] validateRequiredProps: missing auth token');
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: ERROR_MESSAGES.AUTH_TOKEN_REQUIRED,
      });
    }

    if (!this.accountId && !checkoutStore.accountId) {
      console.debug('[TokenizePaymentMethod] validateRequiredProps: missing account id');
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: ERROR_MESSAGES.ACCOUNT_ID_REQUIRED,
      });
    }
  }

  private setDefaultSelectedPaymentMethod() {
    console.debug('[TokenizePaymentMethod] setDefaultSelectedPaymentMethod');
    if (this.selectedPaymentMethodId) {
      return;
    }

    if (!this.disableCreditCard) {
      this.selectedPaymentMethodId = PaymentMethodTypes.card;
    } else if (!this.disableBankAccount) {
      this.selectedPaymentMethodId = PaymentMethodTypes.bankAccount;
    }
  }

  // Keep the component selection in sync with the global checkout store
  private unsubscribeFromStore?: () => void;
  private syncWithStore = () => {
    console.debug('[TokenizePaymentMethod] syncWithStore', { selectedPaymentMethod: checkoutStore.selectedPaymentMethod });
    const selection = checkoutStore.selectedPaymentMethod;
    if (selection === PaymentMethodTypes.card || selection === PaymentMethodTypes.bankAccount) {
      this.selectedPaymentMethodId = selection;
    } else {
      // If selection is not card or bank account, clear local selection so forms are hidden
      this.selectedPaymentMethodId = undefined;
    }
  };

  private setComputedHideSubmitButton() {
    console.debug('[TokenizePaymentMethod] setComputedHideSubmitButton');
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

  private get availablePaymentMethods(): PaymentMethodTypes[] {
    const methods: PaymentMethodTypes[] = [];
    if (!this.disableCreditCard) {
      methods.push(PaymentMethodTypes.card);
    }
    if (!this.disableBankAccount) {
      methods.push(PaymentMethodTypes.bankAccount);
    }
    return methods;
  }

  private areFormsReady(): boolean {
    return !!(this.billingFormRef && this.paymentMethodFormRef);
  }

  private emitError(errorData: { errorCode: ComponentErrorCodes; message: string }) {
    console.error('[TokenizePaymentMethod] emitError', {
      ...errorData,
      selectedPaymentMethodId: this.selectedPaymentMethodId,
      hasBillingFormRef: !!this.billingFormRef,
      hasPaymentMethodFormRef: !!this.paymentMethodFormRef,
    });
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
    console.debug('[TokenizePaymentMethod] resolvePaymentMethod: start', { insuranceValidation });
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
      console.debug('[TokenizePaymentMethod] resolvePaymentMethod: performTokenization result', {
        hasError: !!result?.error,
        hasToken: !!result?.token,
      });
      return result;
    } catch (error) {
      console.debug('[TokenizePaymentMethod] resolvePaymentMethod: exception', { message: error.message });
      return { error };
    }
  }

  private async performTokenization(): Promise<PaymentMethodPayload> {
    console.debug('[TokenizePaymentMethod] performTokenization: start');
    const tokenizeResponse = await this.tokenize();

    if (tokenizeResponse.error) {
      console.error('[TokenizePaymentMethod] performTokenization: error', {
        code: tokenizeResponse.error?.code,
        message: tokenizeResponse.error?.message,
        decline_code: tokenizeResponse.error?.decline_code,
      });
      return { error: tokenizeResponse.error };
    }

    const tokenizeResponseData = tokenizeResponse.data;
    return {
      token: tokenizeResponseData.card?.token || tokenizeResponseData.bank_account?.token,
      data: tokenizeResponseData,
    };
  }

  private async tokenize() {
    try {
      console.debug('[TokenizePaymentMethod] tokenize: building config');
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const config: TokenizeConfig = {
        clientId: this.authToken || checkoutStore.authToken,
        account: this.accountId || checkoutStore.accountId,
        paymentMethodMetadata: this.buildPaymentMethodMetadata(billingFormFieldValues),
      };

      console.debug('[TokenizePaymentMethod] tokenize: calling paymentMethodFormRef.tokenize', {
        hasClientId: !!config.clientId,
        hasAccount: !!config.account,
        hasPaymentMethodMetadata: !!config.paymentMethodMetadata,
      });
      return await this.paymentMethodFormRef.tokenize(config);
    } catch (error) {
      console.error('[TokenizePaymentMethod] tokenize: exception', {
        message: error?.message || String(error),
      });
      return error;
    }
  }

  private buildPaymentMethodMetadata(billingFormFieldValues: any) {
    return this.shouldSavePaymentMethod
      ? { ...billingFormFieldValues, payment_method_group_id: this.paymentMethodGroupID }
      : { ...billingFormFieldValues };
  }

  private get paymentMethodGroupID(): string | undefined {
    return this.paymentMethodGroupId || checkoutStore.paymentMethodGroupId;
  }

  private get shouldSavePaymentMethod(): boolean {
    return !!(this.paymentMethodGroupId || checkoutStore.savePaymentMethod);
  }

  private get shouldHideRadioInput(): boolean {
    return this.disableCreditCard || this.disableBankAccount;
  }

  private renderPaymentMethodOption(paymentMethodType: PaymentMethodTypes) {
    const isSelected = this.selectedPaymentMethodId === paymentMethodType;

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

  private renderSelectedPaymentMethodForm(paymentMethodId: string) {
    return (
      <div class="mt-4 pb-4">
        {this.renderPaymentMethodForm(paymentMethodId)}
        <div class="mt-4">
          <justifi-billing-form
            ref={(el) => (this.billingFormRef = el)}
            hideCardBillingForm={this.hideCardBillingForm}
            hideBankAccountBillingForm={this.hideBankAccountBillingForm}
            paymentMethodType={paymentMethodId}
          />
        </div>
        <div class="mt-4">
          <justifi-save-new-payment-method hidden={!this.paymentMethodGroupID} />
        </div>
      </div>
    );
  }

  private renderPaymentMethodForm(paymentMethodId: string) {
    return paymentMethodId === PaymentMethodTypes.card ? (
      <justifi-card-form ref={(el) => (this.paymentMethodFormRef = el)} />
    ) : (
      <justifi-bank-account-form ref={(el) => (this.paymentMethodFormRef = el)} />
    );
  }

  render() {
    return (
      <StyledHost>
        <form>
          <fieldset>
            <div class="row gy-3">
              <div class="col-12">
                {this.availablePaymentMethods.map((method) => this.renderPaymentMethodOption(method))}
              </div>
              <div class="col-12">
                <justifi-button
                  text={this.submitButtonText}
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
      </StyledHost>
    );
  }
}

