import { PagingInfo } from './Pagination';

export enum GooglePayButtonType {
  PLAIN = 'plain',
  BUY = 'buy',
  BOOK = 'book',
  CHECKOUT = 'checkout',
  DONATE = 'donate',
  ORDER = 'order',
  PAY = 'pay',
  SUBSCRIBE = 'subscribe',
}

export enum GooglePayButtonStyle {
  BLACK = 'black',
  WHITE = 'white',
}

export enum GooglePayButtonSizeMode {
  STATIC = 'static',
  FILL = 'fill',
}

export enum GooglePayEnvironment {
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export interface IGooglePayLineItem {
  label: string;
  price: string;
  type: 'LINE_ITEM' | 'SUBTOTAL';
}

export interface IGooglePayMerchantInfo {
  merchantId?: string;
  merchantName: string;
}

export interface IGooglePayCardParameters {
  allowedAuthMethods: string[];
  allowedCardNetworks: string[];
  billingAddressRequired?: boolean;
  billingAddressParameters?: {
    format?: 'FULL' | 'MIN';
    phoneNumberRequired?: boolean;
  };
}

export interface IGooglePayTokenizationSpecification {
  type: 'PAYMENT_GATEWAY' | 'DIRECT';
  parameters?: {
    gateway?: string;
    gatewayMerchantId?: string;
    [key: string]: any;
  };
}

export interface IGooglePayPaymentMethodData {
  type: 'CARD';
  parameters: IGooglePayCardParameters;
  tokenizationSpecification: IGooglePayTokenizationSpecification;
}

export interface IGooglePayTransactionInfo {
  displayItems?: IGooglePayLineItem[];
  countryCode: string;
  currencyCode: string;
  totalPriceStatus: 'FINAL' | 'ESTIMATED' | 'NOT_CURRENTLY_KNOWN';
  totalPrice: string;
  totalPriceLabel?: string;
  checkoutOption?: 'DEFAULT' | 'COMPLETE_IMMEDIATE_PURCHASE';
}

export interface IGooglePayPaymentDataRequest {
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: IGooglePayPaymentMethodData[];
  transactionInfo: IGooglePayTransactionInfo;
  merchantInfo: IGooglePayMerchantInfo;
  callbackIntents?: string[];
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: {
    allowedCountryCodes?: string[];
    phoneNumberRequired?: boolean;
  };
  emailRequired?: boolean;
}

export interface IGooglePayConfig {
  environment: GooglePayEnvironment;
  merchantId?: string;
  merchantName: string;
  buttonType?: GooglePayButtonType;
  buttonStyle?: GooglePayButtonStyle;
  buttonSizeMode?: GooglePayButtonSizeMode;
  buttonLocale?: string;
}

export interface IGooglePayError {
  code: string;
  message: string;
}

export interface IGooglePayTokenData {
  protocolVersion: string;
  signature: string;
  intermediateSigningKey?: {
    signedKey: string;
    signatures: string[];
  };
  signedMessage: string;
}

export interface IGooglePayPaymentMethod {
  type: string;
  description: string;
  info: {
    cardNetwork: string;
    cardDetails: string;
    assuranceDetails?: {
      accountVerified: boolean;
      cardHolderAuthenticated: boolean;
    };
    billingAddress?: {
      address1: string;
      address2?: string;
      address3?: string;
      administrativeArea: string;
      countryCode: string;
      locality: string;
      name: string;
      postalCode: string;
      sortingCode?: string;
    };
  };
  tokenizationData: IGooglePayTokenData;
}

export interface IGooglePayPaymentData {
  apiVersion: number;
  apiVersionMinor: number;
  paymentMethodData: IGooglePayPaymentMethod;
  email?: string;
  shippingAddress?: {
    address1: string;
    address2?: string;
    address3?: string;
    administrativeArea: string;
    countryCode: string;
    locality: string;
    name: string;
    postalCode: string;
    sortingCode?: string;
  };
}

export interface IGooglePayClient {
  isReadyToPay(request: {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: IGooglePayPaymentMethodData[];
  }): Promise<{ result: boolean; paymentMethodPresent?: boolean }>;
  loadPaymentData(
    request: IGooglePayPaymentDataRequest
  ): Promise<IGooglePayPaymentData>;
  createButton(options: {
    onClick: () => void;
    buttonType?: GooglePayButtonType;
    buttonSizeMode?: GooglePayButtonSizeMode;
    buttonColor?: GooglePayButtonStyle;
    buttonLocale?: string;
  }): HTMLElement;
  prefetchPaymentData(request: IGooglePayPaymentDataRequest): void;
}

export interface IGooglePayTokenProcessRequest {
  tokenizationData: IGooglePayTokenData;
  paymentMethodData: IGooglePayPaymentMethod;
  email?: string;
  shippingAddress?: any;
  product_details?: {
    name: string;
    price: number;
    description: string;
  };
  description?: string;
}

export interface IGooglePayTokenResponse {
  id: string;
  type: string;
  page_info: PagingInfo | null;
  data: {
    account_id: string;
    token: string;
  };
}

export interface IGooglePayService {
  processPayment(
    authToken: string,
    accountId: string,
    payload: IGooglePayTokenProcessRequest
  ): Promise<{ success: boolean; data: IGooglePayTokenResponse }>;
}

export class GooglePayConfig implements IGooglePayConfig {
  public environment: GooglePayEnvironment;
  public merchantId?: string;
  public merchantName: string;
  public buttonType?: GooglePayButtonType;
  public buttonStyle?: GooglePayButtonStyle;
  public buttonSizeMode?: GooglePayButtonSizeMode;
  public buttonLocale?: string;

