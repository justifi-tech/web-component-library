import { object, string } from 'yup';
import { BusinessTypeOptions } from '../utils/business-form-types';
import { 
  businessNameRegex, 
  phoneRegex, 
  stringLettersOnlyRegex, 
  taxIdRegex, 
  transformEmptyString, 
  urlRegex } 
  from './schema-helpers';

const nameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(businessNameRegex, 'Enter valid business name')
  .transform(transformEmptyString);

const doingBusinessAsValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(businessNameRegex, 'Enter valid doing business as')
  .transform(transformEmptyString);

const websiteUrlValidation = string()
  .matches(urlRegex, 'Enter valid website url')
  .transform(transformEmptyString);

const emailValidation = string()
  .email('Enter valid email')
  .transform(transformEmptyString);

const phoneValidation = string()
  .matches(phoneRegex, 'Enter valid phone number')
  .transform(transformEmptyString);

const businessTypeValidation = string()
  .oneOf(BusinessTypeOptions.map((option) => option.value), 'Select business type')
  .transform(transformEmptyString);

const industryValidation = string()
  .min(2, 'Industry must be at least 2 characters')
  .max(50, 'Industry must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid industry')
  .transform(transformEmptyString);

const taxIdValidation = string()
  .matches(taxIdRegex, 'Enter valid tax id')
  .transform(transformEmptyString);

export const businessCoreInfoSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    legal_name: nameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.required('Enter business website url'),
    email: emailValidation.required('Enter business email'),
    phone: phoneValidation.required('Enter phone number'),
    doing_business_as: doingBusinessAsValidation.required('Enter doing business as'),
    business_type: businessTypeValidation.required('Select business type'),
    industry: industryValidation.required('Enter a business industry'),
    tax_id: taxIdValidation.required('Enter tax id'),
  });

  const easySchema = object({
    legal_name: nameValidation.required('Enter legal name'),
    website_url: websiteUrlValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    doing_business_as: doingBusinessAsValidation.nullable(),
    business_type: businessTypeValidation.nullable(),
    industry: industryValidation.nullable(),
    tax_id: taxIdValidation.nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
