import { IBankAccount } from './BankAccount';
import { CurrencyTypes } from './Payment';
import { formatCurrency } from '../utils/utils';

export interface PayoutsQueryParams {
  created_after?: string;
  created_before?: string;
};

export enum PayoutStatuses {
  paid = 'paid',
  failed = 'failed',
  forwarded = 'forwarded',
  scheduled = 'scheduled',
  in_transit = 'in_transit',
  canceled = 'canceled',
}

export enum PayoutStatusesSafeNames {
  paid = 'Paid',
  failed = 'Failed',
  forwarded = 'Forwarded',
  scheduled = 'Scheduled',
  in_transit = 'In Transit',
  canceled = 'Canceled',
}

export interface IPayout {
  id: string;
  account_id: string;
  amount: number;
  bank_account: IBankAccount;
  currency: CurrencyTypes;
  delivery_method: string;
  description: string;
  deposits_at: string;
  fees_total: number;
  refunds_count: number;
  refunds_total: number;
  payments_count: number;
  payments_total: number;
  payout_type: 'ach' | 'cc';
  other_total: number;
  status: PayoutStatuses;
  metadata: Object | null;
  created_at: string;
  updated_at: string;
}

export class Payout implements IPayout {
  public id: string;
  public account_id: string;
  public amount: number;
  public bank_account: IBankAccount;
  public currency: CurrencyTypes;
  public delivery_method: string;
  public description: string;
  public deposits_at: string;
  public fees_total: number;
  public refunds_count: number;
  public refunds_total: number;
  public payments_count: number;
  public payments_total: number;
  public payout_type: 'ach' | 'cc';
  public other_total: number;
  public status: PayoutStatuses;
  public metadata: Object | null;
  public created_at: string;
  public updated_at: string;
  public sub_account_name?: string;

  constructor(payout: IPayout) {
    this.id = payout.id;
    this.account_id = payout.account_id;
    this.currency = payout.currency;
    this.amount = payout.amount;
    this.bank_account = payout.bank_account;
    this.delivery_method = payout.delivery_method || 'standard';
    this.description = payout.description;
    this.deposits_at = payout.deposits_at;
    this.fees_total = payout.fees_total;
    this.refunds_count = payout.refunds_count;
    this.refunds_total = payout.refunds_total;
    this.payments_count = payout.payments_count;
    this.payments_total = payout.payments_total;
    this.payout_type = payout.payout_type;
    this.other_total = payout.other_total;
    this.status = payout.status;
    this.metadata = payout.metadata;
    this.created_at = payout.created_at;
    this.updated_at = payout.updated_at;
  }

  formattedPaymentAmount(amount: number): string {
    return formatCurrency(amount, this.currency);
  }
}
