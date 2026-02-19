import { Identity } from './Identity';
import { IDocument } from './Document';
import { IAddress } from './Address';
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
  bank_account_verification?: boolean;
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
