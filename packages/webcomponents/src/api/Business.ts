import { Identity, Representative } from './Identity';
import { IDocument } from './Document';
import { IBankAccount } from './BankAccount';
import { getStateAbbreviation } from '../components/business-forms/utils/helpers';

export enum BusinessClassification {
  sole_proprietor = 'sole_proprietor',
  partnership = 'partnership',
  corporation = 'corporation',
  public_company = 'public_company',
  limited = 'limited',
  non_profit = 'non_profit',
  government = 'government',
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
  payload?: any;
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

  public get payload() {
    return {
      platform_account_id: this.platform_account_id || '',
      line1: this.line1 || '',
      line2: this.line2 || '',
      postal_code: this.postal_code || '',
      city: this.city || '',
      state: this.state || '',
      country: this.country || '',
    };
  }
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
  payload?: any;
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
    this.business_when_service_received =
      additionalQuestions.business_when_service_received;
    this.business_recurring_payments =
      additionalQuestions.business_recurring_payments;
    this.business_recurring_payments_percentage =
      additionalQuestions.business_recurring_payments_percentage;
    this.business_seasonal = additionalQuestions.business_seasonal;
    this.business_other_payment_details =
      additionalQuestions.business_other_payment_details;
  }

  public get payload() {
    return {
      business_revenue: this.business_revenue || '',
      business_payment_volume: this.business_payment_volume || '',
      business_when_service_received: this.business_when_service_received || '',
      business_recurring_payments: this.business_recurring_payments || '',
      business_recurring_payments_percentage:
        this.business_recurring_payments_percentage || '',
      business_seasonal: this.business_seasonal || '',
      business_other_payment_details: this.business_other_payment_details || '',
    };
  }
}

export interface ICoreBusinessInfo {
  classification?: BusinessClassification;
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
  public classification: BusinessClassification;
  public legal_name: string;
  public doing_business_as: string;
  public industry: string;
  public tax_id: string;
  public website_url: string;
  public email: string;
  public phone: string;
  public date_of_incorporation: string;

  constructor(coreBusinessInfo: ICoreBusinessInfo) {
    this.classification = coreBusinessInfo.classification;
    this.legal_name = coreBusinessInfo.legal_name;
    this.doing_business_as = coreBusinessInfo.doing_business_as;
    this.industry = coreBusinessInfo.industry;
    this.tax_id = coreBusinessInfo.tax_id;
    this.website_url = coreBusinessInfo.website_url;
    this.email = coreBusinessInfo.email;
    this.phone = coreBusinessInfo.phone;
    this.date_of_incorporation = coreBusinessInfo.date_of_incorporation;
  }

  public get payload() {
    return {
      classification: this.classification || '',
      legal_name: this.legal_name || '',
      doing_business_as: this.doing_business_as || '',
      industry: this.industry || '',
      tax_id: this.tax_id || '',
      website_url: this.website_url || '',
      email: this.email || '',
      phone: this.phone || '',
      date_of_incorporation: this.date_of_incorporation || '',
    };
  }
}

export interface IBusiness {
  additional_questions: IAdditionalQuestions;
  associated_accounts: any[];
  classification: BusinessClassification;
  bank_accounts: IBankAccount[];
  created_at: string;
  documents: IDocument[];
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
  terms_conditions_accepted: boolean;
  updated_at: string;
  website_url: string;
  date_of_incorporation?: string;
}

export class Business implements IBusiness {
  public additional_questions: IAdditionalQuestions;
  public associated_accounts: any[];
  public classification: BusinessClassification;
  public bank_accounts: IBankAccount[];
  public created_at: string;
  public documents: IDocument[];
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
  public terms_conditions_accepted: boolean;
  public updated_at: string;
  public website_url: string;
  public date_of_incorporation?: string;
  public product_categories: ProductCategories;

  constructor(business: IBusiness) {
    this.additional_questions = new AdditionalQuestions(
      business.additional_questions || {}
    );
    this.associated_accounts = business.associated_accounts;
    this.classification = business.classification;
    this.bank_accounts = business.bank_accounts;
    this.created_at = business.created_at;
    this.documents = business.documents;
    this.doing_business_as = business.doing_business_as;
    this.email = business.email;
    this.id = business.id;
    this.industry = business.industry;
    this.legal_address = new Address(business.legal_address || {});
    this.legal_name = business.legal_name;
    this.metadata = business.metadata;
    this.owners = business.owners;
    this.phone = business.phone;
    this.platform_account_id = business.platform_account_id;
    this.product_categories = business.product_categories;
    this.representative = new Representative(business.representative || {});
    this.tax_id = business.tax_id;
    this.terms_conditions_accepted = business.terms_conditions_accepted;
    this.updated_at = business.updated_at;
    this.website_url = business.website_url;
    this.date_of_incorporation = business.date_of_incorporation;
  }

  public get payload() {
    return {
      additional_questions: new AdditionalQuestions(this.additional_questions)
        .payload,
      classification: this.classification || '',
      doing_business_as: this.doing_business_as || '',
      email: this.email || '',
      industry: this.industry || '',
      legal_address: new Address(this.legal_address).payload,
      legal_name: this.legal_name || '',
      metadata: this.metadata || {},
      owners: this.owners.map((owner) => ({ id: owner.id })),
      phone: this.phone || '',
      platform_account_id: this.platform_account_id || '',
      representative: new Representative(this.representative).payload,
      tax_id: this.tax_id || '',
      website_url: this.website_url || '',
      date_of_incorporation: this.date_of_incorporation || '',
    };
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
