import { object, string } from 'yup';
import StateOptions from '../../../utils/state-options';

export const legalAddressSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    line1: string().required('Enter street address'),
    line2: string().nullable(),
    city: string().required('Enter city'),
    state: string()
      .required('Select state')
      .oneOf(StateOptions.map((option) => option.value), 'Select state'),
    postal_code: string().required('Enter postal code'),
    country: string().required('Select country')
  });

  const easySchema = object({
    line1: string().nullable(),
    line2: string().nullable(),
    city: string().nullable(),
    state: string().nullable(),
    postal_code: string().nullable(),
    country: string().nullable()
  });

  return allowOptionalFields ? easySchema : schema;
};

export const identityAddressSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    line1: string().required('Enter street address'),
    city: string().required('Enter city'),
    state: string()
      .required('Select state')
      .oneOf(StateOptions.map((option) => option.value), 'Select state'),
    postal_code: string().required('Enter postal code'),
  });

  const easySchema = object({
    line1: string().nullable(),
    city: string().nullable(),
    state: string().nullable(),
    postal_code: string().nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
