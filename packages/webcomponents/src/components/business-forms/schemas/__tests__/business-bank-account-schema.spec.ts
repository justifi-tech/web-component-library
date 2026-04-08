import { EntityDocumentType } from '../../../../api/Document';
import {
  businessBankAccountSchemaUSA,
  businessBankAccountSchemaCAN,
} from '../business-bank-account-schema';

const DOCUMENT_ERROR =
  'Please upload either a voided check or a bank statement. Only one is required.';

const validUsaBankFields = {
  bank_name: 'Test Bank',
  nickname: 'Main Acct',
  account_owner_name: 'Acme Test Corp',
  account_type: 'checking',
  account_number: '1234567890',
  routing_number: '110000000',
};

const validCanBankFields = {
  bank_name: 'Test Bank CA',
  nickname: 'Main Acct',
  account_owner_name: 'Acme Canada Inc',
  account_type: 'checking',
  account_number: '1234567890',
  institution_number: '001',
  transit_number: '12345',
};

describe('businessBankAccountSchemaUSA', () => {
  test('requires voided check or bank statement when no existing documents', async () => {
    const schema = businessBankAccountSchemaUSA([], false);
    await expect(schema.validate(validUsaBankFields)).rejects.toThrow(DOCUMENT_ERROR);
  });

  test('passes when voided_check is present', async () => {
    const schema = businessBankAccountSchemaUSA([], false);
    await expect(
      schema.validate({
        ...validUsaBankFields,
        voided_check: { name: 'check.png' },
      }),
    ).resolves.toBeDefined();
  });

  test('passes when bank_statement is present', async () => {
    const schema = businessBankAccountSchemaUSA([], false);
    await expect(
      schema.validate({
        ...validUsaBankFields,
        bank_statement: { name: 'stmt.pdf' },
      }),
    ).resolves.toBeDefined();
  });

  test('does not require new upload when business already has voided_check document', async () => {
    const schema = businessBankAccountSchemaUSA(
      [{ document_type: EntityDocumentType.voidedCheck }],
      false,
    );
    await expect(schema.validate(validUsaBankFields)).resolves.toBeDefined();
  });

  test('does not require new upload when business already has bank_statement document', async () => {
    const schema = businessBankAccountSchemaUSA(
      [{ document_type: EntityDocumentType.bankStatement }],
      false,
    );
    await expect(schema.validate(validUsaBankFields)).resolves.toBeDefined();
  });

  test('allowOptionalFields does not require document upload', async () => {
    const schema = businessBankAccountSchemaUSA([], true);
    await expect(schema.validate(validUsaBankFields)).resolves.toBeDefined();
  });
});

describe('businessBankAccountSchemaCAN', () => {
  test('requires institution and transit when not optional', async () => {
    const schema = businessBankAccountSchemaCAN([], false);
    const {
      institution_number: _institution_number,
      transit_number: _transit_number,
      ...rest
    } = validCanBankFields;
    await expect(schema.validate(rest)).rejects.toThrow();
  });

  test('requires document upload when no existing documents', async () => {
    const schema = businessBankAccountSchemaCAN([], false);
    await expect(schema.validate(validCanBankFields)).rejects.toThrow(DOCUMENT_ERROR);
  });

  test('passes with valid CAN fields and voided_check', async () => {
    const schema = businessBankAccountSchemaCAN([], false);
    await expect(
      schema.validate({
        ...validCanBankFields,
        voided_check: { name: 'check.png' },
      }),
    ).resolves.toBeDefined();
  });

  test('allowOptionalFields allows null bank and document fields', async () => {
    const schema = businessBankAccountSchemaCAN([], true);
    await expect(
      schema.validate({
        bank_name: null,
        nickname: null,
        account_owner_name: null,
        account_type: null,
        account_number: null,
        institution_number: null,
        transit_number: null,
        voided_check: null,
        bank_statement: null,
      }),
    ).resolves.toBeDefined();
  });
});
