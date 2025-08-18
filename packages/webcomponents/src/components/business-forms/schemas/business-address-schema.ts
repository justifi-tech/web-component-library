import { object, string } from 'yup';
import {
  cityValidation,
  lineOneValidation,
  lineTwoValidation,
  postalValidation,
  makePostalValidation,
} from './schema-validations';
import { CountryCode } from '../../../utils/country-codes';

// Internal USA schemas
const schemaUSA = () =>
  object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: string().nullable(),
    postal_code: string().nullable(),
  });

const strictSchemaUSA = () =>
  object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: string().required('Select state'),
    postal_code: postalValidation.required('Enter postal code'),
  });

// Internal CAN schemas
const schemaCAN = () =>
  object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.nullable(),
    state: string().nullable(),
    postal_code: string().nullable(),
  });

const strictSchemaCAN = () =>
  object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: cityValidation.required('Enter city'),
    state: string().required('Select state'),
    postal_code: makePostalValidation(CountryCode.CAN).required('Enter postal code'),
  });

// Public API
export const addressSchemaUSA = (allowOptionalFields?: boolean) =>
  allowOptionalFields ? schemaUSA() : strictSchemaUSA();

export const addressSchemaCAN = (allowOptionalFields?: boolean) =>
  allowOptionalFields ? schemaCAN() : strictSchemaCAN();

// For Backward compatibility
export const addressSchema = (allowOptionalFields?: boolean) => addressSchemaUSA(allowOptionalFields);
