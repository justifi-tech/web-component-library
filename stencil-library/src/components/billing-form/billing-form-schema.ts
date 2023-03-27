import { object, string } from 'yup';

export const RegExZip = /^\d{5}/;

export interface BillingFormFields {
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

const BillingFormSchema = object({
  // name: string().required('Enter name'),
  address_line1: string().required('Enter street address'),
  address_line2: string(),
  address_city: string().required('Enter city'),
  address_state: string().required('Choose state'),
  address_postal_code: string()
    .required('Enter ZIP')
    .matches(RegExZip, 'Enter a valid ZIP')
    .min(5, 'Enter a valid ZIP')
});

export default BillingFormSchema;