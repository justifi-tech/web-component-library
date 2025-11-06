import { addressSchemaUSA, addressSchemaCAN, addressSchemaByCountry } from '../business-address-schema';
import { CountryCode } from '../../../../utils/country-codes';

describe('Address schema by country', () => {
  test('USA strict schema validates 5-digit zip and requires state', async () => {
    const valid = await addressSchemaUSA(false).isValid({
      line1: '123 Main St',
      line2: '',
      city: 'Atlanta',
      state: 'GA',
      postal_code: '30301',
    });
    expect(valid).toBe(true);

    const invalidPostal = await addressSchemaUSA(false).isValid({
      line1: '123 Main St',
      line2: '',
      city: 'Atlanta',
      state: 'GA',
      postal_code: 'K1A 0B1',
    });
    expect(invalidPostal).toBe(false);

    const missingState = await addressSchemaUSA(false).isValid({
      line1: '123 Main St',
      line2: '',
      city: 'Atlanta',
      state: '',
      postal_code: '30301',
    });
    expect(missingState).toBe(false);
  });

  test('CAN strict schema validates alphanumeric postal and requires province', async () => {
    const valid = await addressSchemaCAN(false).isValid({
      line1: '123 Main St',
      line2: '',
      city: 'Ottawa',
      state: 'ON',
      postal_code: 'K1A 0B1',
    });
    expect(valid).toBe(true);

    const invalidPostal = await addressSchemaCAN(false).isValid({
      line1: '123 Main St',
      line2: '',
      city: 'Ottawa',
      state: 'ON',
      postal_code: '30301',
    });
    expect(invalidPostal).toBe(false);

    const missingProvince = await addressSchemaCAN(false).isValid({
      line1: '123 Main St',
      line2: '',
      city: 'Ottawa',
      state: '',
      postal_code: 'K1A 0B1',
    });
    expect(missingProvince).toBe(false);
  });

  test('addressSchemaByCountry chooses correct schema', async () => {
    const usaSchema = addressSchemaByCountry[CountryCode.USA];
    const canSchema = addressSchemaByCountry[CountryCode.CAN];

    expect(await usaSchema(false).isValid({
      line1: '1',
      line2: '',
      city: 'NY',
      state: 'NY',
      postal_code: '10001',
    })).toBe(false); // line1 too short

    expect(await canSchema(false).isValid({
      line1: '12345 Long Street',
      line2: '',
      city: 'Toronto',
      state: 'ON',
      postal_code: 'M5V 2T6',
    })).toBe(true);
  });
});


