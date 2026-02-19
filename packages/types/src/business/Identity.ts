import { IAddress } from './Address';
import { IDocument } from './Document';

export interface Identity {
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
  ssn_last4?: string;
  title?: string;
  updated_at?: string;
}
