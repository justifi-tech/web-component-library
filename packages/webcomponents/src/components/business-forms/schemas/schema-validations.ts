import { string } from "yup";
import { BusinessTypeOptions } from "../utils/business-form-types";
import { 
  businessNameRegex, 
  phoneRegex, 
  stringLettersOnlyRegex, 
  taxIdRegex, 
  transformEmptyString, 
  urlRegex } 
  from "./schema-helpers";

export const businessNameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(businessNameRegex, 'Enter valid business name')
  .transform(transformEmptyString);

export const doingBusinessAsValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(businessNameRegex, 'Enter valid doing business as')
  .transform(transformEmptyString);

export const websiteUrlValidation = string()
  .matches(urlRegex, 'Enter valid website url')
  .transform(transformEmptyString);

export const emailValidation = string()
  .email('Enter valid email')
  .transform(transformEmptyString);

export const phoneValidation = string()
  .matches(phoneRegex, 'Enter valid phone number')
  .transform(transformEmptyString);

export const businessTypeValidation = string()
  .oneOf(BusinessTypeOptions.map((option) => option.value), 'Select business type')
  .transform(transformEmptyString);

export const industryValidation = string()
  .min(2, 'Industry must be at least 2 characters')
  .max(50, 'Industry must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid industry')
  .transform(transformEmptyString);

export const taxIdValidation = string()
  .matches(taxIdRegex, 'Enter valid tax id')
  .transform(transformEmptyString);
