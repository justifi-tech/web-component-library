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
