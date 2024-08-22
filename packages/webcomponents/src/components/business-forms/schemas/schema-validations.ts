import { mixed, string } from 'yup';
import StateOptions from '../../../utils/state-options';
import {
  businessServiceReceivedOptions,
  recurringPaymentsOptions,
  seasonalBusinessOptions,
  bankAccountTypeOptions,
  businessClassificationOptions
} from '../utils/business-form-options';
import {
  businessNameRegex,
  numbersOnlyRegex,
  phoneRegex,
  poBoxRegex,
  ssnRegex,
  streetAddressRegex,
  stringLettersOnlyRegex,
  transformEmptyString,
  urlRegex,
  validateRoutingNumber
} from './schema-helpers';
import { EntityDocumentType } from '../../../api/Document';

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

export const businessClassificationValidation = string()
  .oneOf(businessClassificationOptions.map((option) => option.value), 'Select business classification')
  .transform(transformEmptyString);

export const industryValidation = string()
  .min(2, 'Industry must be at least 2 characters')
  .max(50, 'Industry must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid industry')
  .transform(transformEmptyString);

export const taxIdValidation = string()
  .matches(numbersOnlyRegex, 'Enter valid tax id, SSN, or EIN')
  .test('not-repeat', 'Enter valid tax id, SSN, or EIN', (value) => {
    return !/^(\d)\1+$/.test(value);
  })
  .test('not-seq', 'Enter valid tax id, SSN, or EIN', (value) => {
    return value !== '123456789';
  })
  .transform(transformEmptyString);

export const dateOfIncorporationValidation = string()
  .test('not-future', 'Date of incorporation cannot be in the future', (value) => {
    const inputDate = new Date(value);
    const today = new Date();
    return inputDate <= today;
  })
  .transform(transformEmptyString);

// Identity Validations

export const identityNameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid name')
  .transform(transformEmptyString);

export const identityTitleValidation = string()
  .min(2, 'Title must be at least 2 characters')
  .max(50, 'Title must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid title')
  .transform(transformEmptyString);

