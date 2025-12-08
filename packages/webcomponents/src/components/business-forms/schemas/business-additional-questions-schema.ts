import { object } from 'yup';
import { otherPaymentDetailsValidation, paymentVolumeValidation, revenueValidation, whenServiceReceivedValidation } from './schema-validations';

export const additionalQuestionsSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    business_revenue: revenueValidation.required('Enter business revenue'),
    business_payment_volume: paymentVolumeValidation.required('Enter business payment volume'),
    business_when_service_received: whenServiceReceivedValidation.required('Select when service is received'),
    business_other_payment_details: otherPaymentDetailsValidation.nullable(),
  });

  const easySchema = object({
    business_revenue: revenueValidation.nullable(),
    business_payment_volume: paymentVolumeValidation.nullable(),
    business_when_service_received: whenServiceReceivedValidation.nullable(),
    business_other_payment_details: otherPaymentDetailsValidation.nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
};
