import { Component, h, Method, Event, EventEmitter, State, Watch } from '@stencil/core';
import { PaymentMethodPayload } from '../../checkout/payment-method-payload';
import { radioListItem } from '../../../styles/parts';
import { checkoutStore, onChange } from '../../../store/checkout.store';
import { StyledHost } from '../../../ui-components';
import plaidLogoSvg from '../../../assets/plaid-icon.svg';
import { PlaidService } from '../../../api/services/plaid.service';

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
  @State() isSelected: boolean = false;

  private scriptRef: HTMLScriptElement;
  private paymentMethodOptionId = 'plaid';
  private plaidService = new PlaidService();
  private unsubscribeFromStore: () => void;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;
  @Event({ bubbles: true }) plaidError: EventEmitter;

  @Watch('isSelected')
  onSelectionChange(newValue: boolean) {
    // Ensure store is updated when component selection changes
    if (newValue && checkoutStore.selectedPaymentMethod !== this.paymentMethodOptionId) {
      checkoutStore.selectedPaymentMethod = this.paymentMethodOptionId;
    }
  }

  componentDidRender() {
    if (!this.scriptRef) return;

    this.scriptRef.onload = () => {
      // Wait for store to be populated before initializing
      this.waitForStoreAndInitialize();
    };
  }

  componentWillLoad() {
    // Initialize selection state based on store
    this.isSelected = checkoutStore.selectedPaymentMethod === this.paymentMethodOptionId;
  }

  waitForStoreAndInitialize = () => {
    // Check if store has necessary data
    if (checkoutStore.authToken && checkoutStore.accountId && checkoutStore.checkoutId) {
      this.initializePlaidLink();
    } else {
      // Wait a bit and try again
      setTimeout(() => {
        this.waitForStoreAndInitialize();
      }, 100);
    }
  };

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

    // Update local selection state
    this.isSelected = true;

    // Update store selection
    checkoutStore.selectedPaymentMethod = this.paymentMethodOptionId;

    // Emit selection event
    this.paymentMethodOptionSelected.emit(this.paymentMethodOptionId);

    // If there's an error, clear it and try to initialize again
    if (this.error) {
      this.error = null;
      this.waitForStoreAndInitialize();
      return;
    }

    // If Plaid Link is ready and no public token exists, open Plaid Link
    if (this.plaidLink && !this.publicToken && !this.isAuthenticating) {
      this.openPlaidLink();
    }
  };

  initializePlaidLink = async () => {
    try {
      // Check if Plaid is available globally
      if (typeof (window as any).Plaid === 'undefined') {
        console.error('Plaid SDK not loaded');
        this.error = 'Unable to load Plaid. Please refresh the page and try again.';
        return;
      }

      // Get link token from backend
      await this.getLinkToken();

      if (!this.linkToken) {
        console.error('Failed to get link token');
        this.error = 'Unable to initialize bank connection. Please try again.';
        return;
      }

      // Initialize Plaid Link
      const Plaid = (window as any).Plaid;
      this.plaidLink = Plaid.create({
        token: this.linkToken,
        onSuccess: this.handlePlaidSuccess,
        onExit: this.handlePlaidExit,
        onEvent: this.handlePlaidEvent,
        onLoad: this.handlePlaidLoad,
      });

      console.log('Plaid Link initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Plaid Link:', error);
      this.error = 'Unable to initialize bank connection. Please try again.';
    }
  };

  getLinkToken = async () => {
    try {
      if (!checkoutStore.authToken || !checkoutStore.accountId) {
        console.error('Missing auth token or account ID from store');
        this.error = 'Unable to initialize bank connection. Please try again.';
        return;
      }

      const response = await this.plaidService.getLinkToken(
        checkoutStore.authToken,
        checkoutStore.accountId,
        checkoutStore.checkoutId
      );

      if (response.error) {
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : response.error.message || 'Failed to get link token';
        throw new Error(errorMessage);
      }

      this.linkToken = response.data.link_token;
      console.log('Link token received:', this.linkToken);
    } catch (error) {
      console.error('Error getting link token:', error);
      this.error = error.message || 'Unable to connect to bank service. Please try again.';
    }
  };

  openPlaidLink = () => {
    if (this.plaidLink && this.linkToken) {
      this.isAuthenticating = true;
      this.error = null;
      this.plaidLink.open();
    }
  };

  handlePlaidSuccess = (publicToken: string, metadata: any) => {
    this.publicToken = publicToken;
    this.isAuthenticating = false;
    this.error = null;
    console.log('Plaid authentication successful:', { publicToken, metadata });

    // Ensure the component remains selected after successful authentication
    if (!this.isSelected) {
      this.isSelected = true;
      checkoutStore.selectedPaymentMethod = this.paymentMethodOptionId;
    }
  };

  handlePlaidExit = (err: any, _metadata: any) => {
    this.isAuthenticating = false;

    if (err) {
      this.handlePlaidError(err);
    } else {
      // User closed the modal without error
      console.log('Plaid Link closed by user');

      // If user closed without completing authentication, ensure component remains selected
      // but clear any existing tokens to force re-authentication
      if (this.isSelected && !this.publicToken) {
        // Component is selected but no token, this is expected state
        console.log('Plaid Link closed without completion, component remains selected');
      }
    }
  };

  handlePlaidEvent = (eventName: string, metadata: any) => {
    console.log('Plaid event:', eventName, metadata);

    // Handle specific events if needed
    switch (eventName) {
      case 'OPEN':
        this.isAuthenticating = true;
        break;
      case 'CLOSE':
        this.isAuthenticating = false;
        break;
      case 'ERROR':
        this.handlePlaidError(metadata);
        break;
    }
  };

  handlePlaidLoad = () => {
    console.log('Plaid Link loaded');
  };

  handlePlaidError = (error: any) => {
    this.error = error.error_message || 'Bank authentication failed. Please try again.';
    this.isAuthenticating = false;

    // Even with an error, the component should remain selected to allow retry
    if (this.isSelected) {
      console.log('Plaid authentication error, component remains selected for retry');
    }

    this.plaidError.emit({
      code: error.error_code,
      message: this.error
    });
    console.error('Plaid authentication error:', error);
  };

  // Method to handle external selection changes (e.g., from other payment methods)
  @Method()
  async setSelected(selected: boolean): Promise<void> {
    this.isSelected = selected;
    if (selected) {
      checkoutStore.selectedPaymentMethod = this.paymentMethodOptionId;
    }
  }

  // Method to check if component is currently selected
  @Method()
  async isCurrentlySelected(): Promise<boolean> {
    return this.isSelected;
  }

  // Method to handle external deselection (when another payment method is selected)
  @Method()
  async deselect(): Promise<void> {
    this.isSelected = false;
    // Don't clear the public token or error state as they might be needed if user reselects
    console.log('Plaid payment method deselected');
  }

  // Method to reset component state (useful for testing or error recovery)
  @Method()
  async reset(): Promise<void> {
    this.publicToken = null;
    this.error = null;
    this.isAuthenticating = false;
    this.linkToken = null;
    this.plaidLink = null;
    console.log('Plaid payment method state reset');
  }

  // Method to check if component is ready for authentication
  @Method()
  async isReadyForAuthentication(): Promise<boolean> {
    return !!(this.plaidLink && this.linkToken && !this.isAuthenticating);
  }

  // Watch for store changes to sync component state
  private syncWithStore = () => {
    const storeSelection = checkoutStore.selectedPaymentMethod;
    const shouldBeSelected = storeSelection === this.paymentMethodOptionId;

    if (this.isSelected !== shouldBeSelected) {
      this.isSelected = shouldBeSelected;
      console.log(`Plaid payment method selection synced with store: ${shouldBeSelected}`);
    }
  };

  componentDidLoad() {
    // Set up store change listener to keep component in sync
    const unsubscribe = onChange('selectedPaymentMethod', this.syncWithStore);

    // Store unsubscribe function for cleanup
    this.unsubscribeFromStore = unsubscribe;
  }

  disconnectedCallback() {
    // Clean up store subscription
    if (this.unsubscribeFromStore) {
      this.unsubscribeFromStore();
    }
  }

  render() {
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
            checked={this.isSelected}
            label={
              <div>
                <div>Pay with Bank Account {plaidLogo} </div>
                {this.error && (
                  <div class="text-danger mt-2">
                    <small>{this.error}</small>
                    <br />
                    <small class="text-muted">Click to try again</small>
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
                {this.isSelected && !this.publicToken && !this.error && !this.isAuthenticating && (
                  <div class="text-muted mt-2">
                    <small>Click to connect your bank account</small>
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
