import { Component, h, Prop, State, Event, EventEmitter, Method, Watch, Listen } from '@stencil/core';
import { Button, StyledHost } from '../../ui-components';
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

@Component({
  tag: 'justifi-tokenize-payment-method',
  shadow: true,
})
export class TokenizePaymentMethod {
  analytics: JustifiAnalytics;

  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodId: string;
  @State() paymentMethodOptions: PaymentMethodOption[] = [];

  @Prop() accountId?: string;
  @Prop() authToken?: string;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableCreditCard?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideSubmitButton?: boolean;
  @Prop() paymentMethodGroupId: string;
  @Prop() submitButtonText: string = 'Submit';

  private selectedPaymentMethodOptionRef?: HTMLJustifiNewPaymentMethodElement;

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

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    if (newPaymentMethodElement.fillBillingForm) {
      newPaymentMethodElement.fillBillingForm(fields);
    }
  }

  @Method()
  async tokenizePaymentMethod(event?: CustomEvent): Promise<PaymentMethodPayload> {
    event && event.preventDefault();
    this.isLoading = true;

    let tokenizeResponse: PaymentMethodPayload;
    try {
      tokenizeResponse = await this.selectedPaymentMethodOptionRef?.resolvePaymentMethod({ isValid: true });
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
    const newPaymentMethodElement = (this.selectedPaymentMethodOptionRef as HTMLJustifiNewPaymentMethodElement);
    return newPaymentMethodElement.validate();
  }

  render() {
    const showCard = !this.disableCreditCard;
    const showAch = !this.disableBankAccount;

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
                      <justifi-new-payment-method
                        // @ts-ignore
                        paymentMethodOption={paymentMethodOption}
                        authToken={this.authToken}
                        account-id={this.accountId}
                        is-selected={isSelected}
                        show-card={showCard}
                        show-ach={showAch}
                        paymentMethodGroupId={this.paymentMethodGroupId}
                        hideCardBillingForm={this.hideCardBillingForm}
                        hideBankAccountBillingForm={this.hideBankAccountBillingForm}
                        ref={(el) => {
                          if (isSelected) {
                            this.selectedPaymentMethodOptionRef = el;
                          }
                        }}
                      />
                    );
                  }
                })}
              </div>
              <div class="col-12">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={event => this.tokenizePaymentMethod(event)}
                  isLoading={this.isLoading}
                  data-testid="submit-button"
                  hidden={this.hideSubmitButton}>
                  {this.submitButtonText}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}
