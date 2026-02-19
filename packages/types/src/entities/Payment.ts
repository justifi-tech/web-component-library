import { IRefund } from './Refund';

export enum CaptureStrategy {
  automatic = 'automatic',
  manual = 'manual',
}

export enum PaymentMethodTypes {
  card = 'card',
  bankAccount = 'bankAccount',
  sezzle = 'sezzle',
  plaid = 'plaid',
  applePay = 'applePay',
}

export enum PaymentTypes {
  card = 'Card',
  bankAccount = 'ACH',
  unknown = 'Unknown',
}

export enum PaymentStatuses {
  pending = 'pending',
  automatic = 'automatic',
  authorized = 'authorized',
  succeeded = 'succeeded',
  failed = 'failed',
  canceled = 'canceled',
  disputed = 'disputed',
  fully_refunded = 'fully_refunded',
  partially_refunded = 'partially_refunded',
}

export enum CurrencyTypes {
  usd = 'usd',
  cad = 'cad',
}

export interface IPaymentMethodData {
  card?: IPaymentCard;
  bank_account?: IPaymentBankAccount;
}

export type CardBrand =
  | 'american_express'
  | 'diners_club'
  | 'discover'
  | 'jcb'
  | 'mastercard'
  | 'china_unionpay'
  | 'visa'
  | 'unknown';

export interface IPaymentBankAccount {
  id: string;
  acct_last_four: string;
  name: string;
  brand: string;
  token: string;
  created_at: string;
  updated_at: string;
}

export interface IPaymentCard {
  id: string;
  acct_last_four: string;
  name: string;
  brand: CardBrand;
  token: string;
  created_at: string;
  updated_at: string;
}

export interface IPaymentDispute {
  amount_cents: number;
  created_at: string;
  currency: CurrencyTypes;
  gateway_ref_id: string;
  id: string;
  payment_id: string;
  reason: null;
  status: string;
  updated_at: string;
}

export interface IApplicationFee {
  id: string;
  amount: number;
  currency: CurrencyTypes;
  created_at: string;
  updated_at: string;
}

export interface IPayment {
  id: string;
  account_id: string;
  amount: number;
  amount_disputed: number;
  amount_refundable: number;
  amount_refunded: number;
  amount_returned?: number;
  balance: number;
  captured: boolean;
  capture_strategy: CaptureStrategy;
  currency: CurrencyTypes;
  description: string;
  disputed: boolean;
  disputes: IPaymentDispute[];
  error_code: string | null;
  error_description: string | null;
  expedited?: boolean;
  fee_amount: number;
  is_test: boolean;
  metadata: object | null;
  payment_method: IPaymentMethodData;
  payment_intent_id?: string | null;
  refunded: boolean;
  status: PaymentStatuses;
  created_at: string;
  updated_at: string;
  financial_transaction_id: string;
  returned: boolean;
  application_fee: IApplicationFee;
  application_fee_rate_id?: string;
  refunds: IRefund[];
  transaction_hold?: null;
  statement_descriptor?: string;
}

export interface PaymentsQueryParams {
  payment_id?: string;
  terminal_id?: string;
  payment_status?: PaymentStatuses;
  created_after?: string;
  created_before?: string;
}

