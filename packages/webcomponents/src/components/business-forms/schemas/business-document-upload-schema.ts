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

export const businessDocumentSchema = (volume: string, documents: any[], allowOptionalFields?: boolean) => {
  const schema = object({
    voided_check: voidedCheckValidation(documents, allowOptionalFields),
    government_id: governmentIdValidation.nullable(),
    ss4: ss4Validation.nullable(),
    other: otherDocumentValidation.nullable(),
    balance_sheet: balanceSheetValidation(volume, documents, allowOptionalFields),
    bank_statement: bankStatementValidation(volume, documents, allowOptionalFields),
    profit_and_loss_statement: profitAndLossStatementValidation(volume, documents, allowOptionalFields),
  });

  const easySchema = object({
    voided_check: voidedCheckValidation(documents, allowOptionalFields),
    government_id: governmentIdValidation.nullable(),
    ss4: ss4Validation.nullable(),
    other: otherDocumentValidation.nullable(),
    balance_sheet: balanceSheetValidation(volume, documents, allowOptionalFields),
    bank_statement: bankStatementValidation(volume, documents, allowOptionalFields),
    profit_and_loss_statement: profitAndLossStatementValidation(volume, documents, allowOptionalFields)
  });

  return allowOptionalFields ? easySchema : schema;
}