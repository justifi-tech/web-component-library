import { object, string } from 'yup';
import { addressSchemaUSA, addressSchemaCAN } from './business-address-schema';
import {
  dobValidation,
  emailValidation,
  identityNameValidation,
  identityTitleValidation,
  phoneValidation,
  ssnValidation,
  makeIdentityNumberValidation,
} from './schema-validations';
import { CountryCode } from '../../../utils/country-codes';

// Internal USA schemas
const schemaUSA = (role: string) =>
  object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_full: dobValidation(role).nullable(),
    ssn_last4: string().nullable(),
    identification_number: ssnValidation.nullable(),
    address: addressSchemaUSA(true),
  });

const strictSchemaUSA = (role: string) =>
  object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.required(`Enter ${role} title`),
    email: emailValidation.required(`Enter ${role} email`),
    phone: phoneValidation.required('Enter phone number'),
    dob_full: dobValidation(role).required('Enter date of birth'),
    ssn_last4: string().nullable(),
    // ssn required unless last4 provided (handled inside ssnValidation)
    identification_number: ssnValidation,
    address: addressSchemaUSA(false),
  });

// Internal CAN schemas
const schemaCAN = (role: string) =>
  object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_full: dobValidation(role).nullable(),
    identification_number: makeIdentityNumberValidation(CountryCode.CAN).nullable(),
    address: addressSchemaCAN(true),
  });

const strictSchemaCAN = (role: string) =>
  object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.required(`Enter ${role} title`),
    email: emailValidation.required(`Enter ${role} email`),
    phone: phoneValidation.required('Enter phone number'),
    dob_full: dobValidation(role).required('Enter date of birth'),
    identification_number: makeIdentityNumberValidation(CountryCode.CAN).required('Enter identification number'),
    address: addressSchemaCAN(false),
  });

export const identitySchemaUSA = (role: string, allowOptionalFields?: boolean) =>
  allowOptionalFields ? schemaUSA(role) : strictSchemaUSA(role);

export const identitySchemaCAN = (role: string, allowOptionalFields?: boolean) =>
  allowOptionalFields ? schemaCAN(role) : strictSchemaCAN(role);
