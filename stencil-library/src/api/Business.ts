import { BankAccount } from './shared';

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

export enum BusinessType {
  individual = 'individual',
  for_profit = 'for_profit',
  non_profit = 'non_profit',
  government_entity = 'government_entity',
}

export interface Address {
  id: string;
  platform_account_id: string;
  line1: string;
  line2: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
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

export interface Identity {
  address: Address;
  created_at: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  documents: Document[];
  email: string;
  id: string;
  is_owner: boolean;
  metadata: any;
  name: string;
  phone: string;
  platform_account_id: string;
  ssn_last4: string;
  title: string;
  updated_at: string;
}

export interface ProductCategories {
  credit: boolean;
  insurance: boolean;
  lending: boolean;
  payment: boolean;
}

export interface AdditionalQuestions {
  business_revenue: string;
  business_payment_volume: string;
  business_dispute_volume: string;
  business_receivable_volume: string;
}

export interface IBusiness {
  business_structure: BusinessStructure;
  business_type: string;
  bank_accounts: BankAccount[];
  created_at: string;
  documents: Document[];
  doing_business_as: string;
  email: string;
  id: string;
  industry: string;
  legal_address: Address;
  legal_name: string;
  metadata: any;
  owners: Identity[];
  phone: string;
  platform_account_id: string;
  representative: Identity | null;
  tax_id: string;
  updated_at: string;
  website_url: string;
  product_categories: ProductCategories;
  additional_questions: AdditionalQuestions;
}

export class Business implements IBusiness {
  public business_structure: BusinessStructure;
  public business_type: string;
  public bank_accounts: BankAccount[];
  public created_at: string;
  public documents: Document[];
  public doing_business_as: string;
  public email: string;
  public id: string;
  public industry: string;
  public legal_address: Address;
  public legal_name: string;
  public metadata: any;
  public owners: Identity[];
  public phone: string;
  public platform_account_id: string;
  public representative: Identity | null;
  public tax_id: string;
  public updated_at: string;
  public website_url: string;
  public product_categories: ProductCategories;
  public additional_questions: AdditionalQuestions;

  constructor(business: IBusiness) {
    this.business_structure = business.business_structure;
    this.business_type = business.business_type;
    this.bank_accounts = business.bank_accounts;
    this.created_at = business.created_at;
    this.documents = business.documents;
    this.doing_business_as = business.doing_business_as;
    this.email = business.email;
    this.id = business.id;
    this.industry = business.industry;
    this.legal_address = business.legal_address;
    this.legal_name = business.legal_name;
    this.metadata = business.metadata;
    this.owners = business.owners;
    this.phone = business.phone;
    this.platform_account_id = business.platform_account_id;
    this.representative = business.representative;
    this.tax_id = business.tax_id;
    this.updated_at = business.updated_at;
    this.website_url = business.website_url;
    this.product_categories = business.product_categories;
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
