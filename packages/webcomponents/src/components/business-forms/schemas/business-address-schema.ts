import { object, string } from 'yup';
import StateOptions from '../../../utils/state-options';

export const legalAddressSchema = (easyValidate?: boolean) => {
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
    line1: string().required('Enter street address').nullable(),
    line2: string().nullable(),
    city: string().required('Enter city').nullable(),
    state: string()
      .required('Select state')
      .oneOf(StateOptions.map((option) => option.value), 'Select state')
      .nullable(),
    postal_code: string().required('Enter postal code').nullable(),
    country: string().required('Select country').nullable()
  });

  return easyValidate ? easySchema : schema;
};

export const identityAddressSchema = (easyValidate?: boolean) => {
  const schema = object({
    line1: string().required('Enter street address'),
    city: string().required('Enter city'),
    state: string()
      .required('Select state')
      .oneOf(StateOptions.map((option) => option.value), 'Select state'),
    postal_code: string().required('Enter postal code'),
  });

  const easySchema = object({
    line1: string().required('Enter street address').nullable(),
    city: string().required('Enter city').nullable(),
    state: string()
      .required('Select state')
      .oneOf(StateOptions.map((option) => option.value), 'Select state')
      .nullable(),
    postal_code: string().required('Enter postal code').nullable(),
  });

  return easyValidate ? easySchema : schema;
};
