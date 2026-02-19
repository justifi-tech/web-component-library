import { CurrencyTypes } from './Payment';

export enum PayoutBalanceTransactionType {
  fee = 'fee',
  payment = 'payment',
  payout = 'payout',
  sellerPaymentRefund = 'seller_payment_refund',
  disputeAmountCollected = 'dispute_amount_collected',
  disputeFeeCollected = 'dispute_fee_collected',
  sellerPayment = 'seller_payment',
  transfer = 'transfer',
  partnerPlatformProceedsCredit = 'partner_platform_proceeds_credit',
}

export interface IPayoutBalanceTransaction {
  id: string;
  account_id: string;
  payout_id: string;
  financial_transaction_id: string;
  amount: number;
  fee: number;
  net: number;
  currency: CurrencyTypes;
  description: string;
  source_id: string;
  txn_type: PayoutBalanceTransactionType;
  created_at: string;
  available_on: string;
  updated_at: string;
}
