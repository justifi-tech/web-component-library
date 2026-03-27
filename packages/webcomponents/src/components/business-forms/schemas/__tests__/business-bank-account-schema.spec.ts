import {
  businessBankAccountSchemaUSA,
  businessBankAccountSchemaCAN,
} from '../business-bank-account-schema';

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
  test('passes with valid USA bank fields', async () => {
    const schema = businessBankAccountSchemaUSA(false);
    await expect(schema.validate(validUsaBankFields)).resolves.toBeDefined();
  });

  test('requires routing number', async () => {
    const schema = businessBankAccountSchemaUSA(false);
    const { routing_number, ...rest } = validUsaBankFields;
    await expect(schema.validate(rest)).rejects.toThrow();
  });

  test('allowOptionalFields makes fields nullable', async () => {
    const schema = businessBankAccountSchemaUSA(true);
    await expect(
      schema.validate({
        bank_name: null,
        nickname: null,
        account_owner_name: null,
        account_type: null,
        account_number: null,
        routing_number: null,
      }),
    ).resolves.toBeDefined();
  });
});

describe('businessBankAccountSchemaCAN', () => {
  test('requires institution and transit when not optional', async () => {
    const schema = businessBankAccountSchemaCAN(false);
    const { institution_number, transit_number, ...rest } = validCanBankFields;
    await expect(schema.validate(rest)).rejects.toThrow();
  });

  test('passes with valid CAN fields', async () => {
    const schema = businessBankAccountSchemaCAN(false);
    await expect(schema.validate(validCanBankFields)).resolves.toBeDefined();
  });

  test('allowOptionalFields allows null fields', async () => {
    const schema = businessBankAccountSchemaCAN(true);
    await expect(
      schema.validate({
        bank_name: null,
        nickname: null,
        account_owner_name: null,
        account_type: null,
        account_number: null,
        institution_number: null,
        transit_number: null,
      }),
    ).resolves.toBeDefined();
  });
});
