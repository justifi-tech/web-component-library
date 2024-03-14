import { object } from 'yup';
import { businessCoreInfoSchema } from './business-core-info-schema';
import { additionQuestionsSchema } from './business-additional-questions-schema';
import { representativeSchema } from './business-representative-schema';
import { legalAddressSchema } from './business-address-schema';

export const businessFormSchema = object({
  ...businessCoreInfoSchema.fields,
  legal_address: legalAddressSchema,
  additional_questions: additionQuestionsSchema,
  representative: representativeSchema
});
