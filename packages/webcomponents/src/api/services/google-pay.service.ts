import { Api } from '../Api';
import {
  IGooglePayConfig,
  IGooglePayPaymentDataRequest,
  IGooglePayClient,
  IGooglePayError,
  IGooglePayPaymentData,
  GooglePayHelpers,
  GooglePayConfig,
  GooglePayPaymentDataRequest,
  IGooglePayService,
  IGooglePayTokenProcessRequest,
  IGooglePayTokenResponse,
} from '../GooglePay';

const PROCESS_TOKEN_ENDPOINT = 'google_pay/process_token';

export class GooglePayService implements IGooglePayService {
  private googlePayConfig?: GooglePayConfig;
  private googlePayClient?: IGooglePayClient;
  private api = Api();

  /**
   * Initialize Google Pay configuration
   */
  public initialize(googlePayConfig: IGooglePayConfig): void {
    this.googlePayConfig = new GooglePayConfig(googlePayConfig);

    if (!this.googlePayConfig.isValid) {
      throw new Error('Invalid Google Pay configuration provided');
    }

    // Create Google Pay client
    this.googlePayClient = GooglePayHelpers.createGooglePayClient(
      this.googlePayConfig.environment
    );

    if (!this.googlePayClient) {
      throw new Error('Failed to create Google Pay client');
    }

    // No debug logs
  }

  /**
   * Process Google Pay payment via API
   */
  async processPayment(
    authToken: string,
    accountId: string,
    payload: IGooglePayTokenProcessRequest
  ): Promise<{ success: boolean; data: IGooglePayTokenResponse }> {
    const endpoint = PROCESS_TOKEN_ENDPOINT;

    try {
      const result: IGooglePayTokenResponse = await this.api.post({
        endpoint,
        authToken,
        body: payload,
        headers: {
          'sub-account': accountId,
        },
      });

      return {
        success: result.id && !!result.data.token,
        data: result,
      };
    } catch (_error) {
      throw new Error('Google Pay payment processing failed');
    }
  }

  /**
   * Check if Google Pay is available on this device/browser
   */
  public isAvailable(): boolean {
    return GooglePayHelpers.isGooglePaySupported() && !!this.googlePayClient;
  }

  /**
   * Check if the user can make payments with Google Pay
   */
  public async canMakePayments(): Promise<boolean> {
    if (!this.googlePayClient || !this.googlePayConfig) {
      return false;
    }

    try {
      const baseRequest = GooglePayHelpers.createBasePaymentDataRequest();
      const response = await this.googlePayClient.isReadyToPay(baseRequest);

      return response.result;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Start Google Pay payment session
   */
  public async startPaymentSession(
    paymentDataRequest: IGooglePayPaymentDataRequest,
    authToken: string,
    accountId: string
  ): Promise<{
    success: boolean;
    paymentData?: IGooglePayPaymentData;
    paymentMethodId?: string;
    error?: IGooglePayError;
  }> {
    if (!this.googlePayConfig || !this.googlePayClient) {
      throw new Error('Google Pay not initialized. Call initialize() first.');
    }

    if (!this.isAvailable()) {
      throw new Error('Google Pay is not available on this device/browser');
    }

    const request = new GooglePayPaymentDataRequest(paymentDataRequest);

    if (!request.isValid) {
      throw new Error('Invalid payment data request provided');
    }

    try {
      const paymentData = await this.googlePayClient.loadPaymentData(request);

      // Build top-level snake_case fields from Google Pay tokenizationData
      const tokenizationData = (paymentData as any)?.paymentMethodData
        ?.tokenizationData;
      const tokenObj = ((): any => {
        if (
          tokenizationData?.token &&
          typeof tokenizationData.token === 'string'
        ) {
          try {
            return JSON.parse(tokenizationData.token);
          } catch (_e) {
            return tokenizationData;
          }
        }
        return tokenizationData;
      })();

      const tokenProcessRequest: IGooglePayTokenProcessRequest = {
        protocolVersion: tokenObj?.protocolVersion,
        signature: tokenObj?.signature,
        intermediateSigningKey: tokenObj?.intermediateSigningKey
          ? {
              signedKey: tokenObj.intermediateSigningKey.signedKey,
              signatures: tokenObj.intermediateSigningKey.signatures,
            }
          : undefined,
        signedMessage: tokenObj?.signedMessage,
      };

      const paymentResult = await this.processPayment(
        authToken,
        accountId,
        tokenProcessRequest
      );

      if (paymentResult.success) {
        return {
          success: true,
          paymentData: paymentData,
          paymentMethodId: paymentResult.data.id,
        };
      } else {
        return {
          success: false,
          error: {
            code: 'PAYMENT_PROCESSING_ERROR',
            message: 'Payment processing failed',
          },
        };
      }
    } catch (error) {
      // Handle different types of errors
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const googlePayError = error as any;
        switch (googlePayError.statusCode) {
          case 'CANCELED':
            return {
              success: false,
              error: {
                code: 'USER_CANCELLED',
                message: 'User cancelled the Google Pay session',
              },
            };
          case 'DEVELOPER_ERROR':
            return {
              success: false,
              error: {
                code: 'DEVELOPER_ERROR',
                message: 'Google Pay configuration error',
              },
            };
          default:
            return {
              success: false,
              error: {
                code: 'PAYMENT_ERROR',
                message:
                  googlePayError.statusMessage || 'Google Pay payment failed',
              },
            };
        }
      }

      return {
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Google Pay payment failed',
        },
      };
    }
  }

  /**
   * Create Google Pay button element
   */
  public createButton(options: {
    onClick: () => void;
    buttonType?: string;
    buttonSizeMode?: string;
    buttonColor?: string;
    buttonLocale?: string;
  }): HTMLElement | null {
    if (!this.googlePayClient || !this.googlePayConfig) {
      return null;
    }

    try {
      return this.googlePayClient.createButton({
        onClick: options.onClick,
        buttonType: options.buttonType as any,
        buttonSizeMode: options.buttonSizeMode as any,
        buttonColor: options.buttonColor as any,
        buttonLocale: options.buttonLocale,
      });
    } catch (_error) {
      return null;
    }
  }

  /**
   * Prefetch payment data for faster loading
   */
  public prefetchPaymentData(
    paymentDataRequest: IGooglePayPaymentDataRequest
  ): void {
    if (!this.googlePayClient) {
      return;
    }

    const request = new GooglePayPaymentDataRequest(paymentDataRequest);

    if (!request.isValid) {
      return;
    }

    try {
      this.googlePayClient.prefetchPaymentData(request);
    } catch (_error) {}
  }

  /**
   * Create a basic payment data request
   */
  public static createPaymentDataRequest(
    amount: number,
    label: string,
    countryCode: string = 'US',
    currencyCode: string = 'USD',
    merchantName: string
  ): IGooglePayPaymentDataRequest {
    const request: IGooglePayPaymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [GooglePayHelpers.createPaymentMethodData()],
      transactionInfo: {
        countryCode,
        currencyCode,
        totalPriceStatus: 'FINAL',
        totalPrice: GooglePayHelpers.formatAmount(amount),
        totalPriceLabel: label,
      },
      merchantInfo: {
        merchantName,
      },
    };

    // No debug logs

    return request;
  }

  /**
   * Get current configuration
   */
  public getGooglePayConfig(): GooglePayConfig | undefined {
    return this.googlePayConfig;
  }

  /**
   * Get current Google Pay client
   */
  public getGooglePayClient(): IGooglePayClient | undefined {
    return this.googlePayClient;
  }
}
