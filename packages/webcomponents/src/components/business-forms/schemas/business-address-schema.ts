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
    state: string().required('Select state'),
    postal_code: string().required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: string().nullable(),
    postal_code: string().nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};

// Country-specific schema convenience wrappers
export const addressSchemaUSA = (allowOptionalFields?: boolean) =>
  baseAddressSchema(allowOptionalFields).concat(object({
    state: stateValidation,
    postal_code: postalValidation,
  } as any));

export const addressSchemaCAN = (allowOptionalFields?: boolean) =>
  baseAddressSchema(allowOptionalFields).concat(object({
    state: makeStateValidation(CountryCode.CAN),
    postal_code: makePostalValidation(CountryCode.CAN),
  } as any));

// Back-compat default: USA
export const addressSchema = (allowOptionalFields?: boolean) => addressSchemaUSA(allowOptionalFields);
