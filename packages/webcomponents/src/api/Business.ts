import { Identity, Representative } from './Identity';
import { BankAccount } from './shared';
import { getStateAbbreviation } from '../components/business-forms/utils/helpers';

export enum BusinessType {
  individual = 'individual',
  for_profit = 'for_profit',
  non_profit = 'non_profit',
  government_entity = 'government_entity',
}

export enum BusinessStructure {
  sole_proprietorship = 'sole_proprietorship',
  single_llc = 'single_llc',
  multi_llc = 'multi_llc',
  private_partnership = 'private_partnership',
  private_corporation = 'private_corporation',
  unincorporated_association = 'unincorporated_association',
  public_partnership = 'public_partnership',
  public_corporation = 'public_corporation',
  incorporated = 'incorporated',
  unincorporated = 'unincorporated',
  government_unit = 'government_unit',
  government_instrumentality = 'government_instrumentality',
  tax_exempt_government_instrumentality = 'tax_exempt_government_instrumentality',
}

export interface IAddress {
  id?: string;
  platform_account_id?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export class Address implements IAddress {
  public id?: string;
  public platform_account_id?: string;
  public line1?: string;
  public line2?: string;
  public postal_code?: string;
  public city?: string;
  public state?: string;
  public country?: string;
  public created_at?: string;
  public updated_at?: string;

  constructor(address: IAddress) {
    this.id = address.id;
    this.platform_account_id = address.platform_account_id;
    this.line1 = address.line1;
    this.line2 = address.line2;
    this.postal_code = address.postal_code;
    this.city = address.city;
    this.state = getStateAbbreviation(address.state);
    this.country = address.country || 'USA';
    this.created_at = address.created_at;
    this.updated_at = address.updated_at;
  }
}

export interface Document {
  business_id: string;
  created_at: string;
  description: string | null;
  document_type: string;
  file_name: string;
  file_type: string;
  id: string;
  identity_id: string;
  metadata: any;
  platform_account_id: string;
  presigned_url: string | null;
  status: string;
  updated_at: string;
}

export interface ProductCategories {
  credit: boolean;
  insurance: boolean;
  lending: boolean;
  payment: boolean;
}

export interface IAdditionalQuestions {
  business_revenue?: string;
  business_payment_volume?: string;
  business_when_service_received?: string;
  business_recurring_payments?: string;
  business_recurring_payments_percentage?: string;
  business_seasonal?: string;
  business_other_payment_details?: string;
}

export class AdditionalQuestions implements IAdditionalQuestions {
  public business_revenue?: string;
  public business_payment_volume?: string;
  public business_when_service_received?: string;
  public business_recurring_payments?: string;
  public business_recurring_payments_percentage?: string;
  public business_seasonal?: string;
  public business_other_payment_details?: string;

  constructor(additionalQuestions: IAdditionalQuestions) {
    this.business_revenue = additionalQuestions.business_revenue;
    this.business_payment_volume = additionalQuestions.business_payment_volume;
    this.business_when_service_received = additionalQuestions.business_when_service_received;
    this.business_recurring_payments = additionalQuestions.business_recurring_payments;
    this.business_recurring_payments_percentage = additionalQuestions.business_recurring_payments_percentage;
    this.business_seasonal = additionalQuestions.business_seasonal;
    this.business_other_payment_details = additionalQuestions.business_other_payment_details;
  }
}

export interface ICoreBusinessInfo {
  business_type?: BusinessType;
  business_structure?: BusinessStructure;
  legal_name?: string;
  doing_business_as?: string;
  industry?: string;
  tax_id?: string;
  website_url?: string;
  email?: string;
  phone?: string;
  date_of_incorporation?: string;
}

export class CoreBusinessInfo implements ICoreBusinessInfo {
  public business_type: BusinessType;
  public business_structure: BusinessStructure;
  public legal_name: string;
  public doing_business_as: string;
  public industry: string;
  public tax_id: string;
  public website_url: string;
  public email: string;
  public phone: string;
  public date_of_incorporation: string;

  constructor(coreBusinessInfo: ICoreBusinessInfo) {
    this.business_type = coreBusinessInfo.business_type;
    this.business_structure = coreBusinessInfo.business_structure;
    this.legal_name = coreBusinessInfo.legal_name;
    this.doing_business_as = coreBusinessInfo.doing_business_as;
    this.industry = coreBusinessInfo.industry;
    this.tax_id = coreBusinessInfo.tax_id;
    this.website_url = coreBusinessInfo.website_url;
    this.email = coreBusinessInfo.email;
    this.phone = coreBusinessInfo.phone;
    this.date_of_incorporation = coreBusinessInfo.date_of_incorporation;
  }
}

export interface IBusiness {
  additional_questions: IAdditionalQuestions | {};
  business_type: BusinessType;
  business_structure: BusinessStructure;
  bank_accounts: BankAccount[];
  created_at: string;
  documents: Document[];
  doing_business_as: string;
  email: string;
  id: string;
  industry: string;
  legal_address: IAddress | {};
  legal_name: string;
  metadata: any;
  owners: Identity[];
  phone: string;
  platform_account_id: string;
  product_categories: ProductCategories;
  representative: Identity | {};
  tax_id: string;
  updated_at: string;
  website_url: string;
  date_of_incorporation?: string;
}

export class Business implements IBusiness {
  public additional_questions: AdditionalQuestions | {};
  public business_type: BusinessType;
  public business_structure: BusinessStructure;
  public bank_accounts: BankAccount[];
  public created_at: string;
  public documents: Document[];
  public doing_business_as: string;
  public email: string;
  public id: string;
  public industry: string;
  public legal_address: Address | {};
  public legal_name: string;
  public metadata: any;
  public owners: Identity[];
  public phone: string;
  public platform_account_id: string;
  public representative: Identity | {};
  public tax_id: string;
  public updated_at: string;
  public website_url: string;
  public date_of_incorporation?: string;
  public product_categories: ProductCategories;

  constructor(business: IBusiness) {
    this.additional_questions = { ...new AdditionalQuestions(business.additional_questions || {})};
    this.bank_accounts = business.bank_accounts;
    this.business_type = business.business_type;
    this.business_structure = business.business_structure;
    this.created_at = business.created_at;
    this.documents = business.documents;
    this.doing_business_as = business.doing_business_as;
    this.email = business.email;
    this.id = business.id;
    this.industry = business.industry;
    this.legal_address = { ...new Address(business.legal_address || {}) };
    this.legal_name = business.legal_name;
    this.metadata = business.metadata;
    this.owners = business.owners;
    this.phone = business.phone;
    this.platform_account_id = business.platform_account_id;
    this.product_categories = business.product_categories;
    this.representative = { ...new Representative(business.representative || {}) };
    this.tax_id = business.tax_id;
    this.updated_at = business.updated_at;
    this.website_url = business.website_url;
    this.date_of_incorporation = business.date_of_incorporation;
  }
}

export interface IProductReadiness {
  business_id: string;
  created_at: string;
  id: string;
  last_verified_at: string;
  missing_optional_fields: string[];
  missing_required_fields: string[];
  percentage_complete: number;
  percentage_ready: number;
  platform_account_id: string;
  product_category: string;
  product_name: string;
  required_ready: boolean;
  updated_at: string;
}
