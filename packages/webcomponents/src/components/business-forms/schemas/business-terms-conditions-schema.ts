import { boolean, object } from 'yup';

export const businessTermsConditionsSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    terms_and_conditions: boolean().required('You must agree to the terms and conditions to continue')
  });

  const easySchema = object({
    terms_and_conditions: boolean().nullable()
  });

  return allowOptionalFields ? easySchema : schema;
}