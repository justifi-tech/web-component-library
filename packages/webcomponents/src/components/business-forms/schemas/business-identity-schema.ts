import { object, string } from 'yup';
import { addressSchemaUSA, addressSchemaCAN } from './business-address-schema';
import { 
  dobValidation, 
  emailValidation, 
  identityNameValidation, 
  identityTitleValidation, 
  phoneValidation, 
  ssnValidation,
  makeIdentityNumberValidation
} from './schema-validations';
import { CountryCode } from '../../../utils/country-codes';

// Base identity schema (no country-specific id/address rules)
export const baseIdentitySchema = (role: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.required(`Enter ${role} title`),
    email: emailValidation.required(`Enter ${role} email`),
    phone: phoneValidation.required('Enter phone number'),
    dob_full: dobValidation(role).required('Enter date of birth'),
    ssn_last4: string().nullable(),
    identification_number: ssnValidation,
    address: addressSchemaUSA(allowOptionalFields),
  });

  const easySchema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_full: dobValidation(role).nullable(),
    ssn_last4: string().nullable(),
    identification_number: ssnValidation.nullable(),
    address: addressSchemaUSA(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}

// Country-specific schema convenience wrappers
export const identitySchemaUSA = (role: string, allowOptionalFields?: boolean) =>
  baseIdentitySchema(role, allowOptionalFields).concat(object({
    identification_number: makeIdentityNumberValidation(CountryCode.USA),
    address: addressSchemaUSA(allowOptionalFields),
  } as any));

export const identitySchemaCAN = (role: string, allowOptionalFields?: boolean) =>
  baseIdentitySchema(role, allowOptionalFields).concat(object({
    identification_number: makeIdentityNumberValidation(CountryCode.CAN),
    address: addressSchemaCAN(allowOptionalFields),
  } as any));
