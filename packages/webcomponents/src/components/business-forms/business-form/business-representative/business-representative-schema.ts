import { BusinessAddressFormFields } from "../../utils/business-form-types";

export interface IBusinessRepresentative {
  name: string;
  title: string;
  email: string;
  phone: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  identification_number: string;
  is_owner: boolean;
  metadata: any;
  address: BusinessAddressFormFields;
  created_at: string;
  updated_at: string;
}
