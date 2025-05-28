import { Component, h, Prop, State, Event, EventEmitter, Method } from '@stencil/core';
import { Button, StyledHost } from '../../ui-components';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from '../../components';
import { PaymentMethodPayload } from '../checkout/payment-method-payload';
import {
  ComponentSubmitEvent,
  ComponentErrorEvent,
  ComponentErrorCodes,
  ComponentErrorSeverity
} from '../../api';
import checkoutStore from '../../store/checkout.store';

@Component({
  tag: 'justifi-tokenize-payment-method',
  shadow: true,
})
export class TokenizePaymentMethod {
  @Prop() authToken?: string;
  @Prop() accountId?: string;
  @Prop() paymentMethodGroupId: string;
  @Prop() submitButtonText: string = 'Submit';
  @Prop() disableCreditCard?: boolean;
  @Prop() disableBankAccount?: boolean;
  @Prop() hideSubmitButton?: boolean;
  @Prop() hideCardBillingForm?: boolean;
  @Prop() hideBankAccountBillingForm?: boolean;

  @State() isLoading: boolean = false;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter<ComponentSubmitEvent>;

  private paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;
  analytics: JustifiAnalytics;

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

  disconnectedCallback() {
    this.analytics?.cleanup();
  };

  @Method()
  async tokenizePaymentMethod(event?: CustomEvent): Promise<PaymentMethodPayload> {
    event && event.preventDefault();
    this.isLoading = true;

    let tokenizeResponse: PaymentMethodPayload;
    try {
      tokenizeResponse = await this.paymentMethodOptionsRef.resolvePaymentMethod({ isValid: true });
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
  async fillBillingForm(fields: BillingFormFields) {
    this.paymentMethodOptionsRef.fillBillingForm(fields);
  }

  @Method()
  async validate(): Promise<{ isValid: boolean, errors?: any }> {
    return this.paymentMethodOptionsRef.validate();
  }

  render() {
    return (
      <StyledHost>
        <form>
          <fieldset>
            <div class="row gy-3">
              <div class="col-12">
                <justifi-payment-method-options
                  ref={(el) => (this.paymentMethodOptionsRef = el)}
                  show-card={!this.disableCreditCard}
                  show-ach={!this.disableBankAccount}
                  show-bnpl={false}
                  paymentMethodGroupId={this.paymentMethodGroupId}
                  show-saved-payment-methods={false} // implement payment method group loading to show these
                  hideCardBillingForm={this.hideCardBillingForm}
                  hideBankAccountBillingForm={this.hideBankAccountBillingForm}
                  authToken={this.authToken}
                  account-id={this.accountId}
                />
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
