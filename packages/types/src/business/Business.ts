import { Identity, Representative } from './Identity';
import { IDocument } from './Document';
import { Address, IAddress } from './Address';
import { normalizeCountry } from '../utils/helpers';
import { CountryCode } from '../utils/country-codes';
import { IBankAccount } from '../entities/BankAccount';

export enum BusinessFormServerErrors {
  fetchData = 'Error retrieving business data',
  patchData = 'Error updating business data',
}

export enum BusinessClassification {
  sole_proprietor = 'sole_proprietor',
  partnership = 'partnership',
  corporation = 'corporation',
  public_company = 'public_company',
  limited = 'limited',
  non_profit = 'non_profit',
  government = 'government',
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
  payload?: unknown;
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
  tax_id_last4?: string;
  website_url?: string;
  email?: string;
  phone?: string;
  date_of_incorporation?: string;
}

export class CoreBusinessInfo implements ICoreBusinessInfo {
  public classification?: BusinessClassification;
  public legal_name?: string;
  public doing_business_as?: string;
  public industry?: string;
  public tax_id?: string;
  public tax_id_last4?: string;
  public website_url?: string;
  public email?: string;
  public phone?: string;
  public date_of_incorporation?: string;

  constructor(coreBusinessInfo: ICoreBusinessInfo) {
    this.classification = coreBusinessInfo.classification;
    this.legal_name = coreBusinessInfo.legal_name;
    this.doing_business_as = coreBusinessInfo.doing_business_as;
    this.industry = coreBusinessInfo.industry;
    this.tax_id = coreBusinessInfo.tax_id;
    this.tax_id_last4 = coreBusinessInfo.tax_id_last4;
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
  associated_accounts: unknown[];
  classification: BusinessClassification;
  bank_accounts: IBankAccount[];
  created_at: string;
  documents: IDocument[];
  doing_business_as: string;
  email: string;
  id: string;
  industry: string;
  legal_address?: IAddress | null;
  legal_name: string;
  metadata: unknown;
  owners: Identity[];
  phone: string;
  platform_account_id: string;
  product_categories: ProductCategories;
  representative?: Identity | null;
  tax_id: string;
  tax_id_last4: string;
  terms_conditions_accepted: boolean;
  updated_at: string;
  website_url: string;
  date_of_incorporation?: string;
  country_of_establishment?: CountryCode;
}

export class Business implements IBusiness {
  public additional_questions: IAdditionalQuestions;
  public associated_accounts: unknown[];
  public classification: BusinessClassification;
  public bank_accounts: IBankAccount[];
  public created_at: string;
  public documents: IDocument[];
  public doing_business_as: string;
  public email: string;
  public id: string;
  public industry: string;
  public legal_address?: Address | null;
  public legal_name: string;
  public metadata: unknown;
  public owners: Identity[];
  public phone: string;
  public platform_account_id: string;
  public representative?: Identity | null;
  public tax_id: string;
  public tax_id_last4: string;
  public terms_conditions_accepted: boolean;
  public updated_at: string;
  public website_url: string;
  public date_of_incorporation?: string;
  public product_categories: ProductCategories;
  public country_of_establishment?: CountryCode;

  constructor(business: IBusiness) {
    this.additional_questions = business.additional_questions
      ? new AdditionalQuestions(business.additional_questions)
      : (null as unknown as IAdditionalQuestions);
    this.associated_accounts = business.associated_accounts;
    this.classification = business.classification;
    this.bank_accounts = business.bank_accounts;
    this.created_at = business.created_at;
    this.documents = business.documents;
    this.doing_business_as = business.doing_business_as;
    this.email = business.email;
    this.id = business.id;
    this.industry = business.industry;
    this.legal_address = business?.legal_address
      ? new Address(business.legal_address)
      : null;
    this.legal_name = business.legal_name;
    this.metadata = business.metadata;
    this.owners = business.owners;
    this.phone = business.phone;
    this.platform_account_id = business.platform_account_id;
    this.product_categories = business.product_categories;
    this.representative = business.representative
      ? new Representative(business.representative)
      : null;
    this.tax_id = business.tax_id;
    this.tax_id_last4 = business.tax_id_last4;
    this.terms_conditions_accepted = business.terms_conditions_accepted;
    this.updated_at = business.updated_at;
    this.website_url = business.website_url;
    this.date_of_incorporation = business.date_of_incorporation;
    this.country_of_establishment = normalizeCountry(
      business.country_of_establishment
    );
  }

  public get payload() {
    return {
      additional_questions: new AdditionalQuestions(this.additional_questions)
        .payload,
      classification: this.classification || '',
      doing_business_as: this.doing_business_as || '',
      email: this.email || '',
      industry: this.industry || '',
      legal_address: new Address(this.legal_address || {}).payload,
      legal_name: this.legal_name || '',
      metadata: this.metadata || {},
      owners: this.owners.map((owner) => ({ id: owner.id })),
      phone: this.phone || '',
      platform_account_id: this.platform_account_id || '',
      representative: new Representative(
        this.representative || ({} as Identity)
      ).payload,
      tax_id: this.tax_id || '',
      tax_id_last4: this.tax_id_last4 || '',
      website_url: this.website_url || '',
      date_of_incorporation: this.date_of_incorporation || '',
      country_of_establishment: this.country_of_establishment || CountryCode.USA,
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
