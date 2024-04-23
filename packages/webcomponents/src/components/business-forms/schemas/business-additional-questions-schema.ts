import { object, string } from 'yup';

export const additionalQuestionsSchema = (easyValidate?: boolean) => {
  const schema = object({
    business_revenue: string().required('Enter business revenue'),
    business_payment_volume: string().required('Enter business payment volume'),
    business_dispute_volume: string().required('Enter business dispute volume'),
    business_receivable_volume: string().required('Enter business receivable volume'),
  });

  const easySchema = object({
    business_revenue: string().required('Enter business revenue').nullable(),
    business_payment_volume: string().required('Enter business payment volume').nullable(),
    business_dispute_volume: string().required('Enter business dispute volume').nullable(),
    business_receivable_volume: string().required('Enter business receivable volume').nullable()
  });

  return easyValidate ? easySchema : schema;
};
