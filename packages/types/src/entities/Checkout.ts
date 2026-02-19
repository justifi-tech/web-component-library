import { IApiResponse } from '../api/Api';
import { CurrencyTypes } from './Payment';

export enum PAYMENT_METHOD_TYPES {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SEZZLE = 'sezzle',
  PLAID = 'plaid',
}

export interface IBnpl {
  provider: string;
  provider_client_id: string;
  provider_mode: string;
  provider_checkout_url: string;
  provider_order_id: string;
  provider_api_version: string;
}

export interface ICompletion {
  payment_mode?: ICheckoutPaymentMode;
  payment_token?: string | null;
  payment_status?: string | null;
  payment_response?: unknown;
  payment_error_code?: string | null;
  payment_error_description?: string | null;
  checkout_id?: string;
  additional_transactions?: unknown[];
  payment_id?: string;
  payment_method_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface ICheckoutPaymentSettings {
  ach_payments: boolean;
  bnpl_payments: boolean;
  credit_card_payments: boolean;
  insurance_payments?: boolean;
  bank_account_verification?: boolean;
  apple_payments?: boolean;
  google_payments?: boolean;
}

export interface ICheckout {
  id: string;
  description: string;
  payment_intent_id: string;
  account_id: string;
  platform_account_id: string;
  payment_amount: number;
  payment_client_id: string;
  payment_description: string;
  payment_methods: ICheckoutPaymentMethod[];
  payment_method_group_id: string;
  payment_settings: ICheckoutPaymentSettings;
  bnpl?: IBnpl;
  total_amount: number;
  insurance_amount: number;
  status: ICheckoutStatus;
  payment_currency?: CurrencyTypes;
  mode?: string | null;
  statement_descriptor?: string | null;
  application_fees?: unknown[] | null;
  successful_payment_id?: string | null;
  created_at: string;
  updated_at: string;
  completions?: ICompletion[];
}

export enum ICheckoutPaymentMode {
  bnpl = 'Buy Now Pay Later',
  ecom = 'E-commerce',
  card = 'Card',
  bank_account = 'Bank Account',
  card_present = 'Card Present',
  apple_pay = 'Apple Pay',
  unknown = '',
}

export enum ICheckoutPaymentModeParam {
  bnpl = 'bnpl',
  ecom = 'ecom',
  apple_pay = 'apple_pay',
}

export enum ICheckoutStatus {
  created = 'created',
  completed = 'completed',
  attempted = 'attempted',
  expired = 'expired',
}

export enum CompletionStatuses {
  failed = 'failed',
  succeeded = 'succeeded',
}

export type ICheckoutCompleteResponse = IApiResponse<{
  payment_mode: ICheckoutPaymentMode;
  payment_token: null;
  payment_status: string;
  payment_response: null;
  checkout_id: string;
  additional_transactions: unknown[];
  checkout: ICheckout;
}>;

export type ILoadedEventResponse = {
  checkout_status: ICheckoutStatus;
};

export interface CheckoutsQueryParams {
  status?: ICheckoutStatus;
  payment_mode?: ICheckoutPaymentMode;
  checkout_id?: string;
  created_after?: string;
  created_before?: string;
}

export type CheckoutCardBrand =
  | 'visa'
  | 'mastercard'
  | 'american_express'
  | 'discover'
  | 'jcb'
  | 'diners_club'
  | 'unionpay';

export type CheckoutAccountType = 'checking' | 'savings';

export interface ICheckoutPaymentMethod {
  id: string;
  type: PAYMENT_METHOD_TYPES;
  status: string;
  invalid_reason: null;
  name: string;
  brand: CheckoutCardBrand;
  acct_last_four: string;
  account_type: CheckoutAccountType;
  month: string;
  year: string;
  address_line1_check: string;
  address_postal_code_check: string;
  bin_details: null;
}
