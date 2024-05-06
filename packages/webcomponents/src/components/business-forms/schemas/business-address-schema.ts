import { object, string } from 'yup';
import StateOptions from '../../../utils/state-options';
import { transformEmptyString } from './schema-helpers';

const lineOneValidation = string()
  .min(5, 'Address must be at least 5 characters')
  .max(100, 'Address must be less than 100 characters')
  .matches(/^(?!^\s+$)[a-zA-Z0-9\s,.'-]*$/, 'Enter valid address line 1')
  .transform(transformEmptyString);

const lineTwoValidation = string()
  .max(100, 'Address must be less than 100 characters')
  .matches(/^(?!^\s+$)[a-zA-Z0-9\s,.'-]*$/, 'Enter valid address line 2')
  .transform(transformEmptyString);

const cityValidation = string()
  .min(2, 'City must be at least 2 characters')
  .max(50, 'City must be less than 50 characters')
  .matches(/^(?!^\s+$)[a-zA-Z\s]*$/, 'Enter valid city')
  .transform(transformEmptyString);

const stateValidation = string()
  .oneOf(StateOptions.map((option) => option.value), 'Select state')
  .transform(transformEmptyString);

const postalValidation = string()
  .matches(/^[0-9]{5}$/, 'Enter valid postal code')
  .transform(transformEmptyString);

export const addressSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: stateValidation.required('Select state'),
    postal_code: postalValidation.required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: stateValidation.nullable(),
    postal_code: postalValidation.nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};
