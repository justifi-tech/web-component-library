export enum ComponentErrorCodes {
  MISSING_PROPS = 'missing-props',
  FETCH_ERROR = 'fetch-error',
  PATCH_ERROR = 'patch-error',
  POST_ERROR = 'post-error',
  UNKNOWN_ERROR = 'unknown-error',
  TOKENIZE_ERROR = 'tokenize-error',
  COMPLETE_CHECKOUT_ERROR = 'complete-checkout-error',
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
