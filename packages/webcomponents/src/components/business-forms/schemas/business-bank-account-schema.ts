import { object } from 'yup';
import {
  customStringValidation,
  accountNumberValidation,
  accountTypeValidation,
  routingNumberValidation 
} 
from './schema-validations';

export const businessBankAccountSchema = (allowOptionalFields?: boolean) => {
  const schema = object({
    bank_name: customStringValidation.required('Enter bank name'),
    nickname: customStringValidation.required('Enter nickname'),
    account_owner_name: customStringValidation.required('Enter account owner name'),
    account_type: accountTypeValidation.required('Select account type'),
    account_number: accountNumberValidation.required('Enter account number'),
    routing_number: routingNumberValidation.required('Enter routing number')
  });

  const easySchema = object({
    bank_name: customStringValidation.nullable(),
    nickname: customStringValidation.nullable(),
    account_owner_name: customStringValidation.nullable(),
    account_type: accountTypeValidation.nullable(),
    account_number: accountNumberValidation.nullable(),
    routing_number: routingNumberValidation.nullable()
  });

  return allowOptionalFields ? easySchema : schema;
}
