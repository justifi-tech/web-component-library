import { object } from 'yup';
import {
  cityValidation,
  identityNameValidation,
  lineOneValidation,
  lineTwoValidation,
  postalValidation,
  stateValidation,
} from '../../business-forms/schemas/schema-validations';

// BillingFormFields and BillingFormSchema are used for justifi-billing-form which renders the entire billing form.
export interface BillingFormFields {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

export const BillingFormSchema = object({
  name: identityNameValidation.required('Enter full name'),
  address_line1: lineOneValidation.required('Enter street address'),
  address_line2: lineTwoValidation.nullable(),
  address_city: cityValidation.required('Enter city'),
  address_state: stateValidation.required('Select state'),
  address_postal_code: postalValidation.required('Enter postal code'),
});

// PostalFormFields and PostalFormSchema are used for justifi-postal-form which renders the postal code field only.
export interface PostalFormFields {
  address_postal_code: string;
}

export const PostalFormSchema = object({
  address_postal_code: postalValidation.required('Enter postal code'),
});

export function isBillingFormFields(fields: any): fields is BillingFormFields {
  return (
    'name' in fields &&
    'address_line1' in fields &&
    'address_city' in fields &&
    'address_state' in fields &&
    'address_postal_code' in fields
  );
}

export function isPostalFormFields(fields: any): fields is PostalFormFields {
  return (
    typeof fields === 'object' &&
    fields !== null &&
    Object.keys(fields).length === 1 &&
    'address_postal_code' in fields
  );
}
