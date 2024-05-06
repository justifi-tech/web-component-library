import { date, object, string } from 'yup';
import { addressSchema } from './business-address-schema';
import { 
  onlyLettersRegex,
  transformEmptyString, 
  emailValidation,
  phoneValidation} 
  from './schema-helpers';

const identityNameValidation = string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .matches(onlyLettersRegex, 'Enter valid name')
  .transform(transformEmptyString);

export const identitySchema = (role: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    email: emailValidation.required(`Enter ${role} email`),
    phone: phoneValidation.required(`Enter ${role} phone number`),
    dob_full: date().required(`Enter ${role} birth date`),
    identification_number: string(),
    address: addressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: identityNameValidation.required(`Enter ${role} name`),
    email: emailValidation.nullable(),
    phone: phoneValidation.nullable(),
    dob_day: string().nullable(),
    dob_month: string().nullable(),
    dob_year: string().nullable(),
    identification_number: string().nullable(),
    address: addressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}
