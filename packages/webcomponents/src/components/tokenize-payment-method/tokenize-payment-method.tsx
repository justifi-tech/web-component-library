import { Component, h, Prop } from '@stencil/core';
import { Button, StyledHost } from '../../ui-components';

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

  componentWillLoad() {
    this.isLoading = false;
  }

  private paymentMethodOptionsRef?: HTMLJustifiPaymentMethodOptionsElement;

  private tokenizePaymentMethod(event: CustomEvent) {
    event.preventDefault();
    this.paymentMethodOptionsRef.resolvePaymentMethod(null);
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
                  show-card={true}
                  show-ach={true}
                  show-bnpl={false}
                  paymentMethodGroupId={this.paymentMethodGroupId}
                  show-saved-payment-methods={false}
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
                  data-testid="submit-button">
                  {this.submitButtonText || 'Submit'}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </StyledHost>
    );
  }
}
