import { IIdentity, IDocument } from '@justifi/types';
import { Address, IAddress } from './Business';
import {
  constructDate,
  filterNumber,
} from '../components/business-forms/utils/helpers';

export class Identity implements IIdentity {
  public address?: Address;
  public created_at?: string;
  public dob_day?: string;
  public dob_month?: string;
  public dob_year?: string;
  public dob_full?: string;
  public documents?: IDocument[];
  public email?: string;
  public id?: string;
  public business_id?: string;
  public is_owner?: boolean;
  public metadata?: any;
  public name?: string;
  public phone?: string;
  public platform_account_id?: string;
  public identification_number?: string;
  public ownership_percentage?: string;
  public ssn_last4?: string;
  public title?: string;
  public updated_at?: string;

  constructor(data: IIdentity) {
    this.address = { ...new Address(data.address as IAddress || {}) } as Address;
    this.created_at = data.created_at;
    this.dob_day = filterNumber(data.dob_day);
    this.dob_month = filterNumber(data.dob_month);
    this.dob_year = data.dob_year;
    this.dob_full = constructDate(this.dob_year, this.dob_month, this.dob_day) || '';
    this.documents = data.documents as IDocument[];
    this.email = data.email;
    this.id = data.id;
    this.business_id = data.business_id;
    this.is_owner = data.is_owner;
    this.metadata = data.metadata;
    this.name = data.name;
    this.phone = data.phone;
    this.platform_account_id = data.platform_account_id;
    this.identification_number = data.identification_number;
    this.ownership_percentage = data.ownership_percentage;
    this.ssn_last4 = data.ssn_last4;
    this.title = data.title;
    this.updated_at = data.updated_at;
  }

  get payload() {
    return {
      address: new Address(this.address || {}).payload,
      dob_day: this.dob_day || '',
      dob_month: this.dob_month || '',
      dob_year: this.dob_year || '',
      email: this.email || '',
      identification_number: this.identification_number || undefined,
      is_owner: this.is_owner || false,
      metadata: this.metadata || null,
      name: this.name || '',
      phone: this.phone || '',
      platform_account_id: this.platform_account_id || null,
      title: this.title || '',
    };
  }
}

export class Owner extends Identity {
  get payload() {
    return {
      ...super.payload,
      ownership_percentage: this.ownership_percentage || undefined,
    };
  }
}

export class Representative extends Identity {
  get payload() {
    return { ...super.payload };
  }
}
