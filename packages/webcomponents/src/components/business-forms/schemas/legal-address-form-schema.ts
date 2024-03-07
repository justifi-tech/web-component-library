import { object, string } from 'yup';

export const legalAddressSchema = object({
  line1: string().required('Enter street address'),
  line2: string().nullable(),
  city: string().required('Enter city'),
  state: string().required('Select state'),
  postal_code: string().required('Enter postal code'),
  country: string().required('Select country'),
});
