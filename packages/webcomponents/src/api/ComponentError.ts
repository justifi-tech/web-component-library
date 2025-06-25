export enum ComponentErrorCodes {
  MISSING_PROPS = 'missing-props',
  FETCH_ERROR = 'fetch-error',
  PATCH_ERROR = 'patch-error',
  POST_ERROR = 'post-error',
  UNKNOWN_ERROR = 'unknown-error',
  TOKENIZE_ERROR = 'tokenize-error',
  COMPLETE_CHECKOUT_ERROR = 'complete-checkout-error',
  CHECKOUT_ALREADY_COMPLETED = 'checkout-already-completed',
  CHECKOUT_EXPIRED = 'checkout-expired',
  NOT_AUTHENTICATED = 'not-authenticated',
  INVALID_PARAMETER = 'invalid-parameter',
  PROVISIONING_REQUESTED = 'provisioning-already-requested',
  INVALID_REFUND_AMOUNT = 'invalid-refund-amount',
  VALIDATION_ERROR = 'validation-error',
}

export enum ComponentErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ComponentErrorMessages {
  NOT_AUTHENTICATED = 'Not authenticated. Please provide a valid auth token, checkout id, and account id.',
  CHECKOUT_ALREADY_COMPLETED = 'Checkout already completed. Please create a new checkout.',
  CHECKOUT_EXPIRED = 'Checkout expired. Please create a new checkout.',
}
