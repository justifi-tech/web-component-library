export const PAYPAL_SANDBOX_SCRIPT_URL =
  'https://www.sandbox.paypal.com/web-sdk/v6/core';
export const PAYPAL_PRODUCTION_SCRIPT_URL =
  'https://www.paypal.com/web-sdk/v6/core';
export const PAYPAL_SCRIPT_DATA_TEST_ID = 'paypal-script';

/**
 * TODO(paypal-mock): remove once staging returns `checkout.paypal.provider_client_id`.
 * JustiFi's PayPal sandbox app id, taken from entity_management#637
 * (`PAYPAL_SANDBOX_CLIENT_ID` in staging.tfvars). Client ids are public by design.
 * The literal 'test' only works for the legacy `/sdk/js?client-id=test` script —
 * v6 `createInstance` validates the id and rejects it.
 */
export const PAYPAL_SANDBOX_CLIENT_ID =
  'AXVVC-vkCnF5CHlWA5VBFpoVM897XFBWdT9Q6yTWYJXrObd7_b0uIoKGElZvL1mCnbR5jzFCv_eo2CWb';

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
