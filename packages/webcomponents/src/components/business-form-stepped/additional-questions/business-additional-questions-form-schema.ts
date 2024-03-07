import { object, string } from 'yup';

export const additionQuestionsSchema = object({
  business_revenue: string().required('Enter business revenue'),
  business_payment_volume: string().required('Enter business payment volume'),
  business_dispute_volume: string().required('Enter business dispute volume'),
  business_receivable_volume: string().required('Enter business receivable volume'),
});
