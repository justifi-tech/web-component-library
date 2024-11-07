export enum CaptureStrategy {
  automatic = 'automatic',
  manual = 'manual',
}

export enum PaymentMethodTypes {
  card = 'card',
  bankAccount = 'bankAccount',
  sezzle = 'sezzle',
  saved = 'saved',
}

export enum PaymentTypes {
  card = 'Card',
  bankAccount = 'ACH',
  unknown = 'Unknown'
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

export enum PaymentDisputedStatuses {
  // if a dispute is 'won', we don't show a dispute status, just general status
  lost = 'lost',
  open = 'open',
}

export interface IPaymentMethod {
  card?: Card;
  bank_account?: BankAccount;
}

export class PaymentMethod implements IPaymentMethod {
  public card?: Card;
  public bank_account?: BankAccount;

  constructor(paymentMethod: IPaymentMethod) {
    this.card = paymentMethod.card ? new Card(paymentMethod.card) : undefined;
    this.bank_account = paymentMethod.bank_account
      ? new BankAccount(paymentMethod.bank_account)
      : undefined;
  }

  public get payersName(): string | null {
    if (this.card) {
      return this.card.name;
    } else if (this.bank_account) {
      return this.bank_account.name;
    }
    return null;
  }

  public get lastFourDigits(): string | null {
    if (this.card) {
      return `**** ${this.card.acct_last_four}`;
    } else if (this.bank_account) {
      return `**** ${this.bank_account.acct_last_four}`;
    }
    return null;
  }
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

export interface IBankAccount {
  id: string;
  acct_last_four: string;
  name: string;
  brand: string;
  token: string;
  created_at: string;
  updated_at: string;
}

export class BankAccount implements IBankAccount {
  public id: string;
  public acct_last_four: string;
  public name: string;
  public brand: string;
  public token: string;
  public created_at: string;
  public updated_at: string;

  constructor(bankAccount: IBankAccount) {
    this.id = bankAccount.id;
    this.acct_last_four = bankAccount.acct_last_four;
    this.name = bankAccount.name;
    this.brand = bankAccount.brand;
    this.token = bankAccount.token;
    this.created_at = bankAccount.created_at;
    this.updated_at = bankAccount.updated_at;
  }
}

export interface ICard {
  id: string;
  acct_last_four: string;
  name: string;
  brand: CardBrand;
  token: string;
  created_at: string;
  updated_at: string;
}

export class Card implements ICard {
  public id: string;
  public acct_last_four: string;
  public name: string;
  public brand: CardBrand;
  public token: string;
  public created_at: string;
  public updated_at: string;

  constructor(card: ICard) {
    this.id = card.id || '';
    this.acct_last_four = card.acct_last_four;
    this.name = card.name;
    this.brand = card.brand;
    this.token = card.token;
    this.created_at = card.created_at;
    this.updated_at = card.updated_at;
  }
}

export interface IDispute {
  amount_cents: number;
  created_at: string;
  currency: string;
  gateway_ref_id: string;
  id: string;
  payment_id: string;
  reason: null;
  status: string;
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
  currency: 'usd';
  description: string;
  disputed: boolean;
  disputes: IDispute[];
  error_code: string | null;
  error_description: string | null;
  fee_amount: number;
  is_test: boolean;
  metadata: Object | null;
  payment_method: IPaymentMethod;
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

export class Payment implements IPayment {
  public id: string;
  public account_id: string;
  public amount: number;
  public amount_disputed: number;
  public amount_refundable: number;
  public amount_refunded: number;
  public balance: number;
  public captured: boolean;
  public capture_strategy: CaptureStrategy;
  public currency: 'usd';
  public description: string;
  public disputed: boolean;
  public disputes: IDispute[];
  public error_code: string | null;
  public error_description: string | null;
  public fee_amount: number;
  public is_test: boolean;
  public metadata: Object | null;
  public payment_method: PaymentMethod;
  public payment_intent_id: string | null;
  public refunded: boolean;
  public status: PaymentStatuses;
  public created_at: string;
  public updated_at: string;
  public statement_descriptor?: string;
  public financial_transaction_id: string;
  public returned: boolean;
  public application_fee: IApplicationFee;
  public refunds: IRefund[];
  public transaction_hold: null;

  constructor(payment: IPayment) {
    this.id = payment.id;
    this.account_id = payment.account_id;
    this.amount = payment.amount;
    this.amount_disputed = payment.amount_disputed;
    this.amount_refundable = payment.amount_refundable;
    this.amount_refunded = payment.amount_refunded;
    this.balance = payment.balance;
    this.captured = payment.captured;
    this.capture_strategy = payment.capture_strategy;
    this.currency = payment.currency;
    this.description = payment.description;
    this.disputed = payment.disputed;
    this.disputes = payment.disputes;
    this.error_code = payment.error_code;
    this.error_description = payment.error_description;
    this.fee_amount = payment.fee_amount;
    this.is_test = payment.is_test;
    this.metadata = payment.metadata;
    this.payment_method = new PaymentMethod(payment.payment_method);
    this.payment_intent_id = payment.payment_intent_id;
    this.refunded = payment.refunded;
    this.status = payment.status;
    this.created_at = payment.created_at;
    this.updated_at = payment.updated_at;
  }

  get disputedStatus(): PaymentDisputedStatuses | null {
    const lost = this.disputes.some(
      (dispute) => dispute.status === PaymentDisputedStatuses.lost
    );
    // if a dispute is 'won', we don't show a dispute status, just general status
    if (!this.disputed) {
      return null;
    } else if (lost) {
      return PaymentDisputedStatuses.lost;
    } else {
      return PaymentDisputedStatuses.open;
    }
  }

  get paymentType(): PaymentTypes {
    if (this.payment_method) {
      return this.payment_method.card ? PaymentTypes.card : PaymentTypes.bankAccount;
    } else {
      return PaymentTypes.unknown;
    }
  }
}

export interface IRefund {
  id: string;
  payment_id: string;
  amount: number;
  description: string | null;
  reason: string | null;
  status: string;
  metadata: null;
  created_at: string;
  updated_at: string;
}

export interface IApplicationFee {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentsParams {
  payment_id?: string;
  terminal_id?: string;
  payment_status?: PaymentStatuses;
  created_after?: string;
  created_before?: string;
  after_cursor?: string;
  before_cursor?: string;
}