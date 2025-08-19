import { Component, h, Method, Event, EventEmitter, State } from '@stencil/core';
import { PaymentMethodPayload } from '../../checkout/payment-method-payload';
import { radioListItem } from '../../../styles/parts';
import { checkoutStore } from '../../../store/checkout.store';
import { StyledHost } from '../../../ui-components';
import plaidLogoSvg from '../../../assets/plaid-icon.svg';

const plaidLogo = (
  <img
    class="plaid-logo-img"
    src={plaidLogoSvg}
    alt="Plaid"
    title="Plaid"
    style={{
      display: 'inline',
      width: '20px',
      height: '20px',
      marginLeft: '5px',
      marginTop: '-2px',
    }}
  />
);

@Component({
  tag: 'justifi-plaid-payment-method',
  shadow: true
})
export class PlaidPaymentMethod {
  @State() isAuthenticating: boolean = false;
  @State() publicToken: string | null = null;
  @State() linkToken: string | null = null;
  @State() error: string | null = null;
  @State() plaidLink: any = null;

  private scriptRef: HTMLScriptElement;
  private paymentMethodOptionId = 'plaid';

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;
  @Event({ bubbles: true }) plaidError: EventEmitter;

  componentDidRender() {
    if (!this.scriptRef) return;

    this.scriptRef.onload = () => {
      this.initializePlaidLink();
    };
  }

  @Method()
  async resolvePaymentMethod(): Promise<PaymentMethodPayload> {
    if (!this.publicToken) {
      return { validationError: true };
    }

    return {
      token: this.publicToken,
      data: {
        type: 'bank_account',
        plaid_public_token: this.publicToken
      } as any
    };
  }

  @Method()
  async validate(): Promise<boolean> {
    return this.publicToken !== null && this.error === null;
  }

  onPaymentMethodOptionClick = (e) => {
    e.preventDefault();
    checkoutStore.selectedPaymentMethod = this.paymentMethodOptionId;
    this.paymentMethodOptionSelected.emit(this.paymentMethodOptionId);
  };

  initializePlaidLink = () => {
    // TODO: Implement Plaid Link initialization
    // This will be completed in Task 1.2
    console.log('Plaid Link initialization - to be implemented');
  };

  handlePlaidSuccess = (publicToken: string, metadata: any) => {
    this.publicToken = publicToken;
    this.isAuthenticating = false;
    this.error = null;
    console.log('Plaid authentication successful:', { publicToken, metadata });
  };

  handlePlaidError = (error: any) => {
    this.error = error.error_message || 'Bank authentication failed. Please try again.';
    this.isAuthenticating = false;
    this.plaidError.emit({
      code: error.error_code,
      message: this.error
    });
    console.error('Plaid authentication error:', error);
  };

  render() {
    return (
      <StyledHost class="payment-method">
        <script
          src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
          async={true}
          ref={(el) => (this.scriptRef = el)}>
        </script>

        <div
          class="radio-list-item p-3"
          part={radioListItem}
          onClick={this.onPaymentMethodOptionClick}
          title="Pay with Plaid"
        >
          <form-control-radio
            name="paymentMethodType"
            value={this.paymentMethodOptionId}
            checked={checkoutStore.selectedPaymentMethod === this.paymentMethodOptionId}
            label={
              <div>
                <div>Pay with Bank Account {plaidLogo} </div>
                {/* <small class="text-muted">
                  Securely connect your bank account through Plaid
                </small> */}
                {this.error && (
                  <div class="text-danger mt-2">
                    <small>{this.error}</small>
                  </div>
                )}
                {this.isAuthenticating && (
                  <div class="text-info mt-2">
                    <small>Connecting to your bank...</small>
                  </div>
                )}
                {this.publicToken && (
                  <div class="text-success mt-2">
                    <small>✓ Bank account connected successfully</small>
                  </div>
                )}
              </div>
            }
          />
        </div>
      </StyledHost>
    );
  }
}
