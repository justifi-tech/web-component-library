import { date, object, string } from 'yup';
import { addressSchema } from './business-address-schema';
import { phoneRegex } from './schema-helpers';

export const identitySchema = (title: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .required(`Enter ${title} email`),
    phone: string().matches(phoneRegex, 'Enter valid phone number').required('Enter phone number'),
    dob_full: date().required('Enter date of birth'),
    identification_number: string(),
    address: addressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .nullable(),
    phone: string().matches(phoneRegex, 'Enter valid phone number').nullable(),
    dob_full: date().nullable('Enter date of birth'),
    identification_number: string().nullable(),
    address: addressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}
