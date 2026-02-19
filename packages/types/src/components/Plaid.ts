import { ComponentErrorSeverity } from './ComponentError';

export enum PlaidErrorCodes {
  PLAID_SDK_LOAD_FAILED = 'plaid-sdk-load-failed',
  PLAID_LINK_INIT_FAILED = 'plaid-link-init-failed',
  PLAID_LINK_TOKEN_FAILED = 'plaid-link-token-failed',
  PLAID_AUTHENTICATION_FAILED = 'plaid-authentication-failed',
  PLAID_BANK_NOT_SUPPORTED = 'plaid-bank-not-supported',
  PLAID_TOKEN_EXPIRED = 'plaid-token-expired',
  PLAID_NETWORK_ERROR = 'plaid-network-error',
  PLAID_USER_CANCELLED = 'plaid-user-cancelled',
  PLAID_TIMEOUT = 'plaid-timeout',
  PLAID_INVALID_CREDENTIALS = 'plaid-invalid-credentials',
  PLAID_ACCOUNT_LOCKED = 'plaid-account-locked',
  PLAID_MAINTENANCE = 'plaid-maintenance',
  PLAID_RATE_LIMITED = 'plaid-rate-limited',
}

export interface PlaidError {
  code: PlaidErrorCodes;
  message: string;
  severity: ComponentErrorSeverity;
  originalError?: any;
  retryable: boolean;
  userAction?: string;
}
