import { mixed, object } from "yup";

export const businessDocumentSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    balance_sheet: mixed().required('Please select one or more files'),
    bank_statement: mixed().required('Please select one or more files'),
    government_id: mixed().required('Please select one or more files'),
    profit_and_loss_statement: mixed().required('Please select one or more files'),
    tax_return: mixed().required('Please select one or more files'),
    other: mixed().nullable()
  });

  const easySchema = object({
    balance_sheet: mixed().nullable(),
    bank_statement: mixed().nullable(),
    government_id: mixed().nullable(),
    profit_and_loss_statement: mixed().nullable(),
    tax_return: mixed().nullable(),
    other: mixed().nullable()
  });

  return allowOptionalFields ? easySchema : schema;
}