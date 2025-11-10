import { PAYMENT_METHODS } from "../modular-checkout/ModularCheckout";

export const MessageEventType = {
  tokenize: 'tokenize',
  validate: 'validate',
};

// Constants
export const PAYMENT_METHOD_TYPE_LABELS = {
  [PAYMENT_METHODS.NEW_BANK_ACCOUNT]: 'New bank account',
  [PAYMENT_METHODS.NEW_CARD]: 'New credit or debit card',
} as const;

export const ERROR_MESSAGES = {
  AUTH_TOKEN_REQUIRED: 'Auth token is required when using the tokenize-payment-method component not slotted in justifi-modular-checkout',
  ACCOUNT_ID_REQUIRED: 'Account ID is required when using the tokenize-payment-method component not slotted in justifi-modular-checkout',
  FORM_NOT_READY: 'Payment form not ready',
  VALIDATION_ERROR: 'Validation error',
} as const;