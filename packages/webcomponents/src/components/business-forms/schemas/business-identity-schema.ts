import { object } from 'yup';
import { addressSchema } from './business-address-schema';
import { 
  dobValidation, 
  emailValidation, 
  identityNameValidation, 
  phoneValidation, 
  ssnValidation
} from './schema-validations';

export const identitySchema = (title: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: identityNameValidation.required(`Enter ${title} name`),
    email: emailValidation.required(`Enter ${title} email`),
    phone: phoneValidation.required('Enter phone number'),
    dob_full: dobValidation(title).required('Enter date of birth'),
    identification_number: ssnValidation.required('Enter SSN'),
    address: addressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: identityNameValidation.required(`Enter ${title} name`),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_full: dobValidation(title).nullable('Enter date of birth'),
    identification_number: ssnValidation.nullable(),
    address: addressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}
