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

// Base address schema (no country-specific constraints on state/postal)
export const baseAddressSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: string().transform((v) => (v === '' ? undefined : v)).required('Select state'),
    postal_code: string().transform((v) => (v === '' ? undefined : v)).required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: string().transform((v) => (v === '' ? undefined : v)).nullable(),
    postal_code: string().transform((v) => (v === '' ? undefined : v)).nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};

// Country-specific schema convenience wrappers
export const addressSchemaUSA = (allowOptionalFields?: boolean) =>
  baseAddressSchema(allowOptionalFields).concat(object({
    state: stateValidation.required('Select state'),
    postal_code: postalValidation.required('Enter postal code'),
  } as any));

export const addressSchemaCAN = (allowOptionalFields?: boolean) =>
  baseAddressSchema(allowOptionalFields).concat(object({
    state: makeStateValidation(CountryCode.CAN).required('Select state'),
    postal_code: makePostalValidation(CountryCode.CAN).required('Enter postal code'),
  } as any));

// Back-compat default: USA
export const addressSchema = (allowOptionalFields?: boolean) => addressSchemaUSA(allowOptionalFields);
