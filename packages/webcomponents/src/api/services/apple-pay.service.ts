import { Api } from '../Api';
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
  IApplePayCancelEvent,
  IApplePayToken,
} from '../ApplePay';

// Centralized error codes for Apple Pay service
export enum ApplePayServiceErrorCode {
  UNAVAILABLE = 'UNAVAILABLE',
  SESSION_ERROR = 'SESSION_ERROR',
  MERCHANT_VALIDATION_ERROR = 'MERCHANT_VALIDATION_ERROR',
  PAYMENT_PROCESSING_ERROR = 'PAYMENT_PROCESSING_ERROR',
  USER_CANCELLED = 'USER_CANCELLED',
}

export class ApplePayService implements IApplePayService {
  private applePayConfig?: ApplePayConfig;
  private currentSession?: IApplePaySession;
  private currentPaymentRequest?: ApplePayPaymentRequest;
  private api = Api();

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
  async validateMerchant(
    authToken: string,
    accountId: string
  ): Promise<IMerchantSession> {
    const endpoint = 'apple_pay/merchant_session';

    try {
      const response = await this.api.post({
        endpoint,
        authToken,
        headers: {
          'Sub-Account': accountId,
        },
      });

      return response;
    } catch (error) {
      console.error('Backend validation failed:', error);
      throw new Error('Merchant validation failed');
    }
  }

