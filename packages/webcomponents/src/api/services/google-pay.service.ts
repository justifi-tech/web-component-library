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
    this.googlePayClient = GooglePayHelpers.createGooglePayClient(this.googlePayConfig.environment);
    
    if (!this.googlePayClient) {
      throw new Error('Failed to create Google Pay client');
    }
  }

  /**
   * Process Google Pay payment via API
   */
  async processPayment(
    authToken: string,
    accountId: string,
    payload: IGooglePayTokenProcessRequest
  ): Promise<{ success: boolean; data: IGooglePayTokenResponse }> {
    const endpoint = 'google_pay/process_token';

    try {
      const result: IGooglePayTokenResponse = await this.api.post({
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
    } catch (error) {
      console.error('Google Pay payment processing failed:', error);
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
    } catch (error) {
      console.error('Error checking Google Pay readiness:', error);
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
  ): Promise<{ success: boolean; paymentData?: IGooglePayPaymentData; paymentMethodId?: string; error?: IGooglePayError }> {
    if (!this.googlePayConfig || !this.googlePayClient) {
      throw new Error('Google Pay not initialized. Call initialize() first.');
    }

    if (!this.isAvailable()) {
      throw new Error('Google Pay is not available on this device/browser');
    }

    const request = new GooglePayPaymentDataRequest(paymentDataRequest);
    
    // if (!request.isValid) {
      //   throw new Error('Invalid payment data request provided');
      // }
      
      try {
      console.log('request!', request)
      const paymentData = await this.googlePayClient.loadPaymentData(request);
      console.log('payment data', paymentData)
      
      // Process the payment token
      const tokenProcessRequest: IGooglePayTokenProcessRequest = {
        tokenizationData: paymentData.paymentMethodData.tokenizationData,
        paymentMethodData: paymentData.paymentMethodData,
        email: paymentData.email,
        shippingAddress: paymentData.shippingAddress,
        product_details: {
          name: request.transactionInfo.totalPriceLabel || 'Payment',
          price: GooglePayHelpers.parseAmount(request.transactionInfo.totalPrice),
          description: request.transactionInfo.totalPriceLabel || 'Payment'
        }
      };

      const paymentResult = await this.processPayment(authToken, accountId, tokenProcessRequest);
      
      if (paymentResult.success) {
        return {
          success: true,
          paymentData: paymentData,
          paymentMethodId: paymentResult.data.id
        };
      } else {
        return {
          success: false,
          error: {
            code: 'PAYMENT_PROCESSING_ERROR',
            message: 'Payment processing failed'
          }
        };
      }
    } catch (error) {
      console.error('Google Pay payment error:', error);
      
      // Handle different types of errors
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const googlePayError = error as any;
        switch (googlePayError.statusCode) {
          case 'CANCELED':
            return {
              success: false,
              error: {
                code: 'USER_CANCELLED',
                message: 'User cancelled the Google Pay session'
              }
            };
          case 'DEVELOPER_ERROR':
            return {
              success: false,
              error: {
                code: 'DEVELOPER_ERROR',
                message: 'Google Pay configuration error'
              }
            };
          default:
            return {
              success: false,
              error: {
                code: 'PAYMENT_ERROR',
                message: googlePayError.statusMessage || 'Google Pay payment failed'
              }
            };
        }
      }

      return {
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: error instanceof Error ? error.message : 'Google Pay payment failed'
        }
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
      console.error('Google Pay not initialized');
      return null;
    }

    try {
      return this.googlePayClient.createButton({
        onClick: options.onClick,
        buttonType: options.buttonType as any,
        buttonSizeMode: options.buttonSizeMode as any,
        buttonColor: options.buttonColor as any,
        buttonLocale: options.buttonLocale
      });
    } catch (error) {
      console.error('Error creating Google Pay button:', error);
      return null;
    }
  }

  /**
   * Prefetch payment data for faster loading
   */
  public prefetchPaymentData(paymentDataRequest: IGooglePayPaymentDataRequest): void {
    if (!this.googlePayClient) {
      console.warn('Google Pay client not initialized');
      return;
    }

    const request = new GooglePayPaymentDataRequest(paymentDataRequest);
    
    if (!request.isValid) {
      console.warn('Invalid payment data request for prefetch');
      return;
    }

    try {
      this.googlePayClient.prefetchPaymentData(request);
    } catch (error) {
      console.error('Error prefetching Google Pay data:', error);
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
    merchantId?: string
  ): IGooglePayPaymentDataRequest {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        GooglePayHelpers.createPaymentMethodData()
      ],
      transactionInfo: {
        countryCode,
        currencyCode,
        totalPriceStatus: 'FINAL',
        totalPrice: GooglePayHelpers.formatAmount(amount),
        totalPriceLabel: label
      },
      merchantInfo: {
        merchantId,
        merchantName
      }
    };
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