import { object, string } from 'yup';

export const addressSchema = object({
  line1: string().required('Enter street address'),
  city: string().required('Enter city'),
  state: string().required('Select state'),
  postal_code: string().required('Enter postal code'),
});

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
  address: addressSchema,
});