export const dobValidation = (role: string) => {
  return (
    string()
    .test('min', 'Enter a valid date', (value) => {
      const date = new Date(value);
      const minDate = new Date('1902-01-01');
      return date >= minDate;
    })
    .test('age', `${role} must be at least 18 years old`, (value) => {
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
  .when('ssn_last4', {
    is: (val: string) => !val || val.length === 0,
    then: (schema) => schema.required('Enter SSN'),
    otherwise: (schema) => schema.nullable(),
  })
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
  .matches(streetAddressRegex, 'Enter valid address line 1')
  .test('not-po-box', 'A PO Box is not a valid address entry', (value) => {
    return !poBoxRegex.test(value);
  })
  .transform(transformEmptyString);

export const lineTwoValidation = string()
  .max(100, 'Address must be less than 100 characters')
  .matches(streetAddressRegex, 'Enter valid address line 2')
  .test('not-po-box', 'A PO Box is not a valid address entry', (value) => {
    return !poBoxRegex.test(value);
  })
  .transform(transformEmptyString);

export const cityValidation = string()
  .min(2, 'City must be at least 2 characters')
  .max(50, 'City must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid city')
  .transform(transformEmptyString);

export const stateValidation = string()
  .oneOf(StateOptions.map((option) => option.value), 'Select state')
  .transform(transformEmptyString);

export const postalValidation = string()
  .matches(/^[0-9]{5}$/, 'Enter valid postal code')
  .transform(transformEmptyString);

// Additional Questions Validations

export const revenueValidation = string()
  .matches(numbersOnlyRegex, 'Enter valid revenue')
  .transform(transformEmptyString);

export const paymentVolumeValidation = string()
  .matches(numbersOnlyRegex, 'Enter valid payment volume')
  .transform(transformEmptyString);

export const whenServiceReceivedValidation = string()
  .oneOf(businessServiceReceivedOptions.map((option) => option.value), 'Select when service is received')
  .transform(transformEmptyString);

export const recurringPaymentsValidation = string()
  .oneOf(recurringPaymentsOptions.map((option) => option.value), 'Select recurring payments')
  .transform(transformEmptyString);

export const recurringPaymentsPercentageValidation = string()
  .when('business_recurring_payments', {
    is: (val: any) => val === 'Yes',
    then: (schema) => schema.required('Enter recurring payments percentage'),
    otherwise: (schema) => schema.nullable(),
  })
  .transform(transformEmptyString);

export const seasonalBusinessValidation = string()
  .oneOf(seasonalBusinessOptions.map((option) => option.value), 'Select seasonal business')
  .transform(transformEmptyString);

export const otherPaymentDetailsValidation = string()
  .transform(transformEmptyString);

// Bank Account Validations

export const bankNameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid bank name')
  .transform(transformEmptyString);

export const nicknameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .matches(stringLettersOnlyRegex, 'Enter valid nickname')
  .transform(transformEmptyString);

export const accountTypeValidation = string()
  .oneOf(bankAccountTypeOptions.map((option) => option.value), 'Select account type')
  .transform(transformEmptyString);

export const accountNumberValidation = string()
  .min(8, 'Account number must be at least 8 digits')
  .max(17, 'Account number must be less than 17 digits')
  .matches(numbersOnlyRegex, 'Enter valid account number')
  .test('not-repeat', 'Enter valid account number', (value) => {
    return !/^(\d)\1+$/.test(value);
  })
  .transform(transformEmptyString);

export const routingNumberValidation = string()
  .length(9, 'Routing number must be 9 digits')
  .matches(numbersOnlyRegex, 'Enter valid routing number')
  .test('not-repeat', 'Enter valid routing number', (value) => {
    return !/^(\d)\1+$/.test(value);
  })
  .test('valid', 'Enter valid routing number', (value) => {
    return validateRoutingNumber(value);
  })
  .transform(transformEmptyString);

  // Document Upload Validations

const documentUploadValidation = mixed();

export const ss4Validation = documentUploadValidation;

export const governmentIdValidation = documentUploadValidation;

export const otherDocumentValidation = documentUploadValidation;

export const voidedCheckValidation = (documents: any[], allowOptionalFields: boolean) => {
  const existingDoc = documents.some((doc) => doc.document_type === EntityDocumentType.voidedCheck);

  if (existingDoc || allowOptionalFields) {
    return documentUploadValidation.nullable();
  } else {
    return documentUploadValidation.required('Please select one or more files');
  }
}

export const bankStatementValidation = (volume: string, documents: any[], allowOptionalFields: boolean) => {
  const vol = parseInt(volume);
  const bankStatementRequiredAmount = 250000;
  const existingDoc = documents.some((doc) => doc.document_type === EntityDocumentType.bankStatement);

  if (existingDoc || allowOptionalFields) {
    return documentUploadValidation.nullable();
  } else if (vol >= bankStatementRequiredAmount && !allowOptionalFields) {
    return documentUploadValidation.required('Please select one or more files');
  }
};

export const balanceSheetValidation = (volume: string, documents: any[], allowOptionalFields: boolean) => {
  const vol = parseInt(volume);
  const balanceSheetRequiredAmount = 1000000;
  const existingDoc = documents.some((doc) => doc.document_type === EntityDocumentType.balanceSheet);

  if (existingDoc || allowOptionalFields) {
    return documentUploadValidation.nullable();
  } else if (vol >= balanceSheetRequiredAmount && !allowOptionalFields) {
    return documentUploadValidation.required('Please select one or more files');
  }
};

export const profitAndLossStatementValidation = (volume: string, documents: any[], allowOptionalFields: boolean) => {
  const vol = parseInt(volume);
  const profitLossRequiredAmount = 1000000;
  const existingDoc = documents.some((doc) => doc.document_type === EntityDocumentType.profitAndLossStatement);
  
  if (existingDoc || allowOptionalFields) {
    return documentUploadValidation.nullable();
  } else if (vol >= profitLossRequiredAmount && !allowOptionalFields) {
    return documentUploadValidation.required('Please select one or more files');
  }
};
