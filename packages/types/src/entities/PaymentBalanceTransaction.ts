import { CurrencyTypes } from './Payment';

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
