import { object } from 'yup';
import { businessCoreInfoSchemaUSA, businessCoreInfoSchemaCAN } from './business-core-info-schema';
import { additionalQuestionsSchema } from './business-additional-questions-schema';
import { identitySchemaUSA, identitySchemaCAN } from './business-identity-schema';
import { addressSchemaUSA, addressSchemaCAN } from './business-address-schema';
import { CountryCode } from '../../../utils/country-codes';

export const businessFormSchemaUSA = object({
  ...businessCoreInfoSchemaUSA().fields,
  legal_address: addressSchemaUSA(),
  additional_questions: additionalQuestionsSchema(),
  representative: identitySchemaUSA('representative'),
});

export const businessFormSchemaCAN = object({
  ...businessCoreInfoSchemaCAN().fields,
  legal_address: addressSchemaCAN(),
  additional_questions: additionalQuestionsSchema(),
  representative: identitySchemaCAN('representative'),
});

// Back-compat: default schema remains USA
export const businessFormSchema = businessFormSchemaUSA;
