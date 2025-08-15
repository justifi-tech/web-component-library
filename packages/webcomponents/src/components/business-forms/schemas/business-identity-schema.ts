import { object, string } from 'yup';
import { addressSchema, addressSchemaUSA, addressSchemaCAN } from './business-address-schema';
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

export const identitySchema = (role: string, allowOptionalFields?: boolean, country?: CountryCode) => {
  const schema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.required(`Enter ${role} title`),
    email: emailValidation.required(`Enter ${role} email`),
    phone: phoneValidation.required('Enter phone number'),
    dob_full: dobValidation(role).required('Enter date of birth'),
    ssn_last4: string().nullable(),
    identification_number: country ? makeIdentityNumberValidation(country) : ssnValidation,
    address: country === CountryCode.CAN
      ? addressSchemaCAN(allowOptionalFields)
      : country === CountryCode.USA
        ? addressSchemaUSA(allowOptionalFields)
        : addressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_full: dobValidation(role).nullable(),
    ssn_last4: string().nullable(),
    identification_number: country ? makeIdentityNumberValidation(country).nullable() : ssnValidation.nullable(),
    address: country === CountryCode.CAN
      ? addressSchemaCAN(allowOptionalFields)
      : country === CountryCode.USA
        ? addressSchemaUSA(allowOptionalFields)
        : addressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}

// Country-specific schema convenience wrappers
export const identitySchemaUSA = (role: string, allowOptionalFields?: boolean) =>
  identitySchema(role, allowOptionalFields, CountryCode.USA);

export const identitySchemaCAN = (role: string, allowOptionalFields?: boolean) =>
  identitySchema(role, allowOptionalFields, CountryCode.CAN);
