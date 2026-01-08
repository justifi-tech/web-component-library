import { ComponentErrorSeverity } from './ComponentError';

// Plaid-specific error codes
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

// Plaid error message mapping
export const PLAID_ERROR_MESSAGES = {
  [PlaidErrorCodes.PLAID_SDK_LOAD_FAILED]: 'Unable to load Plaid. Please refresh the page and try again.',
  [PlaidErrorCodes.PLAID_LINK_INIT_FAILED]: 'Unable to initialize bank connection. Please try again.',
  [PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED]: 'Unable to connect to bank service. Please try again.',
  [PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED]: 'Bank authentication failed. Please try again.',
  [PlaidErrorCodes.PLAID_BANK_NOT_SUPPORTED]: 'Your bank is not currently supported. Please try a different payment method.',
  [PlaidErrorCodes.PLAID_TOKEN_EXPIRED]: 'Your bank session has expired. Please reconnect your account.',
  [PlaidErrorCodes.PLAID_NETWORK_ERROR]: 'Network connection issue. Please check your internet connection and try again.',
  [PlaidErrorCodes.PLAID_USER_CANCELLED]: 'Bank connection was cancelled. Click to try again.',
  [PlaidErrorCodes.PLAID_TIMEOUT]: 'Bank connection timed out. Please try again.',
  [PlaidErrorCodes.PLAID_INVALID_CREDENTIALS]: 'Invalid bank credentials. Please check your username and password.',
  [PlaidErrorCodes.PLAID_ACCOUNT_LOCKED]: 'Your bank account is temporarily locked. Please contact your bank.',
  [PlaidErrorCodes.PLAID_MAINTENANCE]: 'Bank service is temporarily unavailable. Please try again later.',
  [PlaidErrorCodes.PLAID_RATE_LIMITED]: 'Too many connection attempts. Please wait a moment and try again.',
};

// Plaid error severity mapping
export const PLAID_ERROR_SEVERITY = {
  [PlaidErrorCodes.PLAID_SDK_LOAD_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_LINK_INIT_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_LINK_TOKEN_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_AUTHENTICATION_FAILED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_BANK_NOT_SUPPORTED]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_TOKEN_EXPIRED]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_NETWORK_ERROR]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_USER_CANCELLED]: ComponentErrorSeverity.INFO,
  [PlaidErrorCodes.PLAID_TIMEOUT]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_INVALID_CREDENTIALS]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_ACCOUNT_LOCKED]: ComponentErrorSeverity.ERROR,
  [PlaidErrorCodes.PLAID_MAINTENANCE]: ComponentErrorSeverity.WARNING,
  [PlaidErrorCodes.PLAID_RATE_LIMITED]: ComponentErrorSeverity.WARNING,
};

export interface PlaidError {
  code: PlaidErrorCodes;
  message: string;
  severity: ComponentErrorSeverity;
  originalError?: any;
  retryable: boolean;
  userAction?: string;
}