  constructor(data: IGooglePayConfig) {
    this.environment = data.environment;
    this.merchantId = data.merchantId;
    this.merchantName = data.merchantName;
    this.buttonType = data.buttonType || GooglePayButtonType.PLAIN;
    this.buttonStyle = data.buttonStyle || GooglePayButtonStyle.BLACK;
    this.buttonSizeMode = data.buttonSizeMode || GooglePayButtonSizeMode.STATIC;
    this.buttonLocale = data.buttonLocale || 'en';
  }

  public get isValid(): boolean {
    return !!(this.environment && this.merchantName);
  }
}

export class GooglePayPaymentDataRequest
  implements IGooglePayPaymentDataRequest
{
  public apiVersion: number;
  public apiVersionMinor: number;
  public allowedPaymentMethods: IGooglePayPaymentMethodData[];
  public transactionInfo: IGooglePayTransactionInfo;
  public merchantInfo: IGooglePayMerchantInfo;
  public callbackIntents?: string[];
  public shippingAddressRequired?: boolean;
  public shippingAddressParameters?: {
    allowedCountryCodes?: string[];
    phoneNumberRequired?: boolean;
  };
  public emailRequired?: boolean;

  constructor(data: IGooglePayPaymentDataRequest) {
    this.apiVersion = data.apiVersion;
    this.apiVersionMinor = data.apiVersionMinor;
    this.allowedPaymentMethods = data.allowedPaymentMethods;
    this.transactionInfo = data.transactionInfo;
    this.merchantInfo = data.merchantInfo;
    this.callbackIntents = data.callbackIntents;
    this.shippingAddressRequired = data.shippingAddressRequired;
    this.shippingAddressParameters = data.shippingAddressParameters;
    this.emailRequired = data.emailRequired;
  }

  public get isValid(): boolean {
    const hasApiVersion =
      typeof this.apiVersion === 'number' && this.apiVersion > 0;
    const hasApiVersionMinor =
      typeof this.apiVersionMinor === 'number' && this.apiVersionMinor >= 0;
    const hasAllowedMethods =
      Array.isArray(this.allowedPaymentMethods) &&
      this.allowedPaymentMethods.length > 0;
    const hasTxnCountry = Boolean(this.transactionInfo?.countryCode);
    const hasTxnCurrency = Boolean(this.transactionInfo?.currencyCode);
    const hasTxnTotal = Boolean(this.transactionInfo?.totalPrice);
    const hasMerchantName = Boolean(this.merchantInfo?.merchantName);

    return (
      hasApiVersion &&
      hasApiVersionMinor &&
      hasAllowedMethods &&
      hasTxnCountry &&
      hasTxnCurrency &&
      hasTxnTotal &&
      hasMerchantName
    );
  }
}

export class GooglePayHelpers {
  /**
   * Check if Google Pay is supported in the current environment
   */
  static isGooglePaySupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'google' in window &&
      'payments' in (window as any).google &&
      'api' in (window as any).google.payments
    );
  }

  /**
   * Create a Google Pay client instance
   */
  static createGooglePayClient(
    environment: GooglePayEnvironment
  ): IGooglePayClient | null {
    if (!this.isGooglePaySupported()) {
      return null;
    }

    try {
      return new (window as any).google.payments.api.PaymentsClient({
        environment:
          environment === GooglePayEnvironment.PRODUCTION
            ? 'PRODUCTION'
            : 'TEST',
      });
    } catch (error) {
      console.error('Failed to create Google Pay client:', error);
      return null;
    }
  }

  /**
   * Format amount for Google Pay (expects string in full currency units)
   */
  static formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  }

  /**
   * Parse amount from Google Pay format to cents
   */
  static parseAmount(amount: string): number {
    return Math.round(parseFloat(amount) * 100);
  }

  /**
   * Create a line item for Google Pay
   */
  static createLineItem(
    label: string,
    amount: number,
    type: 'LINE_ITEM' | 'SUBTOTAL' = 'LINE_ITEM'
  ): IGooglePayLineItem {
    return {
      label,
      price: this.formatAmount(amount),
      type,
    };
  }

  /**
   * Get default supported card networks
   */
  static getDefaultSupportedNetworks(): string[] {
    return ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'JCB'];
  }

  /**
   * Get default allowed authentication methods
   */
  static getDefaultAuthMethods(): string[] {
    return ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
  }

  /**
   * Create default card parameters
   */
  static createDefaultCardParameters(): IGooglePayCardParameters {
    return {
      allowedAuthMethods: this.getDefaultAuthMethods(),
      allowedCardNetworks: this.getDefaultSupportedNetworks(),
      billingAddressRequired: false,
    };
  }

  /**
   * Create default tokenization specification
   */
  static createTokenizationSpecification(): IGooglePayTokenizationSpecification {
    return {
      type: 'DIRECT',
      parameters: {
        protocolVersion: 'ECv2',
        publicKey:
          'BHaQr3iRmzQE1j2VhPQwupiSz+5K+QTxhktS1nJlJZbIUYTHyIttX8CBPVkRgC56rAv6uYifyiiLhi2tXCZHLIk=',
      },
    };
  }

  /**
   * Create default payment method data
   */
  static createPaymentMethodData(): IGooglePayPaymentMethodData {
    return {
      type: 'CARD',
      parameters: this.createDefaultCardParameters(),
      tokenizationSpecification: this.createTokenizationSpecification(),
    };
  }

  /**
   * Create base payment data request check
   */
  static createBasePaymentDataRequest(): {
    apiVersion: number;
    apiVersionMinor: number;
    allowedPaymentMethods: IGooglePayPaymentMethodData[];
  } {
    const base: any = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [this.createPaymentMethodData()],
    };

    // For development and broader availability of the button, do not require an existing card
    // This allows isReadyToPay to return true on supported browsers even without a saved payment method
    base.existingPaymentMethodRequired = false;

    return base;
  }
}

declare global {
  interface Window {
    google?: {
      payments?: {
        api?: {
          PaymentsClient: {
            new (options: {
              environment: 'PRODUCTION' | 'TEST';
            }): IGooglePayClient;
          };
        };
      };
    };
  }
}
