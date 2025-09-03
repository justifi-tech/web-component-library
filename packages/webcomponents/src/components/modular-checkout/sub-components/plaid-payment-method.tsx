import { Component, h, Method, Event, EventEmitter, State, Watch } from '@stencil/core';
import { PaymentMethodPayload } from '../../checkout/payment-method-payload';
import { checkoutStore, onChange } from '../../../store/checkout.store';
import { StyledHost } from '../../../ui-components';
import plaidLogoSvg from '../../../assets/plaid-icon.svg';
import { PlaidService } from '../../../api/services/plaid.service';
import { ComponentErrorSeverity } from '../../../api/ComponentError';
import { PaymentMethodTypes } from '../../../api';

// Plaid-specific error codes
export enum PlaidErrorCodes {
  PLAID_SDK_LOAD_FAILED = 'plaid-sdk-load-failed',
  PLAID_LINK_INIT_FAILED = 'plaid-link-init-failed',
  PLAID_LINK_TOKEN_FAILED = 'plaid-link-token-failed',
  PLAID_AUTHENTICATION_FAILED = 'plaid-authentication-failed',
  PLAID_BANK_NOT_SUPPORTED = 'plaid-bank-not-supported',
  PLAID_TOKEN_EXPIRED = 'plaid-token-expired',
  PLAID_NETWORK_ERROR = 'plaid-network-error',
  PLAID_USER_CANCELLED = 'plaid-user-cancelled',
  PLAID_TIMEOUT = 'plaid-timeout',
  PLAID_INVALID_CREDENTIALS = 'plaid-invalid-credentials',
  PLAID_ACCOUNT_LOCKED = 'plaid-account-locked',
  PLAID_MAINTENANCE = 'plaid-maintenance',
  PLAID_RATE_LIMITED = 'plaid-rate-limited',
}

// Plaid error message mapping
const PLAID_ERROR_MESSAGES = {
  [PlaidErrorCodes.PLAID_SDK_LOAD_FAILED]: 'Unable to load Plaid. Please refresh the page and try again.',
  [PlaidErrorCodes.PLAID_LINK_INIT_FAILED]: 'Unable to initialize bank connection. Please try again.',
  [PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED]: 'Unable to connect to bank service. Please try again.',
  [PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED]: 'Bank authentication failed. Please try again.',
  [PlaidErrorCodes.PLAID_BANK_NOT_SUPPORTED]: 'Your bank is not currently supported. Please try a different payment method.',
  [PlaidErrorCodes.PLAID_TOKEN_EXPIRED]: 'Your bank session has expired. Please reconnect your account.',
  [PlaidErrorCodes.PLAID_NETWORK_ERROR]: 'Network connection issue. Please check your internet connection and try again.',
  [PlaidErrorCodes.PLAID_USER_CANCELLED]: 'Bank connection was cancelled. Click to try again.',
  [PlaidErrorCodes.PLAID_TIMEOUT]: 'Bank connection timed out. Please try again.',
  [PlaidErrorCodes.PLAID_INVALID_CREDENTIALS]: 'Invalid bank credentials. Please check your username and password.',
  [PlaidErrorCodes.PLAID_ACCOUNT_LOCKED]: 'Your bank account is temporarily locked. Please contact your bank.',
  [PlaidErrorCodes.PLAID_MAINTENANCE]: 'Bank service is temporarily unavailable. Please try again later.',
  [PlaidErrorCodes.PLAID_RATE_LIMITED]: 'Too many connection attempts. Please wait a moment and try again.',
};

// Plaid error severity mapping
const PLAID_ERROR_SEVERITY = {
  [PlaidErrorCodes.PLAID_SDK_LOAD_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_LINK_INIT_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_BANK_NOT_SUPPORTED]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_TOKEN_EXPIRED]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_NETWORK_ERROR]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_USER_CANCELLED]: ComponentErrorSeverity.INFO,
  [PlaidErrorCodes.PLAID_TIMEOUT]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_INVALID_CREDENTIALS]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_ACCOUNT_LOCKED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_MAINTENANCE]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_RATE_LIMITED]: ComponentErrorSeverity.WARNING,
};

