import { object, string } from 'yup';
import { addressSchema } from './business-address-schema';
import { phoneRegex, transformEmptyString } from './schema-helpers';

const dobValidation = (title: string) => {
  return (
    string()
    .test('min', 'Enter a valid date', (value) => {
      const date = new Date(value);
      const minDate = new Date('1902-01-01');
      return date >= minDate;
    })
    .test('age', `${title} must be at least 18 years old`, (value) => {
      const date = new Date(value);
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
      return date <= minAgeDate;
    })
    .transform(transformEmptyString)
  )
};

export const identitySchema = (title: string, allowOptionalFields?: boolean) => {
  const schema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .required(`Enter ${title} email`),
    phone: string().matches(phoneRegex, 'Enter valid phone number').required('Enter phone number'),
    dob_full: dobValidation(title).required('Enter date of birth'),
    identification_number: string(),
    address: addressSchema(allowOptionalFields),
  });

  const easySchema = object({
    name: string().required(`Enter ${title} name`),
    email: string()
      .email(`Enter valid ${title} email`)
      .nullable(),
    phone: string().matches(phoneRegex, 'Enter valid phone number').nullable(),
    dob_full: dobValidation(title).nullable('Enter date of birth'),
    identification_number: string().nullable(),
    address: addressSchema(allowOptionalFields),
  });

  return allowOptionalFields ? easySchema : schema;
}
