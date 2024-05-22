export interface IBankAccount {
  id: string;
  account_owner_name?: string;
  full_name?: string;
  account_type: string;
  acct_last_four?: string;
  account_number_last4?: string;
  routing_number: string;
  bank_name: string;
  country: string;
  currency: string;
  nickname: string;
  metadata: any;
  business_id: string;
  platform_account_id: string;
  created_at?: string;
  updated_at?: string;
}

export class BankAccount implements IBankAccount {
  public id: string;
  public account_owner_name?: string;
  public full_name?: string;
  public account_type: string;
  public acct_last_four?: string;
  public account_number_last4?: string;
  public routing_number: string;
  public bank_name: string;
  public country: string;
  public currency: string;
  public nickname: string;
  public metadata: any;
  public business_id: string;
  public platform_account_id: string;
  public created_at?: string;
  public updated_at?: string;

  constructor(data: IBankAccount) {
    this.id = data.id;
    this.account_owner_name = data.account_owner_name;
    this.full_name = data.full_name;
    this.account_type = data.account_type;
    this.acct_last_four = data.acct_last_four;
    this.account_number_last4 = data.account_number_last4;
    this.routing_number = data.routing_number;
    this.bank_name = data.bank_name;
    this.country = data.country;
    this.currency = data.currency;
    this.nickname = data.nickname;
    this.metadata = data.metadata;
    this.business_id = data.business_id;
    this.platform_account_id = data.platform_account_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