interface PlaidError {
  code: PlaidErrorCodes;
  message: string;
  severity: ComponentErrorSeverity;
  originalError?: any;
  retryable: boolean;
  userAction?: string;
}

@Component({
  tag: 'justifi-plaid-payment-method',
  shadow: true
})
export class PlaidPaymentMethod {
  @State() isAuthenticating: boolean = false;
  @State() publicToken: string | null = null;
  @State() linkToken: string | null = null;
  @State() linkTokenId: string | null = null;
  @State() error: PlaidError | null = null;
  @State() plaidLink: any = null;
  @State() isSelected: boolean = false;
  @State() retryCount: number = 0;
  @State() isRetrying: boolean = false;

  private scriptRef: HTMLScriptElement;
  private plaidService = new PlaidService();
  private unsubscribeFromStore: () => void;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds
  private timeoutId: NodeJS.Timeout | null = null;
  private abortController: AbortController | null = null;
  private hasLoggedDisabledWarning: boolean = false;

  @Event({ bubbles: true }) paymentMethodOptionSelected: EventEmitter;
  @Event({ bubbles: true }) plaidError: EventEmitter;
  @Event({ bubbles: true }) plaidErrorRecovered: EventEmitter;

  @Watch('isSelected')
  onSelectionChange(newValue: boolean) {
    // Ensure store is updated when component selection changes
    if (newValue && checkoutStore.selectedPaymentMethod.type !== PaymentMethodTypes.plaid) {
      checkoutStore.selectedPaymentMethod = { type: PaymentMethodTypes.plaid };
    }

    // Auto-start Plaid flow when selected and ready
    if (
      newValue &&
      this.plaidLink &&
      !this.publicToken &&
      !this.isAuthenticating &&
      !this.error
    ) {
      this.openPlaidLink();
    }
  }

