import { object, mixed, string } from 'yup';
import { CountryCode } from '../../../utils/country-codes';
import { EntityDocumentType } from '../../../api/Document';
import { 
  accountNumberValidation,
  accountTypeValidation,
  bankNameValidation,
  identityNameValidation,
  nicknameValidation,
  routingNumberValidation,
} from './schema-validations';
import { numbersOnlyRegex } from './schema-helpers';

const checkExistingDocs = (documents: any[], documentType: EntityDocumentType) => {
  return documents.some((doc) => doc.document_type === documentType);
}

const documentErrorText = 'Please upload either a voided check or a bank statement. Only one is required.';

export const businessBankAccountSchemaUSA = (documents: any[], allowOptionalFields?: boolean) => {
  const existingVoidedCheck = checkExistingDocs(documents, EntityDocumentType.voidedCheck);
  const existingBankStatement = checkExistingDocs(documents, EntityDocumentType.bankStatement);
  const existingDocument = existingVoidedCheck || existingBankStatement;

  const schema = object().shape(
    {
      bank_name: bankNameValidation.required('Enter bank name'),
      nickname: nicknameValidation.required('Enter nickname'),
      account_owner_name: identityNameValidation.required('Enter account owner name'),
      account_type: accountTypeValidation.required('Select account type'),
      account_number: accountNumberValidation.required('Enter account number'),
      routing_number: routingNumberValidation.required('Enter routing number'),
      voided_check: mixed().when('bank_statement', {
        is: (val: any) => {
          return !val && !existingDocument;
        },
        then: (schema) => {
          return schema.required(documentErrorText);
        },
        otherwise: (schema) => {
          return schema.notRequired();
        }}
      ),
      bank_statement: mixed().when('voided_check', {
        is: (val: any) => {
          return !val && !existingDocument;
        },
        then: (schema) => {
          return schema.required(documentErrorText);
        },
        otherwise: (schema) => {
          return schema.notRequired();
        }}
      ),
    }, [['voided_check', 'bank_statement']]
  );

  const easySchema = object({
    bank_name: bankNameValidation.nullable(),
    nickname: nicknameValidation.nullable(),
    account_owner_name: identityNameValidation.nullable(),
    account_type: accountTypeValidation.nullable(),
    account_number: accountNumberValidation.nullable(),
    routing_number: routingNumberValidation.nullable(),
    voided_check: mixed().nullable(),
    bank_statement: mixed().nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
}

export const businessBankAccountSchemaCAN = (documents: any[], allowOptionalFields?: boolean) => {
  const existingVoidedCheck = checkExistingDocs(documents, EntityDocumentType.voidedCheck);
  const existingBankStatement = checkExistingDocs(documents, EntityDocumentType.bankStatement);
  const existingDocument = existingVoidedCheck || existingBankStatement;

  const institutionNumberValidation = string()
    .length(3, 'Institution number must be 3 digits')
    .matches(numbersOnlyRegex, 'Enter valid institution number');

  const transitNumberValidation = string()
    .length(5, 'Transit number must be 5 digits')
    .matches(numbersOnlyRegex, 'Enter valid transit number');

  const schema = object().shape(
    {
      bank_name: bankNameValidation.required('Enter bank name'),
      nickname: nicknameValidation.required('Enter nickname'),
      account_owner_name: identityNameValidation.required('Enter account owner name'),
      account_type: accountTypeValidation.required('Select account type'),
      account_number: accountNumberValidation.required('Enter account number'),
      institution_number: institutionNumberValidation.required('Enter institution number'),
      transit_number: transitNumberValidation.required('Enter transit number'),
      voided_check: mixed().when('bank_statement', {
        is: (val: any) => {
          return !val && !existingDocument;
        },
        then: (schema) => {
          return schema.required(documentErrorText);
        },
        otherwise: (schema) => {
          return schema.notRequired();
        }}
      ),
      bank_statement: mixed().when('voided_check', {
        is: (val: any) => {
          return !val && !existingDocument;
        },
        then: (schema) => {
          return schema.required(documentErrorText);
        },
        otherwise: (schema) => {
          return schema.notRequired();
        }}
      ),
    }, [['voided_check', 'bank_statement']]
  );

  const easySchema = object({
    bank_name: bankNameValidation.nullable(),
    nickname: nicknameValidation.nullable(),
    account_owner_name: identityNameValidation.nullable(),
    account_type: accountTypeValidation.nullable(),
    account_number: accountNumberValidation.nullable(),
    institution_number: string().nullable(),
    transit_number: string().nullable(),
    voided_check: mixed().nullable(),
    bank_statement: mixed().nullable(),
  });

  return allowOptionalFields ? easySchema : schema;
}

// Back-compat default
export const businessBankAccountSchema = (documents: any[], allowOptionalFields?: boolean) => businessBankAccountSchemaUSA(documents, allowOptionalFields);

export const bankAccountSchemaByCountry: Record<CountryCode, (allowOptionalFields?: boolean, documents?: any[]) => any> = {
  [CountryCode.USA]: (allowOptionalFields?: boolean, documents: any[] = []) => businessBankAccountSchemaUSA(documents, allowOptionalFields),
  [CountryCode.CAN]: (allowOptionalFields?: boolean, documents: any[] = []) => businessBankAccountSchemaCAN(documents, allowOptionalFields),
};
