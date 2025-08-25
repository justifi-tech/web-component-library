import { businessCoreInfoSchemaUSA, businessCoreInfoSchemaCAN } from '../business-core-info-schema';

describe('Business core info schema by country', () => {
  test('USA uses USA tax ID validation', async () => {
    const invalid = await businessCoreInfoSchemaUSA(false).isValid({
      legal_name: 'Acme Inc',
      website_url: 'https://example.com',
      email: 'test@example.com',
      phone: '5551234567',
      doing_business_as: '',
      classification: 'LLC',
      industry: 'Software',
      date_of_incorporation: '2020-01-01',
      tax_id: '123456789', // rejected by helper
    } as any);
    expect(invalid).toBe(false);

    const valid = await businessCoreInfoSchemaUSA(false).isValid({
      legal_name: 'Acme Inc',
      website_url: 'https://example.com',
      email: 'test@example.com',
      phone: '5551234567',
      doing_business_as: '',
      classification: 'LLC',
      industry: 'Software',
      date_of_incorporation: '2020-01-01',
      tax_id: '941074845',
    } as any);
    expect(valid).toBe(true);
  });

  test('CAN uses BN 9-digit validation', async () => {
    const invalid = await businessCoreInfoSchemaCAN(false).isValid({
      legal_name: 'Acme Inc',
      website_url: 'https://example.com',
      email: 'test@example.com',
      phone: '5551234567',
      doing_business_as: '',
      classification: 'LLC',
      industry: 'Software',
      date_of_incorporation: '2020-01-01',
      tax_id: '123456789', // rejected by CAN BN rules
    } as any);
    expect(invalid).toBe(false);

    const valid = await businessCoreInfoSchemaCAN(false).isValid({
      legal_name: 'Acme Inc',
      website_url: 'https://example.com',
      email: 'test@example.com',
      phone: '5551234567',
      doing_business_as: '',
      classification: 'LLC',
      industry: 'Software',
      date_of_incorporation: '2020-01-01',
      tax_id: '862397791',
    } as any);
    expect(valid).toBe(true);
  });
});


