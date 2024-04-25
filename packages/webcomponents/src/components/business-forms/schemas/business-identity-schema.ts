import { object, string } from 'yup';
import { addressSchema } from './business-address-schema';

export const phoneRegex = /^[0-9]+$/;

export const representativeSchema = object({
  name: string().required('Enter representative name'),
  email: string()
    .email('Enter valid representative email')
    .required('Enter representative email'),
  phone: string()
    .required('Enter representative phone number')
    .matches(phoneRegex, 'Phone number must contain only numbers')
    .min(10, 'Phone number must contain 10 digits')
    .max(10, 'Phone number must contain 10 digits'),
  dob_day: string().required('Enter representative birth day'),
  dob_month: string().required('Enter representative birth month'),
  dob_year: string().required('Enter representative birth year'),
  identification_number: string(),
  address: addressSchema,
});

export const ownerSchema = object({
  name: string().required('Enter owner name'),
  email: string()
    .email('Enter valid owner email')
    .required('Enter owner email'),
  phone: string()
    .required('Enter owner phone number')
    .matches(phoneRegex, 'Phone number must contain only numbers')
    .min(10, 'Phone number must contain 10 digits')
    .max(10, 'Phone number must contain 10 digits'),
  dob_day: string().required('Enter owner birth day'),
  dob_month: string().required('Enter owner birth month'),
  dob_year: string().required('Enter owner birth year'),
  identification_number: string(),
  address: addressSchema,
});
