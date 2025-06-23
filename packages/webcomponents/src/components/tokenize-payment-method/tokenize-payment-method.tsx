import { Component, h, Prop, State, Event, EventEmitter, Method, Watch, Listen } from '@stencil/core';
import { StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from '../../components';
import { PaymentMethodPayload } from '../checkout/payment-method-payload';
import { PaymentMethodTypes } from '../../api/Payment';
import { PaymentMethodOption } from '../checkout/payment-method-option-utils';
import {
  ComponentSubmitEvent,
  ComponentErrorEvent,
  ComponentErrorCodes,
  ComponentErrorSeverity
} from '../../api';
import { checkoutStore } from '../../store/checkout.store';

const PaymentMethodTypeLabels = {
  bankAccount: 'New bank account',
  card: 'New credit or debit card',
};

@Component({
  tag: 'justifi-tokenize-payment-method',
})
export class TokenizePaymentMethod {
  analytics: JustifiAnalytics;
  private billingFormRef?: HTMLJustifiBillingFormElement;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;

  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodId: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];
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

    if (!this.authToken) {
      this.authToken = checkoutStore.authToken;
    }

    if (!this.accountId) {
      this.accountId = checkoutStore.accountId;
    }
  }

  connectedCallback() {
    this.paymentMethodsChanged();
  }

  @Watch('disableCreditCard')
  @Watch('disableBankAccount')
  paymentMethodsChanged() {
    const showCard = !this.disableCreditCard;
    const showAch = !this.disableBankAccount;

    // Reset payment method options
    this.paymentMethodOptions = [];

    // Add new payment method options based on what's enabled
    if (showCard) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.card }));
    }
    if (showAch) {
      this.paymentMethodOptions.push(new PaymentMethodOption({ id: PaymentMethodTypes.bankAccount }));
    }

    // Set the first available option as selected
    if (!this.selectedPaymentMethodId && this.paymentMethodOptions.length > 0) {
      this.selectedPaymentMethodId = this.paymentMethodOptions[0]?.id;
    }
  }

  @Listen('paymentMethodOptionSelected')
  paymentMethodOptionSelected(event: CustomEvent<PaymentMethodOption>) {
    this.selectedPaymentMethodId = event.detail.id;
  }

  @Listen('radio-click')
  handleRadioClick(event: CustomEvent<string>) {
    this.selectedPaymentMethodId = event.detail;
  }

  @Listen('checkboxChanged')
  handleCheckboxChanged(event: CustomEvent<boolean>) {
    this.saveNewPaymentMethodChecked = event.detail;
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    if (this.billingFormRef) {
      this.billingFormRef.fill(fields);
    }
  }

  @Method()
  async tokenizePaymentMethod(event?: CustomEvent): Promise<PaymentMethodPayload> {
    event && event.preventDefault();
    this.isLoading = true;

    let tokenizeResponse: PaymentMethodPayload;
    try {
      tokenizeResponse = await this.resolvePaymentMethod({ isValid: true });
      if (tokenizeResponse.error) {
        this.errorEvent.emit({
          errorCode: (tokenizeResponse.error.code as ComponentErrorCodes),
          message: tokenizeResponse.error.message,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const errorData = {
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
      };
      this.errorEvent.emit(errorData);
    } finally {
      this.submitEvent.emit({ response: tokenizeResponse });
      this.isLoading = false;
      return tokenizeResponse;
    }
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors?: any }> {
    if (!this.billingFormRef || !this.paymentMethodFormRef) {
      return { isValid: false, errors: { general: 'Form not ready' } };
    }

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();

    const isValid = billingFormValidation.isValid && paymentMethodFormValidation.isValid;
    const errors = {
      ...billingFormValidation.errors,
      ...paymentMethodFormValidation.errors,
    };
    return { isValid, errors };
  }

  async resolvePaymentMethod(insuranceValidation: any): Promise<PaymentMethodPayload> {
    if (!this.paymentMethodFormRef || !this.billingFormRef) {
      return {
        error: {
          code: 'form_not_ready',
          message: 'Payment form not ready',
          decline_code: undefined
        }
      };
    }

    try {
      const { isValid, errors } = await this.validate();

      if (!isValid || !insuranceValidation.isValid) {
        // get property value from first property in errors object
        const message = `${Object.values(errors)[0] || 'Validation error'}`;

        return {
          validationError: true,
          error: {
            code: 'validation_error',
            message,
            decline_code: undefined
          }
        };
      }

      const tokenizeResponse = await this.tokenize();

      if (tokenizeResponse.error) {
        return { error: tokenizeResponse.error };
      } else {
        const tokenizeResponseData = tokenizeResponse.data;
        return {
          token: tokenizeResponseData.card?.token || tokenizeResponseData.bank_account?.token,
          data: tokenizeResponseData
        };
      }
    } catch (error) {
      return { error };
    }
  }

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      let paymentMethodData;
      if (this.saveNewPaymentMethodChecked) {
        paymentMethodData = { ...billingFormFieldValues, payment_method_group_id: this.paymentMethodGroupId };
      } else {
        paymentMethodData = { ...billingFormFieldValues };
      }
      const clientId = this.authToken;
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize({
        clientId,
        paymentMethodMetadata: paymentMethodData,
        account: this.accountId
      });
      return tokenizeResponse;
    } catch (error) {
      return error;
    }
  }



  showNewPaymentMethodForm() {
    const paymentMethodType = this.selectedPaymentMethodId;
    return (
      <div class="mt-4 pb-4">
        <hidden-input />
        {paymentMethodType === 'card' ? (
          <justifi-card-form ref={(el) => this.paymentMethodFormRef = el} />
        ) : (
          <justifi-bank-account-form ref={(el) => this.paymentMethodFormRef = el} />
        )}
        <justifi-billing-form
          ref={(el) => (this.billingFormRef = el)}
          hideCardBillingForm={this.hideCardBillingForm}
          hideBankAccountBillingForm={this.hideBankAccountBillingForm}
          paymentMethodType={paymentMethodType}
        />
        <justifi-save-new-payment-method hidden={!this.paymentMethodGroupId} />
      </div>
    );
  }

  private get hiddenRadioInput() {
    const showCard = !this.disableCreditCard;
    const showAch = !this.disableBankAccount;
    return !showAch || !showCard;
  }

  render() {
    return (
      <StyledHost>
        <form>
          <fieldset>
            <div class="row gy-3">
              <div class="col-12">
                {this.paymentMethodOptions?.map((paymentMethodOption) => {
                  const newCard = paymentMethodOption.id === PaymentMethodTypes.card;
                  const newBankAccount = paymentMethodOption.id === PaymentMethodTypes.bankAccount;
                  const isSelected = this.selectedPaymentMethodId === paymentMethodOption.id;

                  if (newCard || newBankAccount) {
                    return (
                      <div class="payment-method">
                        <justifi-radio-list-item
                          name="paymentMethodType"
                          value={paymentMethodOption.id}
                          checked={isSelected}
                          label={PaymentMethodTypeLabels[paymentMethodOption.id]}
                          hidden={this.hiddenRadioInput}
                        />
                        {isSelected ? this.showNewPaymentMethodForm() : null}
                      </div>
                    );
                  }
                })}
              </div>
              <div class="col-12">
                <justifi-button
                  text={this.submitButtonText}
                  variant="primary"
                  type="submit"
                  clickHandler={_event => this.tokenizePaymentMethod()}
                  isLoading={this.isLoading}
                  data-testid="submit-button"
                  hidden={this.hideSubmitButton}>
                </justifi-button>
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}
