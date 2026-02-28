import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { JustifiBusinessCoreInfoFormStep } from '../business-core-info/justifi-business-core-info-form-step';
import { JustifiLegalAddressFormStep } from '../legal-address-form/justifi-legal-address-form-step';
import { JustifiBusinessBankAccountFormStep } from '../bank-account/justifi-business-bank-account-form-step';
import { JustifiFormAddressFields } from '../form-address-fields/justifi-form-address-fields';
import { JustifiBusinessOwnersFormStep } from '../business-owners/justifi-business-owners-form-step';
import { CountryCode } from '../../../../utils/country-codes';
import { getNormalizedCountry } from './mockBusiness';
import { JustifiBusinessRepresentativeFormStep } from '../business-representative/justifi-business-representative-form-step';

describe('Payment Provisioning step components country differences', () => {
  const baseProps = {
    businessId: 'biz_123',
    authToken: 'token',
    allowOptionalFields: false,
    getBusiness: jest.fn(),
    patchBusiness: jest.fn(),
    postBusiness: jest.fn(),
  } as any;

  describe('Business Core Info step snapshots', () => {
    test('renders USA tax ID label and help text', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            {...baseProps}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN Business Number (BN) label and help text', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessCoreInfoFormStep],
        template: () => (
          <justifi-business-core-info-form-step
            {...baseProps}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Legal Address step snapshots', () => {
    test('renders USA State and Zip Code labels', async () => {
      const page = await newSpecPage({
        components: [JustifiLegalAddressFormStep],
        template: () => (
          <justifi-legal-address-form-step
            {...baseProps}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN Province and Postal Code labels', async () => {
      const page = await newSpecPage({
        components: [JustifiLegalAddressFormStep],
        template: () => (
          <justifi-legal-address-form-step-core
            {...baseProps}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Form Address Fields component snapshots', () => {
    test('renders USA address fields with State/Zip labels', async () => {
      const page = await newSpecPage({
        components: [JustifiFormAddressFields],
        template: () => (
          <justifi-form-address-fields
            country={CountryCode.USA}
            errors={{}}
            defaultValues={{}}
            inputHandler={jest.fn()}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN address fields with Province/Postal Code labels', async () => {
      const page = await newSpecPage({
        components: [JustifiFormAddressFields],
        template: () => (
          <justifi-form-address-fields
            country={CountryCode.CAN}
            errors={{}}
            defaultValues={{}}
            inputHandler={jest.fn()}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Representative step snapshots', () => {
    test('renders USA SSN labels and help text', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessRepresentativeFormStep],
        template: () => (
          <justifi-business-representative-form-step
            {...baseProps}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN SIN labels and help text', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessRepresentativeFormStep],
        template: () => (
          <justifi-business-representative-form-step
            {...baseProps}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Owners step snapshots', () => {
    test('renders USA SSN labels in owner forms', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessOwnersFormStep],
        template: () => (
          <justifi-business-owners-form-step
            {...baseProps}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN SIN labels in owner forms', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessOwnersFormStep],
        template: () => (
          <justifi-business-owners-form-step
            {...baseProps}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Bank Account step snapshots', () => {
    test('renders USA bank account fields', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessBankAccountFormStep],
        template: () => (
          <justifi-business-bank-account-form-step
            {...baseProps}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });

    test('renders CAN bank account fields', async () => {
      const page = await newSpecPage({
        components: [JustifiBusinessBankAccountFormStep],
        template: () => (
          <justifi-business-bank-account-form-step
            {...baseProps}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
    });
  });

  describe('Country normalization through Business constructor', () => {
    test('Business constructor normalizes various country code formats', () => {
      // Test the normalization function directly
      expect(getNormalizedCountry('US')).toBe(CountryCode.USA);
      expect(getNormalizedCountry('USA')).toBe(CountryCode.USA);
      expect(getNormalizedCountry('CA')).toBe(CountryCode.CAN);
      expect(getNormalizedCountry('CAN')).toBe(CountryCode.CAN);
      expect(getNormalizedCountry('')).toBe(CountryCode.USA); // Default
      expect(getNormalizedCountry('UNKNOWN')).toBe(CountryCode.USA); // Fallback to default
    });
  });
});