import { boolean, object } from 'yup';

export const businessTermsConditionsSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    accepted: boolean().required('You must agree to the terms and conditions to continue')
  });

  const easySchema = object({
    accepted: boolean().nullable()
  });

  return allowOptionalFields ? easySchema : schema;
}