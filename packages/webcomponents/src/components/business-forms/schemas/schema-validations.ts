import { string } from "yup";
import { BusinessTypeOptions } from "../utils/business-form-types";
import StateOptions from "../../../utils/state-options";
import { 
  businessNameRegex, 
  phoneRegex, 
  ssnRegex, 
  stringLettersOnlyRegex, 
  taxIdRegex, 
  transformEmptyString, 
  urlRegex } 
  from "./schema-helpers";

// Common Validations

export const emailValidation = string()
  .email('Enter valid email')
  .transform(transformEmptyString);

export const phoneValidation = string()
  .matches(phoneRegex, 'Enter valid phone number')
  .transform(transformEmptyString);

// Core Info Validations

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

// Identity Validations

export const identityNameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid name')
  .transform(transformEmptyString);

export const dobValidation = (title: string) => {
  return (
    string()
    .test('min', 'Enter a valid date', (value) => {
      const date = new Date(value);
      const minDate = new Date('1902-01-01');
      return date >= minDate;
    })
    .test('age', `${title} must be at least 18 years old`, (value) => {
      const date = new Date(value);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
      return date <= minAgeDate;
    })
    .transform(transformEmptyString)
  )
};

export const ssnValidation = string()
  .matches(ssnRegex, 'Enter valid SSN')
  .test('not-repeat', 'Enter valid SSN', (value) => {
    return !/^(\d)\1+$/.test(value);
  })
  .test('not-seq', 'Enter valid SSN', (value) => {
    return value !== '123456789';
  })
  .transform(transformEmptyString);

// Address Validations

export const lineOneValidation = string()
  .min(5, 'Address must be at least 5 characters')
  .max(100, 'Address must be less than 100 characters')
  .matches(/^(?!^\s+$)[a-zA-Z0-9\s,.'-]*$/, 'Enter valid address line 1')
  .transform(transformEmptyString);

export const lineTwoValidation = string()
  .max(100, 'Address must be less than 100 characters')
  .matches(/^(?!^\s+$)[a-zA-Z0-9\s,.'-]*$/, 'Enter valid address line 2')
  .transform(transformEmptyString);

export const cityValidation = string()
  .min(2, 'City must be at least 2 characters')
  .max(50, 'City must be less than 50 characters')
  .matches(/^(?!^\s+$)[a-zA-Z\s]*$/, 'Enter valid city')
  .transform(transformEmptyString);

export const stateValidation = string()
  .oneOf(StateOptions.map((option) => option.value), 'Select state')
  .transform(transformEmptyString);

export const postalValidation = string()
  .matches(/^[0-9]{5}$/, 'Enter valid postal code')
  .transform(transformEmptyString);
  