import { makePostalValidation, makeIdentityNumberValidation, makeTaxIdValidation } from '../schema-validations';
import { CountryCode } from '../../../../utils/country-codes';

describe('Country-aware validation helpers', () => {
  test('USA postal', async () => {
    await expect(makePostalValidation(CountryCode.USA).isValid('30301')).resolves.toBe(true);
    await expect(makePostalValidation(CountryCode.USA).isValid('A1A 1A1')).resolves.toBe(false);
  });

  test('CAN postal', async () => {
    await expect(makePostalValidation(CountryCode.CAN).isValid('K1A 0B1')).resolves.toBe(true);
    await expect(makePostalValidation(CountryCode.CAN).isValid('30301')).resolves.toBe(false);
  });

  test('USA SSN vs CAN SIN', async () => {
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('123456789')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('111111111')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.USA).isValid('078051120')).resolves.toBe(true);

    await expect(makeIdentityNumberValidation(CountryCode.CAN).isValid('123456789')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.CAN).isValid('111111111')).resolves.toBe(false);
    await expect(makeIdentityNumberValidation(CountryCode.CAN).isValid('046454286')).resolves.toBe(true);
  });

  test('USA Tax ID vs CAN BN', async () => {
    await expect(makeTaxIdValidation(CountryCode.USA).isValid('123456789')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.USA).isValid('111111111')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.USA).isValid('941074845')).resolves.toBe(true);

    await expect(makeTaxIdValidation(CountryCode.CAN).isValid('123456789')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.CAN).isValid('111111111')).resolves.toBe(false);
    await expect(makeTaxIdValidation(CountryCode.CAN).isValid('862397791')).resolves.toBe(true);
  });
});


