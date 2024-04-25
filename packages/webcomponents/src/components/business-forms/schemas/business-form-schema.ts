import { object } from 'yup';
import { businessCoreInfoSchema } from './business-core-info-schema';
import { additionQuestionsSchema } from './business-additional-questions-schema';
import { representativeSchema } from './business-identity-schema';
import { addressSchema } from './business-address-schema';

export const businessFormSchema = object({
  ...businessCoreInfoSchema.fields,
  legal_address: addressSchema,
  additional_questions: additionQuestionsSchema,
  representative: representativeSchema
});
