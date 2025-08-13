import { configState } from '../../components/config-provider/config-state';
import {
  IApplePayConfig,
  IApplePayPaymentRequest,
  IApplePaySession,
  IApplePayError,
  ApplePaySessionStatus,
  ApplePayHelpers,
  ApplePayConfig,
  ApplePayPaymentRequest,
  IMerchantSession,
  IApplePayService,
  IApplePayPaymentProcessRequest,
  IApplePayPaymentResponse,
  IApplePayValidateEvent,
  IApplePayCancelEvent,
  IApplePayToken,
} from '../ApplePay';


export class ApplePayService implements IApplePayService {
  private applePayConfig?: ApplePayConfig;
  private currentSession?: IApplePaySession;
  private currentPaymentRequest?: ApplePayPaymentRequest;
  private apiBaseUrl: string = configState.apiOrigin;
  private authToken?: string;
  private accountId?: string;

  /**
   * Set custom API base URL
   */
  public setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  /**
   * Set authentication token
   */
  public setAuthToken(authToken: string): void {
    this.authToken = authToken;
  }

  public setAccountId(accountId: string) {
    this.accountId = accountId;
  }

  /**
   * Initialize Apple Pay configuration
   */
  public initialize(applePayConfig: IApplePayConfig): void {
    this.applePayConfig = new ApplePayConfig(applePayConfig);

    if (!this.applePayConfig.isValid) {
      throw new Error('Invalid Apple Pay configuration provided');
    }
  }

  /**
   * Validate merchant with Apple Pay servers via API 
   */
  async validateMerchant(authToken: string): Promise<IMerchantSession> {
    const endpoint = `${this.apiBaseUrl}/v1/apple_pay/merchant_session`;

    console.log('=== MERCHANT VALIDATION REQUEST ===');
    console.log('Endpoint:', endpoint);
    console.log('Auth token present:', !!authToken);
    console.log('Account ID:', this.accountId);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
        'Sub-Account': this.accountId,
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend validation failed - Raw response:', errorData);

      try {
        const jsonError = JSON.parse(errorData);
        console.error('Backend validation failed - Parsed error:', jsonError);
      } catch (parseError) {
        console.error('Could not parse error response as JSON:', parseError);
      }

      throw new Error(`Merchant validation failed: ${response.status}`);
    }

    const merchantSession: IMerchantSession = await response.json();
    console.log('Merchant session received:', merchantSession);

