import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { Button, StyledHost } from '../../../../ui-components';
import { PlaidService } from '../../../../api/services/plaid.service';
import { ComponentErrorSeverity, PlaidErrorCodes, PlaidError } from '@justifi/types';
import {
  PLAID_ERROR_MESSAGES,
  PLAID_ERROR_SEVERITY,
} from '../../../../api/Plaid';
import { buttonPrimary } from '../../../../styles/parts';

@Component({
  tag: 'plaid-verification',
  shadow: false,
})
export class PlaidVerification {
  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() businessId: string;

  @State() linkToken: string | null = null;
  @State() linkTokenId: string | null = null;
  @State() plaidLink: any = null;
  @State() isAuthenticating: boolean = false;
  @State() isSuccess: boolean = false;
  @State() error: PlaidError | null = null;
  @State() isLoading: boolean = false;

  private scriptRef: HTMLScriptElement;
  private plaidService = new PlaidService();
  private abortController: AbortController | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  @Event({ bubbles: true }) plaidVerificationSuccess: EventEmitter<{ publicToken: string, bankAccount: any }>;
  @Event({ bubbles: true }) plaidVerificationError: EventEmitter<PlaidError>;

  componentDidRender() {
    if (!this.scriptRef) return;

    this.scriptRef.onload = () => {
      this.initializePlaidLink();
    };

    this.scriptRef.onerror = () => {
      this.handleError({
        code: PlaidErrorCodes.PLAID_SDK_LOAD_FAILED,
        message: PLAID_ERROR_MESSAGES[PlaidErrorCodes.PLAID_SDK_LOAD_FAILED],
        severity: PLAID_ERROR_SEVERITY[PlaidErrorCodes.PLAID_SDK_LOAD_FAILED],
        retryable: true,
        userAction: 'Refresh the page and try again',
      });
    };
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
          userAction: 'Refresh the page and try again',
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
          userAction: 'Click to try again',
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
        userAction: 'Click to try again',
      });
    }
  };

  getLinkToken = async () => {
    try {
      if (!this.authToken || !this.accountId) {
        this.handleError({
          code: PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED,
          message: 'Missing authentication. Please provide authToken and accountId.',
          severity: ComponentErrorSeverity.ERROR,
          retryable: false,
          userAction: 'Provide required props',
        });
        return;
      }

      // Create abort controller for timeout handling
      this.abortController = new AbortController();

      // Set timeout for the request
      this.timeoutId = setTimeout(() => {
        this.abortController?.abort();
      }, 30000); // 30 second timeout

      const response = await this.plaidService.getLinkTokenForVerification(
        this.authToken,
        this.businessId,
        this.abortController.signal
      );

      // Clear timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (response.error) {
        const errorMessage =
          typeof response.error === 'string'
            ? response.error
            : response.error.message || 'Failed to get link token';

        throw new Error(errorMessage);
      }

      this.linkToken = response.data.link_token;
      this.linkTokenId = response.data.id;
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
        message = 'Authentication failed. Please check your credentials.';
        retryable = false;
      }

      this.handleError({
        code: errorCode,
        message: message,
        severity: PLAID_ERROR_SEVERITY[errorCode],
        originalError: error,
        retryable,
        userAction: retryable ? 'Click to try again' : 'Check your credentials',
      });
    }
  };

  openPlaidLink = () => {
    if (this.plaidLink && this.linkToken) {
      this.isAuthenticating = true;
      this.clearError();
      this.plaidLink.open();
    }
  };

  handlePlaidSuccess = async (publicToken: string, _metadata: any) => {
    this.isAuthenticating = false;
    this.isLoading = true;
    this.clearError();

    try {
      // Send publicToken to backend
      const response = await this.plaidService.postPlaidVerifiedBankAccountData(
        this.authToken,
        this.businessId,
        { public_token: publicToken, link_token_id: this.linkTokenId },
        this.abortController?.signal
      );


      if (response.error) {
        const errorMessage =
          typeof response.error === 'string'
            ? response.error
            : response.error.message || 'Failed to verify bank account';

        throw new Error(errorMessage);
      }

      // Success - display success message
      this.isSuccess = true;
      this.isLoading = false;

      // Emit success event
      this.plaidVerificationSuccess.emit({ publicToken, bankAccount: response.data });
    } catch (error) {
      this.isLoading = false;
      this.handleError({
        code: PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED,
        message: (error as any)?.message || 'Failed to verify bank account',
        severity: PLAID_ERROR_SEVERITY[PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED],
        originalError: error,
        retryable: true,
        userAction: 'Click to try again',
      });
    }
  };

  handlePlaidExit = (err: any, _metadata: any) => {
    this.isAuthenticating = false;

    if (err) {
      this.handlePlaidError(err);
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
    }
  };

  handlePlaidLoad = () => {
    // Plaid Link loaded successfully
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
        default:
          if (error.error_message) {
            message = error.error_message;
          }
          break;
      }
    }

    this.handleError({
      code: errorCode,
      message,
      severity: PLAID_ERROR_SEVERITY[errorCode],
      originalError: error,
      retryable,
      userAction,
    });

    this.isAuthenticating = false;
  };

  handleError = (plaidError: PlaidError) => {
    this.error = plaidError;
    this.isLoading = false;

    // Emit error event for parent components
    this.plaidVerificationError.emit(plaidError);

    console.error('Plaid verification error:', plaidError);
  };

  clearError = () => {
    if (this.error) {
      this.error = null;
    }
  };

  disconnectedCallback() {
    // Clean up timeouts and abort controllers
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  render() {
    const renderErrorState = () => {
      if (!this.error) return null;

      const errorClass =
        this.error.severity === ComponentErrorSeverity.ERROR
          ? 'text-danger'
          : this.error.severity === ComponentErrorSeverity.WARNING
            ? 'text-warning'
            : 'text-info';

      return (
        <div class={`${errorClass} mt-2`}>
          <small>{this.error.message}</small>
          <br />
          {this.error.userAction && (
            <small class="text-muted">{this.error.userAction}</small>
          )}
        </div>
      );
    };

    const renderStatusState = () => {
      if (this.error) return null;

      if (this.isLoading) {
        return (
          <div class="text-info mt-2">
            <small>Verifying bank account...</small>
          </div>
        );
      }

      if (this.isSuccess) {
        return (
          <div class="text-success mt-2">
            <small>✓ Bank account verified successfully</small>
          </div>
        );
      }

      if (this.isAuthenticating) {
        return (
          <div class="text-info mt-2">
            <small>Connecting to your bank...</small>
          </div>
        );
      }

      return null;
    };

    const plaidLogo = (
      <svg
        class="plaid-logo-img"
        height="20"
        width="20"
        viewBox="0 0 28 29"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline', marginLeft: '5px', marginRight: '5px', marginTop: '-2px' }}
      >
        <g fill="#fff" fill-rule="evenodd">
          <path d="M25.7629 26.2628L28 17.5309L24.9691 14.5001L27.9999 11.4691L25.7628 2.73706L17.0309 0.5L14.0001 3.531L10.969 0.50014L2.23706 2.73734L0 11.4691L3.03128 14.4999L0.00014 17.531L2.2372 26.2629L10.9691 28.5L14.0001 25.469L17.031 28.4999L25.7629 26.2628ZM15.7321 23.7371L18.6186 20.8505L22.2912 24.5233L17.6956 25.7007L15.7321 23.7371ZM11.1136 9.88154L14.0003 6.99502L16.8868 9.8814L14.0001 12.7679L11.1136 9.88154ZM12.2682 14.5L9.38154 17.3865L6.49502 14.5L9.38154 11.6135L12.2682 14.5ZM18.6187 11.6133L21.5053 14.5L18.6186 17.3865L15.7321 14.5L18.6187 11.6133ZM16.8867 19.1186L14.0001 22.0051L11.1135 19.1185L14.0001 16.2319L16.8867 19.1186ZM10.3044 25.7007L5.70864 24.5233L9.38154 20.8504L12.2682 23.7371L10.3044 25.7007ZM4.76308 16.2319L7.6496 19.1185L3.9767 22.7914L2.7993 18.1957L4.76308 16.2319ZM3.9767 6.20836L7.64974 9.8814L4.76308 12.7681L2.7993 10.8041L3.9767 6.20836ZM12.2683 5.26294L9.38168 8.1496L5.70892 4.4767L10.3047 3.2993L12.2683 5.26294ZM17.6959 3.2993L22.2915 4.4767L18.6186 8.14946L15.7321 5.26294L17.6959 3.2993ZM23.2372 12.7681L20.3505 9.8814L24.0233 6.20878L25.2007 10.8046L23.2372 12.7681ZM24.0233 22.7914L20.3505 19.1186L23.2372 16.2321L25.2007 18.1957L24.0233 22.7914Z"></path>
        </g>
      </svg>
    );

    return (
      <StyledHost>
        <script
          src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
          async={true}
          ref={(el) => (this.scriptRef = el)}
        />

        <div>
          <div class="mb-3">
            <Button
              variant="primary"
              type="button"
              onClick={(event) => { event.preventDefault(); this.openPlaidLink(); }}
              disabled={this.isLoading}
              part={buttonPrimary}
            >
              Connect with Plaid {plaidLogo} (instant verification)
            </Button>
          </div>
          {renderErrorState()}
          {renderStatusState()}
        </div>
      </StyledHost>
    );
  }
}

