import { object, string } from 'yup';
import StateOptions from '../../../utils/state-options';

export const legalAddressSchema = object({
  line1: string().required('Enter street address'),
  line2: string().nullable(),
  city: string().required('Enter city'),
  state: string().required('Select state').oneOf(StateOptions.map((option) => option.value), 'Select state'),
  postal_code: string()
    .matches(/^[0-9]{5}$/, 'Enter valid postal code')
    .required('Enter postal code'),
  country: string().required('Select country')
});

export const identityAddressSchema = object({
  line1: string().required('Enter street address'),
  city: string().required('Enter city'),
  state: string().required('Select state').oneOf(StateOptions.map((option) => option.value), 'Select state'),
  postal_code: string()
    .matches(/^[0-9]{5}$/, 'Enter valid postal code')
    .required('Enter postal code'),
  country: string().required('Select country')
});
