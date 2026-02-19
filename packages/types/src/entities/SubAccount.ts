export enum AccountType {
  test = 'test',
  live = 'live',
}

export enum AccountStatus {
  created = 'created',
  submitted = 'submitted',
  information_needed = 'information_needed',
  rejected = 'rejected',
  enabled = 'enabled',
  disabled = 'disabled',
  archived = 'archived',
}

export interface RelatedAccounts {
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
  application_fee_rates: unknown[];
  processing_ready: boolean;
  payout_ready: boolean;
  related_accounts: RelatedAccounts;
  created_at: string;
  updated_at: string;
}
