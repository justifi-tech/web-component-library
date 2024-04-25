import { object, string } from 'yup';
import StateOptions from '../../../utils/state-options';

const streetValidation = string()
  .min(5, 'Address must be at least 5 characters')
  .max(100, 'Address must be less than 100 characters')
  .matches(/^(?!^\s+$)[a-zA-Z0-9\s,.'-]*$/, 'Invalid characters in address')
  .transform((value, originalValue) => {
    return originalValue.trim() === '' ? null : value;
  })

const cityValidation = string()
  .min(2, 'City must be at least 2 characters')
  .max(50, 'City must be less than 50 characters')
  .matches(/^(?!^\s+$)[a-zA-Z\s]*$/, 'Invalid characters in city')
  .transform((value, originalValue) => {
    return originalValue.trim() === '' ? null : value;
  })

const stateValidation = string()
  .oneOf(StateOptions.map((option) => option.value), 'Select state')

const postalValidation = string()
  .matches(/^[0-9]{5}$/, 'Enter valid postal code')
  .transform((value, originalValue) => {
    return originalValue.trim() === '' ? null : value;
  })

export const addressSchema = object({
  line1: streetValidation.required('Enter street address'),
  line2: streetValidation.nullable(),
  city: cityValidation.required('Enter city'),
  state: stateValidation.required('Select state'),
  postal_code: postalValidation.required('Enter postal code'),
  country: string().required('Select country')
});
