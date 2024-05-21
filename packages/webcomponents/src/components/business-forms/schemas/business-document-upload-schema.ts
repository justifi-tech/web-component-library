import { mixed, object } from "yup";

export const documentSchema = object({
  bank_statement: mixed(),
  other: mixed().required('Please upload a document'),
});