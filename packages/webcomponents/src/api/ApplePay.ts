import { PagingInfo } from "./Pagination";

export enum ApplePaySessionStatus {
  STATUS_SUCCESS = 'STATUS_SUCCESS',
  STATUS_FAILURE = 'STATUS_FAILURE',
}

export enum ApplePayButtonType {
  PLAIN = 'plain',
  BUY = 'buy',
  SET_UP = 'set-up',
  DONATE = 'donate',
  CHECK_OUT = 'check-out',
  BOOK = 'book',
  SUBSCRIBE = 'subscribe',
}

export enum ApplePayButtonStyle {
  BLACK = 'black',
  WHITE = 'white',
  WHITE_OUTLINE = 'white-outline',
}

export enum ApplePayMerchantCapability {
  SUPPORTS_3DS = 'supports3DS',
  SUPPORTS_EMV = 'supportsEMV',
  SUPPORTS_CREDIT = 'supportsCredit',
  SUPPORTS_DEBIT = 'supportsDebit',
}

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

export interface IApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  merchantCapabilities: ApplePayMerchantCapability[];
  supportedNetworks: string[];
  total: IApplePayLineItem;
  lineItems?: IApplePayLineItem[];
  shippingMethods?: IApplePayShippingMethod[];
  applicationData?: string;
  supportedCountries?: string[];
}

export interface IApplePaySession {
  canMakePayments(): boolean;
  canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
  supportsVersion(version: number): boolean;
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: IMerchantSession): void;
  completePayment(result: { status: ApplePaySessionStatus }): void;
  completeShippingMethodSelection(update: any): void;
  completePaymentMethodSelection(update: any): void;

  // Event handlers
  onvalidatemerchant?: (event: IApplePayValidateEvent) => void;
  onpaymentmethodselected?: (event: IApplePayMethodSelectedEvent) => void;
  onshippingmethodselected?: () => void;
  onpaymentauthorized?: (event: any) => void;
  oncancel?: (event: IApplePayCancelEvent) => void;
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
}

export interface IMerchantSession {
  displayName: string;
  domainName: string;
  epochTimestamp: number;
  expiresAt: number;
  merchantIdentifier: string;
  merchantSessionIdentifier: string;
  nonce: string;
  operationalAnalyticsIdentifier: string;
  pspId: string;
  retries: number;
  signature: string;
}

export interface IApplePayTokenData {
  data: string;
  header: {
    publicKeyHash: string;
    ephemeralPublicKey: string;
    transactionId: string;
  };
  signature: string;
  version: string;
}

export interface IApplePayTokenPaymentMethod {
  displayName: string;
  network: string;
  type: string;
}

export interface IApplePayToken {
  paymentData: IApplePayTokenData;
  paymentMethod: IApplePayTokenPaymentMethod;
  transactionIdentifier: string;
}

export interface IApplePayValidateEvent {
  validationURL: string;
}

export interface IApplePayCancelEvent {
  sessionError?: {
    code: 'unknown' | 'invalidMerchantSession' | 'userCancel' | string;
    info?: string;
  };
}

export interface IApplePayMethodSelectedEvent {
  paymentMethod: IApplePayTokenPaymentMethod;
}


export interface IApplePayPaymentProcessRequest {
  paymentData: IApplePayTokenData;
  paymentMethod: IApplePayTokenPaymentMethod;
  transactionIdentifier: string;
  product_details?: {
    name: string;
    price: number;
    description: string;
  };
  description?: string;
}

export interface IApplePayPaymentResponse {
  id: string;
  type: string;
  page_info: PagingInfo | null;
  data: {
    account_id: string;
    token: string;
  }
}

export interface IApplePayService {
  validateMerchant(authToken: string, accountId: string): Promise<IMerchantSession>;

  processPayment(
    authToken: string,
    accountId: string,
    payload: IApplePayPaymentProcessRequest
  ): Promise<{ success: boolean; data: IApplePayPaymentResponse }>;
}

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

export class ApplePayPaymentRequest implements IApplePayPaymentRequest {
  public countryCode: string;
  public currencyCode: string;
  public merchantCapabilities: ApplePayMerchantCapability[];
  public supportedNetworks: string[];
  public total: IApplePayLineItem;
  public lineItems?: IApplePayLineItem[];
  public shippingMethods?: IApplePayShippingMethod[];
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

export class ApplePayHelpers {
  static isApplePaySupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'ApplePaySession' in window &&
      window.ApplePaySession?.supportsVersion(3)
    );
  }

  static canMakePayments(): boolean {
    if (!this.isApplePaySupported()) {
      return false;
    }
    return window.ApplePaySession?.canMakePayments() || false;
  }

  static async canMakePaymentsWithActiveCard(
    merchantIdentifier: string
  ): Promise<boolean> {
    if (!this.isApplePaySupported()) {
      return false;
    }

    try {
      return (
        (await window.ApplePaySession?.canMakePaymentsWithActiveCard(
          merchantIdentifier
        )) || false
      );
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

  static createLineItem(
    label: string,
    amount: number,
    type: 'final' | 'pending' = 'final'
  ): IApplePayLineItem {
    return {
      label,
      amount: this.formatAmount(amount),
      type,
    };
  }

  static getDefaultSupportedNetworks(): string[] {
    return ['amex', 'discover', 'masterCard', 'visa'];
  }

  static getDefaultMerchantCapabilities(): ApplePayMerchantCapability[] {
    return [
      ApplePayMerchantCapability.SUPPORTS_3DS,
      ApplePayMerchantCapability.SUPPORTS_EMV,
      ApplePayMerchantCapability.SUPPORTS_CREDIT,
      ApplePayMerchantCapability.SUPPORTS_DEBIT,
    ];
  }
}

declare global {
  interface Window {
    ApplePaySession?: {
      new (
        version: number,
        paymentRequest: IApplePayPaymentRequest
      ): IApplePaySession;
      canMakePayments(): boolean;
      canMakePaymentsWithActiveCard(
        merchantIdentifier: string
      ): Promise<boolean>;
      supportsVersion(version: number): boolean;
      STATUS_SUCCESS: number;
      STATUS_FAILURE: number;
    };
  }
}
