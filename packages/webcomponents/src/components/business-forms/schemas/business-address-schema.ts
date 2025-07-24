import { object, string } from 'yup';
import { 
  cityValidation,
  lineOneValidation, 
  lineTwoValidation,
  postalValidation,
  stateValidation,
  countryAwareStateValidation,
  countryAwarePostalValidation
} from './schema-validations';

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

// Country-aware address schema for legal address form
export const legalAddressSchema = (allowOptionalFields?: boolean, country?: string) => {
  const schema = object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: countryAwareStateValidation(country).required('Select state/province'),
    postal_code: countryAwarePostalValidation(country).required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: countryAwareStateValidation(country).nullable(),
    postal_code: countryAwarePostalValidation(country).nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};
