import { formatCurrency } from "../utils/utils";
import { CurrencyTypes } from "./Payment";

export enum PaymentBalanceTxnType {
  payment = 'payment',
  paymentFee = 'payment_fee',
  payout = 'payout',
  refund = 'refund',
  feeRefund = 'fee_refund',
  dispute = 'dispute',
  disputeFee = 'dispute_fee',
  disputeFeeRefund = 'dispute_fee_refund',
  disputeRefund = 'dispute_refund',
  applicationFeeReturned = 'application_fee_returned',
}

export interface IPaymentBalanceTransaction {
  id: string;
  amount: number;
  balance: number;
  currency: CurrencyTypes;
  financial_transaction_id: string;
  payment_id: string;
  payment_balance_txn_type: PaymentBalanceTxnType;
  source_id: string;
  source_type: string;
  created_at: string;
  updated_at: string;
}

export class PaymentBalanceTransaction implements IPaymentBalanceTransaction {
  public id: string;
  public amount: number;
  public balance: number;
  public currency: CurrencyTypes;
  public financial_transaction_id: string;
  public payment_id: string;
  public payment_balance_txn_type: PaymentBalanceTxnType;
  public source_id: string;
  public source_type: string;
  public created_at: string;
  public updated_at: string;

  constructor(balanceTransaction: IPaymentBalanceTransaction) {
    this.id = balanceTransaction.id;
    this.amount = balanceTransaction.amount;
    this.balance = balanceTransaction.balance;
    this.currency = balanceTransaction.currency;
    this.financial_transaction_id = balanceTransaction.financial_transaction_id;
    this.payment_id = balanceTransaction.payment_id;
    this.payment_balance_txn_type = balanceTransaction.payment_balance_txn_type;
    this.source_id = balanceTransaction.source_id;
    this.source_type = balanceTransaction.source_type;
    this.created_at = balanceTransaction.created_at;
    this.updated_at = balanceTransaction.updated_at;
  }

  get displayTransactionId(): string {
    if (this.payment_balance_txn_type === PaymentBalanceTxnType.paymentFee) {
      return '--';
    } else if (this.payment_balance_txn_type === PaymentBalanceTxnType.applicationFeeReturned) {
      return '--';
    } else {
      return this.source_id;
    };
  }

  formattedPaymentAmount(amount: number): string {
    return formatCurrency(amount, this.currency);
  }
};
