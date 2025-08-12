import { object } from 'yup';
import { 
  doingBusinessAsValidation,
  emailValidation,
  industryValidation,
  businessNameValidation, 
  phoneValidation, 
  createCountrySpecificTaxIdValidation,
  websiteUrlValidation,
  dateOfIncorporationValidation,
  businessClassificationValidation
} from './schema-validations';

export const businessCoreInfoSchema = (allowOptionalFields?: boolean, country?: string) => {
  const isCanadian = country === 'CAN';
  const taxIdRequiredMessage = isCanadian
    ? 'Enter valid Business Number without dashes'
    : 'Enter valid tax ID (SSN or EIN) without dashes';

  const countrySpecificTaxIdValidation = createCountrySpecificTaxIdValidation(country);

  const schema = object({
    legal_name: businessNameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.required('Enter business website url'),
    email: emailValidation.required('Enter business email'),
    phone: phoneValidation.required('Enter phone number'),
    doing_business_as: doingBusinessAsValidation.nullable(),
    classification: businessClassificationValidation.required('Select business classification'),
    industry: industryValidation.required('Enter a business industry'),
    tax_id: countrySpecificTaxIdValidation.required(taxIdRequiredMessage),
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
    tax_id: countrySpecificTaxIdValidation.nullable(),
    date_of_incorporation: dateOfIncorporationValidation.nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
