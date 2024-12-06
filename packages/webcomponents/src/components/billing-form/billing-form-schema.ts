import { object } from 'yup';
import { 
  customStringValidation,
  lineOneValidation,
  lineTwoValidation,
  postalValidation,
  stateValidation
} from '../business-forms/schemas/schema-validations';
export interface BillingFormFields {
  name: string;
  address_line1: string;
  address_line2?: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

const BillingFormSchema = object({
  name: customStringValidation.required('Enter full name'),
  address_line1: lineOneValidation.required('Enter street address'),
  address_line2: lineTwoValidation.nullable(),
  address_city: customStringValidation.required('Enter city'),
  address_state: stateValidation.required('Select state'),
  address_postal_code: postalValidation.required('Enter postal code'),
});

export default BillingFormSchema;
