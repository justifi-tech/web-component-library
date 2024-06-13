import { object } from 'yup';
import {
  balanceSheetValidation,
  bankStatementValidation,
  governmentIdValidation,
  otherDocumentValidation,
  profitAndLossStatementValidation,
  taxReturnValidation,
  voidedCheckValidation
} from './schema-validations';

export const businessDocumentSchema = (volume: string, allowOptionalFields?: boolean) => {
  const schema = object({
    voided_check: voidedCheckValidation.required('Please select one or more files'),
    government_id: governmentIdValidation.nullable(),
    tax_return: taxReturnValidation.nullable(),
    other: otherDocumentValidation.nullable(),
    balance_sheet: balanceSheetValidation(volume),
    bank_statement: bankStatementValidation(volume),
    profit_and_loss_statement: profitAndLossStatementValidation(volume),
  });

  const easySchema = object({
    voided_check: voidedCheckValidation.nullable(),
    government_id: governmentIdValidation.nullable(),
    tax_return: taxReturnValidation.nullable(),
    other: otherDocumentValidation.nullable(),
    balance_sheet: balanceSheetValidation(volume).nullable(),
    bank_statement: bankStatementValidation(volume).nullable(),
    profit_and_loss_statement: profitAndLossStatementValidation(volume).nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
}