import { Address, IAddress } from "./Business";
import { constructDate, filterNumber } from "../components/business-forms/utils/helpers";

export interface Identity {
  address?: IAddress;
  created_at?: string;
  dob_day?: string;
  dob_month?: string;
  dob_year?: string;
  documents?: Document[];
  email?: string;
  id?: string;
  business_id?: string;
  is_owner?: boolean;
  metadata?: any;
  name?: string;
  phone?: string;
  platform_account_id?: string;
  ssn_last4?: string;
  title?: string;
  updated_at?: string;
}

export class Owner implements Identity {
  public address?: Address;
  public created_at?: string;
  public dob_day?: string;
  public dob_month?: string;
  public dob_year?: string;
  public dob_full?: string;
  public documents?: Document[];
  public email?: string;
  public id?: string;
  public business_id?: string;
  public is_owner?: boolean;
  public metadata?: any;
  public name?: string;
  public phone?: string;
  public platform_account_id?: string;
  public ssn_last4?: string;
  public title?: string;
  public updated_at?: string;

  constructor(owner: Identity) {
    this.address = { ...new Address(owner.address || {}) }
    this.created_at = owner.created_at;
    this.dob_day = filterNumber(owner.dob_day);
    this.dob_month = filterNumber(owner.dob_month);
    this.dob_year = owner.dob_year;
    this.dob_full = constructDate(this.dob_year, this.dob_month, this.dob_day) || '';
    this.documents = owner.documents;
    this.email = owner.email;
    this.id = owner.id;
    this.business_id = owner.business_id;
    this.is_owner = owner.is_owner;
    this.metadata = owner.metadata;
    this.name = owner.name;
    this.phone = owner.phone;
    this.platform_account_id = owner.platform_account_id;
    this.ssn_last4 = owner.ssn_last4;
    this.title = owner.title;
    this.updated_at = owner.updated_at;
  }
}

export class Representative implements Identity {
  public address?: Address;
  public created_at?: string;
  public dob_day?: string;
  public dob_month?: string;
  public dob_year?: string;
  public dob_full?: string;
  public documents?: Document[];
  public email?: string;
  public id?: string;
  public business_id?: string;
  public is_owner?: boolean;
  public metadata?: any;
  public name?: string;
  public phone?: string;
  public platform_account_id?: string;
  public ssn_last4?: string;
  public title?: string;
  public updated_at?: string;

  constructor(representative: Identity) {
    this.address = { ...new Address(representative.address || {}) }
    this.created_at = representative.created_at;
    this.dob_day = filterNumber(representative.dob_day);
    this.dob_month = filterNumber(representative.dob_month);
    this.dob_year = representative.dob_year;
    this.dob_full = constructDate(this.dob_year, this.dob_month, this.dob_day) || '';
    this.documents = representative.documents;
    this.email = representative.email;
    this.id = representative.id;
    this.business_id = representative.business_id;
    this.is_owner = representative.is_owner;
    this.metadata = representative.metadata;
    this.name = representative.name;
    this.phone = representative.phone;
    this.platform_account_id = representative.platform_account_id;
    this.ssn_last4 = representative.ssn_last4;
    this.title = representative.title;
    this.updated_at = representative.updated_at;
  }
}
