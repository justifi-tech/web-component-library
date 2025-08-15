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

export const businessCoreInfoSchema = (allowOptionalFields?: boolean, country?: CountryCode) => {
  const effectiveCountry = country || CountryCode.USA;
  const schema = object({
    legal_name: businessNameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.required('Enter business website url'),
    email: emailValidation.required('Enter business email'),
    phone: phoneValidation.required('Enter phone number'),
    doing_business_as: doingBusinessAsValidation.nullable(),
    classification: (country ? makeBusinessClassificationValidation(effectiveCountry) : businessClassificationValidation).required('Select business classification'),
    industry: industryValidation.required('Enter a business industry'),
    tax_id: (country ? makeTaxIdValidation(effectiveCountry) : taxIdValidation).required(
      effectiveCountry === CountryCode.CAN
        ? `Enter valid ${countryLabels.CAN.taxIdLabel} without dashes`
        : 'Enter valid tax ID (SSN or EIN) without dashes'
    ),
    date_of_incorporation: dateOfIncorporationValidation.required('Enter date of incorporation'),
  });

  const easySchema = object({
    legal_name: businessNameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    doing_business_as: doingBusinessAsValidation.nullable(),
    classification: (country ? makeBusinessClassificationValidation(effectiveCountry) : businessClassificationValidation).nullable(),
    industry: industryValidation.nullable(),
    tax_id: (country ? makeTaxIdValidation(effectiveCountry) : taxIdValidation).nullable(),
    date_of_incorporation: dateOfIncorporationValidation.nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
