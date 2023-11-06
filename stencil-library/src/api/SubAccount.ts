import { formatCurrency, formatDate, formatPercentage, formatTime } from '../utils/utils';

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
