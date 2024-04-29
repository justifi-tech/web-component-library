import { object, string } from 'yup';
import { identityAddressSchema } from './business-address-schema';
import { phoneRegex } from '../utils/helpers';

export const identitySchema = (title: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .required(`Enter ${title} email`),
    phone: string().matches(phoneRegex, 'Enter valid phone number').required('Enter phone number'),
    dob_day: string().required(`Enter ${title} birth day`),
    dob_month: string().required(`Enter ${title} birth month`),
    dob_year: string().required(`Enter ${title} birth year`),
    identification_number: string(),
    address: identityAddressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .nullable(),
    phone: string().matches(phoneRegex, 'Enter valid phone number').nullable(),
    dob_day: string().nullable(),
    dob_month: string().nullable(),
    dob_year: string().nullable(),
    identification_number: string().nullable(),
    address: identityAddressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
};