    return merchantSession;
  }

  /**
   * Process Apple Pay payment via API (fixed to match original logic)
   */
  async processPayment(
    authToken: string,
    payload: IApplePayPaymentProcessRequest
  ): Promise<{ success: boolean; data: IApplePayPaymentResponse }> {
    const endpoint = `${this.apiBaseUrl}/v1/apple_pay/process_token`;
    const body = payload;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
        'Sub-Account': this.accountId,
      },
      body: JSON.stringify(body),
    });

    const result: IApplePayPaymentResponse = await response.json();

    return {
      success: result.id && !!result.data.token,
      data: result,
    };
  }

  /**
   * Check if Apple Pay is available on this device/browser
   */
  public isAvailable(): boolean {
    return (
      ApplePayHelpers.isApplePaySupported() && ApplePayHelpers.canMakePayments()
    );
  }

  /**
   * Check if the user has an active card for the merchant
   */
  public async canMakePaymentsWithActiveCard(): Promise<boolean> {
    if (!this.applePayConfig) {
      throw new Error('Apple Pay not initialized. Call initialize() first.');
    }

    return await ApplePayHelpers.canMakePaymentsWithActiveCard(
      this.applePayConfig.merchantIdentifier
    );
  }

  /**
   * Start Apple Pay session
   */
  public async startPaymentSession(
    paymentRequest: IApplePayPaymentRequest
  ): Promise<{
    success: boolean;
    token?: IApplePayToken;
    error?: IApplePayError;
  }> {
    if (!this.applePayConfig) {
      throw new Error('Apple Pay not initialized. Call initialize() first.');
    }

    // if (!this.isAvailable()) {
    //   throw new Error('Apple Pay is not available on this device/browser');
    // }

    const request = new ApplePayPaymentRequest(paymentRequest);

    if (!request.isValid) {
      throw new Error('Invalid payment request provided');
    }

    this.currentPaymentRequest = request;

    return new Promise((resolve, reject) => {
      try {
        this.currentSession = new window.ApplePaySession!(3, request);

        this.setupSessionEventHandlers(resolve, reject);

        this.currentSession.begin();
      } catch (error) {
        reject({
          success: false,
          error: {
            code: 'SESSION_ERROR',
            message:
              error instanceof Error
                ? error.message
                : 'Failed to start Apple Pay session',
          },
        });
      }
    });
  }

  /**
   * Abort current Apple Pay session
   */
  public abortPaymentSession(): void {
    if (this.currentSession) {
      this.currentSession.abort();
      this.currentSession = undefined;
      this.currentPaymentRequest = undefined;
    }
  }

  /**
   * Setup Apple Pay session event handlers
   */
  private setupSessionEventHandlers(
    resolve: (value: {
      success: boolean;
      token?: IApplePayToken;
      error?: IApplePayError;
    }) => void,
    reject: (reason: { success: boolean; error: IApplePayError }) => void
  ): void {
    if (
      !this.currentSession ||
      !this.applePayConfig ||
      !this.currentPaymentRequest
    ) {
      return;
    }

    this.currentSession.onvalidatemerchant = async (
      event: IApplePayValidateEvent
    ) => {
      try {
        if (!this.authToken) {
          throw new Error(
            'Authentication token not set. Call setAuthToken() first.'
          );
        }

        const merchantSession = await this.validateMerchant(this.authToken);

        try {
          this.currentSession!.completeMerchantValidation(merchantSession);
        } catch (completionError) {
          console.error(
            'Error calling completeMerchantValidation:',
            completionError
          );
          throw completionError;
        }
      } catch (error) {
        console.error('=== MERCHANT VALIDATION ERROR ===');
        console.error('Error during merchant validation:', error);
        console.error('Error stack:', error.stack);
        this.currentSession!.abort();
        reject({
          success: false,
          error: {
            code: 'MERCHANT_VALIDATION_ERROR',
            message:
              error instanceof Error
                ? error.message
                : 'Merchant validation failed',
          },
        });
      }
    };

    this.currentSession.onpaymentauthorized = async (event: any) => {
      try {
        const payment = event.payment;

        const paymentPayload: IApplePayPaymentProcessRequest = {
          ...payment.token,
          product_details: {
            name: this.currentPaymentRequest!.total.label,
            price: ApplePayHelpers.parseAmount(
              this.currentPaymentRequest!.total.amount
            ),
            description: this.currentPaymentRequest!.total.label,
          },
        };

        if (!this.authToken) {
          throw new Error(
            'Authentication token not set. Call setAuthToken() first.'
          );
        }
        const paymentResult = await this.processPayment(
          this.authToken,
          paymentPayload
        );
        if (paymentResult.success) {
          this.currentSession!.completePayment({
            status: ApplePaySessionStatus.STATUS_SUCCESS,
          });
          resolve({
            success: true,
            token: payment.token,
          });
        } else {
          console.error('PSP reported payment failure:', paymentResult.data);
          this.currentSession!.completePayment({
            status: ApplePaySessionStatus.STATUS_FAILURE,
          });
          reject({
            success: false,
            error: {
              code: 'PAYMENT_PROCESSING_ERROR',
              message: 'Payment processing failed',
            },
          });
        }
      } catch (error) {
        console.error('=== PAYMENT PROCESSING ERROR ===');
        console.error('Error processing payment:', error);
        console.error('Error stack:', error.stack);
        this.currentSession!.completePayment({
          status: ApplePaySessionStatus.STATUS_FAILURE,
        });
        reject({
          success: false,
          error: {
            code: 'PAYMENT_PROCESSING_ERROR',
            message:
              error instanceof Error
                ? error.message
                : 'Payment processing failed',
          },
        });
      } finally {
        this.currentSession = undefined;
        this.currentPaymentRequest = undefined;
      }
    };

    this.currentSession.onpaymentmethodselected = () => {
      const paymentUpdate = {
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || [],
      };

      try {
        this.currentSession!.completePaymentMethodSelection(paymentUpdate);
      } catch (error) {
        console.error('Error completing payment method selection:', error);
        this.currentSession!.abort();
      }
    };

    this.currentSession.onshippingmethodselected = () => {
      this.currentSession!.completeShippingMethodSelection({
        status: ApplePaySessionStatus.STATUS_SUCCESS,
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || [],
      });
    };

    this.currentSession.oncancel = (event: IApplePayCancelEvent) => {
      if (event.sessionError) {
        console.error(event.sessionError);
        switch (event.sessionError.code) {
          case 'unknown':
            console.error('Unknown error - likely merchant validation issue');
            console.error('This usually means:');
            console.error('1. Merchant certificate is invalid or expired');
            console.error('2. Merchant identifier mismatch');
            console.error('3. Backend validation endpoint issues');
            break;
          case 'invalidMerchantSession':
            console.error('Invalid merchant session provided');
            console.error(
              'Check that the merchant session from backend is valid'
            );
            break;
          case 'userCancel':
            console.error('User cancelled the payment');
            break;
          default:
            console.error('Other error code:', event.sessionError.code);
        }
      }

      this.currentSession = undefined;
      this.currentPaymentRequest = undefined;
      reject({
        success: false,
        error: {
          code: 'USER_CANCELLED',
          message: 'User cancelled the Apple Pay session',
        },
      });
    };

    if ('onerror' in this.currentSession) {
      (this.currentSession as any).onerror = (error: Error) => {
        console.error('=== APPLE PAY SESSION ERROR ===');
        console.error('Session error:', error);
        this.currentSession = undefined;
        this.currentPaymentRequest = undefined;
        reject({
          success: false,
          error: {
            code: 'SESSION_ERROR',
            message: 'Apple Pay session error occurred',
          },
        });
      };
    }
  }

  /**
   * Create a basic payment request
   */
  public static createPaymentRequest(
    amount: number,
    label: string,
    countryCode: string = 'US',
    currencyCode: string = 'USD'
  ): IApplePayPaymentRequest {
    return {
      countryCode,
      currencyCode,
      merchantCapabilities: ApplePayHelpers.getDefaultMerchantCapabilities(),
      supportedNetworks: ApplePayHelpers.getDefaultSupportedNetworks(),
      total: ApplePayHelpers.createLineItem(label, amount),
    };
  }

  /**
   * Get current configuration
   */
  public getApplePayConfig(): ApplePayConfig | undefined {
    return this.applePayConfig;
  }
}
