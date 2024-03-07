import { object } from 'yup';
import { coreInfoSchema } from '../business-form-stepped/business-core-info/business-core-info-form-schema';
import { legalAddressSchema } from '../business-form-stepped/legal-address-form/legal-address-form-schema';
import { additionQuestionsSchema } from '../business-form-stepped/additional-questions/business-additional-questions-form-schema';
import { representativeSchema } from '../business-form-stepped/business-representative/business-representative-form-schema';

const businessFormSchema = object({
  ...coreInfoSchema.fields,
  legal_address: legalAddressSchema,
  additional_questions: additionQuestionsSchema,
  representative: representativeSchema
});

export default businessFormSchema;
