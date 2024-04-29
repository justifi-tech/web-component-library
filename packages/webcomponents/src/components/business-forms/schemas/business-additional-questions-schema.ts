import { object, string } from 'yup';

export const additionalQuestionsSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    business_revenue: string().required('Enter business revenue'),
    business_payment_volume: string().required('Enter business payment volume'),
    business_dispute_volume: string().required('Enter business dispute volume'),
    business_receivable_volume: string().required('Enter business receivable volume'),
  });

  const easySchema = object({
    business_revenue: string().nullable(),
    business_payment_volume: string().nullable(),
    business_dispute_volume: string().nullable(),
    business_receivable_volume: string().nullable()
  });

  return allowOptionalFields ? easySchema : schema;
};
