import { object } from 'yup';
import {
  balanceSheetValidation,
  bankStatementValidation,
  governmentIdValidation,
  otherDocumentValidation,
  profitAndLossStatementValidation,
  ss4Validation,
  voidedCheckValidation
} from './schema-validations';

export const businessDocumentSchema = (volume: string, allowOptionalFields?: boolean) => {
  const schema = object({
    voided_check: voidedCheckValidation.required('Please select one or more files'),
    government_id: governmentIdValidation.nullable(),
    ss4: ss4Validation.nullable(),
    other: otherDocumentValidation.nullable(),
    balance_sheet: balanceSheetValidation(volume, allowOptionalFields),
    bank_statement: bankStatementValidation(volume, allowOptionalFields),
    profit_and_loss_statement: profitAndLossStatementValidation(volume, allowOptionalFields),
  });

  const easySchema = object({
    voided_check: voidedCheckValidation.nullable(),
    government_id: governmentIdValidation.nullable(),
    ss4: ss4Validation.nullable(),
    other: otherDocumentValidation.nullable(),
    balance_sheet: balanceSheetValidation(volume, allowOptionalFields),
    bank_statement: bankStatementValidation(volume, allowOptionalFields),
    profit_and_loss_statement: profitAndLossStatementValidation(volume, allowOptionalFields)
  });

  return allowOptionalFields ? easySchema : schema;
}