import { object, string } from 'yup';

const AdditionalStatementSchema = object({
  additional_statement: string().nullable(),
});

export default AdditionalStatementSchema;