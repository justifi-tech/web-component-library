import { object, string } from 'yup';

export const RegExZip = /^\d{5}/;

export interface BusinessAddressFormFields {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const BusinessAddressFormSchema = object({
  line1: string().required('Enter street address'),
  line2: string(),
  city: string().required('Enter city'),
  state: string().required('Choose state'),
  postal_code: string()
    .required('Enter ZIP')
    .matches(RegExZip, 'Enter a valid ZIP')
    .min(5, 'Enter a valid ZIP')
});

export default BusinessAddressFormSchema;