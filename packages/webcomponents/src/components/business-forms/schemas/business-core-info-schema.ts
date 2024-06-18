import { object } from 'yup';
import { 
  doingBusinessAsValidation,
  emailValidation,
  industryValidation,
  businessNameValidation, 
  phoneValidation, 
  taxIdValidation, 
  websiteUrlValidation,
  dateOfIncorporationValidation,
  businessClassificationValidation
} from './schema-validations';

export const businessCoreInfoSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    legal_name: businessNameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.required('Enter business website url'),
    email: emailValidation.required('Enter business email'),
    phone: phoneValidation.required('Enter phone number'),
    doing_business_as: doingBusinessAsValidation.required('Enter doing business as'),
    classification: businessClassificationValidation.required('Select business classification'),
    industry: industryValidation.required('Enter a business industry'),
    tax_id: taxIdValidation.required('Enter tax id'),
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
