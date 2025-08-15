import { object, string } from 'yup';
import { 
  cityValidation,
  lineOneValidation, 
  lineTwoValidation,
  postalValidation,
  stateValidation,
  makePostalValidation,
  makeStateValidation
} from './schema-validations';
import { CountryCode } from '../../../utils/country-codes';

export const addressSchema = (allowOptionalFields?: boolean, country?: CountryCode) => {
  const effectiveCountry = country || CountryCode.USA;
  const schema = object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: (country ? makeStateValidation(effectiveCountry) : stateValidation).required('Select state'),
    postal_code: (country ? makePostalValidation(effectiveCountry) : postalValidation).required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: (country ? makeStateValidation(effectiveCountry) : stateValidation).nullable(),
    postal_code: (country ? makePostalValidation(effectiveCountry) : postalValidation).nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};
