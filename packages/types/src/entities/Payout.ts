import { IBankAccount } from './BankAccount';
import { CurrencyTypes } from './Payment';

export interface PayoutsQueryParams {
  created_after?: string;
  created_before?: string;
}

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
  metadata: object | null;
  created_at: string;
  updated_at: string;
  settlement_priority?: 'standard' | 'expedited';
}
