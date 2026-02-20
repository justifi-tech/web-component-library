import { IAddress } from './Address';
import { IDocument } from './Document';

export interface IIdentity {
  address?: IAddress;
  created_at?: string;
  dob_day?: string;
  dob_month?: string;
  dob_year?: string;
  documents?: IDocument[];
  email?: string;
  id?: string;
  business_id?: string;
  is_owner?: boolean;
  metadata?: unknown;
  name?: string;
  phone?: string;
  platform_account_id?: string;
  identification_number?: string;
  ownership_percentage?: string;
  ssn_last4?: string;
  title?: string;
  updated_at?: string;
}
