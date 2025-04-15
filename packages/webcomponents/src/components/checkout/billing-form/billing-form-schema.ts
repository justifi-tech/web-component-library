import { object } from 'yup';
import {
  cityValidation,
  identityNameValidation,
  lineOneValidation,
  lineTwoValidation,
  postalValidation,
  stateValidation,
} from '../../business-forms/schemas/schema-validations';

export interface BillingFormFields {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

export const billingFormSchema = (postalOnly?: boolean) => {
  const fullBillingForm = object({
    name: identityNameValidation.required('Enter full name'),
    address_line1: lineOneValidation.required('Enter street address'),
    address_line2: lineTwoValidation.nullable(),
    address_city: cityValidation.required('Enter city'),
    address_state: stateValidation.required('Select state'),
    address_postal_code: postalValidation.required('Enter postal code')
  });

  const postalForm = object({
    name: identityNameValidation.nullable(),
    address_line1: lineOneValidation.nullable(),
    address_line2: lineTwoValidation.nullable(),
    address_city: cityValidation.nullable(),
    address_state: stateValidation.nullable(),
    address_postal_code: postalValidation.required('Enter postal code')
  });

  return postalOnly ? postalForm : fullBillingForm;
};
