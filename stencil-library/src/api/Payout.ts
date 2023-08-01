export enum PayoutStatuses {
  paid = 'paid',
  failed = 'failed',
  forwarded = 'forwarded',
  scheduled = 'scheduled',
  in_transit = 'in_transit',
  canceled = 'canceled',
}

export interface PayoutBankAccount {
  id: string,
  full_name: string,
  bank_name: string,
  account_number_last4: string,
  routing_number: string,
  country: string,
  currency: string,
  nickname: string,
  account_type: string,
}

export interface IPayout {
  id: string;
  account_id: string;
  amount: number;
  bank_account: PayoutBankAccount;
  currency: 'usd';
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
  metadata: any;
  created_at: string;
  updated_at: string;
}

export class Payout implements IPayout {
  public id: string;
  public account_id: string;
  public amount: number;
  public bank_account: PayoutBankAccount;
  public currency: 'usd';
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
  public metadata: any;
  public created_at: string;
  public updated_at: string;

  constructor(payout: IPayout) {
    this.id = payout.id;
    this.account_id = payout.account_id;
    this.amount = payout.amount;
    this.bank_account = payout.bank_account;
    this.currency = payout.currency;
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
}
