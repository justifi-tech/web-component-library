import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { BusinessCoreInfo } from '../business-core-info';
import { FormController } from '../../../../../ui-components/form/form';
import { businessCoreInfoSchemaUSA, businessCoreInfoSchemaCAN } from '../../../schemas/business-core-info-schema';
import { CountryCode } from '../../../../../utils/country-codes';

describe('justifi-business-core-info', () => {
  describe('Country-specific tax ID label and help text', () => {
    test('renders USA tax ID label and help text', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Verify the tax ID field has the correct USA-specific label and help text
      const taxIdField = page.root.querySelector('form-control-text[name="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('label')).toBe('Tax ID (EIN or SSN)');
      expect(taxIdField.getAttribute('helptext')).toBe('Employer Identification Numbers (EINs) are nine digits. The federal tax identification number/EIN issued to you by the IRS. It can be found on your tax returns. Enter value without dashes.');
    });

    test('renders CAN Business Number (BN) label and help text', async () => {
      const formController = new FormController(businessCoreInfoSchemaCAN());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.CAN}
          />
        ),
      });
      
      expect(page.root).toMatchSnapshot();
      
      // Verify the tax ID field has the correct Canada-specific label and help text
      const taxIdField = page.root.querySelector('form-control-text[name="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('label')).toBe('Business Number (BN)');
      expect(taxIdField.getAttribute('helptext')).toBe('Business Numbers (BN) are nine digits. Enter value without spaces or dashes.');
    });

    test('defaults to USA when no country is specified', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
          />
        ),
      });
      
      // Verify it defaults to USA tax ID labels
      const taxIdField = page.root.querySelector('form-control-text[name="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('label')).toBe('Tax ID (EIN or SSN)');
      expect(taxIdField.getAttribute('helptext')).toBe('Employer Identification Numbers (EINs) are nine digits. The federal tax identification number/EIN issued to you by the IRS. It can be found on your tax returns. Enter value without dashes.');
    });
  });

  describe('Form component behavior', () => {
    test('uses form-control-text with number-only handler instead of masked input', async () => {
      const formController = new FormController(businessCoreInfoSchemaUSA());
      
      const page = await newSpecPage({
        components: [BusinessCoreInfo],
        template: () => (
          <justifi-business-core-info
            formController={formController}
            country={CountryCode.USA}
          />
        ),
      });
      
      const taxIdField = page.root.querySelector('form-control-text[name="tax_id"]');
      expect(taxIdField).toBeTruthy();
      expect(taxIdField.getAttribute('maxlength')).toBe('9');
      
      // Should not find the old masked input
      const maskedTaxIdField = page.root.querySelector('form-control-number-masked[name="tax_id"]');
      expect(maskedTaxIdField).toBeNull();
    });
  });
});
