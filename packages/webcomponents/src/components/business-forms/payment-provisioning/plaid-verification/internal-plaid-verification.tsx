import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { Button, StyledHost } from '../../../../ui-components';
import { PlaidService } from '../../../../api/services/plaid.service';
import { ComponentErrorSeverity } from '../../../../api/ComponentError';
import {
  PlaidErrorCodes,
  PLAID_ERROR_MESSAGES,
  PLAID_ERROR_SEVERITY,
  PlaidError,
} from '../../../../api/Plaid';
import plaidLogoSvg from '../../../../assets/plaid-icon.svg';
import { buttonSecondary } from '../../../../styles/parts';

@Component({
  tag: 'internal-plaid-verification',
  shadow: false,
})
export class InternalPlaidVerification {
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

      console.log('getLinkToken', response.data);
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
      const response = await this.plaidService.postBankAccount(
        this.authToken,
        this.businessId,
        { public_token: publicToken, link_token_id: this.linkTokenId },
        this.abortController?.signal
      );

      console.log('postBankAccount', response);

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
      <StyledHost>
        <script
          src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
          async={true}
          ref={(el) => (this.scriptRef = el)}
        />

        <div>
          <div class="mb-3">
            <Button
              variant="secondary"
              type="button"
              onClick={(event) => { event.preventDefault(); this.openPlaidLink(); }}
              disabled={this.isLoading}
              part={buttonSecondary}
            >
              Link Bank Account with {plaidLogo}
            </Button>
          </div>
          {renderErrorState()}
          {renderStatusState()}
        </div>
      </StyledHost>
    );
  }
}

