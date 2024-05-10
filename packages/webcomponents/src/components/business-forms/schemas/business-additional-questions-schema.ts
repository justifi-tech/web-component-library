import { object, string } from 'yup';
import { paymentVolumeValidation, revenueValidation } from './schema-validations';

export const additionalQuestionsSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    business_revenue: revenueValidation.required('Enter business revenue'),
    business_payment_volume: paymentVolumeValidation.required('Enter business payment volume'),
    business_when_service_received: string().required('Select when service is received'),
    business_recurring_payments: string().required('Select recurring payments'),
    business_recurring_payments_percentage: string().required('Enter recurring payments percentage'),
    business_seasonal: string().required('Select business seasonal'),
    business_other_payment_details: string().nullable(),
  });

  const easySchema = object({
    business_revenue: revenueValidation.nullable(),
    business_payment_volume: paymentVolumeValidation.nullable(),
    business_when_service_received: string().nullable(),
    business_recurring_payments: string().nullable(),
    business_recurring_payments_percentage: string().nullable(),
    business_seasonal: string().nullable(),
    business_other_payment_details: string().nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
