// import { IApiResponse } from '..';
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
  IApplePayMerchantValidationRequest,
  IApplePayPaymentProcessRequest,
  IApplePayPaymentResponse,
  IApplePayValidateEvent,
  IApplePayMethodSelectedEvent,
  IApplePayCancelEvent
} from '../ApplePay';


const isValidMerchantSession = (merchantSession: IMerchantSession): boolean => {
  const requiredFields: (keyof IMerchantSession)[] = ['merchantSessionIdentifier', 'nonce', 'merchantIdentifier', 'epochTimestamp', 'expiresAt'];
  const missingFields = requiredFields.filter(field => !merchantSession[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing required fields in merchant session:', missingFields);
    console.error('Available fields:', Object.keys(merchantSession));
    return false;
  }

  const now = Date.now();
  if (merchantSession.expiresAt && merchantSession.expiresAt < now) {
    console.error('Merchant session is expired:', {
      expiresAt: merchantSession.expiresAt,
      currentTime: now,
      expired: merchantSession.expiresAt < now
    });
    return false;
  }

  return true;
};

export class ApplePayService implements IApplePayService {
  private applePayConfig?: ApplePayConfig;
  private currentSession?: IApplePaySession;
  private currentPaymentRequest?: ApplePayPaymentRequest;
  private apiBaseUrl: string = 'https://ahalaburda.zapto.org/api/v1';

  /**
   * Set custom API base URL
   */
  public setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
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
   * Validate merchant with Apple Pay servers via API (fixed to match original logic)
   */
  async validateMerchant(
    payload: IApplePayMerchantValidationRequest
  ): Promise<IMerchantSession> {
    const endpoint = `${this.apiBaseUrl}/apple_pay/validate_merchant_session`;
    const body = payload;

    console.log('Making request to backend for merchant validation...');
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response ok:", response.ok);

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
    console.log('=== MERCHANT SESSION RECEIVED ===');
    console.log("Merchant session data:", merchantSession);
    
    return merchantSession;
  }

  /**
   * Process Apple Pay payment via API (fixed to match original logic)
   */
  async processPayment(
    payload: IApplePayPaymentProcessRequest
  ): Promise<{ success: boolean; data: IApplePayPaymentResponse }> {
    const endpoint = `${this.apiBaseUrl}/apple_pay/process_token`;
    const body = payload;

    console.log('PSP request body:', body);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log('PSP response status:', response.status);
    console.log('PSP response ok:', response.ok);

    const result: IApplePayPaymentResponse = await response.json();
    console.log('PSP result:', result);

    return {
      success: response.ok && result.status === 'success',
      data: result
    };
  }

  /**
   * Check if Apple Pay is available on this device/browser
   */
  public isAvailable(): boolean {
    return ApplePayHelpers.isApplePaySupported() && ApplePayHelpers.canMakePayments();
  }

  /**
   * Check if the user has an active card for the merchant
   */
  public async canMakePaymentsWithActiveCard(): Promise<boolean> {
    if (!this.applePayConfig) {
      throw new Error('Apple Pay not initialized. Call initialize() first.');
    }

    return await ApplePayHelpers.canMakePaymentsWithActiveCard(this.applePayConfig.merchantIdentifier);
  }

  /**
   * Start Apple Pay session
   */
  public async startPaymentSession(
    paymentRequest: IApplePayPaymentRequest
  ): Promise<{ success: boolean; error?: IApplePayError }> {
    if (!this.applePayConfig) {
      throw new Error('Apple Pay not initialized. Call initialize() first.');
    }

    if (!this.isAvailable()) {
      throw new Error('Apple Pay is not available on this device/browser');
    }

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
            message: error instanceof Error ? error.message : 'Failed to start Apple Pay session'
          }
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
    resolve: (value: { success: boolean; transactionId?: string; error?: IApplePayError }) => void,
    reject: (reason: { success: boolean; error: IApplePayError }) => void
  ): void {
    if (!this.currentSession || !this.applePayConfig || !this.currentPaymentRequest) {
      return;
    }

    this.currentSession.onvalidatemerchant = async (event: IApplePayValidateEvent) => {
      console.log('=== MERCHANT VALIDATION STARTED ===');
      console.log("Merchant: onvalidatemerchant event:", event);
      console.log("Validation URL:", event.validationURL);
      
      try {
        const validationPayload: IApplePayMerchantValidationRequest = {
          validation_url: event.validationURL,
        };

        const merchantSession = await this.validateMerchant(validationPayload);
        
        if (merchantSession && isValidMerchantSession(merchantSession)) {
          console.log('Merchant session validation passed, calling completeMerchantValidation...');
          console.log('Session object before completion:', this.currentSession);
          
          try {
            this.currentSession!.completeMerchantValidation(merchantSession);
            console.log('✅ completeMerchantValidation called successfully');
          } catch (completionError) {
            console.error('❌ Error calling completeMerchantValidation:', completionError);
            throw completionError;
          }
        } else {
          this.currentSession!.abort();
          reject({
            success: false,
            error: {
              code: 'MERCHANT_VALIDATION_ERROR',
              message: 'Merchant validation failed'
            }
          });
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
            message: error instanceof Error ? error.message : 'Merchant validation failed'
          }
        });
      }
    };

    this.currentSession.onpaymentauthorized = async (event: any) => {
      console.log('=== PAYMENT AUTHORIZATION STARTED ===');
      console.log("Payment authorized event:", event);
      console.log("Payment token:", event.payment.token);
      console.log("Billing contact:", event.payment.billingContact);

      try {
        const payment = event.payment;
        
        const paymentPayload: IApplePayPaymentProcessRequest = {
          ...payment.token,
          billing_contact: payment.billingContact ? {
            given_name: payment.billingContact.givenName,
            family_name: payment.billingContact.familyName,
            address_lines: payment.billingContact.addressLines,
            locality: payment.billingContact.locality,
            administrative_area: payment.billingContact.administrativeArea,
            postal_code: payment.billingContact.postalCode,
            country_code: payment.billingContact.countryCode
          } : null,
          product_details: {
            name: this.currentPaymentRequest!.total.label,
            price: ApplePayHelpers.parseAmount(this.currentPaymentRequest!.total.amount),
            description: this.currentPaymentRequest!.total.label
          }
        };

        console.log('Sending payment token to PSP...');
        const paymentResult = await this.processPayment(paymentPayload);
        
        if (paymentResult.success) {
          console.log('✅ Payment successful via PSP:', paymentResult.data);
          this.currentSession!.completePayment({
            status: ApplePaySessionStatus.STATUS_SUCCESS
          });
          resolve({
            success: true,
          });
        } else {
          console.error('❌ PSP reported payment failure:', paymentResult.data);
          this.currentSession!.completePayment({
            status: ApplePaySessionStatus.STATUS_FAILURE
          });
          reject({
            success: false,
            error: {
              code: 'PAYMENT_PROCESSING_ERROR',
              message: 'Payment processing failed'
            }
          });
        }
      } catch (error) {
        console.error('=== PAYMENT PROCESSING ERROR ===');
        console.error('Error processing payment:', error);
        console.error('Error stack:', error.stack);
        this.currentSession!.completePayment({
          status: ApplePaySessionStatus.STATUS_FAILURE
        });
        reject({
          success: false,
          error: {
            code: 'PAYMENT_PROCESSING_ERROR',
            message: error instanceof Error ? error.message : 'Payment processing failed'
          }
        });
      } finally {
        this.currentSession = undefined;
        this.currentPaymentRequest = undefined;
      }
    };

    this.currentSession.onpaymentmethodselected = (event: IApplePayMethodSelectedEvent) => {
      console.log('=== PAYMENT METHOD SELECTED ===');
      console.log("Payment method selected event:", event);
      console.log("Payment method:", event.paymentMethod);
      
      const paymentUpdate = {
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || []
      };
      
      console.log('Completing payment method selection with:', paymentUpdate);
      
      try {
        this.currentSession!.completePaymentMethodSelection(paymentUpdate);
        console.log('✅ Payment method selection completed successfully');
      } catch (error) {
        console.error('❌ Error completing payment method selection:', error);
        this.currentSession!.abort();
      }
    };

    this.currentSession.onshippingcontactselected = () => {
      this.currentSession!.completeShippingContactSelection({
        status: ApplePaySessionStatus.STATUS_SUCCESS,
        newShippingMethods: this.currentPaymentRequest!.shippingMethods || [],
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || []
      });
    };

    this.currentSession.onshippingmethodselected = () => {
      this.currentSession!.completeShippingMethodSelection({
        status: ApplePaySessionStatus.STATUS_SUCCESS,
        newTotal: this.currentPaymentRequest!.total,
        newLineItems: this.currentPaymentRequest!.lineItems || []
      });
    };

    this.currentSession.oncancel = (event: IApplePayCancelEvent) => {
      console.log('=== APPLE PAY SESSION CANCELLED ===');
      console.log("Payment cancelled event:", event);
      console.log("Session error:", event.sessionError);
      
      if (event.sessionError) {
        console.log("Error code:", event.sessionError.code);
        console.log("Error info:", event.sessionError.info);
        
        switch(event.sessionError.code) {
          case 'unknown':
            console.error('❌ Unknown error - likely merchant validation issue');
            console.error('This usually means:');
            console.error('1. Merchant certificate is invalid or expired');
            console.error('2. Merchant identifier mismatch');
            console.error('3. Backend validation endpoint issues');
            break;
          case 'invalidMerchantSession':
            console.error('❌ Invalid merchant session provided');
            console.error('Check that the merchant session from backend is valid');
            break;
          case 'userCancel':
            console.log('ℹ️ User cancelled the payment');
            break;
          default:
            console.error('❌ Other error code:', event.sessionError.code);
        }
      } else {
        console.log('ℹ️ Payment cancelled without specific error');
      }

      this.currentSession = undefined;
      this.currentPaymentRequest = undefined;
      reject({
        success: false,
        error: {
          code: 'USER_CANCELLED',
          message: 'User cancelled the Apple Pay session'
        }
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
            message: 'Apple Pay session error occurred'
          }
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
      total: ApplePayHelpers.createLineItem(label, amount)
    };
  }

  /**
   * Get current configuration
   */
  public getApplePayConfig(): ApplePayConfig | undefined {
    return this.applePayConfig;
  }
}