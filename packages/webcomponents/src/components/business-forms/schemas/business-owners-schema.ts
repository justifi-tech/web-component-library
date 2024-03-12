import { object, string, boolean } from 'yup';
import { identityAddressSchema } from './business-legal-address-form-schema';

export const ownerSchema = object({
  name: string().required('Enter owner name'),
  title: string().required('Enter owner title'),
  email: string()
    .email('Enter valid owner email')
    .required('Enter owner email'),
  phone: string().required('Enter owner phone number'),
  dob_day: string().required('Enter owner birth day'),
  dob_month: string().required('Enter owner birth month'),
  dob_year: string().required('Enter owner birth year'),
  identification_number: string(),
  is_owner: boolean(),
  address: identityAddressSchema,
});
