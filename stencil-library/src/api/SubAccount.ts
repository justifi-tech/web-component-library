import { formatCurrency, formatDate, formatPercentage, formatTime } from '../utils/utils';
import { BusinessStructure } from './Business';

export enum TagTypes {
  neutral = 'neutral',
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error'
}

export enum SubAccountStatusType {
  created = 'created',
  submitted = 'submitted',
  information_needed = 'information_needed',
  enabled = 'enabled',
  disabled = 'disabled',
  rejected = 'rejected',
  archived = 'archived'
}

export enum AccountType {
  live = 'live',
  test = 'test'
}

export enum BusinessType {
  forProfit = 'for_profit',
  nonProfit = 'non_profit',
  government = 'government_entity',
  individual = 'individual'
}

export enum ForProfitStructure {
  none = '',
  soleProprietorship = 'sole_proprietorship',
  singleMember = 'single_llc',
  multiMember = 'multi_llc',
  privatePartnership = 'private_partnership',
  privateCorp = 'private_corporation',
  unincorporatedAssociation = 'unincorporated_association',
  publicPartnership = 'public_partnership',
  publicCorp = 'public_corporation'
}

export enum NonProfitStructure {
  incorporated = 'incorporated',
  unincorporated = 'unincorporated'
}

export enum GovernmentEntityStructure {
  unit = 'government_unit',
  instrumentality = 'government_instrumentality',
  taxExempt = 'tax_exempt_government_instrumentality'
}

export interface ApplicationFeeRate {
  basis_point_rate: number,
  created_at: string,
  currency: string,
  id: string,
  rate_type: string,
  transaction_fee: number,
  updated_at: string
}

export interface Legal {
  name?: string,
  address_line1?: string,
  address_line2?: string,
  address_city?: string,
  address_state?: string,
  address_postal_code?: string,
  address_country?: string
}

export interface ISubAccount {
  account_type: AccountType,
  application_fee_rates: ApplicationFeeRate[] | [],
  created_at: string,
  currency: string,
  id: string,
  name: string,
  payout_ready: boolean,
  platform_account_id: string,
  processing_ready: boolean,
  status: SubAccountStatusType,
  updated_at: string
  related_accounts?: object,
  readonly statusTagType?: TagTypes
};

export class SubAccount implements ISubAccount {
  public account_type: AccountType;
  public application_fee_rates: ApplicationFeeRate[] | [];
  public created_at: string;
  public dateString: string;
  public timeString: string;
  public currency: string;
  public id: string;
  public name: string;
  public payout_ready: boolean;
  public platform_account_id: string;
  public processing_ready: boolean;
  public status: SubAccountStatusType;
  public updated_at: string;
  public related_accounts: object;
  public cardRate: string | undefined;
  public achRate: string | undefined;

  constructor(subAccount: ISubAccount) {
    this.account_type = subAccount.account_type;
    this.application_fee_rates = subAccount.application_fee_rates || [];
    this.created_at = subAccount.created_at;
    this.dateString = formatDate(subAccount.created_at);
    this.timeString = formatTime(subAccount.created_at);
    this.currency = subAccount.currency;
    this.id = subAccount.id;
    this.name = subAccount.name;
    this.payout_ready = subAccount.payout_ready;
    this.platform_account_id = subAccount.platform_account_id;
    this.processing_ready = subAccount.processing_ready;
    this.status = subAccount.status;
    this.updated_at = subAccount.updated_at;
    this.related_accounts = subAccount.related_accounts || {};
    const activeCardRate = this.findActiveRate(subAccount, 'cc');
    const activeAchRate = this.findActiveRate(subAccount, 'ach');
    this.cardRate = this.getFormattedRate(activeCardRate);
    this.achRate = this.getFormattedRate(activeAchRate);
  }

  findActiveRate = (subAccount: ISubAccount, type: string): ApplicationFeeRate | undefined => {
    return subAccount.application_fee_rates.find(rate => rate.rate_type === type);
  };

  getBasisPercentage = (rate: ApplicationFeeRate | undefined): string | undefined => {
    return formatPercentage(rate?.basis_point_rate);
  };

  getTransactionFee = (rate: ApplicationFeeRate | undefined): string | undefined => {
    return formatCurrency(rate?.transaction_fee);
  };

  getFormattedRate = (rate: ApplicationFeeRate | undefined): string | undefined => {
    return rate ?
      `${this.getBasisPercentage(rate)} + ${this.getTransactionFee(rate)}`
      : 'Not set';
  };

  get statusTagType(): TagTypes {
    const typeMap = {
      [SubAccountStatusType.enabled]: TagTypes.success,
      [SubAccountStatusType.disabled]: TagTypes.error,
      [SubAccountStatusType.rejected]: TagTypes.error,
      [SubAccountStatusType.information_needed]: TagTypes.warning,
      [SubAccountStatusType.submitted]: TagTypes.info,
      [SubAccountStatusType.created]: TagTypes.neutral,
      [SubAccountStatusType.archived]: TagTypes.neutral,
    };
    return typeMap[this.status];
  }
}

export interface SubAccountBusinessDetails {
  url?: string,
  type?: BusinessType,
  structure?: BusinessStructure,
  industry?: string,
  tax_id?: string,
  phone?: string,
  email?: string,
  date_of_incorporation?: string,
  approximate_annual_volume?: string,
  legal?: Legal,
  doing_business_as?: {name: string}
}

export interface SubAccountIdentity {
  name?: string,
  title?: string,
  email?: string,
  identification_number?: string,
  dob_month?: string,
  dob_day?: string,
  dob_year?: string,
  address_line1?: string,
  address_line2?: string,
  address_city?: string,
  address_state?: string,
  address_postal_code?: string,
  address_country?: string,
  phone?: string,
  is_owner?: boolean,
  ssn_last4?: string
}

export interface SubaccountBankAccount {
  bank_name?: string,
  account_nickname?: string,
  routing_number?: string,
  account_number?: string,
  account_type?: string,
  account_owner_name?: string
}

export interface Terms {
  accepted?: boolean,
  ip?: string,
  user_agent?: string
}

export interface IOnboardingPayload {
  onboarding_version: string,
  bank_account?: SubaccountBankAccount,
  business_details?: SubAccountBusinessDetails,
  representative?: SubAccountIdentity,
  terms_and_conditions?: Terms
  owners?: SubAccountIdentity[]
}

export class OnboardingPayload implements IOnboardingPayload {
  public onboarding_version: string;
  public bank_account?: SubaccountBankAccount;
  public business_details?: SubAccountBusinessDetails;
  public representative?: SubAccountIdentity;
  public terms_and_conditions?: Terms;
  public owners?: SubAccountIdentity[];

  constructor(payload: IOnboardingPayload) {
    this.onboarding_version = payload.onboarding_version;
    this.bank_account = payload.bank_account;
    this.business_details = payload.business_details;
    this.representative = payload.representative;
    this.terms_and_conditions = payload.terms_and_conditions;
    this.owners = payload.owners;
  }
}

export interface SubAccountOnboardingData {
  account_type?: AccountType,
  payload?: OnboardingPayload,
  platform_account_id?: string,
  seller_account_id?: string,
  sub_account_id?: string
}
