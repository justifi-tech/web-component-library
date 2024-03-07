import { object } from 'yup';
import { coreInfoSchema } from './business-core-info-form-schema';
import { legalAddressSchema } from './legal-address-form-schema';
import { additionQuestionsSchema } from './business-additional-questions-form-schema';
import { representativeSchema } from './business-representative-form-schema';

const businessFormSchema = object({
  ...coreInfoSchema.fields,
  legal_address: legalAddressSchema,
  additional_questions: additionQuestionsSchema,
  representative: representativeSchema
});

export default businessFormSchema;
