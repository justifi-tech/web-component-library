// Apple Pay Session Status
export enum ApplePaySessionStatus {
    STATUS_SUCCESS = 'STATUS_SUCCESS',
    STATUS_FAILURE = 'STATUS_FAILURE',
    STATUS_INVALID_BILLING_POSTAL_ADDRESS = 'STATUS_INVALID_BILLING_POSTAL_ADDRESS',
    STATUS_INVALID_SHIPPING_POSTAL_ADDRESS = 'STATUS_INVALID_SHIPPING_POSTAL_ADDRESS',
    STATUS_INVALID_SHIPPING_CONTACT = 'STATUS_INVALID_SHIPPING_CONTACT',
    STATUS_PIN_REQUIRED = 'STATUS_PIN_REQUIRED',
    STATUS_PIN_INCORRECT = 'STATUS_PIN_INCORRECT',
    STATUS_PIN_LOCKOUT = 'STATUS_PIN_LOCKOUT'
  }
  
  // Apple Pay Button Types
  export enum ApplePayButtonType {
    PLAIN = 'plain',
    BUY = 'buy',
    SET_UP = 'set-up',
    DONATE = 'donate',
    CHECK_OUT = 'check-out',
    BOOK = 'book',
    SUBSCRIBE = 'subscribe'
  }
  
  // Apple Pay Button Styles
  export enum ApplePayButtonStyle {
    BLACK = 'black',
    WHITE = 'white',
    WHITE_OUTLINE = 'white-outline'
  }
  
  // Apple Pay Capabilities
  export enum ApplePayMerchantCapability {
    SUPPORTS_3DS = 'supports3DS',
    SUPPORTS_EMV = 'supportsEMV',
    SUPPORTS_CREDIT = 'supportsCredit',
    SUPPORTS_DEBIT = 'supportsDebit'
  }
  
  // Apple Pay Contact Fields
  export enum ApplePayContactField {
    POSTAL_ADDRESS = 'postalAddress',
    PHONE = 'phone',
    EMAIL = 'email',
    NAME = 'name',
    PHONE_PHONETIC_NAME = 'phoneticName'
  }
  
  // Interfaces
  export interface IApplePayLineItem {
    label: string;
    amount: string;
    type?: 'final' | 'pending';
  }
  
  export interface IApplePayShippingMethod {
    label: string;
    amount: string;
    identifier: string;
    detail?: string;
  }
  
  export interface IApplePayPaymentContact {
    phoneNumber?: string;
    emailAddress?: string;
    givenName?: string;
    familyName?: string;
    phoneticGivenName?: string;
    phoneticFamilyName?: string;
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    country?: string;
    countryCode?: string;
  }
  
  export interface IApplePayPaymentMethod {
    displayName?: string;
    network?: string;
    type?: 'debit' | 'credit' | 'prepaid' | 'store';
    paymentPass?: any;
  }
  
  export interface IApplePayPaymentToken {
    paymentMethod: IApplePayPaymentMethod;
    transactionIdentifier: string;
    paymentData: any;
  }
  
  export interface IApplePayPayment {
    token: IApplePayPaymentToken;
    billingContact?: IApplePayPaymentContact;
    shippingContact?: IApplePayPaymentContact;
  }
  
  export interface IApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    merchantCapabilities: ApplePayMerchantCapability[];
    supportedNetworks: string[];
    total: IApplePayLineItem;
    lineItems?: IApplePayLineItem[];
    shippingMethods?: IApplePayShippingMethod[];
    requiredBillingContactFields?: ApplePayContactField[];
    requiredShippingContactFields?: ApplePayContactField[];
    billingContact?: IApplePayPaymentContact;
    shippingContact?: IApplePayPaymentContact;
    applicationData?: string;
    supportedCountries?: string[];
  }
  
  export interface IApplePaySession {
    canMakePayments(): boolean;
    canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
    supportsVersion(version: number): boolean;
    begin(): void;
    abort(): void;
    completeMerchantValidation(merchantSession: any): void;
    completePayment(result: { status: ApplePaySessionStatus }): void;
    completeShippingContactSelection(update: any): void;
    completeShippingMethodSelection(update: any): void;
    completePaymentMethodSelection(update: any): void;
    
    // Event handlers
    onvalidatemerchant?: (event: any) => void;
    onpaymentmethodselected?: (event: any) => void;
    onshippingcontactselected?: (event: any) => void;
    onshippingmethodselected?: (event: any) => void;
    onpaymentauthorized?: (event: any) => void;
    oncancel?: (event: any) => void;
  }
  
  export interface IApplePayConfig {
    merchantIdentifier: string;
    displayName: string;
    initiative: string;
    initiativeContext: string;
    buttonType?: ApplePayButtonType;
    buttonStyle?: ApplePayButtonStyle;
    buttonLocale?: string;
  }
  
  export interface IApplePayError {
    code: string;
    message: string;
    contactField?: ApplePayContactField;
  }
  
  export interface IApplePayValidationResponse {
    success: boolean;
    merchantSession?: any;
    error?: IApplePayError;
  }
  
  export interface IApplePayPaymentResponse {
    success: boolean;
    transactionId?: string;
    error?: IApplePayError;
  }
  
  // Apple Pay Configuration Class
  export class ApplePayConfig implements IApplePayConfig {
    public merchantIdentifier: string;
    public displayName: string;
    public initiative: string;
    public initiativeContext: string;
    public buttonType?: ApplePayButtonType;
    public buttonStyle?: ApplePayButtonStyle;
    public buttonLocale?: string;
  
    constructor(data: IApplePayConfig) {
      this.merchantIdentifier = data.merchantIdentifier;
      this.displayName = data.displayName;
      this.initiative = data.initiative;
      this.initiativeContext = data.initiativeContext;
      this.buttonType = data.buttonType || ApplePayButtonType.PLAIN;
      this.buttonStyle = data.buttonStyle || ApplePayButtonStyle.BLACK;
      this.buttonLocale = data.buttonLocale || 'en-US';
    }
  
    public get isValid(): boolean {
      return !!(
        this.merchantIdentifier &&
        this.displayName &&
        this.initiative &&
        this.initiativeContext
      );
    }
  }
  
  // Payment Request Builder Class
  export class ApplePayPaymentRequest implements IApplePayPaymentRequest {
    public countryCode: string;
    public currencyCode: string;
    public merchantCapabilities: ApplePayMerchantCapability[];
    public supportedNetworks: string[];
    public total: IApplePayLineItem;
    public lineItems?: IApplePayLineItem[];
    public shippingMethods?: IApplePayShippingMethod[];
    public requiredBillingContactFields?: ApplePayContactField[];
    public requiredShippingContactFields?: ApplePayContactField[];
    public billingContact?: IApplePayPaymentContact;
    public shippingContact?: IApplePayPaymentContact;
    public applicationData?: string;
    public supportedCountries?: string[];
  
    constructor(data: IApplePayPaymentRequest) {
      this.countryCode = data.countryCode;
      this.currencyCode = data.currencyCode;
      this.merchantCapabilities = data.merchantCapabilities;
      this.supportedNetworks = data.supportedNetworks;
      this.total = data.total;
      this.lineItems = data.lineItems;
      this.shippingMethods = data.shippingMethods;
      this.requiredBillingContactFields = data.requiredBillingContactFields;
      this.requiredShippingContactFields = data.requiredShippingContactFields;
      this.billingContact = data.billingContact;
      this.shippingContact = data.shippingContact;
      this.applicationData = data.applicationData;
      this.supportedCountries = data.supportedCountries;
    }
  
    public get isValid(): boolean {
      return !!(
        this.countryCode &&
        this.currencyCode &&
        this.merchantCapabilities?.length &&
        this.supportedNetworks?.length &&
        this.total?.label &&
        this.total?.amount
      );
    }
  }
  
  // Helper Methods
  export class ApplePayHelpers {
    static isApplePaySupported(): boolean {
      return typeof window !== 'undefined' && 
             'ApplePaySession' in window && 
             window.ApplePaySession?.supportsVersion(3);
    }
  
    static canMakePayments(): boolean {
      if (!this.isApplePaySupported()) {
        return false;
      }
      return window.ApplePaySession?.canMakePayments() || false;
    }
  
    static async canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean> {
      if (!this.isApplePaySupported()) {
        return false;
      }
      
      try {
        return await window.ApplePaySession?.canMakePaymentsWithActiveCard(merchantIdentifier) || false;
      } catch (error) {
        console.error('Error checking Apple Pay active card:', error);
        return false;
      }
    }
  
    static formatAmount(amount: number): string {
      return (amount / 100).toFixed(2);
    }
  
    static parseAmount(amount: string): number {
      return Math.round(parseFloat(amount) * 100);
    }
  
    static createLineItem(label: string, amount: number, type: 'final' | 'pending' = 'final'): IApplePayLineItem {
      return {
        label,
        amount: this.formatAmount(amount),
        type
      };
    }
  
    static getDefaultSupportedNetworks(): string[] {
      return [
        'amex',
        'discover',
        'masterCard',
        'visa'
      ];
    }
  
    static getDefaultMerchantCapabilities(): ApplePayMerchantCapability[] {
      return [
        ApplePayMerchantCapability.SUPPORTS_3DS,
        ApplePayMerchantCapability.SUPPORTS_EMV,
        ApplePayMerchantCapability.SUPPORTS_CREDIT,
        ApplePayMerchantCapability.SUPPORTS_DEBIT
      ];
    }
  }
  
  // Global Apple Pay Session interface for TypeScript
  declare global {
    interface Window {
      ApplePaySession?: {
        new (version: number, paymentRequest: IApplePayPaymentRequest): IApplePaySession;
        canMakePayments(): boolean;
        canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
        supportsVersion(version: number): boolean;
        STATUS_SUCCESS: number;
        STATUS_FAILURE: number;
        STATUS_INVALID_BILLING_POSTAL_ADDRESS: number;
        STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: number;
        STATUS_INVALID_SHIPPING_CONTACT: number;
        STATUS_PIN_REQUIRED: number;
        STATUS_PIN_INCORRECT: number;
        STATUS_PIN_LOCKOUT: number;
      };
    }
  }