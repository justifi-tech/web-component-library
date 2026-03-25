import { identitySchemaUSA, identitySchemaCAN } from '../business-identity-schema';

const validAddress = {
  line1: '123 Main St',
  city: 'Anytown',
  state: 'GA',
  postal_code: '30301',
  country: 'US',
};

const validAddressCAN = {
  line1: '123 Main St',
  city: 'Ottawa',
  state: 'ON',
  postal_code: 'K1A 0B1',
  country: 'CA',
};

const baseIdentity = {
  name: 'Jane Doe',
  title: 'CEO',
  email: 'jane@example.com',
  phone: '5551234567',
  dob_full: '1990-01-01',
  ssn_last4: '1234',
  identification_number: '078051120',
};

describe('ownership_percentage requirement', () => {
  describe('strict USA schema', () => {
    it('fails for owner when ownership_percentage is empty', async () => {
      const schema = identitySchemaUSA('owner', false);
      const data = { ...baseIdentity, ownership_percentage: null, address: validAddress };
      await expect(schema.isValid(data)).resolves.toBe(false);
    });

    it('passes for owner when ownership_percentage is provided', async () => {
      const schema = identitySchemaUSA('owner', false);
      const data = { ...baseIdentity, ownership_percentage: '50', address: validAddress };
      await expect(schema.isValid(data)).resolves.toBe(true);
    });

    it('passes for representative when ownership_percentage is empty', async () => {
      const schema = identitySchemaUSA('representative', false);
      const data = { ...baseIdentity, ownership_percentage: null, address: validAddress };
      await expect(schema.isValid(data)).resolves.toBe(true);
    });
  });

  describe('strict CAN schema', () => {
    it('fails for owner when ownership_percentage is empty', async () => {
      const schema = identitySchemaCAN('owner', false);
      const data = {
        ...baseIdentity,
        identification_number: '046454286',
        ownership_percentage: null,
        address: validAddressCAN,
      };
      await expect(schema.isValid(data)).resolves.toBe(false);
    });

    it('passes for owner when ownership_percentage is provided', async () => {
      const schema = identitySchemaCAN('owner', false);
      const data = {
        ...baseIdentity,
        identification_number: '046454286',
        ownership_percentage: '25',
        address: validAddressCAN,
      };
      await expect(schema.isValid(data)).resolves.toBe(true);
    });

    it('passes for representative when ownership_percentage is empty', async () => {
      const schema = identitySchemaCAN('representative', false);
      const data = {
        ...baseIdentity,
        identification_number: '046454286',
        ownership_percentage: null,
        address: validAddressCAN,
      };
      await expect(schema.isValid(data)).resolves.toBe(true);
    });
  });

  describe('permissive schemas', () => {
    it('USA: passes for owner when ownership_percentage is empty', async () => {
      const schema = identitySchemaUSA('owner', true);
      const data = { ...baseIdentity, ownership_percentage: null, address: validAddress };
      await expect(schema.isValid(data)).resolves.toBe(true);
    });

    it('CAN: passes for owner when ownership_percentage is empty', async () => {
      const schema = identitySchemaCAN('owner', true);
      const data = {
        ...baseIdentity,
        identification_number: '046454286',
        ownership_percentage: null,
        address: validAddressCAN,
      };
      await expect(schema.isValid(data)).resolves.toBe(true);
    });
  });
});
