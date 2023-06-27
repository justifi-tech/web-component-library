import { object, string } from 'yup';
import { BusinessAddressFormFields } from '../business-address/business-address-form-schema';

export const RegExZip = /^\d{5}/;

export interface IBusinessRepresentative {
  name: string,
  title: string,
  email: string,
  phone: string,
  dob_day: string,
  dob_month: string,
  dob_year: string,
  identification_number: string,
  is_owner: boolean,
  metadata: any,
  address: BusinessAddressFormFields,
}

const RepresentativeFormSchema = object({
  name: string().required('Enter full name'),
  title: string(),
  email: string().required('Enter email'),
  phone: string().required('Enter phone'),
  dob_day: string().length(2).required('Enter birth day'),
  dob_month: string().length(2).required('Enter birth month'),
  dob_year: string().length(2).required('Enter birth year'),
  identification_number: string().required('Enter EIN/SSN')
});

export default RepresentativeFormSchema;