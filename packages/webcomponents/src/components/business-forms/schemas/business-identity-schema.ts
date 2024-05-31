import { object, string } from 'yup';
import { addressSchema } from './business-address-schema';
import { 
  dobValidation, 
  emailValidation, 
  identityNameValidation, 
  identityTitleValidation, 
  phoneValidation, 
  ssnValidation
} from './schema-validations';

export const identitySchema = (role: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.required(`Enter ${role} title`),
    email: emailValidation.required(`Enter ${role} email`),
    phone: phoneValidation.required('Enter phone number'),
    dob_full: dobValidation(role).required('Enter date of birth'),
    ssn_last4: string().nullable(),
    identification_number: ssnValidation,
    address: addressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    title: identityTitleValidation.nullable(),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_full: dobValidation(role).nullable(),
    ssn_last4: string().nullable(),
    identification_number: ssnValidation.nullable(),
    address: addressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}
