import { getStateAbbreviation, normalizeCountry } from '../utils/helpers';

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
    this.country = normalizeCountry(address.country);
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
