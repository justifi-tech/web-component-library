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
    console.log('[GooglePayService] initialize: Starting initialization', {
      config: googlePayConfig,
    });

    this.googlePayConfig = new GooglePayConfig(googlePayConfig);
    console.log('[GooglePayService] initialize: Config object created', {
      isValid: this.googlePayConfig.isValid,
      environment: this.googlePayConfig.environment,
      merchantId: this.googlePayConfig.merchantId,
    });

    if (!this.googlePayConfig.isValid) {
      console.error('[GooglePayService] initialize: Invalid configuration');
      throw new Error('Invalid Google Pay configuration provided');
    }

    // Create Google Pay client
    console.log('[GooglePayService] initialize: Creating Google Pay client', {
      environment: this.googlePayConfig.environment,
    });
    this.googlePayClient = GooglePayHelpers.createGooglePayClient(
      this.googlePayConfig.environment
    );

    if (!this.googlePayClient) {
      console.error('[GooglePayService] initialize: Failed to create client');
      throw new Error('Failed to create Google Pay client');
    }

    console.log('[GooglePayService] initialize: Client created successfully', {
      hasClient: !!this.googlePayClient,
    });
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
    console.log('[GooglePayService] processPayment: Starting', {
      endpoint,
      hasAuthToken: !!authToken,
      accountId,
      payload,
    });

    try {
      const result: IGooglePayTokenResponse = await this.api.post({
        endpoint,
        authToken,
        body: payload,
        headers: {
          'sub-account': accountId,
        },
      });

      console.log('[GooglePayService] processPayment: API response received', {
        hasId: !!result.id,
        hasToken: !!result.data?.token,
        result,
      });

      const success = result.id && !!result.data.token;
      console.log('[GooglePayService] processPayment: Result', { success });

      return {
        success,
        data: result,
      };
    } catch (error) {
      console.error('[GooglePayService] processPayment: API error', error);
      throw new Error('Google Pay payment processing failed');
    }
  }

  /**
   * Check if Google Pay is available on this device/browser
   */
  public isAvailable(): boolean {
    const isSupported = GooglePayHelpers.isGooglePaySupported();
    const hasClient = !!this.googlePayClient;
    const result = isSupported && hasClient;
    console.log('[GooglePayService] isAvailable:', {
      isSupported,
      hasClient,
      result,
    });
    return result;
  }

  /**
   * Check if the user can make payments with Google Pay
   */
  public async canMakePayments(): Promise<boolean> {
    console.log('[GooglePayService] canMakePayments: Checking', {
      hasClient: !!this.googlePayClient,
      hasConfig: !!this.googlePayConfig,
    });

    if (!this.googlePayClient || !this.googlePayConfig) {
      console.warn(
        '[GooglePayService] canMakePayments: Missing client or config'
      );
      return false;
    }

    try {
      const baseRequest = GooglePayHelpers.createBasePaymentDataRequest();
      console.log('[GooglePayService] canMakePayments: Calling isReadyToPay', {
        baseRequest,
      });
      const response = await this.googlePayClient.isReadyToPay(baseRequest);
      console.log('[GooglePayService] canMakePayments: Response received', {
        result: response.result,
        response,
      });

      return response.result;
    } catch (error) {
      console.error('[GooglePayService] canMakePayments: Error', error);
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
    console.log('[GooglePayService] startPaymentSession: Starting', {
      hasConfig: !!this.googlePayConfig,
      hasClient: !!this.googlePayClient,
      hasAuthToken: !!authToken,
      accountId,
      paymentDataRequest,
    });

    if (!this.googlePayConfig || !this.googlePayClient) {
      console.error('[GooglePayService] startPaymentSession: Not initialized');
      throw new Error('Google Pay not initialized. Call initialize() first.');
    }

    if (!this.isAvailable()) {
      console.error('[GooglePayService] startPaymentSession: Not available');
      throw new Error('Google Pay is not available on this device/browser');
    }

    const request = new GooglePayPaymentDataRequest(paymentDataRequest);
    console.log(
      '[GooglePayService] startPaymentSession: Request object created',
      {
        isValid: request.isValid,
        request,
      }
    );

    if (!request.isValid) {
      console.error('[GooglePayService] startPaymentSession: Invalid request');
      throw new Error('Invalid payment data request provided');
    }

    try {
      console.log(
        '[GooglePayService] startPaymentSession: Loading payment data...'
      );
      const paymentData = await this.googlePayClient.loadPaymentData(request);
      console.log(
        '[GooglePayService] startPaymentSession: Payment data loaded',
        {
          hasPaymentData: !!paymentData,
          paymentMethodData: paymentData?.paymentMethodData,
        }
      );

      // Build top-level snake_case fields from Google Pay tokenizationData
      const tokenizationData = (paymentData as any)?.paymentMethodData
        ?.tokenizationData;
      console.log(
        '[GooglePayService] startPaymentSession: Extracted tokenization data',
        {
          hasTokenizationData: !!tokenizationData,
          tokenizationData,
        }
      );

      const tokenObj = ((): any => {
        if (
          tokenizationData?.token &&
          typeof tokenizationData.token === 'string'
        ) {
          try {
            const parsed = JSON.parse(tokenizationData.token);
            console.log(
              '[GooglePayService] startPaymentSession: Parsed token',
              parsed
            );
            return parsed;
          } catch (_e) {
            console.warn(
              '[GooglePayService] startPaymentSession: Failed to parse token, using raw',
              _e
            );
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
      console.log(
        '[GooglePayService] startPaymentSession: Token process request created',
        {
          hasProtocolVersion: !!tokenProcessRequest.protocolVersion,
          hasSignature: !!tokenProcessRequest.signature,
          hasSignedMessage: !!tokenProcessRequest.signedMessage,
          hasIntermediateSigningKey:
            !!tokenProcessRequest.intermediateSigningKey,
        }
      );

      console.log(
        '[GooglePayService] startPaymentSession: Processing payment...'
      );
      const paymentResult = await this.processPayment(
        authToken,
        accountId,
        tokenProcessRequest
      );
      console.log(
        '[GooglePayService] startPaymentSession: Payment processed',
        paymentResult
      );

      if (paymentResult.success) {
        console.log(
          '[GooglePayService] startPaymentSession: Payment successful',
          {
            paymentMethodId: paymentResult.data.id,
          }
        );
        return {
          success: true,
          paymentData: paymentData,
          paymentMethodId: paymentResult.data.id,
        };
      } else {
        console.error(
          '[GooglePayService] startPaymentSession: Payment processing failed'
        );
        return {
          success: false,
          error: {
            code: 'PAYMENT_PROCESSING_ERROR',
            message: 'Payment processing failed',
          },
        };
      }
    } catch (error) {
      console.error(
        '[GooglePayService] startPaymentSession: Exception caught',
        error
      );
      // Handle different types of errors
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const googlePayError = error as any;
        console.log(
          '[GooglePayService] startPaymentSession: Google Pay error',
          {
            statusCode: googlePayError.statusCode,
            statusMessage: googlePayError.statusMessage,
          }
        );
        switch (googlePayError.statusCode) {
          case 'CANCELED':
            console.log(
              '[GooglePayService] startPaymentSession: User cancelled'
            );
            return {
              success: false,
              error: {
                code: 'USER_CANCELLED',
                message: 'User cancelled the Google Pay session',
              },
            };
          case 'DEVELOPER_ERROR':
            console.error(
              '[GooglePayService] startPaymentSession: Developer error'
            );
            return {
              success: false,
              error: {
                code: 'DEVELOPER_ERROR',
                message: 'Google Pay configuration error',
              },
            };
          default:
            console.error(
              '[GooglePayService] startPaymentSession: Unknown error',
              {
                statusCode: googlePayError.statusCode,
              }
            );
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

      console.error(
        '[GooglePayService] startPaymentSession: Generic error',
        error
      );
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
    console.log('[GooglePayService] prefetchPaymentData: Starting', {
      hasClient: !!this.googlePayClient,
      paymentDataRequest,
    });

    if (!this.googlePayClient) {
      console.warn(
        '[GooglePayService] prefetchPaymentData: No client available'
      );
      return;
    }

    const request = new GooglePayPaymentDataRequest(paymentDataRequest);
    console.log('[GooglePayService] prefetchPaymentData: Request created', {
      isValid: request.isValid,
    });

    if (!request.isValid) {
      console.warn('[GooglePayService] prefetchPaymentData: Invalid request');
      return;
    }

    try {
      console.log(
        '[GooglePayService] prefetchPaymentData: Calling prefetchPaymentData'
      );
      this.googlePayClient.prefetchPaymentData(request);
      console.log('[GooglePayService] prefetchPaymentData: Prefetch complete');
    } catch (error) {
      console.error('[GooglePayService] prefetchPaymentData: Error', error);
    }
  }

  /**
   * Create a basic payment data request
   */
  public static createPaymentDataRequest(
    amount: number,
    label: string,
    countryCode: string = 'US',
    currencyCode: string = 'USD',
    merchantName: string,
    merchantId: string
  ): IGooglePayPaymentDataRequest {
    console.log(
      '[GooglePayService] createPaymentDataRequest: Creating request',
      {
        amount,
        label,
        countryCode,
        currencyCode,
        merchantName,
      }
    );

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
        merchantId,
        merchantName,
      },
    };

    console.log(
      '[GooglePayService] createPaymentDataRequest: Request created',
      {
        apiVersion: request.apiVersion,
        apiVersionMinor: request.apiVersionMinor,
        transactionInfo: request.transactionInfo,
        merchantInfo: request.merchantInfo,
        allowedPaymentMethodsCount: request.allowedPaymentMethods?.length,
      }
    );

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
