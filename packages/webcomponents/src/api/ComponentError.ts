export enum ComponentErrorCodes {
  MISSING_PROPS = 'missing-props',
  FETCH_ERROR = 'fetch-error',
  UNKNOWN_ERROR = 'unknown-error',
}

export enum ComponentErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface ComponentError {
  errorCode: ComponentErrorCodes; // A unique code identifying the error
  message: string; // A descriptive message about the error
  severity?: ComponentErrorSeverity; // Optional severity level
  data?: any; // Additional data pertinent to the error (optional)
}
