import { makePostalValidation, makeIdentityNumberValidation, makeTaxIdValidation, postalValidation } from '../schema-validations';
import { CountryCode } from '../../../../utils/country-codes';

describe('Country-aware validation helpers', () => {
  test('USA postal', async () => {
    await expect(makePostalValidation(CountryCode.USA).isValid('30301')).resolves.toBe(true);
    await expect(makePostalValidation(CountryCode.USA).isValid('A1A 1A1')).resolves.toBe(false);
  });

  test('USA postal accepts ZIP+4', async () => {
    await expect(makePostalValidation(CountryCode.USA).isValid('44240-5555')).resolves.toBe(true);
    // The +4 is exactly four digits, and the hyphen is not optional punctuation.
    await expect(makePostalValidation(CountryCode.USA).isValid('44240-555')).resolves.toBe(false);
    await expect(makePostalValidation(CountryCode.USA).isValid('442405555')).resolves.toBe(false);
  });

  test('CAN postal can accept both zip/postal code', async () => {
    await expect(makePostalValidation(CountryCode.CAN).isValid('K1A 0B1')).resolves.toBe(true);
    await expect(makePostalValidation(CountryCode.CAN).isValid('30301')).resolves.toBe(true);
  });

  test('CAN postal accepts lowercase and non-canonical spacing, which the schema normalizes', async () => {
    await expect(makePostalValidation(CountryCode.CAN).isValid('k1a 0b1')).resolves.toBe(true);
    await expect(makePostalValidation(CountryCode.CAN).isValid('M5V2T6')).resolves.toBe(true);
    await expect(makePostalValidation(CountryCode.CAN).isValid('m5v-2t6')).resolves.toBe(true);
  });

  test('CAN postal rejects a first character that identifies no geographic area', async () => {
    // Canada Post lists 18 valid FSA first characters; D, F, I, O, Q, U, W and Z are not among them.
    await expect(makePostalValidation(CountryCode.CAN).isValid('D1A 1A1')).resolves.toBe(false);
    await expect(makePostalValidation(CountryCode.CAN).isValid('Z1A 1A1')).resolves.toBe(false);
  });

  test('USA SSN vs CAN SIN', async () => {
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('123456789')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('111111111')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('078051120')).resolves.toBe(true);

    await expect(makeIdentityNumberValidation(CountryCode.CAN).isValid('123456789')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.CAN).isValid('111111111')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.CAN).isValid('046454286')).resolves.toBe(true);
  });

  test('USA accepts ITIN (starts with 9)', async () => {
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('912701234')).resolves.toBe(true);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('999881234')).resolves.toBe(true);
  });

  test('USA rejects ITIN with zero group or serial', async () => {
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('912001234')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('912700000')).resolves.toBe(false);
  });

  test('USA still rejects SSN area 000 and 666', async () => {
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('000451234')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('666451234')).resolves.toBe(false);
  });

  test('USA Tax ID vs CAN BN', async () => {
    await expect(makeTaxIdValidation(CountryCode.USA).isValid('123456789')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.USA).isValid('111111111')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.USA).isValid('941074845')).resolves.toBe(true);

    await expect(makeTaxIdValidation(CountryCode.CAN).isValid('123456789')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.CAN).isValid('111111111')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.CAN).isValid('862397791')).resolves.toBe(true);
  });

  test('postalValidation', async () => {
    await expect(postalValidation.isValid('12345')).resolves.toBe(true);
    await expect(postalValidation.isValid('A1A 1A1')).resolves.toBe(true);
    await expect(postalValidation.isValid('44240-5555')).resolves.toBe(true);
    // Was false before the schema normalized its input: 'A1A1A1' now casts to
    // the canonical 'A1A 1A1' and passes. Stored values predating the canonical
    // format must not hard-block a form that prefills them.
    await expect(postalValidation.isValid('A1A1A1')).resolves.toBe(true);
    await expect(postalValidation.isValid('AAAAAA1')).resolves.toBe(false);
    await expect(postalValidation.isValid('44240ddd')).resolves.toBe(false);
  });

  test('postalValidation accepts a lowercase Canadian postal code', async () => {
    await expect(postalValidation.isValid('n2b 2a5')).resolves.toBe(true);
    await expect(postalValidation.isValid('n2b2a5')).resolves.toBe(true);
  });

  test('postalValidation rejects a first character that identifies no geographic area', async () => {
    await expect(postalValidation.isValid('D1A 1A1')).resolves.toBe(false);
  });
});


