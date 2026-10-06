import { formatCurrency } from "../utils/utils";
import { CurrencyTypes } from "./Payment";

export enum PayoutBalanceTransactionType {
  fee = 'fee',
  payment = 'payment',
  payout = 'payout',
  sellerPaymentRefund = 'seller_payment_refund',
  disputeAmountCollected = 'dispute_amount_collected',
  disputeFeeCollected = 'dispute_fee_collected',
  sellerPayment = 'seller_payment',
  transfer = 'transfer',
  partnerPlatformProceedsCredit = 'partner_platform_proceeds_credit'
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

export class PayoutBalanceTransaction implements IPayoutBalanceTransaction {
  public id: string;
  public account_id: string;
  public payout_id: string;
  public financial_transaction_id: string;
  public amount: number;
  public fee: number;
  public net: number;
  public currency: CurrencyTypes;
  public description: string;
  public source_id: string;
  public txn_type: PayoutBalanceTransactionType;
  public created_at: string;
  public available_on: string;
  public updated_at: string;

  constructor(balanceTransaction: IPayoutBalanceTransaction) {
    this.id = balanceTransaction.id;
    this.account_id = balanceTransaction.account_id;
    this.payout_id = balanceTransaction.payout_id;
    this.financial_transaction_id = balanceTransaction.financial_transaction_id;
    this.amount = balanceTransaction.amount;
    this.fee = balanceTransaction.fee;
    this.net = balanceTransaction.net;
    this.currency = balanceTransaction.currency;
    this.source_id = balanceTransaction.source_id;
    this.description = balanceTransaction.description;
    this.txn_type = balanceTransaction.txn_type;
    this.created_at = balanceTransaction.created_at;
    this.available_on = balanceTransaction.available_on;
    this.updated_at = balanceTransaction.updated_at;
  }

  formattedPaymentAmount(amount: number): string {
    return formatCurrency(amount, this.currency);
  }
};
