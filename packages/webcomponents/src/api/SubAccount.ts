export enum AccountType {
  test = 'test',
  live = 'live'
}

export enum AccountStatus {
  created = 'created',
  'submitted' = 'submitted',
  'information_needed' = 'information_needed',
  'rejected' = 'rejected',
  'enabled' = 'enabled',
  'disabled' = 'disabled',
  'archived' = 'archived'
}

interface RelatedAccounts {
  live_account_id: string;
  test_account_id: string;
}

export interface ISubAccount {
  id: string;
  name: string;
  account_type: AccountType;
  status: AccountStatus;
  currency: string;
  platform_account_id: string;
  payout_account_id: string;
  business_id: string;
  application_fee_rates: any[];
  processing_ready: boolean;
  payout_ready: boolean;
  related_accounts: RelatedAccounts;
  created_at: string;
  updated_at: string;
}

export class SubAccount implements ISubAccount {
  public id: string;
  public name: string;
  public account_type: AccountType;
  public status: AccountStatus;
  public currency: string;
  public platform_account_id: string;
  public payout_account_id: string;
  public business_id: string;
  public application_fee_rates: any[];
  public processing_ready: boolean;
  public payout_ready: boolean;
  public related_accounts: RelatedAccounts;
  public created_at: string;
  public updated_at: string;

  constructor(subAccount: ISubAccount) {
    this.id = subAccount.id;
    this.name = subAccount.name;
    this.account_type = subAccount.account_type;
    this.status = subAccount.status;
    this.currency = subAccount.currency;
    this.platform_account_id = subAccount.platform_account_id;
    this.payout_account_id = subAccount.payout_account_id;
    this.business_id = subAccount.business_id;
    this.application_fee_rates = subAccount.application_fee_rates;
    this.processing_ready = subAccount.processing_ready;
    this.payout_ready = subAccount.payout_ready;
    this.related_accounts = subAccount.related_accounts;
    this.created_at = subAccount.created_at;
    this.updated_at = subAccount.updated_at;
  }
}
