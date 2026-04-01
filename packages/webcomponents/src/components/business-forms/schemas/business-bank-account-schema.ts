import { object, string } from 'yup';
import { CountryCode } from '../../../utils/country-codes';
import {
  accountNumberValidation,
  accountTypeValidation,
  bankNameValidation,
  identityNameValidation,
  nicknameValidation,
  routingNumberValidation,
} from './schema-validations';
import { numbersOnlyRegex } from './schema-helpers';

const buildCommonFieldRules = (allowOptionalFields?: boolean) => {
  if (allowOptionalFields) {
    return {
      bank_name: bankNameValidation.nullable(),
      nickname: nicknameValidation.nullable(),
      account_owner_name: identityNameValidation.nullable(),
      account_type: accountTypeValidation.nullable(),
      account_number: accountNumberValidation.nullable(),
    };
  }
  return {
    bank_name: bankNameValidation.required('Enter bank name'),
    nickname: nicknameValidation.required('Enter nickname'),
    account_owner_name: identityNameValidation.required('Enter account owner name'),
    account_type: accountTypeValidation.required('Select account type'),
    account_number: accountNumberValidation.required('Enter account number'),
  };
}

const buildUSARules = (allowOptionalFields?: boolean) => {
  if (allowOptionalFields) {
    return { routing_number: routingNumberValidation.nullable() };
  }
  return { routing_number: routingNumberValidation.required('Enter routing number') };
}

const buildCANRules = (allowOptionalFields?: boolean) => {
  const institutionNumberValidation = string()
    .length(3, 'Institution number must be 3 digits')
    .matches(numbersOnlyRegex, 'Enter valid institution number');

  const transitNumberValidation = string()
    .length(5, 'Transit number must be 5 digits')
    .matches(numbersOnlyRegex, 'Enter valid transit number');

  if (allowOptionalFields) {
    return {
      institution_number: institutionNumberValidation.nullable(),
      transit_number: transitNumberValidation.nullable(),
    };
  }
  return {
    institution_number: institutionNumberValidation.required('Enter institution number'),
    transit_number: transitNumberValidation.required('Enter transit number'),
  };
}

export const businessBankAccountSchemaUSA = (allowOptionalFields?: boolean) => {
  const shape = {
    ...buildCommonFieldRules(allowOptionalFields),
    ...buildUSARules(allowOptionalFields),
  };
  return object().shape(shape as any);
}

export const businessBankAccountSchemaCAN = (allowOptionalFields?: boolean) => {
  const shape = {
    ...buildCommonFieldRules(allowOptionalFields),
    ...buildCANRules(allowOptionalFields),
  };
  return object().shape(shape as any);
}

// For backward compatibility, default to USA
export const businessBankAccountSchema = (allowOptionalFields?: boolean) => businessBankAccountSchemaUSA(allowOptionalFields);

export const bankAccountSchemaByCountry: Record<CountryCode, (allowOptionalFields?: boolean) => any> = {
  [CountryCode.USA]: (allowOptionalFields?: boolean) => businessBankAccountSchemaUSA(allowOptionalFields),
  [CountryCode.CAN]: (allowOptionalFields?: boolean) => businessBankAccountSchemaCAN(allowOptionalFields),
};
