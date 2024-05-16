import { mixed, object } from "yup";

export const documentSchema = object({
  bank_statement: mixed().required('File is required')
});