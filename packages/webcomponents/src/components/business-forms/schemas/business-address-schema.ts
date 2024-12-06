import { object, string } from 'yup';
import { 
  customStringValidation,
  lineOneValidation, 
  lineTwoValidation,
  postalValidation,
  stateValidation
} from './schema-validations';

export const addressSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    line1: lineOneValidation.required('Enter street address'),
    line2: lineTwoValidation.nullable(),
    city: customStringValidation.required('Enter city'),
    state: stateValidation.required('Select state'),
    postal_code: postalValidation.required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: lineOneValidation.nullable(),
    line2: lineTwoValidation.nullable(),
    city: customStringValidation.nullable(),
    state: stateValidation.nullable(),
    postal_code: postalValidation.nullable(),
    country: string().required('Select country')
  });

  return allowOptionalFields ? easySchema : schema;
};
