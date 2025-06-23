import { Component, h, Prop, State, Event, EventEmitter, Method, Watch, Listen } from '@stencil/core';
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
import { checkoutStore } from '../../store/checkout.store';

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

  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodId: string;
  @State() saveNewPaymentMethodChecked: boolean = false;

  @Prop() accountId?: string;
  @Prop() authToken?: string;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableCreditCard?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideSubmitButton?: boolean;
  @Prop() paymentMethodGroupId: string;
  @Prop() submitButtonText: string = 'Submit';

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.validateRequiredProps();
  }

  connectedCallback() {
    this.setDefaultSelectedPaymentMethod();
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Watch('disableCreditCard')
  @Watch('disableBankAccount')
  paymentMethodsChanged() {
    this.setDefaultSelectedPaymentMethod();
  }



  @Listen('radio-click')
  handleRadioClick(event: CustomEvent<string>) {
    this.selectedPaymentMethodId = event.detail;
  }

  @Listen('checkboxChanged')
  handleCheckboxChanged(event: CustomEvent<boolean>) {
    this.saveNewPaymentMethodChecked = event.detail;
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.billingFormRef?.fill(fields);
  }

  @Method()
  async tokenizePaymentMethod(event?: CustomEvent): Promise<PaymentMethodPayload> {
    event?.preventDefault();
    this.isLoading = true;

    try {
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
      const errorResponse = this.createErrorResponse(ComponentErrorCodes.TOKENIZE_ERROR, error.message);
      this.emitError({
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: error.message,
      });
      this.submitEvent.emit({ response: errorResponse });
      return errorResponse;
    } finally {
      this.isLoading = false;
    }
  }

  @Method()
  async validate(): Promise<ValidationResult> {
    if (!this.areFormsReady()) {
      return { isValid: false, errors: { general: ERROR_MESSAGES.FORM_NOT_READY } };
    }

    const [billingValidation, paymentMethodValidation] = await Promise.all([
      this.billingFormRef.validate(),
      this.paymentMethodFormRef.validate(),
    ]);

    return {
      isValid: billingValidation.isValid && paymentMethodValidation.isValid,
      errors: { ...billingValidation.errors, ...paymentMethodValidation.errors },
    };
  }

  private validateRequiredProps() {
    if (!this.authToken) {
      if (!checkoutStore.authToken) {
        this.emitError({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: ERROR_MESSAGES.AUTH_TOKEN_REQUIRED,
        });
      } else {
        this.authToken = checkoutStore.authToken;
      }
    }

    if (!this.accountId) {
      if (!checkoutStore.accountId) {
        this.emitError({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: ERROR_MESSAGES.ACCOUNT_ID_REQUIRED,
        });
      } else {
        this.accountId = checkoutStore.accountId;
      }
    }
  }

  private setDefaultSelectedPaymentMethod() {
    if (!this.selectedPaymentMethodId) {
      if (!this.disableCreditCard) {
        this.selectedPaymentMethodId = PaymentMethodTypes.card;
      } else if (!this.disableBankAccount) {
        this.selectedPaymentMethodId = PaymentMethodTypes.bankAccount;
      }
    }
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

      return await this.performTokenization();
    } catch (error) {
      return { error };
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

  private async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const config: TokenizeConfig = {
        clientId: this.authToken,
        paymentMethodMetadata: this.buildPaymentMethodMetadata(billingFormFieldValues),
        account: this.accountId,
      };

      return await this.paymentMethodFormRef.tokenize(config);
    } catch (error) {
      return error;
    }
  }

  private buildPaymentMethodMetadata(billingFormFieldValues: any) {
    return this.saveNewPaymentMethodChecked
      ? { ...billingFormFieldValues, payment_method_group_id: this.paymentMethodGroupId }
      : { ...billingFormFieldValues };
  }

  private get shouldHideRadioInput(): boolean {
    const showCard = !this.disableCreditCard;
    const showAch = !this.disableBankAccount;
    return !showAch || !showCard;
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
        <justifi-billing-form
          ref={(el) => (this.billingFormRef = el)}
          hideCardBillingForm={this.hideCardBillingForm}
          hideBankAccountBillingForm={this.hideBankAccountBillingForm}
          paymentMethodType={paymentMethodId}
        />
        <justifi-save-new-payment-method hidden={!this.paymentMethodGroupId} />
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
                  clickHandler={() => this.tokenizePaymentMethod()}
                  isLoading={this.isLoading}
                  data-testid="submit-button"
                  hidden={this.hideSubmitButton}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}

