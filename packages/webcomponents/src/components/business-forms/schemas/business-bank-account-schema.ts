import { object } from 'yup';
import { 
  accountNumberValidation,
  accountTypeValidation,
  bankNameValidation,
  identityNameValidation,
  nicknameValidation,
  routingNumberValidation,
  voidedCheckValidation,
  bankStatementValidation
} from './schema-validations';

export const businessBankAccountSchema = (documents: any[], allowOptionalFields?: boolean) => {
  const schema = object({
    bank_name: bankNameValidation.required('Enter bank name'),
    nickname: nicknameValidation.required('Enter nickname'),
    account_owner_name: identityNameValidation.required('Enter account owner name'),
    account_type: accountTypeValidation.required('Select account type'),
    account_number: accountNumberValidation.required('Enter account number'),
    routing_number: routingNumberValidation.required('Enter routing number'),
    voided_check: voidedCheckValidation(documents, allowOptionalFields),
    bank_statement: bankStatementValidation(documents, allowOptionalFields)
  });

  const easySchema = object({
    bank_name: bankNameValidation.nullable(),
    nickname: nicknameValidation.nullable(),
    account_owner_name: identityNameValidation.nullable(),
    account_type: accountTypeValidation.nullable(),
    account_number: accountNumberValidation.nullable(),
    routing_number: routingNumberValidation.nullable(),
    voided_check: voidedCheckValidation(documents, allowOptionalFields),
    bank_statement: bankStatementValidation(documents, allowOptionalFields)
  });

  return allowOptionalFields ? easySchema : schema;
}
