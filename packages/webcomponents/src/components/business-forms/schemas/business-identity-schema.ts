import { object, string } from 'yup';
import { identityAddressSchema } from './business-address-schema';

export const phoneRegex = /^[0-9]+$/;

export const identitySchema = (title: string, easyValidate?: boolean) => {
  const schema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .required(`Enter ${title} email`),
    phone: string()
      .required(`Enter ${title} phone number`)
      .matches(phoneRegex, 'Phone number must contain only numbers')
      .min(10, 'Phone number must contain 10 digits')
      .max(10, 'Phone number must contain 10 digits'),
    dob_day: string().required(`Enter ${title} birth day`),
    dob_month: string().required(`Enter ${title} birth month`),
    dob_year: string().required(`Enter ${title} birth year`),
    identification_number: string(),
    address: identityAddressSchema(easyValidate),
  });

  const easySchema = object({
    name: string().required(`Enter ${title} name`).nullable(),
    email: string()
      .email(`Enter valid ${title} email`)
      .required(`Enter ${title} email`)
      .nullable(),
    phone: string()
      .required(`Enter ${title} phone number`)
      .matches(phoneRegex, 'Phone number must contain only numbers')
      .min(10, 'Phone number must contain 10 digits')
      .max(10, 'Phone number must contain 10 digits')
      .nullable(),
    dob_day: string().required(`Enter ${title} birth day`).nullable(),
    dob_month: string().required(`Enter ${title} birth month`).nullable(),
    dob_year: string().required(`Enter ${title} birth year`).nullable(),
    identification_number: string().nullable(),
    address: identityAddressSchema(easyValidate),
  });

  return easyValidate ? easySchema : schema;
};
