export const PAYPAL_SANDBOX_SCRIPT_URL =
  'https://www.sandbox.paypal.com/web-sdk/v6/core';
export const PAYPAL_PRODUCTION_SCRIPT_URL =
  'https://www.paypal.com/web-sdk/v6/core';
export const PAYPAL_SCRIPT_DATA_TEST_ID = 'paypal-script';

export const PAYPAL_COMPONENTS = ['paypal-payments', 'venmo-payments'];
export const PAYPAL_PAGE_TYPE = 'checkout';
export const PAYPAL_DEFAULT_CURRENCY = 'USD';
export const PAYPAL_PRESENTATION_MODE = 'auto';

/** Venmo only settles in USD, and the checkout payload carries no country. */
export const VENMO_SUPPORTED_CURRENCY = 'USD';

/** `test` checkouts talk to PayPal's sandbox; everything else goes to production. */
export const paypalScriptUrl = (mode: 'test' | 'live' | null): string =>
  mode === 'test' ? PAYPAL_SANDBOX_SCRIPT_URL : PAYPAL_PRODUCTION_SCRIPT_URL;

export const PaypalErrorCode = {
  CONFIG_ERROR: 'CONFIG_ERROR',
  INITIALIZATION_ERROR: 'INITIALIZATION_ERROR',
  ORDER_ERROR: 'ORDER_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export type PaypalErrorCodeType =
  (typeof PaypalErrorCode)[keyof typeof PaypalErrorCode];

export interface IPaypalSessionOrder {
  orderId: string;
}

export interface IPaypalSession {
  start: (
    options: { presentationMode: string },
    order: Promise<IPaypalSessionOrder>
  ) => Promise<void>;
}

export interface IPaypalEligibleMethods {
  isEligible: (method: string) => boolean;
}

export interface IPaypalSdkInstance {
  findEligibleMethods: (args: {
    currencyCode: string;
  }) => Promise<IPaypalEligibleMethods>;
  createPayPalOneTimePaymentSession: (options: object) => IPaypalSession;
  createVenmoOneTimePaymentSession: (options: object) => IPaypalSession;
}

export interface IPaypalSdk {
  createInstance: (config: object) => Promise<IPaypalSdkInstance>;
}
