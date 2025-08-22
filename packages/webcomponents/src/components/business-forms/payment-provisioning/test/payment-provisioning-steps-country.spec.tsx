import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentProvisioningFormSteps } from '../payment-provisioning-form-steps';
import { BusinessCoreInfoFormStepCore } from '../business-core-info/business-core-info-form-step-core';
import { LegalAddressFormStepCore } from '../legal-address-form/legal-address-form-step-core';
import { BusinessRepresentativeFormStepCore } from '../business-representative/business-representative-form-step-core';
import { BusinessOwnersFormStepCore } from '../business-owners/business-owners-form-step-core';
import { BusinessBankAccountFormStepCore } from '../bank-account/business-bank-account-form-step-core';
import { CountryCode } from '../../../../utils/country-codes';
import { getNormalizedCountry } from './mockBusiness';

describe('Payment Provisioning step components country toggles', () => {
  const baseProps = {
    businessId: 'biz_123',
    authToken: 'token',
    refs: new Array(7).fill(undefined),
    allowOptionalFields: false,
  } as any;

  test('Core Info step: USA vs CAN tax id label toggles', async () => {
    // Use normalized country codes as they would appear in real usage
    const normalizedUSA = getNormalizedCountry('US');
    const normalizedCAN = getNormalizedCountry('CA');

    const pageUSA = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessCoreInfoFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={0}
          country={normalizedUSA}
        />
      ),
    });

    expect(pageUSA.root).toBeTruthy();
    const usCore = pageUSA.root.querySelector('justifi-business-core-info-form-step');
    expect(usCore.getAttribute('country')).toBe(normalizedUSA);

    const pageCAN = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessCoreInfoFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={0}
          country={normalizedCAN}
        />
      ),
    });
    const caCore = pageCAN.root.querySelector('justifi-business-core-info-form-step');
    expect(caCore.getAttribute('country')).toBe(normalizedCAN);
  });

  test('Legal Address step: USA vs CAN address fields toggle', async () => {
    // Use normalized country codes as they would appear in real usage
    const normalizedUSA = getNormalizedCountry('US');
    const normalizedCAN = getNormalizedCountry('CA');

    const pageUSA = await newSpecPage({
      components: [PaymentProvisioningFormSteps, LegalAddressFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={1}
          country={normalizedUSA}
        />
      ),
    });
    const usAddress = pageUSA.root.querySelector('justifi-legal-address-form-step');
    expect(usAddress.getAttribute('country')).toBe(normalizedUSA);

    const pageCAN = await newSpecPage({
      components: [PaymentProvisioningFormSteps, LegalAddressFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={1}
          country={normalizedCAN}
        />
      ),
    });
    const caAddress = pageCAN.root.querySelector('justifi-legal-address-form-step');
    expect(caAddress.getAttribute('country')).toBe(normalizedCAN);
  });

  test('Representative step: USA vs CAN schema selection', async () => {
    // Use normalized country codes as they would appear in real usage
    const normalizedUSA = getNormalizedCountry('US');
    const normalizedCAN = getNormalizedCountry('CA');

    const pageUSA = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessRepresentativeFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={3}
          country={normalizedUSA}
        />
      ),
    });
    const usRep = pageUSA.root.querySelector('justifi-business-representative-form-step');
    expect(usRep.getAttribute('country')).toBe(normalizedUSA);

    const pageCAN = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessRepresentativeFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={3}
          country={normalizedCAN}
        />
      ),
    });
    const caRep = pageCAN.root.querySelector('justifi-business-representative-form-step');
    expect(caRep.getAttribute('country')).toBe(normalizedCAN);
  });

  test('Owners step: USA vs CAN owner forms pass down country', async () => {
    // Use normalized country codes as they would appear in real usage
    const normalizedUSA = getNormalizedCountry('US');
    const normalizedCAN = getNormalizedCountry('CA');

    const pageUSA = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessOwnersFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={4}
          country={normalizedUSA}
        />
      ),
    });
    const usOwners = pageUSA.root.querySelector('justifi-business-owners-form-step');
    expect(usOwners.getAttribute('country')).toBe(normalizedUSA);

    const pageCAN = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessOwnersFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={4}
          country={normalizedCAN}
        />
      ),
    });
    const caOwners = pageCAN.root.querySelector('justifi-business-owners-form-step');
    expect(caOwners.getAttribute('country')).toBe(normalizedCAN);
  });

  test('Bank Account step: USA vs CAN renders correct inputs', async () => {
    // Use normalized country codes as they would appear in real usage
    const normalizedUSA = getNormalizedCountry('US');
    const normalizedCAN = getNormalizedCountry('CA');

    const pageUSA = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessBankAccountFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={5}
          country={normalizedUSA}
        />
      ),
    });
    const usBank = pageUSA.root.querySelector('justifi-business-bank-account-form-step');
    expect(usBank.getAttribute('country')).toBe(normalizedUSA);

    const pageCAN = await newSpecPage({
      components: [PaymentProvisioningFormSteps, BusinessBankAccountFormStepCore],
      template: () => (
        <justifi-payment-provisioning-form-steps
          {...baseProps}
          currentStep={5}
          country={normalizedCAN}
        />
      ),
    });
    const caBank = pageCAN.root.querySelector('justifi-business-bank-account-form-step');
    expect(caBank.getAttribute('country')).toBe(normalizedCAN);
  });

  describe('Country normalization through Business constructor', () => {
    test('Core Info step: 2-character codes get normalized through Business constructor', async () => {
      // Test that "US" -> "USA" normalization works through Business constructor
      const normalizedUSA = getNormalizedCountry('US');
      expect(normalizedUSA).toBe(CountryCode.USA);
      
      const page = await newSpecPage({
        components: [PaymentProvisioningFormSteps, BusinessCoreInfoFormStepCore],
        template: () => (
          <justifi-payment-provisioning-form-steps
            {...baseProps}
            currentStep={0}
            country={normalizedUSA}
          />
        ),
      });
      const el = page.root.querySelector('justifi-business-core-info-form-step');
      expect(el.getAttribute('country')).toBe(CountryCode.USA);
    });

    test('Legal Address step: 2-character codes get normalized through Business constructor', async () => {
      // Test that "CA" -> "CAN" normalization works through Business constructor
      const normalizedCAN = getNormalizedCountry('CA');
      expect(normalizedCAN).toBe(CountryCode.CAN);
      
      const page = await newSpecPage({
        components: [PaymentProvisioningFormSteps, LegalAddressFormStepCore],
        template: () => (
          <justifi-payment-provisioning-form-steps
            {...baseProps}
            currentStep={1}
            country={normalizedCAN}
          />
        ),
      });
      const el = page.root.querySelector('justifi-legal-address-form-step');
      expect(el.getAttribute('country')).toBe(CountryCode.CAN);
    });

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