import { object, string } from 'yup';
import { 
  doingBusinessAsValidation,
  emailValidation,
  industryValidation,
  businessNameValidation, 
  phoneValidation, 
  taxIdValidation, 
  websiteUrlValidation,
  dateOfIncorporationValidation,
  businessClassificationValidation,
  makeBusinessClassificationValidation,
  makeTaxIdValidation
} from './schema-validations';
import { CountryCode } from '../../../utils/country-codes';
import { countryLabels } from '../utils/country-config';

// Base schema (no country-specific rules for classification/tax id)
export const baseBusinessCoreInfoSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    legal_name: businessNameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.required('Enter business website url'),
    email: emailValidation.required('Enter business email'),
    phone: phoneValidation.required('Enter phone number'),
    doing_business_as: doingBusinessAsValidation.nullable(),
    classification: businessClassificationValidation.required('Select business classification'),
    industry: industryValidation.required('Enter a business industry'),
    tax_id: taxIdValidation.required('Enter valid tax ID (SSN or EIN) without dashes'),
    date_of_incorporation: dateOfIncorporationValidation.required('Enter date of incorporation'),
  });

  const easySchema = object({
    legal_name: businessNameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    doing_business_as: doingBusinessAsValidation.nullable(),
    classification: businessClassificationValidation.nullable(),
    industry: industryValidation.nullable(),
    tax_id: taxIdValidation.nullable(),
    date_of_incorporation: dateOfIncorporationValidation.nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};

// Country-specific schema convenience wrappers
export const businessCoreInfoSchemaUSA = (allowOptionalFields?: boolean) =>
  baseBusinessCoreInfoSchema(allowOptionalFields).concat(object({
    classification: makeBusinessClassificationValidation(CountryCode.USA).required('Select business classification'),
    tax_id: makeTaxIdValidation(CountryCode.USA).required('Enter valid tax ID (SSN or EIN) without dashes'),
  } as any));

export const businessCoreInfoSchemaCAN = (allowOptionalFields?: boolean) =>
  baseBusinessCoreInfoSchema(allowOptionalFields).concat(object({
    classification: makeBusinessClassificationValidation(CountryCode.CAN).required('Select business classification'),
    tax_id: makeTaxIdValidation(CountryCode.CAN).required(`Enter valid ${countryLabels.CAN.taxIdLabel} without dashes`),
  } as any));

// Back-compat default: USA
export const businessCoreInfoSchema = (allowOptionalFields?: boolean) => businessCoreInfoSchemaUSA(allowOptionalFields);