  /**
   * Process Apple Pay payment via API (fixed to match original logic)
   */
  async processPayment(
    authToken: string,
    accountId: string,
    payload: IApplePayPaymentProcessRequest
  ): Promise<{ success: boolean; data: IApplePayPaymentResponse }> {
    const endpoint = 'apple_pay/process_token';

    const result: IApplePayPaymentResponse = await this.api.post({
      endpoint,
      authToken,
      body: payload,
      headers: {
        'Sub-Account': accountId,
      },
    });

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
    paymentRequest: IApplePayPaymentRequest,
    authToken: string,
    accountId: string
  ): Promise<{
    success: boolean;
    token?: IApplePayToken;
    paymentMethodId?: string;
    error?: IApplePayError;
  }> {
    // Begin verbose diagnostics for easier debugging in the field
    console.groupCollapsed('[ApplePayService] startPaymentSession called');
    console.log(
      '[ApplePayService] raw paymentRequest:',
      JSON.stringify(paymentRequest, null, 2)
    );
    console.log('[ApplePayService] has authToken:', Boolean(authToken));
    console.log('[ApplePayService] accountId:', accountId);
    console.log('[ApplePayService] has config:', Boolean(this.applePayConfig));

    if (!this.applePayConfig) {
      console.error(
        '[ApplePayService] Missing applePayConfig. Did you call initialize()?'
      );
      console.groupEnd();
      throw new Error('Apple Pay not initialized. Call initialize() first.');
    }

    // if (!this.isAvailable()) {
    //   throw new Error('Apple Pay is not available on this device/browser');
    // }

    const request = new ApplePayPaymentRequest(paymentRequest);
    console.log('[ApplePayService] created ApplePayPaymentRequest:', request);

    if (!request.isValid) {
      const missingFields: string[] = [];
      if (!request.countryCode) missingFields.push('countryCode');
      if (!request.currencyCode) missingFields.push('currencyCode');
      if (
        !request.merchantCapabilities ||
        request.merchantCapabilities.length === 0
      )
        missingFields.push('merchantCapabilities');
      if (!request.supportedNetworks || request.supportedNetworks.length === 0)
        missingFields.push('supportedNetworks');
      if (!request.total || !request.total.label || !request.total.amount)
        missingFields.push('total');
      console.error(
        '[ApplePayService] Payment request is invalid. Missing/invalid:',
        missingFields
      );
      console.groupEnd();
      throw new Error('Invalid payment request provided');
    }

    this.currentPaymentRequest = request;

    return new Promise((resolve, reject) => {
      try {
        console.log('[ApplePayService] About to instantiate ApplePaySession');
        // Defensive checks for Apple Pay environment
        if (typeof window === 'undefined' || !('ApplePaySession' in window)) {
          console.error(
            '[ApplePayService] ApplePaySession not available on window'
          );
          console.groupEnd();
          return reject({
            success: false,
            error: {
              code: ApplePayServiceErrorCode.UNAVAILABLE,
              message:
                'ApplePaySession API is not available in this environment',
            },
          });
        }

        this.currentSession = new window.ApplePaySession!(3, request);
        console.log(
          '[ApplePayService] ApplePaySession instantiated:',
          this.currentSession
        );

        this.setupSessionEventHandlers(resolve, reject, authToken, accountId);
        console.log(
          '[ApplePayService] Event handlers set. Beginning session...'
        );

        this.currentSession.begin();
        console.log('[ApplePayService] Session.begin() called');
        console.groupEnd();
      } catch (error) {
        console.error(
          '[ApplePayService] Exception while starting session:',
          error
        );
        console.groupEnd();
        reject({
          success: false,
          error: {
            code: ApplePayServiceErrorCode.SESSION_ERROR,
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
      paymentMethodId?: string;
      error?: IApplePayError;
    }) => void,
    reject: (reason: { success: boolean; error: IApplePayError }) => void,
    authToken: string,
    accountId: string
  ): void {
    if (
      !this.currentSession ||
      !this.applePayConfig ||
      !this.currentPaymentRequest
    ) {
      console.error(
        '[ApplePayService] setupSessionEventHandlers called without required state',
        {
          hasSession: Boolean(this.currentSession),
          hasConfig: Boolean(this.applePayConfig),
          hasPaymentRequest: Boolean(this.currentPaymentRequest),
        }
      );
      return;
    }

    this.currentSession.onvalidatemerchant = async () => {
      console.groupCollapsed('[ApplePayService] onvalidatemerchant');
      try {
        console.log('[ApplePayService] accountId:', accountId);
        if (!authToken) {
          console.error(
            '[ApplePayService] Missing authToken for merchant validation'
          );
          throw new Error('Authentication token not provided.');
        }

        const merchantSession = await this.validateMerchant(
          authToken,
          accountId
        );
        console.log('[ApplePayService] merchantSession received');

        try {
          this.currentSession!.completeMerchantValidation(merchantSession);
          console.log('[ApplePayService] completeMerchantValidation called');
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
        if (error && (error as any).stack) {
          console.error('Error stack:', (error as any).stack);
        }
        this.currentSession!.abort();
        reject({
          success: false,
          error: {
            code: ApplePayServiceErrorCode.MERCHANT_VALIDATION_ERROR,
            message:
              error instanceof Error
                ? error.message
                : 'Merchant validation failed',
          },
        });
      }
      console.groupEnd();
    };

    this.currentSession.onpaymentauthorized = async (event: any) => {
      console.groupCollapsed('[ApplePayService] onpaymentauthorized');
      try {
        const payment = event.payment;
        console.log('[ApplePayService] payment payload snapshot:', {
          hasToken: Boolean(payment?.token),
          tokenType: payment?.token?.paymentData ? 'paymentData' : 'raw',
        });

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
        console.log('[ApplePayService] paymentPayload prepared');

        const paymentResult = await this.processPayment(
          authToken,
          accountId,
          paymentPayload
        );
        console.log('[ApplePayService] processPayment result:', paymentResult);

        if (paymentResult.success) {
          this.currentSession!.completePayment({
            status: ApplePaySessionStatus.STATUS_SUCCESS,
          });
          console.log('[ApplePayService] Payment success; resolving');
          resolve({
            success: true,
            token: payment.token,
            paymentMethodId: paymentResult.data.id,
          });
        } else {
          console.error('PSP reported payment failure:', paymentResult.data);
          this.currentSession!.completePayment({
            status: ApplePaySessionStatus.STATUS_FAILURE,
          });
          reject({
            success: false,
            error: {
              code: ApplePayServiceErrorCode.PAYMENT_PROCESSING_ERROR,
              message: 'Payment processing failed',
            },
          });
        }
      } catch (error) {
        console.error('=== PAYMENT PROCESSING ERROR ===');
        console.error('Error processing payment:', error);
        if (error && (error as any).stack) {
          console.error('Error stack:', (error as any).stack);
        }
        this.currentSession!.completePayment({
          status: ApplePaySessionStatus.STATUS_FAILURE,
        });
        reject({
          success: false,
          error: {
            code: ApplePayServiceErrorCode.PAYMENT_PROCESSING_ERROR,
            message:
              error instanceof Error
                ? error.message
                : 'Payment processing failed',
          },
        });
      } finally {
        console.log('[ApplePayService] Cleaning up session state');
        this.currentSession = undefined;
        this.currentPaymentRequest = undefined;
      }
      console.groupEnd();
    };

    this.currentSession.onpaymentmethodselected = () => {
      console.groupCollapsed('[ApplePayService] onpaymentmethodselected');
      const paymentUpdate = {
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || [],
      };

      try {
        this.currentSession!.completePaymentMethodSelection(paymentUpdate);
        console.log('[ApplePayService] completePaymentMethodSelection called');
      } catch (error) {
        console.error('Error completing payment method selection:', error);
        this.currentSession!.abort();
      }
      console.groupEnd();
    };

    this.currentSession.onshippingmethodselected = () => {
      console.groupCollapsed('[ApplePayService] onshippingmethodselected');
      this.currentSession!.completeShippingMethodSelection({
        status: ApplePaySessionStatus.STATUS_SUCCESS,
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || [],
      });
      console.log('[ApplePayService] completeShippingMethodSelection called');
      console.groupEnd();
    };

    this.currentSession.oncancel = (event: IApplePayCancelEvent) => {
      console.groupCollapsed('[ApplePayService] oncancel');
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
          code: ApplePayServiceErrorCode.USER_CANCELLED,
          message: 'User cancelled the Apple Pay session',
        },
      });
      console.groupEnd();
    };

    if ('onerror' in this.currentSession) {
      (this.currentSession as any).onerror = (error: Error) => {
        console.groupCollapsed('[ApplePayService] onerror');
        console.error('=== APPLE PAY SESSION ERROR ===');
        console.error('Session error:', error);
        this.currentSession = undefined;
        this.currentPaymentRequest = undefined;
        reject({
          success: false,
          error: {
            code: ApplePayServiceErrorCode.SESSION_ERROR,
            message: 'Apple Pay session error occurred',
          },
        });
        console.groupEnd();
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