  componentDidRender() {
    if (!this.scriptRef) return;

    this.scriptRef.onload = () => {
      // Wait for store to be populated before initializing
      this.waitForStoreAndInitialize();
    };

    // Add error handler for script loading failures
    this.scriptRef.onerror = () => {
      this.handleError({
        code: PlaidErrorCodes.PLAID_SDK_LOAD_FAILED,
        message: PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_SDK_LOAD_FAILED],
        severity: PLAID_ERROR_SEVERITY[PlaidErrorCodes.PLAID_SDK_LOAD_FAILED],
        retryable: true,
        userAction: 'Refresh the page and try again'
      });
    };
  }

  componentWillLoad() {
    // Initialize selection state based on store
    this.isSelected = checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.plaid;
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

  // Returns a usable payment method token for checkout completion.
  // Will perform the backend exchange if the token is not yet present in the store.
  @Method()
  async getPaymentToken(): Promise<string | undefined> {
    return checkoutStore.paymentToken;
  }

  @Method()
  async handleSelectionClick(): Promise<void> {
    // Update local selection state
    this.isSelected = true;

    // Update store selection
    checkoutStore.selectedPaymentMethod = { type: PaymentMethodTypes.plaid };

    // If there's an error, clear it and try to initialize again
    if (this.error) {
      this.clearError();
      this.waitForStoreAndInitialize();
      return;
    }

    // If Plaid Link is ready and no public token exists, open Plaid Link
    if (this.plaidLink && !this.publicToken && !this.isAuthenticating) {
      this.openPlaidLink();
    }
  }

  initializePlaidLink = async () => {
    try {
      // Check if Plaid is available globally
      if (typeof (window as any).Plaid === 'undefined') {
        this.handleError({
          code: PlaidErrorCodes.PLAID_SDK_LOAD_FAILED,
          message: PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_SDK_LOAD_FAILED],
          severity: PLAID_ERROR_SEVERITY[PlaidErrorCodes.PLAID_SDK_LOAD_FAILED],
          retryable: true,
          userAction: 'Refresh the page and try again'
        });
        return;
      }

      // Get link token from backend
      await this.getLinkToken();

      if (!this.linkToken) {
        this.handleError({
          code: PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED,
          message: PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED],
          severity: PLAID_ERROR_SEVERITY[PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED],
          retryable: true,
          userAction: 'Click to try again'
        });
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
    } catch (error) {
      this.handleError({
        code: PlaidErrorCodes.PLAID_LINK_INIT_FAILED,
        message: PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_LINK_INIT_FAILED],
        severity: PLAID_ERROR_SEVERITY[PlaidErrorCodes.PLAID_LINK_INIT_FAILED],
        originalError: error,
        retryable: true,
        userAction: 'Click to try again'
      });
    }
  };

  getLinkToken = async () => {
    try {
      if (!checkoutStore.authToken || !checkoutStore.accountId) {
        this.handleError({
          code: PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED,
          message: 'Missing authentication. Please refresh the page and try again.',
          severity: ComponentErrorSeverity.ERROR,
          retryable: false,
          userAction: 'Refresh the page'
        });
        return;
      }

      // Create abort controller for timeout handling
      this.abortController = new AbortController();

      // Set timeout for the request
      this.timeoutId = setTimeout(() => {
        this.abortController?.abort();
      }, 30000); // 30 second timeout

      const response = await this.plaidService.getLinkToken(
        checkoutStore.authToken,
        checkoutStore.accountId,
        checkoutStore.checkoutId,
        this.abortController.signal
      );

      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (response.error) {
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : response.error.message || 'Failed to get link token';

        throw new Error(errorMessage);
      }

      // Some backends may return an id along with the link token
      this.linkToken = response.data.link_token;
      // Try to capture link token id if present in envelope
      this.linkTokenId = (response as any)?.id || (response as any)?.data?.id || null;
      if (this.linkTokenId) {
        checkoutStore.plaidLinkTokenId = this.linkTokenId;
      }
    } catch (error) {
      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      let errorCode = PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED;
      let message = PLAID_ERROR_MESSAGES[errorCode];
      let retryable = true;

      // Handle specific error types
      if (error.name === 'AbortError') {
        errorCode = PlaidErrorCodes.PLAID_TIMEOUT;
        message = PLAID_ERROR_MESSAGES[errorCode];
        retryable = true;
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorCode = PlaidErrorCodes.PLAID_NETWORK_ERROR;
        message = PLAID_ERROR_MESSAGES[errorCode];
        retryable = true;
      } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        errorCode = PlaidErrorCodes.PLAID_INVALID_CREDENTIALS;
        message = 'Authentication failed. Please refresh the page and try again.';
        retryable = false;
      }

      this.handleError({
        code: errorCode,
        message: message,
        severity: PLAID_ERROR_SEVERITY[errorCode],
        originalError: error,
        retryable,
        userAction: retryable ? 'Click to try again' : 'Refresh the page'
      });
    }
  };

  mapApiErrorToPlaidError = (apiError: any): PlaidErrorCodes => {
    if (typeof apiError === 'string') {
      if (apiError.includes('rate_limit')) return PlaidErrorCodes.PLAID_RATE_LIMITED;
      if (apiError.includes('maintenance')) return PlaidErrorCodes.PLAID_MAINTENANCE;
      if (apiError.includes('not_authenticated')) return PlaidErrorCodes.PLAID_INVALID_CREDENTIALS;
    }

    if (apiError?.code) {
      switch (apiError.code) {
        case 'rate_limited': return PlaidErrorCodes.PLAID_RATE_LIMITED;
        case 'maintenance': return PlaidErrorCodes.PLAID_MAINTENANCE;
        case 'not_authenticated': return PlaidErrorCodes.PLAID_INVALID_CREDENTIALS;
        case 'invalid_parameter': return PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED;
        default: return PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED;
      }
    }

    return PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED;
  };

  openPlaidLink = () => {
    if (this.plaidLink && this.linkToken) {
      this.isAuthenticating = true;
      this.clearError();
      this.plaidLink.open();
    }
  };

  handlePlaidSuccess = (publicToken: string, _metadata: any) => {
    this.publicToken = publicToken;
    this.isAuthenticating = false;
    this.clearError();
    this.retryCount = 0; // Reset retry count on success

    // Ensure the component remains selected after successful authentication
    if (!this.isSelected) {
      this.isSelected = true;
      checkoutStore.selectedPaymentMethod = { type: PaymentMethodTypes.plaid };
    }

    // Emit success event for parent components
    this.plaidErrorRecovered.emit({
      code: 'plaid-success',
      message: 'Bank account connected successfully',
      severity: ComponentErrorSeverity.INFO
    });

    // Store public token in checkout store; exchange will be handled on submit
    checkoutStore.plaidPublicToken = publicToken;
  };

  // Exchange logic moved to Modular Checkout submit flow.

  handlePlaidExit = (err: any, _metadata: any) => {
    this.isAuthenticating = false;

    if (err) {
      this.handlePlaidError(err);
    } else {
      // User closed the modal without error

      // If user closed without completing authentication, ensure component remains selected
      // but clear any existing tokens to force re-authentication
      if (this.isSelected && !this.publicToken) {
        // Component is selected but no token, this is expected state
      }
    }
  };

  handlePlaidEvent = (eventName: string, metadata: any) => {

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
      case 'HANDOFF':
        // User is being redirected to their bank
        break;
      case 'TRANSITION_VIEW':
        // Plaid Link view transition
        break;
    }
  };

  handlePlaidLoad = () => {
  };

  handlePlaidError = (error: any) => {
    let errorCode = PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED;
    let message = PLAID_ERROR_MESSAGES[errorCode];
    let retryable = true;
    let userAction = 'Click to try again';

    // Map Plaid error codes to our error codes
    if (error.error_code) {
      switch (error.error_code) {
        case 'INVALID_CREDENTIALS':
          errorCode = PlaidErrorCodes.PLAID_INVALID_CREDENTIALS;
          message = PLAID_ERROR_MESSAGES[errorCode];
          retryable = true;
          break;
        case 'ITEM_LOGIN_REQUIRED':
          errorCode = PlaidErrorCodes.PLAID_INVALID_CREDENTIALS;
          message = 'Your bank requires re-authentication. Please try again.';
          retryable = true;
          break;
        case 'ITEM_LOCKED':
          errorCode = PlaidErrorCodes.PLAID_ACCOUNT_LOCKED;
          message = PLAID_ERROR_MESSAGES[errorCode];
          retryable = false;
          userAction = 'Contact your bank';
          break;
        case 'INSTITUTION_NOT_RESPONDING':
          errorCode = PlaidErrorCodes.PLAID_MAINTENANCE;
          message = PLAID_ERROR_MESSAGES[errorCode];
          retryable = true;
          break;
        case 'RATE_LIMIT_EXCEEDED':
          errorCode = PlaidErrorCodes.PLAID_RATE_LIMITED;
          message = PLAID_ERROR_MESSAGES[errorCode];
          retryable = true;
          break;
        case 'INVALID_REQUEST':
          errorCode = PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED;
          message = 'Invalid request. Please try again.';
          retryable = true;
          break;
        case 'PLAID_ERROR':
          errorCode = PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED;
          message = error.error_message || 'Bank authentication failed. Please try again.';
          retryable = true;
          break;
        default:
          // Use the error message from Plaid if available
          if (error.error_message) {
            message = error.error_message;
          }
          break;
      }
    }

    // Handle specific error messages
    if (error.error_message) {
      const lowerMessage = error.error_message.toLowerCase();
      if (lowerMessage.includes('not supported') || lowerMessage.includes('unsupported')) {
        errorCode = PlaidErrorCodes.PLAID_BANK_NOT_SUPPORTED;
        message = PLAID_ERROR_MESSAGES[errorCode];
        retryable = false;
        userAction = 'Try a different payment method';
      } else if (lowerMessage.includes('expired') || lowerMessage.includes('timeout')) {
        errorCode = PlaidErrorCodes.PLAID_TOKEN_EXPIRED;
        message = PLAID_ERROR_MESSAGES[errorCode];
        retryable = true;
      }
    }

    this.handleError({
      code: errorCode,
      message,
      severity: PLAID_ERROR_SEVERITY[errorCode],
      originalError: error,
      retryable,
      userAction
    });

    this.isAuthenticating = false;

    // Even with an error, the component should remain selected to allow retry
    if (this.isSelected) {
    }
  };

  handleError = (plaidError: PlaidError) => {
    this.error = plaidError;

    // Emit error event for parent components
    this.plaidError.emit({
      code: plaidError.code,
      message: plaidError.message,
      severity: plaidError.severity,
      data: {
        originalError: plaidError.originalError,
        retryable: plaidError.retryable,
        userAction: plaidError.userAction,
        retryCount: this.retryCount
      }
    });

    console.error('Plaid error:', plaidError);

    // Auto-retry for retryable errors if under max retries
    if (plaidError.retryable && this.retryCount < this.maxRetries) {
      this.scheduleRetry();
    }
  };

  scheduleRetry = () => {
    if (this.isRetrying) return;

    this.isRetrying = true;
    this.retryCount++;

    setTimeout(() => {
      this.isRetrying = false;
      this.clearError();
      this.waitForStoreAndInitialize();
    }, this.retryDelay * this.retryCount); // Exponential backoff
  };

  clearError = () => {
    if (this.error) {
      this.error = null;
      this.retryCount = 0;
    }
  };

  // Method to handle external selection changes (e.g., from other payment methods)
  @Method()
  async setSelected(selected: boolean): Promise<void> {
    this.isSelected = selected;
    if (selected) {
      checkoutStore.selectedPaymentMethod = { type: PaymentMethodTypes.plaid };
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
  }

  // Method to reset component state (useful for testing or error recovery)
  @Method()
  async reset(): Promise<void> {
    this.publicToken = null;
    this.clearError();
    this.isAuthenticating = false;
    this.linkToken = null;
    this.plaidLink = null;
    this.retryCount = 0;
    this.isRetrying = false;

    // Clear any pending timeouts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Abort any pending requests
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Method to check if component is ready for authentication
  @Method()
  async isReadyForAuthentication(): Promise<boolean> {
    return !!(this.plaidLink && this.linkToken && !this.isAuthenticating);
  }

  // Method to manually retry after an error
  @Method()
  async retry(): Promise<void> {
    if (this.error && this.error.retryable) {
      this.clearError();
      this.waitForStoreAndInitialize();
    }
  }

  // Method to get current error information
  @Method()
  async getErrorInfo(): Promise<PlaidError | null> {
    return this.error;
  }

  // Watch for store changes to sync component state
  private syncWithStore = () => {
    const shouldBeSelected = checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.plaid;

    if (this.isSelected !== shouldBeSelected) {
      this.isSelected = shouldBeSelected;
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

    // Clean up timeouts and abort controllers
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  render() {
    // Only allow use if enabled in checkout settings
    if (checkoutStore.bankAccountVerification !== true) {
      if (!this.hasLoggedDisabledWarning) {
        // Log once per component lifecycle
        console.warn('[PlaidPaymentMethod] bank_account_verification is disabled. Component will not render.');
        this.hasLoggedDisabledWarning = true;
      }
      return null;
    }

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

    const renderErrorState = () => {
      if (!this.error) return null;

      const errorClass = this.error.severity === ComponentErrorSeverity.ERROR
        ? 'text-danger'
        : this.error.severity === ComponentErrorSeverity.WARNING
          ? 'text-warning'
          : 'text-info';

      return (
        <div class={`${errorClass} mt-2`}>
          <small>{this.error.message}</small>
          <br />
          <small class="text-muted">
            {this.error.userAction}
            {this.error.retryable && this.retryCount < this.maxRetries && (
              <span> • Auto-retry in progress...</span>
            )}
          </small>
        </div>
      );
    };

    const renderStatusState = () => {
      if (this.error) return null;

      if (this.isAuthenticating) {
        return (
          <div class="text-info mt-2">
            <small>Connecting to your bank...</small>
          </div>
        );
      }

      if (this.publicToken) {
        return (
          <div class="text-success mt-2">
            <small>✓ Bank account connected successfully</small>
          </div>
        );
      }

      if (this.isSelected && !this.publicToken && !this.error && !this.isAuthenticating) {
        return (
          <div class="text-muted mt-2">
            <small>Click to connect your bank account</small>
          </div>
        );
      }

      return null;
    };

    return (
      <StyledHost class="payment-method">
        <script
          src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
          async={true}
          ref={(el) => (this.scriptRef = el)}>
        </script>

        <div title="Pay with Plaid">
          <div onClick={(event) => { event.preventDefault(); this.handleSelectionClick(); }}>Pay with Bank Account {plaidLogo} </div>
          {renderErrorState()}
          {renderStatusState()}
        </div>
      </StyledHost>
    );
  }
}
