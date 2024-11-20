import { Component, h, Prop, Event, EventEmitter, Method, State } from '@stencil/core';
import { Button, StyledHost } from '../../ui-components';
import { BillingFormFields, ComponentError } from '../../components';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import JustifiAnalytics from '../../api/Analytics';

@Component({
  tag: 'justifi-tokenize-payment-method',
  styleUrl: 'tokenize-payment-method.css',
  shadow: true,
})
export class TokenizePaymentMethod {
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() paymentMethodGroupId: string;
  @Prop() isLoading: boolean = true;
  @Prop() submitButtonText: string;
  @Prop() hideSubmitButton: boolean;
  @Prop() disableCreditCard?: boolean;
  @Prop() disableBankAccount?: boolean;

  @Event() submitted: EventEmitter<{ token: string }>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  private paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;
  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.isLoading = false;
  }

  @Method()
  async tokenizePaymentMethod(event?: CustomEvent) {
    event && event.preventDefault();

    const tokenizeResponse = await this.paymentMethodOptionsRef.resolvePaymentMethod({ isValid: true });
    if (tokenizeResponse.error) {
      this.errorEvent.emit({
        errorCode: (tokenizeResponse.error.code as ComponentErrorCodes),
        message: tokenizeResponse.error.message,
        severity: ComponentErrorSeverity.ERROR,
      });
    } else if (tokenizeResponse.token) {
      this.submitted.emit({ token: tokenizeResponse.token });
    }
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.paymentMethodOptionsRef.fillBillingForm(fields);
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
                  show-saved-payment-methods={false}
                  authToken={this.authToken}
                  account-id={this.accountId}
                />
              </div>
              <div class="col-12">
                {!this.hideSubmitButton && (
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={event => this.tokenizePaymentMethod(event)}
                    isLoading={this.isLoading}
                    data-testid="submit-button">
                    {this.submitButtonText || 'Submit'}
                  </Button>
                )}
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}
