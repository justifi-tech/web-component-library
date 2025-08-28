export enum PAYMENT_MODE {
  ECOM = 'ecom',
  BNPL = 'bnpl',
  APPLE_PAY = 'apple_pay',
}

// Maps the backend payment method types to the frontend payment method types
export enum PAYMENT_METHOD_TYPES {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEZZLE = 'sezzle',
  PLAID = 'plaid',
}

// Available payment methods for the modular checkout component (differentiates between saved and new payment methods)
export enum PAYMENT_METHODS {
  SAVED_CARD = 'saved_card',
  NEW_CARD = 'new_card',
  SAVED_BANK_ACCOUNT = 'saved_bank_account',
  NEW_BANK_ACCOUNT = 'new_bank_account',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEZZLE = 'sezzle',
  PLAID = 'plaid',
}

// Event detail payload for the checkout-changed event
export interface CheckoutChangedEventDetail {
  availablePaymentMethods: PAYMENT_METHODS[];
}
