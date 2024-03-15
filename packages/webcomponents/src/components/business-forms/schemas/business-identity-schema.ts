import { object, string } from 'yup';
import { identityAddressSchema } from './business-address-schema';

export const representativeSchema = object({
  name: string().required('Enter representative name'),
  email: string()
    .email('Enter valid representative email')
    .required('Enter representative email'),
  phone: string().required('Enter representative phone number'),
  dob_day: string().required('Enter representative birth day'),
  dob_month: string().required('Enter representative birth month'),
  dob_year: string().required('Enter representative birth year'),
  identification_number: string(),
  address: identityAddressSchema,
});

export const ownerSchema = object({
  name: string().required('Enter owner name'),
  email: string()
    .email('Enter valid owner email')
    .required('Enter owner email'),
  phone: string().required('Enter owner phone number'),
  dob_day: string().required('Enter owner birth day'),
  dob_month: string().required('Enter owner birth month'),
  dob_year: string().required('Enter owner birth year'),
  identification_number: string(),
  address: identityAddressSchema,
});
